require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Service = require("../models/Service");

const adminData = {
    name: "Admin",
    email: "admin@hyperlocal.com",
    password: "admin123",
    role: "admin",
    city: "Chennai",
    isApproved: true,
};

const servicesData = [
    {
        name: "Electrician",
        basePrice: 300,
        description: "Electrical repair and installation services",
    },
    {
        name: "Plumber",
        basePrice: 250,
        description: "Plumbing repair and maintenance services",
    },
    {
        name: "Carpenter",
        basePrice: 400,
        description: "Woodwork, furniture repair, and installation",
    },
    {
        name: "Painter",
        basePrice: 500,
        description: "Interior and exterior painting services",
    },
    {
        name: "AC Repair",
        basePrice: 350,
        description: "Air conditioner servicing, repair, and gas refilling",
    },
    {
        name: "Cleaning Service",
        basePrice: 200,
        description: "Home and office deep cleaning services",
    },
    {
        name: "Pest Control",
        basePrice: 600,
        description: "Pest control and fumigation services",
    },
    {
        name: "Appliance Repair",
        basePrice: 300,
        description: "Washing machine, fridge, and appliance repair",
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");

        await User.deleteMany({ role: "admin" });
        await Service.deleteMany({});

        await User.create(adminData);
        console.log("Admin seeded: admin@hyperlocal.com / admin123");

        await Service.insertMany(servicesData);
        console.log(`${servicesData.length} services seeded`);

        console.log("Seeding complete");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error.message);
        process.exit(1);
    }
};

seed();
