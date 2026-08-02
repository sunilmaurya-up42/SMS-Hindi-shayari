const express = require("express");

const router = express.Router();

const rssController = require("../controllers/rss/rssController");

/*
|--------------------------------------------------------------------------
| Main RSS Feed
|--------------------------------------------------------------------------
*/

router.get(
    "/rss.xml",
    rssController.feed
);

/*
|--------------------------------------------------------------------------
| Latest Feed API
|--------------------------------------------------------------------------
*/

router.get(
    "/rss/latest",
    rssController.latest
);

/*
|--------------------------------------------------------------------------
| Category RSS Feed
|--------------------------------------------------------------------------
*/

router.get(
    "/rss/category/:slug",
    rssController.categoryFeed
);

/*
|--------------------------------------------------------------------------
| RSS Status
|--------------------------------------------------------------------------
*/

router.get(
    "/rss/status",
    rssController.status
);

module.exports = router;
