/**
 * ==========================================================
 * SMS Hindi Shayari
 * MongoDB Database Configuration
 * ==========================================================
 */

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        console.log("===========================================");
        console.log("✅ MongoDB Connected Successfully");
        console.log(`📦 Database : ${conn.connection.name}`);
        console.log(`🌐 Host     : ${conn.connection.host}`);
        console.log("===========================================");
    } catch (error) {
        console.error("===========================================");
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        console.error("===========================================");

        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("📡 MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected.");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed.");
    process.exit(0);
});

module.exports = connectDB;
