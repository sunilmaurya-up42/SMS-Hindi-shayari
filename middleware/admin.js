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
exports.isAdmin = (req, res, next) => {

    if (req.session.admin) {
        return next();
    }

    return res.redirect("/auth/login");

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
