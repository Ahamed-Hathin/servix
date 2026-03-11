const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

const getAllWorkers = asyncHandler(async (req, res) => {
    const workers = await User.find({ role: "worker" }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: workers.length,
        data: workers,
    });
});

const approveWorker = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const worker = await User.findById(id);

    if (!worker || worker.role !== "worker") {
        res.status(404);
        throw new Error("Worker not found");
    }

    worker.isApproved = true;
    await worker.save();

    res.status(200).json({
        success: true,
        message: "Worker approved successfully",
        data: worker,
    });
});

const blockWorker = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const worker = await User.findById(id);

    if (!worker || worker.role !== "worker") {
        res.status(404);
        throw new Error("Worker not found");
    }

    worker.isApproved = false;
    worker.isAvailable = false;
    await worker.save();

    res.status(200).json({
        success: true,
        message: "Worker blocked successfully",
        data: worker,
    });
});

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate("user", "name email city")
        .populate("worker", "name email skills")
        .populate("service", "name basePrice")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

const getTotalRevenue = asyncHandler(async (req, res) => {
    const result = await Booking.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$commissionAmount" } } },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({
        success: true,
        data: { totalRevenue: +totalRevenue.toFixed(2) },
    });
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalWorkers, totalBookings, completedBookings] =
        await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "worker" }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "completed" }),
        ]);

    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            totalWorkers,
            totalBookings,
            totalCompletedJobs: completedBookings,
        },
    });
});

const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: services.length,
        data: services,
    });
});

const createService = asyncHandler(async (req, res) => {
    const { name, basePrice, description } = req.body;

    const service = await Service.create({ name, basePrice, description });

    res.status(201).json({
        success: true,
        data: service,
    });
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    res.status(200).json({
        success: true,
        message: "Service deleted",
    });
});

module.exports = {
    getAllUsers,
    getAllWorkers,
    approveWorker,
    blockWorker,
    getAllBookings,
    getTotalRevenue,
    getDashboardStats,
    getAllServices,
    createService,
    deleteService,
};
