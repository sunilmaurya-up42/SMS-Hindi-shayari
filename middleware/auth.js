const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
| JWT token:
| 1. Authorization: Bearer <token>
| 2. token cookie
|--------------------------------------------------------------------------
*/

module.exports = (req, res, next) => {
    try {

        let token = null;

        /*
        |--------------------------------------------------------------------------
        | Authorization Header
        |--------------------------------------------------------------------------
        */

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token =
                authHeader.substring(7).trim();
        }

        /*
        |--------------------------------------------------------------------------
        | Cookie
        |--------------------------------------------------------------------------
        */

        if (!token && req.cookies) {
            token = req.cookies.token;
        }

        /*
        |--------------------------------------------------------------------------
        | Token Missing
        |--------------------------------------------------------------------------
        */

        if (!token) {

            /*
             * Browser request:
             * redirect to Admin Login
             */

            if (
                req.accepts("html") &&
                !req.originalUrl.startsWith("/api/")
            ) {

                return res.redirect(
                    "/admin/login"
                );
            }

            return res.status(401).json({
                success: false,
                message:
                    "Access denied. Token required."
            });
        }

        /*
        |--------------------------------------------------------------------------
        | JWT Secret Check
        |--------------------------------------------------------------------------
        */

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing."
            );

            return res.status(500).json({
                success: false,
                message:
                    "Authentication configuration error."
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Verify Token
        |--------------------------------------------------------------------------
        */

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );

        /*
        |--------------------------------------------------------------------------
        | Browser
        |--------------------------------------------------------------------------
        */

        if (
            req.accepts("html") &&
            !req.originalUrl.startsWith("/api/")
        ) {

            return res.redirect(
                "/admin/login"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token."
        });
    }
};
