/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Authentication Middleware
 * -------------------------------------------------------
 */

"use strict";

const User = require("../models/User");

/* ==================================
   Login Required
================================== */

exports.isAuthenticated = async (req, res, next) => {

    try {

        if (!req.isAuthenticated || !req.isAuthenticated()) {

            if (req.originalUrl.startsWith("/api")) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required."
                });
            }

            return res.redirect("/auth/login");
        }

        const user = await User.findById(req.user._id).select("-password");

        if (!user) {

            await new Promise((resolve, reject) => {
    req.logout((err) => {
        if (err) return reject(err);
        resolve();
    });
});

            if (req.originalUrl.startsWith("/api")) {
                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });
            }

            return res.redirect("/auth/login");
        }

        if (!user.isActive) {

            await new Promise((resolve, reject) => {
    req.logout((err) => {
        if (err) return reject(err);
        resolve();
    });
});

            if (req.originalUrl.startsWith("/api")) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been disabled."
                });
            }

            return res.redirect("/auth/login");
        }

        req.user = user;

        next();

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Optional Login
================================== */

exports.optionalAuth = async (req, res, next) => {

    try {

        if (
            req.isAuthenticated &&
            req.isAuthenticated() &&
            req.user
        ) {

            const user = await User.findById(req.user._id).select("-password");

            if (!user || !user.isActive) {

    await new Promise((resolve) => {
        req.logout(() => resolve());
    });

    req.user = null;

} else {

    req.user = user;

            }

        }

        next();

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Guest Only
================================== */

exports.isGuest = (req, res, next) => {

    if (
        req.isAuthenticated &&
        req.isAuthenticated()
    ) {
        return res.redirect("/");
    }

    next();

};
