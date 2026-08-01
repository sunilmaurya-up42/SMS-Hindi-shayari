const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics/analyticsController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
|--------------------------------------------------------------------------
| Admin Analytics Routes
|--------------------------------------------------------------------------
*/

// Dashboard Overview
router.get(
    "/dashboard",
    auth,
    admin,
    analyticsController.dashboard
);

// Dashboard Graph
router.get(
    "/graph",
    auth,
    admin,
    analyticsController.graph
);

// Daily Visitors
router.get(
    "/daily",
    auth,
    admin,
    analyticsController.dailyVisitors
);

// Monthly Visitors
router.get(
    "/monthly",
    auth,
    admin,
    analyticsController.monthlyVisitors
);

// Yearly Visitors
router.get(
    "/yearly",
    auth,
    admin,
    analyticsController.yearlyVisitors
);

// Live Visitors
router.get(
    "/live",
    auth,
    admin,
    analyticsController.liveVisitors
);

// Top Shayari
router.get(
    "/top-shayari",
    auth,
    admin,
    analyticsController.topShayari
);

// Top Categories
router.get(
    "/top-category",
    auth,
    admin,
    analyticsController.topCategories
);

// Downloads Report
router.get(
    "/downloads",
    auth,
    admin,
    analyticsController.downloadReport
);

// Shares Report
router.get(
    "/shares",
    auth,
    admin,
    analyticsController.shareReport
);

// Copies Report
router.get(
    "/copies",
    auth,
    admin,
    analyticsController.copyReport
);

// Device Statistics
router.get(
    "/devices",
    auth,
    admin,
    analyticsController.deviceStatistics
);

// Browser Statistics
router.get(
    "/browsers",
    auth,
    admin,
    analyticsController.browserStatistics
);

// Country Statistics
router.get(
    "/countries",
    auth,
    admin,
    analyticsController.countryStatistics
);

// Search Keywords Report
router.get(
    "/keywords",
    auth,
    admin,
    analyticsController.searchKeywords
);

module.exports = router;
