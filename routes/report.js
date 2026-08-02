const express = require("express");

const router = express.Router();

const reportController = require("../controllers/report/reportController");
const exportController = require("../controllers/report/exportController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Dashboard
router.get(
    "/",
    auth,
    admin,
    reportController.dashboard
);

// Summary API
router.get(
    "/summary",
    auth,
    admin,
    reportController.summary
);

// User Report
router.get(
    "/users",
    auth,
    admin,
    reportController.userReport
);

// Shayari Report
router.get(
    "/shayari",
    auth,
    admin,
    reportController.shayariReport
);

// Download Report
router.get(
    "/downloads",
    auth,
    admin,
    reportController.downloadReport
);

// Comment Report
router.get(
    "/comments",
    auth,
    admin,
    reportController.commentReport
);

// Export CSV
router.get(
    "/export/users/csv",
    auth,
    admin,
    exportController.exportUsersCsv
);

router.get(
    "/export/shayari/csv",
    auth,
    admin,
    exportController.exportShayariCsv
);

router.get(
    "/export/comments/csv",
    auth,
    admin,
    exportController.exportCommentsCsv
);

// Export Excel
router.get(
    "/export/downloads/excel",
    auth,
    admin,
    exportController.exportDownloadsExcel
);

// Dashboard Summary Export
router.get(
    "/export/dashboard",
    auth,
    admin,
    exportController.exportDashboardSummary
);

module.exports = router;
