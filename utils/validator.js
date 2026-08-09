const mongoose = require("mongoose");

/**
 * Email Validation
 */
exports.isEmail = (email = "") => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

};

/**
 * Mobile Number Validation (India)
 */
exports.isMobile = (mobile = "") => {

    return /^[6-9]\d{9}$/.test(mobile);

};

/**
 * Password Strength
 */
exports.isStrongPassword = (password = "") => {

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(password);

};

/**
 * Username Validation
 */
exports.isUsername = (username = "") => {

    return /^[a-zA-Z0-9_]{3,30}$/.test(username);

};

/**
 * URL Validation
 */
exports.isURL = (url = "") => {

    try {

        new URL(url);

        return true;

    } catch {

        return false;

    }

};

/**
 * Slug Validation
 */
exports.isSlug = (slug = "") => {

    return /^[a-z0-9-]+$/.test(slug);

};

/**
 * MongoDB ObjectId Validation
 */
exports.isObjectId = (id = "") => {

    return mongoose.Types.ObjectId.isValid(id);

};

/**
 * File Extension Validation
 */
exports.isImage = (filename = "") => {

    return /\.(jpg|jpeg|png|webp)$/i.test(filename);

};

/**
 * File Size Validation
 */
exports.isValidSize = (

    size,

    max = 5 * 1024 * 1024

) => {

    return size <= max;

};

/**
 * HTML Escape
 */
exports.escapeHTML = (text = "") => {

    return text

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#39;");

};

/**
 * Remove Script Tags
 */
exports.sanitize = (text = "") => {

    return text

        .replace(/<script.*?>.*?<\/script>/gis, "")

        .trim();

};

/**
 * Required Field Validation
 */
exports.required = (...values) => {

    return values.every(value =>

        value !== undefined &&

        value !== null &&

        value !== ""

    );

};

/**
 * Min Length Validation
 */
exports.minLength = (

    value = "",

    min = 1

) => {

    return value.length >= min;

};

/**
 * Max Length Validation
 */
exports.maxLength = (

    value = "",

    max = 255

) => {

    return value.length <= max;

};

/**
 * Number Validation
 */
exports.isNumber = (value) => {

    return !isNaN(value);

};

/**
 * Boolean Validation
 */
exports.isBoolean = (value) => {

    return typeof value === "boolean";

};

/**
 * Date Validation
 */
exports.isDate = (value) => {

    return !isNaN(Date.parse(value));

};
