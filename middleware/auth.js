const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
| Checks JWT from:
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
                authHeader.split(" ")[1];
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

            return res.status(401).json({
                success: false,
                message: "Access denied. Token required."
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

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
};
