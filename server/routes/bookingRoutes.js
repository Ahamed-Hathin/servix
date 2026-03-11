const express = require("express");
const {
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
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("user"), createBooking);
router.get("/available", protect, authorize("worker"), getAvailableBookings);
router.put("/:id/accept", protect, authorize("worker"), acceptBooking);
router.put("/:id/status", protect, authorize("worker"), updateBookingStatus);
router.put("/:id/submit-final-amount", protect, authorize("worker"), submitFinalAmount);
router.post("/:id/process-payment", protect, authorize("user"), processPayment);
router.get("/my-bookings", protect, authorize("user"), getUserBookings);
router.get("/worker-bookings", protect, authorize("worker"), getWorkerBookings);
router.put("/:id/rate", protect, authorize("user"), rateBooking);
router.get("/:id/invoice", protect, authorize("user"), generateInvoice);
router.put("/:id/cancel", protect, authorize("user"), cancelBooking);

module.exports = router;
