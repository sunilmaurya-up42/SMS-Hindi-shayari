const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const dashboardController =
    require("../controllers/admin/dashboardController");

const analyticsController =
    require("../controllers/analytics/analyticsController");

const settingsController =
    require("../controllers/settings/settingsController");


// ==========================================================
// ADMIN ROOT
// GET /admin
// ==========================================================
router.get("/admin-login", (req, res) => {
    res.render("auth/admin-login", {
        title: "Admin Login",
        error: null,
        success: null,
        csrfToken: req.csrfToken()
    });
});
router.get(
    "/",
    auth,
    admin(),
    (req, res) => {
        return res.redirect("/admin/dashboard");
    }
);


// ==========================================================
// ADMIN DASHBOARD
// GET /admin/dashboard
// ==========================================================

router.get(
    "/dashboard",
    auth,
    admin(),
    dashboardController.dashboard
);


// ==========================================================
// ANALYTICS
// ==========================================================

router.get(
    "/analytics",
    auth,
    admin(),
    analyticsController.dashboard
);

router.get(
    "/analytics/daily",
    auth,
    admin(),
    analyticsController.dailyVisitors
);

router.get(
    "/analytics/monthly",
    auth,
    admin(),
    analyticsController.monthlyVisitors
);

router.get(
    "/analytics/top-shayari",
    auth,
    admin(),
    analyticsController.topShayari
);

router.get(
    "/analytics/top-category",
    auth,
    admin(),
    analyticsController.topCategories
);

router.get(
    "/analytics/downloads",
    auth,
    admin(),
    analyticsController.downloadReport
);

router.get(
    "/analytics/devices",
    auth,
    admin(),
    analyticsController.deviceStatistics
);

router.get(
    "/analytics/browser",
    auth,
    admin(),
    analyticsController.browserStatistics
);

router.get(
    "/analytics/country",
    auth,
    admin(),
    analyticsController.countryStatistics
);

router.get(
    "/analytics/graph",
    auth,
    admin(),
    analyticsController.graph
);


// ==========================================================
// WEBSITE SETTINGS
// ==========================================================

router.get(
    "/settings",
    auth,
    admin(),
    settingsController.index
);

router.post(
    "/settings/general",
    auth,
    admin(),
    settingsController.updateGeneral
);

router.put(
    "/settings/seo",
    auth,
    admin(),
    settingsController.updateSeo
);

router.put(
    "/settings/adsense",
    auth,
    admin(),
    settingsController.updateAdsense
);

router.put(
    "/settings/github",
    auth,
    admin(),
    settingsController.updateGithub
);

router.put(
    "/settings/ai",
    auth,
    admin(),
    settingsController.updateAI
);

router.put(
    "/settings/maintenance",
    auth,
    admin(),
    settingsController.toggleMaintenance
);


// ==========================================================
// BACKUP / RESTORE
// ==========================================================

router.get(
    "/backup",
    auth,
    admin(),
    settingsController.backup
);

router.post(
    "/restore",
    auth,
    admin(),
    settingsController.restore
);


module.exports = router;
