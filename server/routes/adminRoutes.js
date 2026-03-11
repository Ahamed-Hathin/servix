const express = require("express");
const {
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
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/workers", getAllWorkers);
router.put("/workers/:id/approve", approveWorker);
router.put("/workers/:id/block", blockWorker);
router.get("/bookings", getAllBookings);
router.get("/total-revenue", getTotalRevenue);
router.get("/dashboard-stats", getDashboardStats);
router.get("/services", getAllServices);
router.post("/services", createService);
router.delete("/services/:id", deleteService);

module.exports = router;
