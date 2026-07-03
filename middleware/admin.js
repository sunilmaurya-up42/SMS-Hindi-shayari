/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Admin Authorization Middleware
 * -------------------------------------------------------
 */

"use strict";

const User = require("../models/User");

/* ==================================
   Admin Required
================================== */

exports.isAdmin = async (req, res, next) => {

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

            req.logout(() => {});

            if (req.originalUrl.startsWith("/api")) {
                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });
            }

            return res.redirect("/auth/login");
        }

        if (!user.isActive) {

            req.logout(() => {});

            if (req.originalUrl.startsWith("/api")) {
                return res.status(403).json({
                    success: false,
                    message: "Account disabled."
                });
            }

            return res.redirect("/auth/login");
        }

        if (user.role !== "admin") {

            if (req.originalUrl.startsWith("/api")) {
                return res.status(403).json({
                    success: false,
                    message: "Admin access required."
                });
            }

            return res.status(403).render("errors/403", {
                title: "403 Forbidden"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Admin Or Self
================================== */

exports.isAdminOrSelf = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    if (
        req.user.role === "admin" ||
        req.user._id.toString() === req.params.id
    ) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Permission denied."
    });

};

/* ==================================
   Role Check
================================== */

exports.hasRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied."
            });

        }

        next();

    };

};
