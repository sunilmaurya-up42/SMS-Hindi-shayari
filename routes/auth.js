const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authController");

const {
    loginLimiter,
    apiLimiter
} = require("../middleware/rateLimiter");

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post(
    "/login",
    loginLimiter,
    authController.login
);

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

router.post(
    "/register",
    apiLimiter,
    authController.register
);

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

router.post(
    "/forgot-password",
    loginLimiter,
    authController.forgotPassword
);

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

router.post(
    "/reset-password",
    loginLimiter,
    authController.resetPassword
);

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

router.post(
    "/refresh-token",
    apiLimiter,
    authController.refreshToken
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post(
    "/logout",
    authController.logout
);

module.exports = router;
