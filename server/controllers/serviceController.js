const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");

const getServices = asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: services.length,
        data: services,
    });
});

const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    res.status(200).json({
        success: true,
        data: service,
    });
});

module.exports = { getServices, getServiceById };
