const crypto = require("crypto");

/**
 * Generate Random String
 */
exports.randomString = (length = 16) => {

    return crypto
        .randomBytes(length)
        .toString("hex")
        .slice(0, length);

};

/**
 * Generate OTP
 */
exports.generateOTP = (length = 6) => {

    let otp = "";

    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;

};

/**
 * UUID
 */
exports.uuid = () => {

    return crypto.randomUUID();

};

/**
 * Sleep
 */
exports.sleep = (ms) => {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );

};

/**
 * Format Date
 */
exports.formatDate = (date = new Date()) => {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

};

/**
 * Format Time
 */
exports.formatTime = (date = new Date()) => {

    return new Date(date).toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

};

/**
 * File Size
 */
exports.fileSize = (bytes) => {

    if (bytes === 0) return "0 Bytes";

    const k = 1024;

    const sizes = [

        "Bytes",

        "KB",

        "MB",

        "GB",

        "TB"

    ];

    const i = Math.floor(
        Math.log(bytes) / Math.log(k)
    );

    return (
        parseFloat(
            (bytes / Math.pow(k, i)).toFixed(2)
        ) +
        " " +
        sizes[i]
    );

};

/**
 * Read Time
 */
exports.readTime = (text = "") => {

    const words =
        text.trim().split(/\s+/).length;

    const minutes =
        Math.max(1, Math.ceil(words / 200));

    return `${minutes} min read`;

};

/**
 * Truncate Text
 */
exports.truncate = (text, limit = 100) => {

    if (!text) return "";

    return text.length > limit
        ? text.substring(0, limit) + "..."
        : text;

};

/**
 * Number Formatter
 */
exports.numberFormat = (number) => {

    return new Intl.NumberFormat("en-IN")
        .format(number);

};

/**
 * Deep Clone
 */
exports.deepClone = (obj) => {

    return JSON.parse(
        JSON.stringify(obj)
    );

};

/**
 * Capitalize
 */
exports.capitalize = (text = "") => {

    return text
        .charAt(0)
        .toUpperCase() +
        text.slice(1);

};

/**
 * Slug Cleaner
 */
exports.cleanSlug = (slug = "") => {

    return slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");

};

/**
 * Array Unique
 */
exports.uniqueArray = (array = []) => {

    return [...new Set(array)];

};

/**
 * Shuffle Array
 */
exports.shuffle = (array = []) => {

    return array.sort(() => Math.random() - 0.5);

};

/**
 * Is Empty Object
 */
exports.isEmpty = (obj = {}) => {

    return Object.keys(obj).length === 0;

};

/**
 * Safe JSON Parse
 */
exports.safeJSON = (json) => {

    try {

        return JSON.parse(json);

    } catch {

        return null;

    }

};
