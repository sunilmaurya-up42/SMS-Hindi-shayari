const express = require("express");
const router = express.Router();

const settingController = require("../controllers/setting/settingController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
*/

// Get Website Settings
router.get(
    "/",
    auth,
    admin,
    settingController.getSettings
);

// Update Website Settings
router.put(
    "/",
    auth,
    admin,
    settingController.updateSettings
);

// Maintenance Mode
router.patch(
    "/maintenance",
    auth,
    admin,
    settingController.toggleMaintenance
);

/*
|--------------------------------------------------------------------------
| SEO Settings
|--------------------------------------------------------------------------
*/

router.put(
    "/seo",
    auth,
    admin,
    settingController.updateSeo
);

/*
|--------------------------------------------------------------------------
| Google AdSense
|--------------------------------------------------------------------------
*/

router.put(
    "/adsense",
    auth,
    admin,
    settingController.updateAdsense
);

/*
|--------------------------------------------------------------------------
| GitHub Settings
|--------------------------------------------------------------------------
*/

router.put(
    "/github",
    auth,
    admin,
    settingController.updateGithub
);

/*
|--------------------------------------------------------------------------
| AI Image Settings
|--------------------------------------------------------------------------
*/

router.put(
    "/ai",
    auth,
    admin,
    settingController.updateAI
);

/*
|--------------------------------------------------------------------------
| Logo & Favicon
|--------------------------------------------------------------------------
*/

router.post(
    "/logo",
    auth,
    admin,
    upload.single("logo"),
    settingController.uploadLogo
);

router.post(
    "/favicon",
    auth,
    admin,
    upload.single("favicon"),
    settingController.uploadFavicon
);

/*
|--------------------------------------------------------------------------
| Backup & Restore
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
