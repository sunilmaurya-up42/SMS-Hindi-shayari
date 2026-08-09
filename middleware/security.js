const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const blockedIPs = new Set();

/**
 * Helmet
 */
exports.helmet = helmet({

    contentSecurityPolicy: false,

    crossOriginEmbedderPolicy: false

});

/**
 * CORS
 */
exports.cors = cors({

    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : "*",

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ]

});

/**
 * MongoDB Injection Protection
 */
exports.mongoSanitize = mongoSanitize();

/**
 * XSS Protection
 */
exports.xss = xss();

/**
 * HTTP Parameter Pollution Protection
 */
exports.hpp = hpp();

/**
 * Request Size Limit
 */
exports.requestLimit = (req, res, next) => {

    const length = Number(req.headers["content-length"] || 0);

    const max = 10 * 1024 * 1024;

    if (length > max) {

        return res.status(413).json({

            success: false,

            message: "Request size exceeded."

        });

    }

    next();

};

/**
 * Blocked IP Middleware
 */
exports.ipBlocker = (req, res, next) => {

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.ip;

    if (blockedIPs.has(ip)) {

        return res.status(403).json({

            success: false,

            message: "Access denied."

        });

    }

    next();

};

/**
 * Block IP
 */
exports.blockIP = (ip) => {

    blockedIPs.add(ip);

};

/**
 * Unblock IP
 */
exports.unblockIP = (ip) => {

    blockedIPs.delete(ip);

};

/**
 * SQL / Script Injection Detection
 */
exports.detectInjection = (req, res, next) => {

    const payload = JSON.stringify({

        body: req.body,

        query: req.query,

        params: req.params

    });

    const patterns = [

        /(\$where|\$gt|\$lt|\$ne)/i,

        /<script.*?>/i,

        /union\s+select/i,

        /drop\s+table/i,

        /insert\s+into/i,

        /delete\s+from/i,

        /update\s+\w+/i

    ];

    const found = patterns.some(regex =>
        regex.test(payload)
    );

    if (found) {

        return res.status(400).json({

            success: false,

            message: "Suspicious request detected."

        });

    }

    next();

};

/**
 * Security Headers
 */
exports.headers = (req, res, next) => {

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    res.setHeader(
        "X-Frame-Options",
        "DENY"
    );

    res.setHeader(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );

    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
    );

    next();

};

/**
 * Disable Server Header
 */
exports.hideServer = (req, res, next) => {

    res.removeHeader("X-Powered-By");

    next();

};

/**
 * Admin CSRF Placeholder
 */
exports.csrf = (req, res, next) => {

    // Future CSRF Token Verification

    next();

};
