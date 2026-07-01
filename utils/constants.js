/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Global Constants
 * -------------------------------------------------------
 */

"use strict";

/* ==================================
   Application
================================== */

const APP_NAME = "SMS Hindi Shayari";

const APP_VERSION = "1.0.0";

/* ==================================
   User Roles
================================== */

const USER_ROLES = Object.freeze({
    ADMIN: "admin",
    USER: "user"
});

/* ==================================
   Languages
================================== */

const LANGUAGES = Object.freeze([
    "Hindi",
    "English",
    "Urdu"
]);

/* ==================================
   Shayari Status
================================== */

const SHAYARI_STATUS = Object.freeze({
    DRAFT: "draft",
    PUBLISHED: "published"
});

/* ==================================
   Visibility
================================== */

const VISIBILITY = Object.freeze({
    PUBLIC: "public",
    PRIVATE: "private"
});

/* ==================================
   Comment Status
================================== */

const COMMENT_STATUS = Object.freeze({
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
});

/* ==================================
   Contact Status
================================== */

const CONTACT_STATUS = Object.freeze({
    NEW: "new",
    READ: "read",
    REPLIED: "replied",
    CLOSED: "closed"
});

/* ==================================
   Download Types
================================== */

const DOWNLOAD_TYPES = Object.freeze([
    "png",
    "jpg",
    "jpeg",
    "webp"
]);

/* ==================================
   Image Settings
================================== */

const IMAGE = Object.freeze({

    MAX_SIZE: 5 * 1024 * 1024,

    WIDTH: 1080,

    HEIGHT: 1080,

    MIME_TYPES: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ],

    EXTENSIONS: [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]

});

/* ==================================
   Pagination
================================== */

const PAGINATION = Object.freeze({

    DEFAULT_LIMIT: 20,

    ADMIN_LIMIT: 25,

    COMMENT_LIMIT: 15,

    MAX_LIMIT: 100

});

/* ==================================
   HTTP Status
================================== */

const HTTP_STATUS = Object.freeze({

    OK: 200,

    CREATED: 201,

    BAD_REQUEST: 400,

    UNAUTHORIZED: 401,

    FORBIDDEN: 403,

    NOT_FOUND: 404,

    CONFLICT: 409,

    TOO_MANY_REQUESTS: 429,

    INTERNAL_SERVER_ERROR: 500

});

/* ==================================
   Default SEO
================================== */

const SEO = Object.freeze({

    TITLE: "SMS Hindi Shayari",

    DESCRIPTION:
        "Love Shayari, Sad Shayari, Attitude Shayari, Wishes, Ghazal, Kavita and Hindi Quotes.",

    KEYWORDS: [
        "Hindi Shayari",
        "Love Shayari",
        "Sad Shayari",
        "Attitude Shayari",
        "SMS Hindi Shayari"
    ]

});

/* ==================================
   Export
================================== */

module.exports = {

    APP_NAME,
    APP_VERSION,

    USER_ROLES,

    LANGUAGES,

    SHAYARI_STATUS,

    VISIBILITY,

    COMMENT_STATUS,

    CONTACT_STATUS,

    DOWNLOAD_TYPES,

    IMAGE,

    PAGINATION,

    HTTP_STATUS,

    SEO

};
