const multer = require("multer");

module.exports = (err, req, res, next) => {

    console.error(err);

    // Mongoose Validation Error
    if (err.name === "ValidationError") {

        const errors = Object.values(err.errors).map(item => item.message);

        return res.status(400).json({
            success: false,
            type: "ValidationError",
            message: "Validation failed.",
            errors
        });

    }

    // Duplicate Key Error
    if (err.code === 11000) {

        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({
            success: false,
            type: "DuplicateKey",
            message: `${field} already exists.`
        });

    }

    // Invalid ObjectId
    if (err.name === "CastError") {

        return res.status(400).json({
            success: false,
            type: "CastError",
            message: "Invalid ID."
        });

    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {

        return res.status(401).json({
            success: false,
            type: "TokenExpired",
            message: "Token expired."
        });

    }

    // JWT Invalid
    if (err.name === "JsonWebTokenError") {

        return res.status(401).json({
            success: false,
            type: "InvalidToken",
            message: "Invalid token."
        });

    }

    // Multer Error
    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            type: "UploadError",
            message: err.message
        });

    }

    // File Type Error
    if (err.message === "Only JPG, PNG and WEBP images are allowed.") {

        return res.status(400).json({
            success: false,
            type: "FileTypeError",
            message: err.message
        });

    }

    // Custom API Error
    if (err.statusCode) {

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });

    }

    // Development
    if (process.env.NODE_ENV === "development") {

        return res.status(500).json({
            success: false,
            type: err.name,
            message: err.message,
            stack: err.stack
        });

    }

    // Production
    return res.status(500).json({
        success: false,
        message: "Internal Server Error."
    });

};
