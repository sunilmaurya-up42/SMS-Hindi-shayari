const slugify = require("slugify");

/**
 * Reserved Slugs
 */
const RESERVED_SLUGS = [
    "admin",
    "login",
    "register",
    "dashboard",
    "api",
    "about",
    "contact",
    "privacy",
    "terms",
    "robots",
    "sitemap",
    "search"
];

/**
 * Generate SEO Slug
 */
exports.generate = (text, separator = "-") => {

    return slugify(text, {
        lower: true,
        strict: true,
        trim: true,
        replacement: separator
    });

};

/**
 * Generate Unique Slug
 */
exports.unique = async (
    Model,
    text,
    field = "slug"
) => {

    let slug = exports.generate(text);

    let count = 1;

    while (await Model.exists({ [field]: slug })) {

        slug = `${exports.generate(text)}-${count}`;

        count++;

    }

    return slug;

};

/**
 * Reserved Slug Check
 */
exports.isReserved = (slug) => {

    return RESERVED_SLUGS.includes(
        slug.toLowerCase()
    );

};

/**
 * Validate Slug
 */
exports.validate = (slug) => {

    return /^[a-z0-9-]+$/.test(slug);

};

/**
 * Clean Slug
 */
exports.clean = (slug) => {

    return slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");

};

/**
 * Generate Slug From Hindi
 */
exports.fromHindi = (text) => {

    return slugify(text, {
        lower: true,
        strict: true,
        trim: true,
        locale: "hi"
    });

};

/**
 * Compare Slugs
 */
exports.equals = (slug1, slug2) => {

    return exports.clean(slug1) === exports.clean(slug2);

};

/**
 * Auto Increment Slug
 */
exports.increment = (slug, number) => {

    return `${exports.clean(slug)}-${number}`;

};

/**
 * Ensure Safe Slug
 */
exports.safe = (slug) => {

    slug = exports.clean(slug);

    if (exports.isReserved(slug)) {
        slug += "-page";
    }

    return slug;

};

/**
 * Remove Duplicate Separator
 */
exports.normalize = (
    slug,
    separator = "-"
) => {

    const regex = new RegExp(
        `${separator}+`,
        "g"
    );

    return slug.replace(regex, separator);

};
