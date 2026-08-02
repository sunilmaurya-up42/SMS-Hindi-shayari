/**
 * ==========================================================
 * SMS Hindi Shayari
 * Create Default Website Settings
 * ==========================================================
 */

"use strict";

require("dotenv").config();

const connectDB = require("../config/db");
const Setting = require("../models/Setting");

async function createSettings() {

    try {

        await connectDB();

        const exists = await Setting.findOne();

        if (exists) {

            console.log("✅ Website settings already exist.");

            process.exit(0);

        }

        await Setting.create({

            siteName: process.env.SITE_NAME || "SMS Hindi Shayari",

            siteUrl: process.env.SITE_URL || "http://localhost:3000",

            language: process.env.DEFAULT_LANGUAGE || "hi",

            title: process.env.DEFAULT_TITLE || "SMS Hindi Shayari",

            description:
                process.env.DEFAULT_DESCRIPTION ||
                "Read and Download Beautiful Hindi Shayari.",

            keywords:
                process.env.DEFAULT_KEYWORDS ||
                "shayari,hindi,love,sad,status",

            themeColor:
                process.env.PWA_THEME_COLOR || "#e53935",

            backgroundColor:
                process.env.PWA_BACKGROUND_COLOR || "#ffffff",

            adsenseClient:
                process.env.ADSENSE_CLIENT || "",

            analyticsId:
                process.env.GA_MEASUREMENT_ID || "",

            maintenanceMode: false,

            registrationEnabled: true,

            commentsEnabled: true,

            downloadEnabled: true,

            aiImageEnabled: true

        });

        console.log("==================================");
        console.log("✅ Default Website Settings Created");
        console.log("==================================");

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

createSettings();
