/**
 * ============================================================
 * SMS Hindi Shayari
 * Production Ready Server
 * ============================================================
 */

require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");

let app;

try {
    app = require("./app");
    console.log("✅ app.js loaded");
} catch (err) {
    console.error("❌ Error loading app.js");
    console.error(err);
    process.exit(1);
}

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

console.log("Step 1");
console.log("Step 2");
console.log("Step 3");
console.log("Step 4");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


/**
 * ============================================================
 * CREATE ADMIN FROM RENDER ENVIRONMENT VARIABLES
 * ============================================================
 */

const createAdmin = async () => {

    try {

        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        /*
        |--------------------------------------------------------------------------
        | Check Environment Variables
        |--------------------------------------------------------------------------
        */

        if (!name || !email || !password) {

            console.log(
                "ℹ️ Admin environment variables not configured. Skipping admin creation."
            );

            return;
        }

        if (password.length < 8) {

            console.error(
                "❌ ADMIN_PASSWORD must be at least 8 characters."
            );

            return;
        }

        const normalizedEmail =
            email.toLowerCase().trim();


        /*
        |--------------------------------------------------------------------------
        | Check Existing Admin
        |--------------------------------------------------------------------------
        */

        const existingAdmin = await Admin.findOne({
            email: normalizedEmail
        });


        if (existingAdmin) {

            console.log("-------------------------------------------");
            console.log("ℹ️ Admin account already exists.");
            console.log(`📧 Email : ${existingAdmin.email}`);
            console.log(`👤 Role  : ${existingAdmin.role}`);
            console.log(`✅ Active: ${existingAdmin.isActive}`);
            console.log("-------------------------------------------");

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Create Admin
        |--------------------------------------------------------------------------
        */

        const admin = await Admin.create({

            name: name.trim(),

            email: normalizedEmail,

            password: password,

            role: "super_admin",

            isActive: true

        });


        console.log("-------------------------------------------");
        console.log("✅ Admin account created successfully.");
        console.log(`📧 Email : ${admin.email}`);
        console.log(`👤 Role  : ${admin.role}`);
        console.log(`✅ Active: ${admin.isActive}`);
        console.log("-------------------------------------------");

    } catch (error) {

        console.error("-------------------------------------------");
        console.error("❌ Admin creation failed.");
        console.error(error.message);
        console.error("-------------------------------------------");

    }
};


/**
 * ============================================================
 * START SERVER
 * ============================================================
 */

const startServer = async () => {

    try {

        console.log("Before DB");

        await connectDB();

        console.log("After DB");


        /*
        |--------------------------------------------------------------------------
        | Automatically create Admin if required
        |--------------------------------------------------------------------------
        */

        await createAdmin();


        /*
        |--------------------------------------------------------------------------
        | Start HTTP Server
        |--------------------------------------------------------------------------
        */

        server.listen(PORT, () => {

            console.log(`Server running on ${PORT}`);

        });

    } catch (err) {

        console.error("❌ Server startup failed.");
        console.error(err);

        process.exit(1);

    }

};


/**
 * ============================================================
 * START
 * ============================================================
 */

startServer();


/**
 * ============================================================
 * Handle Promise Rejections
 * ============================================================
 */

process.on("unhandledRejection", (err) => {

    console.error("Unhandled Rejection:");
    console.error(err);

    server.close(() => {

        process.exit(1);

    });

});


/**
 * ============================================================
 * Handle Uncaught Exceptions
 * ============================================================
 */

process.on("uncaughtException", (err) => {

    console.error("Uncaught Exception:");
    console.error(err);

    process.exit(1);

});


/**
 * ============================================================
 * Graceful Shutdown
 * ============================================================
 */

process.on("SIGINT", () => {

    console.log("\nStopping Server...");

    server.close(async () => {

        await mongoose.connection.close();

        console.log("Server Stopped");

        process.exit(0);

    });

});


process.on("SIGTERM", () => {

    console.log("\nServer Terminated");

    server.close(async () => {

        await mongoose.connection.close();

        process.exit(0);

    });

});
