const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

const Service = require("../models/Service");

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, city, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("Email already registered");
    }

    const userData = { name, email, password, city };

    if (role === "worker") {
        userData.role = "worker";
        userData.skills = skills || [];
        userData.isApproved = false;
        userData.isAvailable = false;
    } else {
        userData.role = "user";
    }

    const user = await User.create(userData);

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            city: user.city,
            token: generateToken(user._id, user.role),
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            city: user.city,
            token: generateToken(user._id, user.role),
        },
    });
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

const updateAvailability = asyncHandler(async (req, res) => {
    const { isAvailable } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { isAvailable },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: user,
    });
});

const seedMasterData = asyncHandler(async (req, res) => {
    const services = [
        { name: "Electrician", basePrice: 300, description: "Professional electrical repair and installation" },
        { name: "Plumber", basePrice: 250, description: "Reliable plumbing maintenance and repair" },
        { name: "Carpenter", basePrice: 400, description: "Expert wood work, furniture fixes" },
        { name: "Painter", basePrice: 500, description: "Quality wall painting and decoration" },
        { name: "AC Repair", basePrice: 350, description: "AC servicing and gas refilling" },
        { name: "Cleaning Service", basePrice: 200, description: "Deep home and office cleaning" },
        { name: "Pest Control", basePrice: 600, description: "Safe and effective pest control" },
        { name: "Appliance Repair", basePrice: 300, description: "Washing machine, fridge and TV repair" }
    ];

    // Seeding logic
    await Service.deleteMany({});
    const seededServices = await Service.insertMany(services);

    res.status(200).json({
        success: true,
        message: "Database seeded successfully!",
        data: seededServices
    });
});

module.exports = { register, login, getProfile, updateAvailability, seedMasterData };
