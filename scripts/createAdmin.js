/**
 * ==========================================================
 * SMS Hindi Shayari
 * Create Default Admin
 * ==========================================================
 */

"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function createAdmin() {

    try {

        await connectDB();

        const exists = await User.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (exists) {

            console.log("✅ Admin already exists.");

            process.exit(0);

        }

        const password = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        );

        const admin = new User({

            name: process.env.ADMIN_NAME,

            email: process.env.ADMIN_EMAIL,

            password,

            role: "admin",

            isVerified: true,

            isActive: true

        });

        await admin.save();

        console.log("==================================");
        console.log("✅ Admin Created Successfully");
        console.log("Name :", admin.name);
        console.log("Email:", admin.email);
        console.log("==================================");

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

createAdmin();
