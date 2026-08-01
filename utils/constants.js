/**
 * User Roles
 */
exports.ROLES = {
    USER: "user",
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin"
};

/**
 * Status
 */
exports.STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    BLOCKED: "blocked",
    DELETED: "deleted"
};

/**
 * Shayari Status
 */
exports.SHAYARI_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived"
};

/**
 * Supported Languages
 */
exports.LANGUAGES = [
    "Hindi",
    "English",
    "Bhojpuri",
    "Urdu"
];

/**
 * Categories
 */
exports.DEFAULT_CATEGORIES = [
    "Love",
    "Sad",
    "Attitude",
    "Friendship",
    "Motivational",
    "Good Morning",
    "Good Night",
    "Birthday",
    "Festival"
];

/**
 * Image
 */
exports.IMAGE = {

    MAX_SIZE: 5 * 1024 * 1024,

    THUMBNAIL_WIDTH: 300,

    THUMBNAIL_HEIGHT: 300,

    QUALITY: 90,

    ALLOWED_TYPES: [

        "image/jpeg",

        "image/png",

        "image/webp"

    ]

};

/**
 * Pagination
 */
exports.PAGINATION = {

    DEFAULT_LIMIT: 20,

    MAX_LIMIT: 100

};

/**
 * SEO
 */
exports.SEO = {

    TITLE_LENGTH: 60,

    DESCRIPTION_LENGTH: 160,

    DEFAULT_TITLE:
        "SMS Hindi Shayari",

    DEFAULT_DESCRIPTION:
        "Latest Hindi Shayari Collection",

    DEFAULT_KEYWORDS:
        "Hindi Shayari, Love Shayari, Sad Shayari"

};

/**
 * OTP
 */
exports.OTP = {

    LENGTH: 6,

    EXPIRE_MINUTES: 10

};

/**
 * Cache
 */
exports.CACHE = {

    DEFAULT_TTL: 3600

};

/**
 * File Paths
 */
exports.PATHS = {

    UPLOADS: "uploads",

    GENERATED: "uploads/generated",

    BACKUPS: "backups",

    LOGS: "logs"

};

/**
 * API Response
 */
exports.RESPONSE = {

    SUCCESS: "Success",

    FAILED: "Failed",

    NOT_FOUND: "Not Found",

    UNAUTHORIZED: "Unauthorized",

    FORBIDDEN: "Forbidden",

    SERVER_ERROR: "Internal Server Error"

};

/**
 * Default Settings
 */
exports.DEFAULT_SETTINGS = {

    maintenanceMode: false,

    commentsEnabled: true,

    downloadsEnabled: true,

    registrationEnabled: true,

    aiImageEnabled: true

};
