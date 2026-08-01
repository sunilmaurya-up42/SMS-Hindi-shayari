const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact/contactController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Submit Contact Form
router.post(
    "/",
    contactController.submit
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Get All Contacts
router.get(
    "/",
    auth,
    admin,
    contactController.getAll
);

// Get Single Contact
router.get(
    "/:id",
    auth,
    admin,
    contactController.getOne
);

// Reply Contact
router.post(
    "/reply/:id",
    auth,
    admin,
    contactController.reply
);

// Mark Contact As Read
router.patch(
    "/read/:id",
    auth,
    admin,
    contactController.markAsRead
);

// Delete Contact
router.delete(
    "/:id",
    auth,
    admin,
    contactController.remove
);

// Contact Analytics
router.get(
    "/analytics",
    auth,
    admin,
    contactController.analytics
);

module.exports = router;
