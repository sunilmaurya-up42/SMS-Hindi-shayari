/**
 * ==========================================================
 * SMS Hindi Shayari
 * CSRF Protection Middleware
 * ==========================================================
 */

const csrf = require("csurf");

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
});

module.exports = csrfProtection;
