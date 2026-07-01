/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Global Application Configuration
 * -------------------------------------------------------
 */

"use strict";

const path = require("path");

module.exports = Object.freeze({

    /* ==========================================
       Application
    ========================================== */

    app: {
        name: "SMS Hindi Shayari",
        shortName: "SMS Shayari",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        port: Number(process.env.PORT) || 3000,

        url: process.env.APP_URL || "http://localhost:3000",

        adminUrl: "/admin",

        timezone: "Asia/Kolkata",

        language: "hi",

        charset: "utf-8"
    },

    /* ==========================================
       Pagination
    ========================================== */

    pagination: {
        home: 20,
        category: 20,
        search: 20,
        admin: 25,
        comments: 15
    },

    /* ==========================================
       Image
    ========================================== */

    image: {

        maxUploadSize: 5 * 1024 * 1024,

        allowedExtensions: [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ],

        download: {
            width: 1080,
            height: 1080,
            quality: 95
        }

    },

    /* ==========================================
       Directories
    ========================================== */

    paths: {

        public: path.join(process.cwd(), "public"),

        uploads: path.join(process.cwd(), "uploads"),

        backgrounds: path.join(
            process.cwd(),
            "public/images/backgrounds"
        ),

        ai: path.join(
            process.cwd(),
            "public/images/ai"
        ),

        logos: path.join(
            process.cwd(),
            "public/images/logos"
        )

    },

    /* ==========================================
       Supported Languages
    ========================================== */

    languages: [
        "Hindi",
        "English",
        "Urdu"
    ],

    /* ==========================================
       SEO
    ========================================== */

    seo: {

        title: "SMS Hindi Shayari",

        description:
            "Love Shayari, Sad Shayari, Attitude Shayari, Wishes, Poetry, Ghazal and Quotes.",

        keywords: [
            "Hindi Shayari",
            "Love Shayari",
            "Sad Shayari",
            "Attitude Shayari",
            "SMS Shayari",
            "Poetry"
        ],

        robots: "index,follow"

    },

    /* ==========================================
       Branding
    ========================================== */

    branding: {

        watermark: "SMS Hindi Shayari",

        copyright:
            `© ${new Date().getFullYear()} SMS Hindi Shayari`

    }

});
