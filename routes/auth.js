const express = require("express");
const router = express.Router();

const authController =
    require("../controllers/auth/authController");


// ==========================================================
// ADMIN LOGIN PAGE
// GET /auth/admin-login
// ==========================================================

router.get(
    "/admin-login",
    (req, res) => {

        return res.render(
            "auth/admin-login",
            {
                title: "Admin Login - SMS Hindi Shayari",
                error_msg: null,
                success_msg: null,
                csrfToken: req.csrfToken()
            }
        );

    }
);


// ==========================================================
// ADMIN LOGIN
// POST /auth/admin-login
// ==========================================================

router.post(
    "/admin-login",
    authController.login
);


// ==========================================================
// USER LOGIN PAGE
// GET /auth/login
// ==========================================================

router.get(
    "/login",
    (req, res) => {

        if (req.user) {
            return res.redirect("/");
        }

        return res.render(
            "auth/login",
            {
                title: "Login",
                activePage: "login",
                redirect:
                    req.query.redirect || ""
            }
        );

    }
);


// ==========================================================
// USER REGISTER PAGE
// GET /auth/register
// ==========================================================

router.get(
    "/register",
    (req, res) => {

        if (req.user) {
            return res.redirect("/");
        }

        return res.render(
            "auth/register",
            {
                title: "Register",
                activePage: "register"
            }
        );

    }
);


// ==========================================================
// ADMIN PROFILE
// GET /auth/profile
// ==========================================================

router.get(
    "/profile",
    async (req, res, next) => {

        try {

            if (!req.user) {
                return res.redirect(
                    "/auth/admin-login"
                );
            }

            return authController.profile(
                req,
                res,
                next
            );

        } catch (error) {

            return next(error);

        }

    }
);


// ==========================================================
// LOGOUT
// GET /auth/logout
// ==========================================================

router.get(
    "/logout",
    (req, res, next) => {

        if (!req.logout) {
            return res.redirect("/");
        }

        req.logout((error) => {

            if (error) {
                return next(error);
            }

            if (req.session) {

                req.session.destroy(
                    () => {
                        return res.redirect("/");
                    }
                );

            } else {

                return res.redirect("/");

            }

        });

    }
);


// ==========================================================
// FORGOT PASSWORD
// ==========================================================

router.post(
    "/forgot-password",
    authController.forgotPassword
);


// ==========================================================
// RESET PASSWORD
// ==========================================================

router.post(
    "/reset-password",
    authController.resetPassword
);


// ==========================================================
// REFRESH TOKEN
// ==========================================================

router.post(
    "/refresh-token",
    authController.refreshToken
);


// ==========================================================
// CHANGE PASSWORD
// ==========================================================

router.post(
    "/change-password",
    authController.changePassword
);


module.exports = router;
