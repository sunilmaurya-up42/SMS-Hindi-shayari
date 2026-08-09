const rateLimit = require("express-rate-limit");

/**
 * Default API Rate Limiter
 */
const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }

});


/**
 * Login Rate Limiter
 *
 * 10 failed attempts allowed within 5 minutes.
 * Successful login attempts are not counted.
 */
const loginLimiter = rateLimit({

    windowMs: 5 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many failed login attempts. Please try again after 5 minutes."
    }

});


/**
 * Contact Form Limiter
 */
const contactLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Contact form limit exceeded."
    }

});


/**
 * Comment Limiter
 */
const commentLimiter = rateLimit({

    windowMs: 30 * 60 * 1000,

    max: 20,

    message: {
        success: false,
        message: "Too many comments."
    }

});


/**
 * AI Image Generate Limiter
 */
const aiImageLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    max: 50,

    message: {
        success: false,
        message: "AI image generation limit reached."
    }

});


/**
 * Download Limiter
 */
const downloadLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    max: 100,

    message: {
        success: false,
        message: "Download limit exceeded."
    }

});


/**
 * Search Limiter
 */
const searchLimiter = rateLimit({

    windowMs: 10 * 60 * 1000,

    max: 100,

    message: {
        success: false,
        message: "Search limit exceeded."
    }

});


/**
 * Admin API Limiter
 */
const adminLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 1000,

    message: {
        success: false,
        message: "Admin request limit exceeded."
    }

});


/**
 * Export
 */
module.exports = {

    apiLimiter,

    loginLimiter,

    contactLimiter,

    commentLimiter,

    aiImageLimiter,

    downloadLimiter,

    searchLimiter,

    adminLimiter

};
