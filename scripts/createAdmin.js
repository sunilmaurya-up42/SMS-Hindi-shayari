require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function createAdmin() {
    try {

        // Check required environment variables
        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !password) {

            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required."
            );

        }

        if (password.length < 8) {

            throw new Error(
                "ADMIN_PASSWORD must be at least 8 characters long."
            );

        }

        // Connect MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected.");

        // Check existing admin
        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingAdmin) {

            console.log("--------------------------------");
            console.log("Admin already exists.");
            console.log("Email:", existingAdmin.email);
            console.log("Role:", existingAdmin.role);
            console.log("Active:", existingAdmin.isActive);
            console.log("--------------------------------");

            await mongoose.disconnect();

            process.exit(0);
        }

        // Create Admin
        const admin = await Admin.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
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

        console.error("Create Admin Error:", error.message);

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            // Ignore disconnect error
        }

        process.exit(1);
    }
}

createAdmin();
