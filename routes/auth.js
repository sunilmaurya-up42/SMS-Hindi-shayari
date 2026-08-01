const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");

const auth = require("../middleware/auth");
const rateLimiter = require("../middleware/rateLimiter");

/**
 * Public Routes
 */

// Admin Login
router.post(
    "/login",
    rateLimiter,
    authController.login
);

// Forgot Password
router.post(
    "/forgot-password",
    rateLimiter,
    authController.forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    rateLimiter,
    authController.resetPassword
);

// Refresh Token
router.post(
    "/refresh-token",
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
