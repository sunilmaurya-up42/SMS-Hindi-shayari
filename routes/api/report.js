const express = require("express");

const router = express.Router();

const reportController = require("../../controllers/report/reportController");
const exportController = require("../../controllers/report/exportController");

const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

/**
 * Report Dashboard
 */
router.get(
    "/dashboard",
    auth,
    admin,
    reportController.dashboard
);

/**
 * Summary
 */
router.get(
    "/summary",
    auth,
    admin,
    reportController.summary
);

/**
 * Reports
 */
router.get(
    "/users",
    auth,
    admin,
    reportController.userReport
);

router.get(
    "/shayari",
    auth,
    admin,
    reportController.shayariReport
);

router.get(
    "/downloads",
    auth,
    admin,
    reportController.downloadReport
);

router.get(
    "/comments",
    auth,
    admin,
    reportController.commentReport
);

/**
 * CSV Export
 */
router.get(
    "/export/users",
    auth,
    admin,
    exportController.exportUsersCsv
);

router.get(
    "/export/shayari",
    auth,
    admin,
    exportController.exportShayariCsv
);

router.get(
    "/export/comments",
    auth,
    admin,
    exportController.exportCommentsCsv
);

/**
 * Excel Export
 */
router.get(
    "/export/downloads",
    auth,
    admin,
    exportController.exportDownloadsExcel
);

/**
 * Dashboard Export
 */
router.get(
    "/export/dashboard",
    auth,
    admin,
    exportController.exportDashboardSummary
);

module.exports = router;
