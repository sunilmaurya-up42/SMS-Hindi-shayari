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
    (req, res, next) => {

        try {

            return res.render(
                "admin/login",
                {
                    title: "Admin Login - SMS Hindi Shayari",
                    error_msg: null,
                    success_msg: null,
                    csrfToken: req.csrfToken()
                }
            );

        } catch (error) {

            console.error(
                "❌ Admin Login Page Error:",
                error
            );

            return next(error);

        }

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
// ADMIN LOGOUT
// GET /auth/logout
// ==========================================================

router.get(
    "/logout",
    (req, res, next) => {

        try {

            if (typeof req.logout === "function") {

                return req.logout((error) => {

                    if (error) {
                        return next(error);
                    }

                    if (req.session) {

                        return req.session.destroy(
                            () => {
                                return res.redirect(
                                    "/auth/admin-login"
                                );
                            }
                        );

                    }

                    return res.redirect(
                        "/auth/admin-login"
                    );

                });

            }

            return res.redirect(
                "/auth/admin-login"
            );

        } catch (error) {

            return next(error);

        }

    }
);


module.exports = router;
