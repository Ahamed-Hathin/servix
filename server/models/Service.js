const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
        },
        basePrice: {
            type: Number,
            required: [true, "Base price is required"],
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
