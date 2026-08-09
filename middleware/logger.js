const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Write Log
 */
function writeLog(fileName, message) {

    const today = new Date().toISOString().split("T")[0];

    const file = path.join(
        logDirectory,
        `${today}-${fileName}.log`
    );

    const log = `[${new Date().toISOString()}] ${message}\n`;

    fs.appendFile(file, log, err => {

        if (err) {
            console.error(err);
        }

    });

}

/**
 * Request Logger
 */
exports.request = (req, res, next) => {

    writeLog(
        "request",
        `${req.ip} ${req.method} ${req.originalUrl}`
    );

    next();

};

/**
 * Error Logger
 */
exports.error = (err, req, res, next) => {

    writeLog(
        "error",
        `${req.method} ${req.originalUrl}\n${err.stack || err}`
    );

    next(err);

};

/**
 * Login Logger
 */
exports.login = (email, success, ip) => {

    writeLog(
        "login",
        `${email} | ${success ? "SUCCESS" : "FAILED"} | ${ip}`
    );

};

/**
 * Admin Activity Logger
 */
exports.admin = (admin, action) => {

    writeLog(
        "admin",
        `${admin} => ${action}`
    );

};

/**
 * File Upload Logger
 */
exports.upload = (fileName, type) => {

    writeLog(
        "upload",
        `${type} | ${fileName}`
    );

};

/**
 * AI Image Logger
 */
exports.aiImage = (prompt, imageUrl) => {

    writeLog(
        "ai-image",
        `Prompt: ${prompt}\nImage: ${imageUrl}`
    );

};

/**
 * GitHub Upload Logger
 */
exports.github = (pathName) => {

    writeLog(
        "github",
        `Uploaded: ${pathName}`
    );

};

/**
 * API Logger
 */
exports.api = (endpoint, status) => {

    writeLog(
        "api",
        `${endpoint} | ${status}`
    );

};

/**
 * Download Logger
 */
exports.download = (fileName, ip) => {

    writeLog(
        "download",
        `${fileName} | ${ip}`
    );

};

/**
 * Custom Logger
 */
exports.custom = (type, message) => {

    writeLog(type, message);

};
