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
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Create Shayari
router.post(
    "/create",
    auth,
    admin,
    shayariController.create
);

// Update Shayari
router.put(
    "/update/:id",
    auth,
    admin,
    shayariController.update
);

// Soft Delete Shayari
router.delete(
    "/delete/:id",
    auth,
    admin,
    shayariController.remove
);

// Generate AI Image
router.post(
    "/generate-image/:id",
    auth,
    admin,
    shayariController.generateImage
);

// Upload Generated Image To GitHub
router.post(
    "/upload-image/:id",
    auth,
    admin,
    shayariController.uploadImage
);

// Download Generated Image
router.get(
    "/download-image/:id",
    shayariController.downloadImage
);

// Refresh SEO
router.post(
    "/refresh-seo/:id",
    auth,
    admin,
    shayariController.refreshSeo
);

// Bulk Import Shayari
router.post(
    "/bulk-import",
    auth,
    admin,
    upload.single("file"),
    shayariController.bulkImport
);

// Bulk Export Shayari
router.get(
    "/bulk-export",
    auth,
    admin,
    shayariController.bulkExport
);

// Restore Deleted Shayari
router.put(
    "/restore/:id",
    auth,
    admin,
    shayariController.restore
);

// Permanently Delete Shayari
router.delete(
    "/force-delete/:id",
    auth,
    admin,
    shayariController.forceDelete
);

// Toggle Featured
router.patch(
    "/featured/:id",
    auth,
    admin,
    shayariController.toggleFeatured
);

// Toggle Trending
router.patch(
    "/trending/:id",
    auth,
    admin,
    shayariController.toggleTrending
);

// Publish / Unpublish
router.patch(
    "/publish/:id",
    auth,
    admin,
    shayariController.togglePublish
);
/*
|--------------------------------------------------------------------------
| Advanced Public Routes
|--------------------------------------------------------------------------
*/

// Advanced Search
router.get(
    "/search",
    shayariController.search
);

// Category Wise Shayari
router.get(
    "/category/:slug",
    shayariController.categoryWise
);

// Language Wise Shayari
router.get(
    "/language/:language",
    shayariController.languageWise
);

// Tag Wise Shayari
router.get(
    "/tag/:tag",
    shayariController.tagWise
);

// Archive
router.get(
    "/archive/:year/:month",
    shayariController.archive
);

// Most Viewed
router.get(
    "/most-viewed",
    shayariController.mostViewed
);

// Most Downloaded
router.get(
    "/most-downloaded",
    shayariController.mostDownloaded
);

// Most Shared
router.get(
    "/most-shared",
    shayariController.mostShared
);

// Most Copied
router.get(
    "/most-copied",
    shayariController.mostCopied
);

// Validate Slug
router.get(
    "/slug/:slug",
    shayariController.validateSlug
);

// SEO Redirect
router.get(
    "/redirect/:slug",
    shayariController.redirect
);

/*
|--------------------------------------------------------------------------
| Version 1 API
|--------------------------------------------------------------------------
*/

router.get(
    "/v1/home",
    shayariController.home
);

router.get(
    "/v1/latest",
    shayariController.latest
);

router.get(
    "/v1/trending",
    shayariController.trending
);

router.get(
    "/v1/featured",
    shayariController.featured
);

router.get(
    "/v1/random",
    shayariController.random
);

router.get(
    "/v1/search",
    shayariController.search
);

router.get(
    "/v1/:slug",
    shayariController.getOne
);

module.exports = router;
