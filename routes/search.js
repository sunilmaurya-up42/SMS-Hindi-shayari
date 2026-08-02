const express = require("express");

const router = express.Router();

const searchController = require("../controllers/search/searchController");

/**
 * Global Search
 */
router.get(
    "/",
    searchController.search
);

/**
 * Search Suggestions (AJAX)
 */
router.get(
    "/suggestions",
    searchController.suggestions
);

/**
 * Category Search
 */
router.get(
    "/category/:slug",
    searchController.category
);

/**
 * Tag Search
 */
router.get(
    "/tag/:tag",
    searchController.tag
);

/**
 * Search Statistics API
 */
router.get(
    "/statistics",
    searchController.statistics
);

module.exports = router;
