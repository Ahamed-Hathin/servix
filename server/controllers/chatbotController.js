const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini — API key stays on backend only
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a friendly AI assistant for "Servix" — a trusted home services marketplace website based in Tamil Nadu, India. 

Your role:
- Help users understand how to book services (plumbing, electrical, cleaning, painting, etc.)
- Explain the booking flow: Browse → Book → Worker accepts → Work done → Payment → Rating
- Explain pricing: Visit charge is paid upfront, final amount is decided after work
- Explain payment: Simulated payment gateway with UPI, Card, or Net Banking
- Explain commission: 5% platform fee is deducted from worker earnings
- Help with general questions about the platform

Rules:
- Be polite, friendly, and concise
- Keep answers short (2-4 sentences max)
- Use emojis sparingly for warmth
- If asked about something unrelated to the platform, politely redirect
- Never share technical details about the backend or database
- Never make up information about services that don't exist`;

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 requests per minute

const checkRateLimit = (ip) => {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
        rateLimitMap.set(ip, { count: 1, startTime: now });
        return true;
    }

    if (now - record.startTime > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, startTime: now });
        return true;
    }

    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
};

// Clean up rate limit map every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
        if (now - value.startTime > RATE_LIMIT_WINDOW) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        if (message.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Message too long. Please keep it under 500 characters.",
            });
        }

        // Rate limiting
        const clientIp = req.ip || req.connection.remoteAddress || "unknown";
        if (!checkRateLimit(clientIp)) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please wait a moment before trying again.",
            });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Chatbot is not configured. Please contact the administrator.",
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message.trim()}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            data: {
                reply: text,
            },
        });
    } catch (error) {
        console.error("Chatbot error:", error.message);

        // Handle specific Gemini API errors
        if (error.message?.includes("API_KEY")) {
            return res.status(500).json({
                success: false,
                message: "Chatbot service configuration error.",
            });
        }

        if (error.message?.includes("SAFETY")) {
            return res.status(200).json({
                success: true,
                data: {
                    reply: "I'm sorry, I can't respond to that. Let me know if you have any questions about our home services! 😊",
                },
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong with the chatbot. Please try again later.",
        });
    }
};

module.exports = { chatWithBot };
