const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload Directory
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({

    destination(req, file, cb) {

        let folder = "others";

        if (file.fieldname === "background") {
            folder = "backgrounds";
        }

        if (file.fieldname === "logo") {
            folder = "logo";
        }

        if (file.fieldname === "favicon") {
            folder = "favicon";
        }

        if (file.fieldname === "shayariImage") {
            folder = "shayari";
        }

        const dir = path.join(uploadDir, folder);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }

        cb(null, dir);

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Allowed Images
const fileFilter = (req, file, cb) => {

    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (!allowed.includes(file.mimetype)) {

        return cb(
            new Error("Only JPG, PNG and WEBP images are allowed.")
        );

    }

    cb(null, true);

};

// Multer
const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024 // 10MB

    }

});

// Error Handler
upload.handleError = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    if (err) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    next();

};

// Delete Local File
upload.remove = (filePath) => {

    if (
        filePath &&
        fs.existsSync(filePath)
    ) {

        fs.unlinkSync(filePath);

    }

};

// Upload Paths
upload.paths = {

    backgrounds: "/uploads/backgrounds/",

    shayari: "/uploads/shayari/",

    logo: "/uploads/logo/",

    favicon: "/uploads/favicon/"

};

module.exports = upload;
