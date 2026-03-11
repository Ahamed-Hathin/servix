const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const PDFDocument = require("pdfkit");

const createBooking = asyncHandler(async (req, res) => {
    const { service, city, address, scheduledDate, visitCharge } = req.body;

    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
        res.status(404);
        throw new Error("Service not found");
    }

    const booking = await Booking.create({
        user: req.user._id,
        service,
        city,
        address,
        scheduledDate,
        visitCharge: visitCharge || serviceExists.basePrice,
        status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
        .populate("user", "name email city")
        .populate("service", "name basePrice");

    res.status(201).json({
        success: true,
        data: populatedBooking,
    });
});

const getAvailableBookings = asyncHandler(async (req, res) => {
    if (!req.user.isApproved) {
        res.status(403);
        throw new Error("Worker not approved by admin");
    }

    if (!req.user.isAvailable) {
        res.status(403);
        throw new Error("Set your availability to true before viewing bookings");
    }

    const bookings = await Booking.find({
        status: "pending",
        city: req.user.city,
    })
        .populate("user", "name email city")
        .populate("service", "name basePrice description")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

const acceptBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user.isApproved) {
        res.status(403);
        throw new Error("Worker not approved by admin");
    }

    const booking = await Booking.findOneAndUpdate(
        { _id: id, status: "pending", worker: null },
        { worker: req.user._id, status: "accepted" },
        { new: true }
    )
        .populate("user", "name email city")
        .populate("worker", "name email skills")
        .populate("service", "name basePrice");

    if (!booking) {
        res.status(400);
        throw new Error("Booking unavailable or already accepted by another worker");
    }

    res.status(200).json({
        success: true,
        message: "Booking accepted successfully",
        data: booking,
    });
});

// Simplified flow: accepted → work_started only
// work_started → awaiting_user_approval is handled by submitFinalAmount
const STATUS_FLOW = {
    accepted: "work_started",
};

const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this booking");
    }

    const nextStatus = STATUS_FLOW[booking.status];
    if (!nextStatus) {
        res.status(400);
        throw new Error(
            `Cannot advance from status '${booking.status}'`
        );
    }

    booking.status = nextStatus;
    await booking.save();

    const updatedBooking = await Booking.findById(id)
        .populate("user", "name email city")
        .populate("worker", "name email skills")
        .populate("service", "name basePrice");

    res.status(200).json({
        success: true,
        message: `Status updated to '${nextStatus}'`,
        data: updatedBooking,
    });
});

// Worker submits final amount after completing work
const submitFinalAmount = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { finalAmount } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    // Only assigned worker can submit
    if (booking.worker.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized — only the assigned worker can submit the final amount");
    }

    // Must be in work_started status
    if (booking.status !== "work_started") {
        res.status(400);
        throw new Error("Final amount can only be submitted when work is started");
    }

    // Prevent double submission
    if (booking.finalAmount) {
        res.status(400);
        throw new Error("Final amount has already been submitted");
    }

    // finalAmount must be provided and > visitCharge
    if (!finalAmount || finalAmount <= booking.visitCharge) {
        res.status(400);
        throw new Error(`Final amount must be greater than visit charge (₹${booking.visitCharge})`);
    }

    booking.finalAmount = finalAmount;
    booking.status = "awaiting_payment";
    await booking.save();

    const updatedBooking = await Booking.findById(id)
        .populate("user", "name email city")
        .populate("worker", "name email skills")
        .populate("service", "name basePrice");

    res.status(200).json({
        success: true,
        message: "Final amount submitted. Waiting for customer approval.",
        data: updatedBooking,
    });
});

// Process payment via simulated payment gateway
const processPayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    // Only booking owner can pay
    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized — only the booking owner can make payment");
    }

    // Must be awaiting payment
    if (booking.status !== "awaiting_payment") {
        res.status(400);
        throw new Error("Payment can only be processed when status is awaiting_payment");
    }

    // Prevent double payment
    if (booking.paymentConfirmed) {
        res.status(400);
        throw new Error("Payment has already been processed");
    }

    // Simulate 2 second processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate unique transaction ID
    const transactionId = "TXN" + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Calculate commission (5%)
    const commissionAmount = +(booking.finalAmount * 0.05).toFixed(2);
    const workerAmount = +(booking.finalAmount * 0.95).toFixed(2);

    booking.paymentMethod = paymentMethod || "UPI";
    booking.paymentStatus = "success";
    booking.transactionId = transactionId;
    booking.commissionAmount = commissionAmount;
    booking.workerAmount = workerAmount;
    booking.paymentConfirmed = true;
    booking.status = "completed";
    await booking.save();

    // Update worker earnings
    await User.findByIdAndUpdate(booking.worker, {
        $inc: { totalEarnings: workerAmount },
    });

    // Emit real-time notification to the assigned worker
    const io = req.app.get("io");
    if (io) {
        io.to(booking.worker.toString()).emit("paymentConfirmed", {
            bookingId: booking._id,
            message: "Customer completed payment via gateway",
            transactionId,
        });
    }

    res.status(200).json({
        success: true,
        message: "Payment successful",
        data: {
            transactionId,
            finalAmount: booking.finalAmount,
            commissionAmount,
            workerAmount,
            paymentMethod: booking.paymentMethod,
            paymentStatus: booking.paymentStatus,
        },
    });
});

const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("worker", "name email skills rating")
        .populate("service", "name basePrice")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

const getWorkerBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ worker: req.user._id })
        .populate("user", "name email city")
        .populate("service", "name basePrice")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

const rateBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be between 1 and 5");
    }

    const booking = await Booking.findById(id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to rate this booking");
    }

    if (booking.status !== "completed") {
        res.status(400);
        throw new Error("Can only rate completed bookings");
    }

    if (booking.rating) {
        res.status(400);
        throw new Error("Booking already rated");
    }

    booking.rating = rating;
    if (review) booking.review = review;
    await booking.save();

    // Update worker rating using aggregation fields
    await User.findByIdAndUpdate(booking.worker, {
        $inc: { totalRatings: 1, ratingSum: rating },
    });

    const worker = await User.findById(booking.worker);
    const avgRating = worker.totalRatings > 0
        ? +(worker.ratingSum / worker.totalRatings).toFixed(2)
        : 0;

    await User.findByIdAndUpdate(booking.worker, {
        rating: avgRating,
        averageRating: avgRating,
    });

    res.status(200).json({
        success: true,
        message: "Rating submitted",
        data: booking,
    });
});

// Generate PDF Invoice (user only, after payment confirmed)
const generateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id)
        .populate("user", "name email")
        .populate("worker", "name email")
        .populate("service", "name");

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    // Only booking owner can download
    if (booking.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to download this invoice");
    }

    // Only completed + payment confirmed
    if (booking.status !== "completed" || !booking.paymentConfirmed) {
        res.status(400);
        throw new Error("Invoice is only available after payment is confirmed");
    }

    // Generate PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${booking._id}.pdf`);
    doc.pipe(res);

    const PLATFORM_NAME = "Servix";

    // Header
    doc.fontSize(24).font("Helvetica-Bold").text(PLATFORM_NAME, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica").fillColor("#666666").text("Service Invoice", { align: "center" });
    doc.moveDown(1);

    // Divider
    doc.strokeColor("#4f46e5").lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Invoice details
    doc.fillColor("#333333").fontSize(11).font("Helvetica-Bold");
    const leftCol = 50;
    const rightCol = 300;
    let y = doc.y;

    const addRow = (label, value) => {
        doc.font("Helvetica-Bold").fillColor("#555555").text(label, leftCol, y, { width: 200 });
        doc.font("Helvetica").fillColor("#333333").text(value, rightCol, y, { width: 245 });
        y += 22;
    };

    addRow("Booking ID:", booking._id.toString());
    addRow("Date:", new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    }));
    addRow("Customer Name:", booking.user.name);
    addRow("Customer Email:", booking.user.email);
    addRow("Worker Name:", booking.worker?.name || "N/A");
    addRow("Service:", booking.service?.name || "N/A");
    addRow("City:", booking.city);

    y += 10;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
    y += 15;

    // Financial section
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#4f46e5").text("Payment Details", leftCol, y);
    y += 25;

    addRow("Visit Charge:", `Rs. ${booking.visitCharge}`);
    addRow("Final Amount:", `Rs. ${booking.finalAmount}`);
    addRow("Commission (5%):", `Rs. ${booking.commissionAmount}`);
    addRow("Worker Amount (95%):", `Rs. ${booking.workerAmount}`);

    y += 5;
    addRow("Payment Status:", "Confirmed");

    y += 15;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
    y += 20;

    // Total box
    doc.rect(50, y, 495, 40).fillAndStroke("#f0f0ff", "#4f46e5");
    doc.fillColor("#4f46e5").font("Helvetica-Bold").fontSize(14)
        .text(`Total Paid: Rs. ${booking.finalAmount}`, 60, y + 12, { width: 475, align: "center" });
    y += 60;

    // Footer
    doc.fillColor("#999999").font("Helvetica").fontSize(9)
        .text("This is a system generated invoice.", 50, y, { align: "center" });
    doc.moveDown(0.5);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, { align: "center" });

    doc.end();
});

const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to cancel this booking");
    }

    if (!["pending", "accepted"].includes(booking.status)) {
        res.status(400);
        throw new Error("Cannot cancel a booking that is already in progress");
    }

    booking.status = "cancelled";
    booking.worker = null;
    await booking.save();

    res.status(200).json({
        success: true,
        message: "Booking cancelled",
        data: booking,
    });
});

module.exports = {
    createBooking,
    getAvailableBookings,
    acceptBooking,
    updateBookingStatus,
    submitFinalAmount,
    processPayment,
    getUserBookings,
    getWorkerBookings,
    rateBooking,
    generateInvoice,
    cancelBooking,
};
