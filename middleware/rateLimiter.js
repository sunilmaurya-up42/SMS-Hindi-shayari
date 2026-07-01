/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Rate Limiter Middleware
 * -------------------------------------------------------
 */

"use strict";

const rateLimit = require("express-rate-limit");

/* ==================================
   Common Handler
================================== */

const handler = (req, res) => {

    const response = {
        success: false,
        message: "Too many requests. Please try again later."
    };

    if (req.originalUrl.startsWith("/api")) {
        return res.status(429).json(response);
    }

    return res.status(429).render("errors/429", {
        title: "Too Many Requests",
        statusCode: 429,
        message: response.message
    });

};

/* ==================================
   Global Rate Limit
================================== */

const globalLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 300,

    standardHeaders: true,

    legacyHeaders: false,

    handler

});

/* ==================================
   Login Rate Limit
================================== */

const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: true,

    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler

});

/* ==================================
   Contact Form Rate Limit
================================== */

const contactLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    limit: 5,

    standardHeaders: true,

    legacyHeaders: false,

    handler

});

/* ==================================
   Comment Rate Limit
================================== */

const commentLimiter = rateLimit({

    windowMs: 10 * 60 * 1000,

    limit: 20,

    standardHeaders: true,

    legacyHeaders: false,

    handler

});

/* ==================================
   Image Download Rate Limit
================================== */

const downloadLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    limit: 100,

    standardHeaders: true,

    legacyHeaders: false,

    handler

});

/* ==================================
   API Rate Limit
================================== */

const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 150,

    standardHeaders: true,

    legacyHeaders: false,

    handler

});

/* ==================================
   Export
================================== */

module.exports = {

    globalLimiter,

    loginLimiter,

    contactLimiter,

    commentLimiter,

    downloadLimiter,

    apiLimiter

};
