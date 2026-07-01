
/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Helper Utilities
 * -------------------------------------------------------
 */

"use strict";

const crypto = require("crypto");

/* ==================================
   Date Format
================================== */

const formatDate = (date) => {

    if (!date) return "";

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
    }).format(new Date(date));

};

/* ==================================
   Time Ago
================================== */

const timeAgo = (date) => {

    if (!date) return "";

    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    const units = [
        { name: "year", value: 31536000 },
        { name: "month", value: 2592000 },
        { name: "day", value: 86400 },
        { name: "hour", value: 3600 },
        { name: "minute", value: 60 }
    ];

    for (const unit of units) {

        const value = Math.floor(seconds / unit.value);

        if (value >= 1) {
            return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
        }

    }

    return "Just now";

};

/* ==================================
   Number Format
================================== */

const formatNumber = (number = 0) =>
    new Intl.NumberFormat("en-IN").format(number);

/* ==================================
   File Size
================================== */

const formatFileSize = (bytes = 0) => {

    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;

};

/* ==================================
   Random String
================================== */

const randomString = (length = 32) => {

    return crypto
        .randomBytes(length)
        .toString("hex")
        .slice(0, length);

};

/* ==================================
   Truncate Text
================================== */

const truncate = (text = "", length = 150) => {

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length).trim() + "...";

};

/* ==================================
   Reading Time
================================== */

const readingTime = (text = "") => {

    const words = text.trim().split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 180));

};

/* ==================================
   Escape HTML
================================== */

const escapeHtml = (text = "") => {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

};

/* ==================================
   Safe JSON Parse
================================== */

const safeJsonParse = (value, fallback = {}) => {

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }

};

/* ==================================
   Pagination
================================== */

const paginate = (page = 1, limit = 20) => {

    page = Number(page) || 1;
    limit = Number(limit) || 20;

    return {
        page,
        limit,
        skip: (page - 1) * limit
    };

};

/* ==================================
   Async Handler
================================== */

const asyncHandler = (fn) => {

    return (req, res, next) => {

        Promise.resolve(fn(req, res, next))
            .catch(next);

    };

};

/* ==================================
   Export
================================== */

module.exports = {

    formatDate,
    timeAgo,
    formatNumber,
    formatFileSize,
    randomString,
    truncate,
    readingTime,
    escapeHtml,
    safeJsonParse,
    paginate,
    asyncHandler

};
