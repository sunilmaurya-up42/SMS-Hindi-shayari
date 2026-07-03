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

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.admin = true;

        return res.redirect("/admin");
    }

    return res.render("pages/auth/login", {
        title: "Login",
        error: "Invalid Email or Password"
    });

});

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

router.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/auth/login");
    });

});

/* ==================================
   Export
================================== */

module.exports = router;
