/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * MongoDB Configuration
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

mongoose.set("strictQuery", true);

const connectDatabase = async () => {
    try {

        const MONGO_URI =
            process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!MONGO_URI) {
            throw new Error("MongoDB URI is missing in environment variables.");
        }

        const connection = await mongoose.connect(MONGO_URI, {
            autoIndex: false,
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });

        logger.info("==================================");
        logger.info(" MongoDB Connected");
        logger.info(` Database : ${connection.connection.name}`);
        logger.info(` Host     : ${connection.connection.host}`);
        logger.info("==================================");

        return connection;

    } catch (error) {

        logger.error("==================================");
        logger.error(" MongoDB Connection Failed");
        logger.error(error.message);
        logger.error("==================================");

        process.exit(1);
    }
};

/* ===============================
   Connection Events
=============================== */

mongoose.connection.on("connected", () => {
    logger.info("MongoDB connection established.");
});

mongoose.connection.on("error", (error) => {
    logger.error(`MongoDB Error: ${error.message}`);
});

mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected.");
});

module.exports = connectDatabase;
