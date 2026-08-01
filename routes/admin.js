const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const dashboardController = require("../controllers/admin/dashboardController");
const analyticsController = require("../controllers/analytics/analyticsController");
const settingController = require("../controllers/setting/settingController");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    auth,
    admin,
    dashboardController.dashboard
);

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

router.get(
    "/analytics",
    auth,
    admin,
    analyticsController.dashboard
);

router.get(
    "/analytics/daily",
    auth,
    admin,
    analyticsController.dailyVisitors
);

router.get(
    "/analytics/monthly",
    auth,
    admin,
    analyticsController.monthlyVisitors
);

router.get(
    "/analytics/top-shayari",
    auth,
    admin,
    analyticsController.topShayari
);

router.get(
    "/analytics/top-category",
    auth,
    admin,
    analyticsController.topCategories
);

router.get(
    "/analytics/downloads",
    auth,
    admin,
    analyticsController.downloadReport
);

router.get(
    "/analytics/devices",
    auth,
    admin,
    analyticsController.deviceStatistics
);

router.get(
    "/analytics/browser",
    auth,
    admin,
    analyticsController.browserStatistics
);

router.get(
    "/analytics/country",
    auth,
    admin,
    analyticsController.countryStatistics
);

router.get(
    "/analytics/graph",
    auth,
    admin,
    analyticsController.graph
);

/*
|--------------------------------------------------------------------------
| Website Settings
|--------------------------------------------------------------------------
*/

router.get(
    "/settings",
    auth,
    admin,
    settingController.getSettings
);

router.put(
    "/settings",
    auth,
    admin,
    settingController.updateSettings
);

router.put(
    "/settings/seo",
    auth,
    admin,
    settingController.updateSeo
);

router.put(
    "/settings/adsense",
    auth,
    admin,
    settingController.updateAdsense
);

router.put(
    "/settings/github",
    auth,
    admin,
    settingController.updateGithub
);

router.put(
    "/settings/ai",
    auth,
    admin,
    settingController.updateAI
);

router.put(
    "/settings/maintenance",
    auth,
    admin,
    settingController.toggleMaintenance
);

/*
|--------------------------------------------------------------------------
| Backup / Restore
|--------------------------------------------------------------------------
*/

router.get(
    "/backup",
    auth,
    admin,
    settingController.backup
);

router.post(
    "/restore",
    auth,
    admin,
    settingController.restore
);

module.exports = router;
