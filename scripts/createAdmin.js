require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function createAdmin() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected.");

        const name = "YOUR ADMIN NAME";
        const email = "YOUR ADMIN EMAIL";
        const password = "YOUR ADMIN PASSWORD";

        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (existingAdmin) {

            console.log("Admin already exists.");

            process.exit(0);
        }

        const admin = await Admin.create({
            name,
            email: email.toLowerCase(),
            password,
            role: "super_admin",
            isActive: true
        });

        console.log("--------------------------------");
        console.log("Admin created successfully.");
        console.log("ID:", admin._id);
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        console.log("Active:", admin.isActive);
        console.log("--------------------------------");

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error("Create Admin Error:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
}

createAdmin();
