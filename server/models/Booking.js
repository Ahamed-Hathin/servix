const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        scheduledDate: {
            type: Date,
            required: [true, "Scheduled date is required"],
        },
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "work_started",
                "awaiting_user_approval",
                "awaiting_payment",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },
        visitCharge: {
            type: Number,
            required: true,
        },
        finalAmount: {
            type: Number,
        },
        commissionAmount: {
            type: Number,
        },
        workerAmount: {
            type: Number,
        },
        paymentConfirmed: {
            type: Boolean,
            default: false,
        },
        paymentMethod: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: "pending",
        },
        transactionId: {
            type: String,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
        review: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
