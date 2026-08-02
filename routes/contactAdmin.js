const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const contactAdminController = require("../controllers/contact/contactAdminController");

// Contact Dashboard
router.get(
    "/",
    auth,
    admin,
    contactAdminController.index
);

// View Contact
router.get(
    "/:id",
    auth,
    admin,
    contactAdminController.show
);

// Mark Read
router.patch(
    "/:id/read",
    auth,
    admin,
    contactAdminController.markRead
);

// Mark Unread
router.patch(
    "/:id/unread",
    auth,
    admin,
    contactAdminController.markUnread
);

// Delete
router.delete(
    "/:id",
    auth,
    admin,
    contactAdminController.destroy
);

// Bulk Delete
router.post(
    "/bulk-delete",
    auth,
    admin,
    contactAdminController.bulkDelete
);

// Statistics
router.get(
    "/statistics",
    auth,
    admin,
    contactAdminController.statistics
);

// Export CSV
router.get(
    "/export/csv",
    auth,
    admin,
    contactAdminController.exportCsv
);

module.exports = router;
