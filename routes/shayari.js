const express = require("express");
const router = express.Router();

const shayariController =
    require("../controllers/shayari/shayariController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

const wantsJson = (req) => {

    return (
        req.xhr ||
        req.query.format === "json" ||
        req.get("Accept")?.includes(
            "application/json"
        )
    );

};

/* =========================
   PUBLIC
========================= */

router.get(
    "/home",
    shayariController.home
);

router.get(
    "/latest",
    shayariController.latest
);

router.get(
    "/trending",
    shayariController.trending
);

router.get(
    "/featured",
    shayariController.featured
);

router.get(
    "/random",
    shayariController.random
);

router.get(
    "/suggestions",
    shayariController.suggestions
);

/* =========================
   SEARCH
========================= */

router.get(
    "/search",
    shayariController.search
);

/* =========================
   CATEGORY
========================= */

router.get(
    "/category/:slug",
    shayariController.categoryWise
);

/* =========================
   LANGUAGE
========================= */

router.get(
    "/language/:language",
    shayariController.languageWise
);

/* =========================
   TAG
========================= */

router.get(
    "/tag/:tag",
    shayariController.tagWise
);

/* =========================
   ARCHIVE
========================= */

router.get(
    "/archive/:year/:month",
    shayariController.archive
);

/* =========================
   POPULAR
========================= */

router.get(
    "/most-viewed",
    shayariController.mostViewed
);

router.get(
    "/most-downloaded",
    shayariController.mostDownloaded
);

router.get(
    "/most-shared",
    shayariController.mostShared
);

router.get(
    "/most-copied",
    shayariController.mostCopied
);

/* =========================
   SEO
========================= */

router.get(
    "/slug/:slug",
    shayariController.validateSlug
);

router.get(
    "/redirect/:slug",
    shayariController.redirect
);

/* =========================
   API V1
========================= */

router.get(
    "/v1/home",
    shayariController.home
);

router.get(
    "/v1/latest",
    shayariController.latest
);

router.get(
    "/v1/trending",
    shayariController.trending
);

router.get(
    "/v1/featured",
    shayariController.featured
);

router.get(
    "/v1/random",
    shayariController.random
);

router.get(
    "/v1/search",
    shayariController.search
);

router.get(
    "/v1/:slug",
    shayariController.getOne
);

/* =========================
   ALL SHAYARI
========================= */

router.get(
    "/",
    shayariController.getAll
);

/* =========================
   SINGLE SHAYARI PAGE
========================= */

router.get(
    "/:slug",
    async (req, res, next) => {

        if (wantsJson(req)) {

            return shayariController.getOne(
                req,
                res,
                next
            );

        }

        return shayariController.showPage(
            req,
            res,
            next
        );

    }
);

/* =========================
   COUNTERS
========================= */

router.post(
    "/copy/:id",
    shayariController.copy
);

router.post(
    "/share/:id",
    shayariController.share
);

router.post(
    "/download/:id",
    shayariController.download
);

/* =========================
   ADMIN CREATE
========================= */

router.post(
    "/create",
    auth,
    admin,
    shayariController.create
);

/* =========================
   ADMIN UPDATE
========================= */

router.put(
    "/update/:id",
    auth,
    admin,
    shayariController.update
);

/* =========================
   DELETE
========================= */

router.delete(
    "/delete/:id",
    auth,
    admin,
    shayariController.remove
);

/* =========================
   AI IMAGE
========================= */

router.post(
    "/generate-image/:id",
    auth,
    admin,
    shayariController.generateImage
);

router.post(
    "/upload-image/:id",
    auth,
    admin,
    shayariController.uploadImage
);

router.get(
    "/download-image/:id",
    shayariController.downloadImage
);

/* =========================
   SEO REFRESH
========================= */

router.post(
    "/refresh-seo/:id",
    auth,
    admin,
    shayariController.refreshSeo
);

/* =========================
   BULK
========================= */

router.post(
    "/bulk-import",
    auth,
    admin,
    upload.single("file"),
    shayariController.bulkImport
);

router.get(
    "/bulk-export",
    auth,
    admin,
    shayariController.bulkExport
);

/* =========================
   RESTORE
========================= */

router.put(
    "/restore/:id",
    auth,
    admin,
    shayariController.restore
);

router.delete(
    "/force-delete/:id",
    auth,
    admin,
    shayariController.forceDelete
);

/* =========================
   FEATURED
========================= */

router.patch(
    "/featured/:id",
    auth,
    admin,
    shayariController.toggleFeatured
);

/* =========================
   TRENDING
========================= */

router.patch(
    "/trending/:id",
    auth,
    admin,
    shayariController.toggleTrending
);

/* =========================
   PUBLISH
========================= */

router.patch(
    "/publish/:id",
    auth,
    admin,
    shayariController.togglePublish
);

module.exports = router;
