const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");

const auth = require("../middleware/auth");
const {
  loginLimiter,
  apiLimiter
} = require("../middleware/rateLimiter");

// Browser pages
router.get("/login", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("auth/login", {
        title: "Login",
        activePage: "login",
        redirect: req.query.redirect || ""
    });
});

router.get("/register", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("auth/register", {
        title: "Register",
        activePage: "register"
    });
});

router.get("/forgot-password", (req, res) => {
    res.render("auth/forgot-password", { title: "Forgot Password" });
});

router.get("/reset-password", (req, res) => {
    res.render("auth/reset-password", { title: "Reset Password" });
});

// login 
router.post(
    "/login",
    loginLimiter,
    authController.login
);

// Forgot Password
router.post(
    "/forgot-password",
    loginLimiter,
    authController.forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    loginLimiter,
    authController.resetPassword
);

// Refresh Token
router.post(
    "/refresh-token",
    apiLimiter,
    authController.refreshToken
);

/**
 * Protected Routes
 */

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

module.exports = router;
