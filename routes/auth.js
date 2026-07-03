/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Auth Routes
 * -------------------------------------------------------
 */

"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
    isGuest,
    isAuthenticated
} = require("../middleware/auth");

const {
    loginLimiter
} = require("../middleware/rateLimiter");

const {
    validateLogin,
    validateRegister
} = require("../middleware/validation");

/* ==================================
   Login Page
================================== */

router.get("/login", isGuest, (req, res) => {

    res.render("pages/auth/login", {
    title: "Login"
});

});

/* ==================================
   Register Page
================================== */

router.get("/register", isGuest, (req, res) => {

    res.render("pages/auth/register", {
    title: "Register"
});

});

/* ==================================
   Login Action
================================== */

router.post(
    "/login",
    loginLimiter,
    validateLogin,
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: true
    }),
    (req, res) => {

        if (req.body.remember) {
            req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
        }

        return res.redirect("/");
    }
);

/* ==================================
   Register Action (Basic Placeholder)
================================== */

router.post(
    "/register",
    validateRegister,
    async (req, res, next) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;

            const exists = await User.findOne({
                email: email.toLowerCase().trim()
            });

            if (exists) {
                return res.render("pages/auth/register", {
    title: "Register",
    error: "Email already registered."
});
            }

            const hash = await bcrypt.hash(password, 12);

            await User.create({

                name,

                email: email.toLowerCase().trim(),

                password: hash

            });

            return res.redirect("/auth/login");

        } catch (error) {

            next(error);

        }

    }
);

/* ==================================
   Logout
================================== */

router.get("/logout", isAuthenticated, (req, res, next) => {

    req.logout((err) => {

        if (err) return next(err);

        req.session.destroy(() => {
            res.redirect("/");
        });

    });

});

/* ==================================
   Export
================================== */

module.exports = router;
