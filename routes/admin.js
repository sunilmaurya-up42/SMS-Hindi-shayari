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
/*
|--------------------------------------------------------------------------
| CATEGORY EDIT
|--------------------------------------------------------------------------
*/

router.get(
    "/categories/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const category =
                await Category.findById(
                    req.params.id
                ).lean();

            if (!category) {

                req.flash(
                    "error_msg",
                    "Category not found."
                );

                return res.redirect(
                    "/admin/categories"
                );

            }

            return res.render(
                "admin/category-edit",
                {
                    title: "Edit Category",
                    activePage: "categories",
                    category
                }
            );

        } catch (error) {

            next(error);

        }

    }
);


/*
|--------------------------------------------------------------------------
| CATEGORY TOGGLE
|--------------------------------------------------------------------------
*/

router.post(
    "/categories/:id/toggle",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const category =
                await Category.findById(
                    req.params.id
                );

            if (!category) {

                req.flash(
                    "error_msg",
                    "Category not found."
                );

                return res.redirect(
                    "/admin/categories"
                );

            }

            category.isActive =
                !category.isActive;

            await category.save();

            req.flash(
                "success_msg",
                "Category status updated."
            );

            return res.redirect(
                "/admin/categories"
            );

        } catch (error) {

            next(error);

        }

    }
);


/*
|--------------------------------------------------------------------------
| CATEGORY DELETE
|--------------------------------------------------------------------------
*/

router.post(
    "/categories/:id/delete",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const Shayari =
                require("../models/Shayari");

            const count =
                await Shayari.countDocuments({
                    category: req.params.id
                });

            if (count > 0) {

                req.flash(
                    "error_msg",
                    `Category contains ${count} Shayari. Delete not allowed.`
                );

                return res.redirect(
                    "/admin/categories"
                );

            }

            const deleted =
                await Category.findByIdAndDelete(
                    req.params.id
                );

            if (!deleted) {

                req.flash(
                    "error_msg",
                    "Category not found."
                );

                return res.redirect(
                    "/admin/categories"
                );

            }

            req.flash(
                "success_msg",
                "Category deleted successfully."
            );

            return res.redirect(
                "/admin/categories"
            );

        } catch (error) {

            next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| UPDATE CATEGORY
|--------------------------------------------------------------------------
*/

router.post(
    "/categories/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Category =
                require("../models/Category");

            const category =
                await Category.findById(
                    req.params.id
                );

            if (!category) {

                req.flash(
                    "error_msg",
                    "Category not found."
                );

                return res.redirect(
                    "/admin/categories"
                );
            }

            const name =
                (req.body.name || "").trim();

            const slug =
                (req.body.slug || "")
                    .trim()
                    .toLowerCase();

            if (!name || !slug) {

                req.flash(
                    "error_msg",
                    "Category name and slug are required."
                );

                return res.redirect(
                    `/admin/categories/${req.params.id}/edit`
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Duplicate Name Check
            |--------------------------------------------------------------------------
            */

            const duplicateName =
                await Category.findOne({
                    name: name,
                    _id: {
                        $ne: req.params.id
                    }
                });

            if (duplicateName) {

                req.flash(
                    "error_msg",
                    "Another category already uses this name."
                );

                return res.redirect(
                    `/admin/categories/${req.params.id}/edit`
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Duplicate Slug Check
            |--------------------------------------------------------------------------
            */

            const duplicateSlug =
                await Category.findOne({
                    slug: slug,
                    _id: {
                        $ne: req.params.id
                    }
                });

            if (duplicateSlug) {

                req.flash(
                    "error_msg",
                    "Another category already uses this slug."
                );

                return res.redirect(
                    `/admin/categories/${req.params.id}/edit`
                );
            }

            category.name = name;

            category.slug = slug;

            category.description =
                (req.body.description || "").trim();

            category.sortOrder =
                Number(req.body.sortOrder) || 0;

            category.isActive =
                req.body.isActive === "true";

            await category.save();

            req.flash(
                "success_msg",
                "Category updated successfully."
            );

            return res.redirect(
                "/admin/categories"
            );

        } catch (error) {

            console.error(
                "❌ Update Category Error:",
                error
            );

            next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

router.get(
    "/users",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const User =
                require("../models/User");

            const users =
                await User.find({})
                    .select("-password")
                    .sort({
                        createdAt: -1
                    })
                    .lean();

            return res.render(
                "admin/users",
                {
                    title: "Users",
                    activePage: "users",
                    users
                }
            );

        } catch (error) {

            console.error(
                "❌ Admin Users Error:",
                error
            );

            next(error);

        }

    }
);
module.exports = router;
