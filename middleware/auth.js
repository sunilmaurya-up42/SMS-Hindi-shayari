const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {

    try {

        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token required."
            });
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account disabled."
            });
        }

        req.user = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                message: "Token expired."
            });

        }

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });

        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed."
        });

    }

};
