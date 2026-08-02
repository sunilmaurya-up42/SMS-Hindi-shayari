const express = require("express");

const router = express.Router();

const settingsController = require("../controllers/settings/settingsController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| Website Settings
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    auth,
    admin,
    settingsController.index
);

/*
|--------------------------------------------------------------------------
| General Settings
|--------------------------------------------------------------------------
*/

router.post(
    "/general",
    auth,
    admin,
    settingsController.updateGeneral
);

/*
|--------------------------------------------------------------------------
| SEO Settings
|--------------------------------------------------------------------------
*/

router.post(
    "/seo",
    auth,
    admin,
    settingsController.updateSeo
);

/*
|--------------------------------------------------------------------------
| Social Settings
|--------------------------------------------------------------------------
*/

router.post(
    "/social",
    auth,
    admin,
    settingsController.updateSocial
);

/*
|--------------------------------------------------------------------------
| Logo Upload
|--------------------------------------------------------------------------
*/

router.post(
    "/logo",
    auth,
    admin,
    upload.single("logo"),
    settingsController.uploadLogo
);

/*
|--------------------------------------------------------------------------
| Favicon Upload
|--------------------------------------------------------------------------
*/

router.post(
    "/favicon",
    auth,
    admin,
    upload.single("favicon"),
    settingsController.uploadFavicon
);

/*
|--------------------------------------------------------------------------
| Cache Clear
|--------------------------------------------------------------------------
*/

router.post(
    "/cache/clear",
    auth,
    admin,
    settingsController.clearCache
);

module.exports = router;
