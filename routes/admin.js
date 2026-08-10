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
const Category = require("../models/Category");


/*
|--------------------------------------------------------------------------
| ADMIN ROOT
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    (req, res) => {

        if (!req.user) {
            return res.redirect("/auth/admin-login");
        }

        return res.redirect("/admin/dashboard");

    }
);


/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    auth,
    admin(),
    dashboardController.dashboard
);


/*
|--------------------------------------------------------------------------
| ANALYTICS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| WEBSITE SETTINGS
|--------------------------------------------------------------------------
*/

router.get(
    "/settings",
    auth,
    admin(),
    (req, res, next) => {

        try {

            return res.render("admin/settings", {
                title: "Settings - Admin",
                activePage: "settings",
                user: req.user
            });

        } catch (error) {

            console.error(
                "❌ Admin Settings Page Error:",
                error
            );

            return next(error);
        }

    }
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


/*
|--------------------------------------------------------------------------
| BACKUP / RESTORE
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| ADD SHAYARI PAGE
|--------------------------------------------------------------------------
| GET /admin/shayari/new
|--------------------------------------------------------------------------
*/

router.get(
    "/shayari/new",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const categories =
                await Category.find({
                    isActive: true
                })
                .sort({
                    sortOrder: 1,
                    name: 1
                })
                .lean();

            return res.render(
                "admin/shayari-new",
                {
                    title: "Add Shayari - Admin",
                    activePage: "shayari",
                    activeMenu: "shayari",
                    user: req.user,
                    categories,
                    layout: "layouts/admin"
                }
            );

        } catch (error) {

            console.error(
                "❌ Add Shayari Page Error:",
                error
            );

            return next(error);
        }
    }
);
/*
|--------------------------------------------------------------------------
| CATEGORY ADMIN
|--------------------------------------------------------------------------
*/

router.get(
    "/categories",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const categories =
                await Category.find({})
                    .sort({
                        sortOrder: 1,
                        name: 1
                    })
                    .lean();

            return res.render(
                "admin/categories",
                {
                    title: "Categories",
                    activePage: "categories",
                    categories
                }
            );

        } catch (error) {

            next(error);

        }

    }
);


router.get(
    "/categories/new",
    auth,
    admin(),
    (req, res) => {

        return res.render(
            "admin/category-new",
            {
                title: "Add Category",
                activePage: "categories"
            }
        );

    }
);
/*
|--------------------------------------------------------------------------
| CREATE CATEGORY
|--------------------------------------------------------------------------
*/

router.post(
    "/categories",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            let {
                name,
                slug,
                description,
                sortOrder,
                isActive
            } = req.body;

            name = (name || "").trim();
            slug = (slug || "").trim().toLowerCase();

            /*
            |--------------------------------------------------------------------------
            | Validation
            |--------------------------------------------------------------------------
            */

            if (!name) {

                req.flash(
                    "error_msg",
                    "Category name is required."
                );

                return res.redirect(
                    "/admin/categories/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Generate slug if empty
            |--------------------------------------------------------------------------
            */

            if (!slug) {

                slug = name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");

            }

            /*
            |--------------------------------------------------------------------------
            | Check duplicate name
            |--------------------------------------------------------------------------
            */

            const nameExists =
                await Category.findOne({
                    name: name
                });

            if (nameExists) {

                req.flash(
                    "error_msg",
                    "This category already exists."
                );

                return res.redirect(
                    "/admin/categories/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Check duplicate slug
            |--------------------------------------------------------------------------
            */

            const slugExists =
                await Category.findOne({
                    slug: slug
                });

            if (slugExists) {

                req.flash(
                    "error_msg",
                    "This category slug already exists."
                );

                return res.redirect(
                    "/admin/categories/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Create Category
            |--------------------------------------------------------------------------
            */

            await Category.create({

                name: name,

                slug: slug,

                description:
                    (description || "").trim(),

                sortOrder:
                    Number(sortOrder) || 0,

                isActive:
                    isActive === "true",

                totalShayari: 0

            });

            /*
            |--------------------------------------------------------------------------
            | Success
            |--------------------------------------------------------------------------
            */

            req.flash(
                "success_msg",
                "Category created successfully."
            );

            return res.redirect(
                "/admin/categories"
            );

        } catch (error) {

            console.error(
                "❌ Create Category Error:",
                error
            );

            return next(error);

        }

    }
);
module.exports = router;
