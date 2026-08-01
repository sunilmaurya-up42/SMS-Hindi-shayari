const express = require("express");
const router = express.Router();

const shayariController = require("../controllers/shayari/shayariController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Home API
router.get(
    "/home",
    shayariController.home
);

// Latest Shayari
router.get(
    "/latest",
    shayariController.latest
);

// Trending Shayari
router.get(
    "/trending",
    shayariController.trending
);

// Featured Shayari
router.get(
    "/featured",
    shayariController.featured
);

// Random Shayari
router.get(
    "/random",
    shayariController.random
);

// Search Suggestions
router.get(
    "/suggestions",
    shayariController.suggestions
);

// Get All Shayari
router.get(
    "/",
    shayariController.getAll
);

// Get Single Shayari
router.get(
    "/:slug",
    shayariController.getOne
);

// Related Shayari
router.get(
    "/related/:id",
    shayariController.related
);

/*
|--------------------------------------------------------------------------
| Counter APIs
|--------------------------------------------------------------------------
*/

router.post(
    "/copy/:id",
    shayariController.copy
);

router.post(
    "/share/:id",
    shayariController.share
);

router.post(
    "/download/:id",
    shayariController.download
);

module.exports = router;
