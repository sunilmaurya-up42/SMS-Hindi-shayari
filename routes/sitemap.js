const express = require("express");

const router = express.Router();

const sitemapController = require("../controllers/sitemap/sitemapController");

/*
|--------------------------------------------------------------------------
| Sitemap
|--------------------------------------------------------------------------
*/

router.get(
    "/sitemap.xml",
    sitemapController.sitemap
);

/*
|--------------------------------------------------------------------------
| Robots.txt
|--------------------------------------------------------------------------
*/

router.get(
    "/robots.txt",
    sitemapController.robots
);

/*
|--------------------------------------------------------------------------
| News Sitemap
|--------------------------------------------------------------------------
*/

router.get(
    "/news-sitemap.xml",
    sitemapController.newsSitemap
);

/*
|--------------------------------------------------------------------------
| Image Sitemap
|--------------------------------------------------------------------------
*/

router.get(
    "/image-sitemap.xml",
    sitemapController.imageSitemap
);

/*
|--------------------------------------------------------------------------
| Ping Search Engines
|--------------------------------------------------------------------------
*/

router.post(
    "/sitemap/ping",
    sitemapController.ping
);

module.exports = router;
