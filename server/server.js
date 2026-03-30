require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();
const server = http.createServer(app);

// ─── CORS (must be FIRST, before anything else) ─────────────
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
        "https://servix-server.onrender.com"
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            process.env.CLIENT_URL,
            "https://servix-server.onrender.com"
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT"],
    },
});

// Store io on app so controllers can access it via req.app.get("io")
app.set("io", io);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "SERVEFIX — Trusted Home Services Marketplace API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);

app.use(errorHandler);

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Worker joins their own room using their userId
    socket.on("joinRoom", (workerId) => {
        socket.join(workerId);
        console.log(`👷 Worker ${workerId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

