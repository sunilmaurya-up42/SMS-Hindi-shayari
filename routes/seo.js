const express = require("express");
const router = express.Router();

const seoController = require("../controllers/seo/seoController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Generate Sitemap
router.get(
    "/sitemap.xml",
    seoController.generateSitemap
);

// robots.txt
router.get(
    "/robots.txt",
    seoController.robots
);

// ads.txt
router.get(
    "/ads.txt",
    seoController.ads
);

// JSON-LD Schema
router.get(
    "/schema",
    seoController.schema
);

// Open Graph
router.get(
    "/opengraph/:id",
    seoController.openGraph
);

// Twitter Card
router.get(
    "/twitter/:id",
    seoController.twitterCard
);

// Canonical URL
router.get(
    "/canonical/:id",
    seoController.canonical
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Get SEO Records
router.get(
    "/",
    auth,
    admin,
    seoController.getSeo
);

// Create / Update SEO
router.post(
    "/",
    auth,
    admin,
    seoController.saveSeo
);

// Update SEO
router.put(
    "/:id",
    auth,
    admin,
    seoController.saveSeo
);

// Delete SEO
router.delete(
    "/:id",
    auth,
    admin,
    seoController.removeSeo
);

module.exports = router;
