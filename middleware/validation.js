/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Validation Middleware
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");

/* ==================================
   Helpers
================================== */

const sendError = (res, message) => {
    return res.status(400).json({
        success: false,
        message
    });
};

const clean = (value = "") => {
    return String(value)
        .trim()
        .replace(/[<>]/g, "");
};

/* ==================================
   Mongo ObjectId
================================== */

exports.validateObjectId = (field = "id") => {

    return (req, res, next) => {

        const value = req.params[field] || req.body[field];

        if (!mongoose.Types.ObjectId.isValid(value)) {
            return sendError(res, `Invalid ${field}.`);
        }

        next();

    };

};

/* ==================================
   Login Validation
================================== */

exports.validateLogin = (req, res, next) => {

    req.body.email = clean(req.body.email).toLowerCase();
    req.body.password = clean(req.body.password);

    if (!req.body.email || !req.body.password) {
        return sendError(res, "Email and password are required.");
    }

    next();

};

/* ==================================
   Register Validation
================================== */

exports.validateRegister = (req, res, next) => {

    req.body.name = clean(req.body.name);
    req.body.email = clean(req.body.email).toLowerCase();
    req.body.password = clean(req.body.password);

    if (
        !req.body.name ||
        !req.body.email ||
        !req.body.password
    ) {
        return sendError(res, "All fields are required.");
    }

    if (req.body.password.length < 8) {
        return sendError(res, "Password must be at least 8 characters.");
    }

    next();

};

/* ==================================
   Shayari Validation
================================== */

exports.validateShayari = (req, res, next) => {

    req.body.title = clean(req.body.title);
    req.body.content = clean(req.body.content);

    if (!req.body.title) {
        return sendError(res, "Title is required.");
    }

    if (!req.body.content) {
        return sendError(res, "Shayari content is required.");
    }

    next();

};

/* ==================================
   Category Validation
================================== */

exports.validateCategory = (req, res, next) => {

    req.body.name = clean(req.body.name);

    if (!req.body.name) {
        return sendError(res, "Category name is required.");
    }

    next();

};

/* ==================================
   Comment Validation
================================== */

exports.validateComment = (req, res, next) => {

    req.body.message = clean(req.body.message);

    if (!req.body.message) {
        return sendError(res, "Comment is required.");
    }

    next();

};

/* ==================================
   Contact Validation
================================== */

exports.validateContact = (req, res, next) => {

    req.body.name = clean(req.body.name);
    req.body.email = clean(req.body.email);
    req.body.subject = clean(req.body.subject);
    req.body.message = clean(req.body.message);

    if (
        !req.body.name ||
        !req.body.email ||
        !req.body.subject ||
        !req.body.message
    ) {
        return sendError(res, "All fields are required.");
    }

    next();

};

/* ==================================
   Upload Validation
================================== */

exports.validateUpload = (req, res, next) => {

    if (!req.file) {
        return sendError(res, "Please upload an image.");
    }

    next();

};
