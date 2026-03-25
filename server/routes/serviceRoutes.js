const express = require("express");
const { getServices, getServiceById } = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", protect, getServiceById);

module.exports = router;
