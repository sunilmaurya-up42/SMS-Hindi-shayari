const mongoose = require("mongoose");

/**
 * Validate MongoDB ObjectId
 */
exports.validateObjectId = (req, res, next) => {

    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID."
        });
    }

    next();

};

/**
 * Login Validation
 */
exports.validateLogin = (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    next();

};

/**
 * Shayari Validation
 */
exports.validateShayari = (req, res, next) => {

    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({
            success: false,
            message: "Title, content and category are required."
        });
    }

    next();

};

/**
 * Category Validation
 */
exports.validateCategory = (req, res, next) => {

    if (!req.body.name) {
        return res.status(400).json({
            success: false,
            message: "Category name is required."
        });
    }

    next();

};

/**
 * Comment Validation
 */
exports.validateComment = (req, res, next) => {

    const { name, comment } = req.body;

    if (!name || !comment) {
        return res.status(400).json({
            success: false,
            message: "Name and comment are required."
        });
    }

    next();

};

/**
 * Contact Validation
 */
exports.validateContact = (req, res, next) => {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    next();

};

/**
 * SEO Validation
 */
exports.validateSeo = (req, res, next) => {

    if (!req.body.title || !req.body.description) {
        return res.status(400).json({
            success: false,
            message: "SEO title and description are required."
        });
    }

    next();

};

/**
 * Settings Validation
 */
exports.validateSettings = (req, res, next) => {

    if (!req.body.siteName) {
        return res.status(400).json({
            success: false,
            message: "Website name is required."
        });
    }

    next();

};

/**
 * Slug Validation
 */
exports.validateSlug = (req, res, next) => {

    const slug = req.params.slug;

    const regex = /^[a-z0-9-]+$/;

    if (!slug || !regex.test(slug)) {
        return res.status(400).json({
            success: false,
            message: "Invalid slug."
        });
    }

    next();

};

/**
 * Request Sanitization
 */
exports.sanitizeRequest = (req, res, next) => {

    const clean = (obj) => {

        Object.keys(obj).forEach(key => {

            if (typeof obj[key] === "string") {

                obj[key] = obj[key]
                    .trim()
                    .replace(/<script.*?>.*?<\/script>/gi, "");

            }

        });

    };

    if (req.body) clean(req.body);
    if (req.query) clean(req.query);

    next();

};
