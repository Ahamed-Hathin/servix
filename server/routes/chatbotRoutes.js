const express = require("express");
const { chatWithBot } = require("../controllers/chatbotController");

const router = express.Router();

// POST /api/chatbot — public route (no auth required)
router.post("/", chatWithBot);

module.exports = router;
