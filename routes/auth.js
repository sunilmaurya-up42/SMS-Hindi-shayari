const express = require("express");
const router = express.Router();

const authController =
    require("../controllers/auth/authController");

const auth =
    require("../middleware/auth");

const {
    loginLimiter,
    apiLimiter
} = require("../middleware/rateLimiter");


/*
|--------------------------------------------------------------------------
| USER LOGIN
|--------------------------------------------------------------------------
| POST /auth/login
|--------------------------------------------------------------------------
*/

router.post(
    "/login",
    loginLimiter,
    authController.login
);


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
| POST /auth/admin-login
|--------------------------------------------------------------------------
*/

router.post(
    "/admin-login",
    loginLimiter,
    authController.adminLogin
);


/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

router.post(
    "/forgot-password",
    loginLimiter,
    authController.forgotPassword
);


/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

router.post(
    "/reset-password",
    loginLimiter,
    authController.resetPassword
);


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
*/

router.post(
    "/refresh-token",
    apiLimiter,
    authController.refreshToken
);


/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
| GET /auth/profile
|--------------------------------------------------------------------------
*/

router.get(
    "/profile",
    auth,
    authController.profile
);


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

router.post(
    "/logout",
    auth,
    authController.logout
);


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

router.post(
    "/change-password",
    auth,
    authController.changePassword
);

/* Registration */

router.post(
    "/register",
    authController.register
);
module.exports = router;
