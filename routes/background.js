const express = require("express");
const router = express.Router();

const backgroundController =
    require("../controllers/background/backgroundController");

const auth =
    require("../middleware/auth");

const admin =
    require("../middleware/admin");

const upload =
    require("../middleware/upload");


/*
|--------------------------------------------------------------------------
| PUBLIC BACKGROUND ROUTES
|--------------------------------------------------------------------------
*/

/*
 * GET /background
 * सभी backgrounds
 */
router.get(
    "/",
    backgroundController.getAll
);


/*
 * GET /background/random
 * Active background में से random
 */
router.get(
    "/random",
    backgroundController.random
);


/*
 * GET /background/preview/:id
 */
router.get(
    "/preview/:id",
    backgroundController.preview
);


/*
 * GET /background/categories
 */
router.get(
    "/categories",
    backgroundController.categories
);


/*
|--------------------------------------------------------------------------
| ADMIN BACKGROUND ROUTES
|--------------------------------------------------------------------------
*/


/*
 * POST /background/upload
 *
 * Admin:
 * Local image
 *       ↓
 * GitHub backgrounds/
 *       ↓
 * MongoDB
 */
router.post(
    "/upload",
    auth,
    admin(),
    upload.single("background"),
    backgroundController.upload
);


/*
 * PUT /background/update/:id
 */
router.put(
    "/update/:id",
    auth,
    admin(),
    backgroundController.update
);


/*
 * PATCH /background/toggle/:id
 */
router.patch(
    "/toggle/:id",
    auth,
    admin(),
    backgroundController.toggle
);


/*
 * DELETE /background/delete/:id
 *
 * GitHub से image delete
 * फिर MongoDB से record delete
 */
router.delete(
    "/delete/:id",
    auth,
    admin(),
    backgroundController.remove
);


/*
 * GET /background/analytics
 */
router.get(
    "/analytics",
    auth,
    admin(),
    backgroundController.analytics
);


/*
|--------------------------------------------------------------------------
| GITHUB UPLOAD
|--------------------------------------------------------------------------
|
| पुराने duplicate endpoint को भी रखा गया है ताकि
| अगर project की किसी दूसरी जगह से /github-upload call हो
| तो वह टूटे नहीं।
|
*/

router.post(
    "/github-upload",
    auth,
    admin(),
    upload.single("background"),
    backgroundController.githubUpload
);


module.exports = router;
