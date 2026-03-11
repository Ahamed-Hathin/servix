const express = require("express");
const {
    register,
    login,
    getProfile,
    updateAvailability,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/availability", protect, authorize("worker"), updateAvailability);

module.exports = router;
