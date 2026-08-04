const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");

const auth = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");

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
