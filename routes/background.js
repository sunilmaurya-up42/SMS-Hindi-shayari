const express = require("express");
const router = express.Router();

const backgroundController = require("../controllers/background/backgroundController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get All Backgrounds
router.get(
    "/",
    backgroundController.getAll
);

// Get Random Background
router.get(
    "/random",
    backgroundController.random
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Upload Background
router.post(
    "/upload",
    auth,
    admin,
    upload.single("background"),
    backgroundController.upload
);

// Update Background
router.put(
    "/update/:id",
    auth,
    admin,
    backgroundController.update
);

// Enable / Disable Background
router.patch(
    "/toggle/:id",
    auth,
    admin,
    backgroundController.toggle
);

// Delete Background
router.delete(
    "/delete/:id",
    auth,
    admin,
    backgroundController.remove
);

// Background Analytics
router.get(
    "/analytics",
    auth,
    admin,
    backgroundController.analytics
);

// Preview Background
router.get(
    "/preview/:id",
    backgroundController.preview
);

// Background Categories
router.get(
    "/categories",
    backgroundController.categories
);

// GitHub Upload API
router.post(
    "/github-upload",
    auth,
    admin,
    upload.single("background"),
    backgroundController.githubUpload
);

module.exports = router;
