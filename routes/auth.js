const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");

const auth = require("../middleware/auth");

const {
  loginLimiter,
  apiLimiter
} = require("../middleware/rateLimiter");


// ==========================================================
// BROWSER PAGES
// ==========================================================

router.get("/login", (req, res) => {

    if (req.user) {
        return res.redirect("/");
    }

    res.render("auth/login", {
        title: "Login",
        activePage: "login",
        redirect: req.query.redirect || ""
    });

});


router.get("/register", (req, res) => {

    if (req.user) {
        return res.redirect("/");
    }

    res.render("auth/register", {
        title: "Register",
        activePage: "register"
    });

});


router.get("/forgot-password", (req, res) => {

    res.render("auth/forgot-password", {
        title: "Forgot Password"
    });

});


router.get("/reset-password", (req, res) => {

    res.render("auth/reset-password", {
        title: "Reset Password"
    });

});


// ==========================================================
// USER LOGIN
// ==========================================================

router.post(
    "/login",
    loginLimiter,
    authController.login
);


// ==========================================================
// FORGOT PASSWORD
// ==========================================================

router.post(
    "/forgot-password",
    loginLimiter,
    authController.forgotPassword
);


// ==========================================================
// RESET PASSWORD
// ==========================================================

router.post(
    "/reset-password",
    loginLimiter,
    authController.resetPassword
);


// ==========================================================
// REFRESH TOKEN
// ==========================================================

router.post(
    "/refresh-token",
    apiLimiter,
    authController.refreshToken
);


// ==========================================================
// PROTECTED USER ROUTES
// ==========================================================


// Profile

router.get(
    "/profile",
    auth,
    authController.profile
);


// Logout

router.post(
    "/logout",
    auth,
    authController.logout
);


// Change Password

router.post(
    "/change-password",
    auth,
    authController.changePassword
);


// ==========================================================
// ADMIN LOGIN PAGE
// ==========================================================
// GET /auth/admin-login
// ==========================================================

router.get(
    "/admin-login",
    (req, res) => {

        if (req.user) {
            return res.redirect("/admin/dashboard");
        }

        res.render("admin/login", {
            title: "Admin Login - SMS Hindi Shayari",
            activePage: "admin-login"
        });

    }
);


// ==========================================================
// ADMIN LOGIN
// ==========================================================
// POST /auth/admin-login
// ==========================================================

router.post(
    "/admin-login",
    loginLimiter,
    authController.login
);


// ==========================================================
// EXPORT
// ==========================================================

module.exports = router;
