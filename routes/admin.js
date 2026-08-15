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
router.get("/admin-login", (req, res) => {
    res.render("auth/admin-login", {
        title: "Admin Login",
        error: null,
        success: null,
        csrfToken: req.csrfToken()
    });
});


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
    ["/shayari", "/shayari/new"],
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
| CREATE SHAYARI
|--------------------------------------------------------------------------
| POST /admin/shayari
|--------------------------------------------------------------------------
*/

router.post(
    "/shayari",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Shayari =
                require("../models/Shayari");

            const Category =
                require("../models/Category");

            const slugify =
                require("slugify");

            const title =
                (req.body.title || "").trim();

            const content =
                (req.body.content || "").trim();

            const categoryId =
                (req.body.category || "").trim();

            /*
            |--------------------------------------------------------------------------
            | Validation
            |--------------------------------------------------------------------------
            */

            if (!title) {

                req.flash(
                    "error_msg",
                    "Shayari title is required."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            if (!content) {

                req.flash(
                    "error_msg",
                    "Shayari content is required."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            if (!categoryId) {

                req.flash(
                    "error_msg",
                    "Please select a category."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Check Category
            |--------------------------------------------------------------------------
            */

            const category =
                await Category.findById(categoryId);

            if (!category) {

                req.flash(
                    "error_msg",
                    "Selected category not found."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Generate Slug
            |--------------------------------------------------------------------------
            */

            let baseSlug =
                slugify(title, {
                    lower: true,
                    strict: true,
                    trim: true
                });

            /*
            |--------------------------------------------------------------------------
            | Fallback Slug
            |--------------------------------------------------------------------------
            */

            if (!baseSlug) {

                baseSlug =
                    `shayari-${Date.now()}`;

            }

            let slug = baseSlug;
            let counter = 1;

            /*
            |--------------------------------------------------------------------------
            | Make Slug Unique
            |--------------------------------------------------------------------------
            */

            while (
                await Shayari.exists({
                    slug: slug
                })
            ) {

                slug =
                    `${baseSlug}-${counter}`;

                counter++;

            }

            /*
            |--------------------------------------------------------------------------
            | Create Shayari
            |--------------------------------------------------------------------------
            */

            await Shayari.create({

                title: title,

                slug: slug,

                content: content,

                category: category._id,

                language: "hi",

                published:
                    req.body.published !== "false",

                featured:
                    req.body.featured === "true",

                trending:
                    req.body.trending === "true",

                tags: []

            });

            /*
            |--------------------------------------------------------------------------
            | Update Category Count
            |--------------------------------------------------------------------------
            */

            await Category.findByIdAndUpdate(
                category._id,
                {
                    $inc: {
                        totalShayari: 1
                    }
                }
            );

            /*
            |--------------------------------------------------------------------------
            | Success
            |--------------------------------------------------------------------------
            */

            req.flash(
                "success_msg",
                "Shayari created successfully."
            );

            return res.redirect(
                "/admin/shayari/new"
            );

        } catch (error) {

            console.error(
                "❌ Create Shayari Error:",
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
| USERS LIST
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


/*
|--------------------------------------------------------------------------
| EDIT USER PAGE
|--------------------------------------------------------------------------
*/

router.get(
    "/users/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const User =
                require("../models/User");

            const user =
                await User.findById(
                    req.params.id
                )
                .select("-password")
                .lean();

            if (!user) {

                req.flash(
                    "error_msg",
                    "User not found."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            return res.render(
                "admin/user-edit",
                {
                    title: "Edit User",
                    activePage: "users",
                    user
                }
            );

        } catch (error) {

            console.error(
                "❌ Edit User Page Error:",
                error
            );

            next(error);

        }

    }
);


/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

router.post(
    "/users/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const User =
                require("../models/User");

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {

                req.flash(
                    "error_msg",
                    "User not found."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            const name =
                (req.body.name || "").trim();

            const email =
                (req.body.email || "")
                    .trim()
                    .toLowerCase();

            const role =
                req.body.role === "admin"
                    ? "admin"
                    : "user";

            if (!name || !email) {

                req.flash(
                    "error_msg",
                    "Name and email are required."
                );

                return res.redirect(
                    `/admin/users/${req.params.id}/edit`
                );

            }

            const duplicate =
                await User.findOne({
                    email: email,
                    _id: {
                        $ne: req.params.id
                    }
                });

            if (duplicate) {

                req.flash(
                    "error_msg",
                    "Another user already uses this email."
                );

                return res.redirect(
                    `/admin/users/${req.params.id}/edit`
                );

            }

            user.name = name;
            user.email = email;
            user.role = role;

            await user.save();

            req.flash(
                "success_msg",
                "User updated successfully."
            );

            return res.redirect(
                "/admin/users"
            );

        } catch (error) {

            console.error(
                "❌ Update User Error:",
                error
            );

            next(error);

        }

    }
);


/*
|--------------------------------------------------------------------------
| ACTIVE / INACTIVE
|--------------------------------------------------------------------------
*/

router.post(
    "/users/:id/toggle",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const User =
                require("../models/User");

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {

                req.flash(
                    "error_msg",
                    "User not found."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Prevent Self Deactivation
            |--------------------------------------------------------------------------
            */

            if (
                req.user &&
                req.user._id &&
                req.user._id.toString() ===
                user._id.toString()
            ) {

                req.flash(
                    "error_msg",
                    "You cannot deactivate your own account."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            user.isActive =
                !user.isActive;

            await user.save();

            req.flash(
                "success_msg",
                user.isActive
                    ? "User activated successfully."
                    : "User deactivated successfully."
            );

            return res.redirect(
                "/admin/users"
            );

        } catch (error) {

            console.error(
                "❌ Toggle User Error:",
                error
            );

            next(error);

        }

    }
);


/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

router.post(
    "/users/:id/delete",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const User =
                require("../models/User");

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {

                req.flash(
                    "error_msg",
                    "User not found."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Prevent Self Delete
            |--------------------------------------------------------------------------
            */

            if (
                req.user &&
                req.user._id &&
                req.user._id.toString() ===
                user._id.toString()
            ) {

                req.flash(
                    "error_msg",
                    "You cannot delete your own account."
                );

                return res.redirect(
                    "/admin/users"
                );

            }

            await User.findByIdAndDelete(
                req.params.id
            );

            req.flash(
                "success_msg",
                "User deleted successfully."
            );

            return res.redirect(
                "/admin/users"
            );

        } catch (error) {

            console.error(
                "❌ Delete User Error:",
                error
            );

            next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| CREATE SHAYARI
|--------------------------------------------------------------------------
| POST /admin/shayari
|--------------------------------------------------------------------------
*/

router.post(
    "/shayari",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Shayari =
                require("../models/Shayari");

            const Category =
                require("../models/Category");

            const title =
                (req.body.title || "").trim();

            const content =
                (req.body.content || "").trim();

            const categoryId =
                (req.body.category || "").trim();

            /*
            |--------------------------------------------------------------------------
            | Validation
            |--------------------------------------------------------------------------
            */

            if (!title) {

                req.flash(
                    "error_msg",
                    "Shayari title is required."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            if (!content) {

                req.flash(
                    "error_msg",
                    "Shayari content is required."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            if (!categoryId) {

                req.flash(
                    "error_msg",
                    "Please select a category."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Check Category
            |--------------------------------------------------------------------------
            */

            const category =
                await Category.findById(categoryId);

            if (!category) {

                req.flash(
                    "error_msg",
                    "Selected category not found."
                );

                return res.redirect(
                    "/admin/shayari/new"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Create Shayari
            |--------------------------------------------------------------------------
            */

            await Shayari.create({

                title: title,

                content: content,

                category: category._id,

                language: "hi",

                published: true,

                featured: false,

                trending: false,

                tags: []

            });

            /*
            |--------------------------------------------------------------------------
            | Update Category Count
            |--------------------------------------------------------------------------
            */

            await Category.findByIdAndUpdate(
                category._id,
                {
                    $inc: {
                        totalShayari: 1
                    }
                }
            );

            req.flash(
                "success_msg",
                "Shayari created successfully."
            );

            /*
            |--------------------------------------------------------------------------
            | Redirect
            |--------------------------------------------------------------------------
            */

            return res.redirect(
                "/admin/shayari/new"
            );

        } catch (error) {

            console.error(
                "❌ Create Shayari Error:",
                error
            );

            return next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| EDIT SHAYARI PAGE
|--------------------------------------------------------------------------
*/

router.get(
    "/shayari/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Shayari =
                require("../models/Shayari");

            const Category =
                require("../models/Category");

            const shayari =
                await Shayari.findById(
                    req.params.id
                ).lean();

            if (!shayari) {

                req.flash(
                    "error_msg",
                    "Shayari not found."
                );

                return res.redirect(
                    "/admin/shayari"
                );

            }

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
                "admin/shayari-edit",
                {
                    title: "Edit Shayari - Admin",
                    activePage: "shayari",
                    activeMenu: "shayari",
                    shayari,
                    categories,
                    layout: "layouts/admin"
                }
            );

        } catch (error) {

            console.error(
                "❌ Edit Shayari Page Error:",
                error
            );

            return next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| UPDATE SHAYARI
|--------------------------------------------------------------------------
| POST /admin/shayari/:id/edit
|--------------------------------------------------------------------------
*/

router.post(
    "/shayari/:id/edit",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Shayari =
                require("../models/Shayari");

            const Category =
                require("../models/Category");

            const shayari =
                await Shayari.findById(
                    req.params.id
                );

            if (!shayari) {

                req.flash(
                    "error_msg",
                    "Shayari not found."
                );

                return res.redirect(
                    "/admin/dashboard"
                );
            }

            const title =
                (req.body.title || "").trim();

            const content =
                (req.body.content || "").trim();

            const categoryId =
                (req.body.category || "").trim();

            if (!title) {

                req.flash(
                    "error_msg",
                    "Shayari title is required."
                );

                return res.redirect(
                    `/admin/shayari/${req.params.id}/edit`
                );
            }

            if (!content) {

                req.flash(
                    "error_msg",
                    "Shayari content is required."
                );

                return res.redirect(
                    `/admin/shayari/${req.params.id}/edit`
                );
            }

            if (!categoryId) {

                req.flash(
                    "error_msg",
                    "Please select a category."
                );

                return res.redirect(
                    `/admin/shayari/${req.params.id}/edit`
                );
            }

            const category =
                await Category.findById(categoryId);

            if (!category) {

                req.flash(
                    "error_msg",
                    "Selected category not found."
                );

                return res.redirect(
                    `/admin/shayari/${req.params.id}/edit`
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Update Category Count
            |--------------------------------------------------------------------------
            */

            const oldCategoryId =
                String(shayari.category);

            const newCategoryId =
                String(category._id);

            if (
                oldCategoryId !== newCategoryId
            ) {

                await Category.findByIdAndUpdate(
                    shayari.category,
                    {
                        $inc: {
                            totalShayari: -1
                        }
                    }
                );

                await Category.findByIdAndUpdate(
                    category._id,
                    {
                        $inc: {
                            totalShayari: 1
                        }
                    }
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Update Shayari
            |--------------------------------------------------------------------------
            */

            shayari.title =
                title;

            shayari.content =
                content;

            shayari.category =
                category._id;

            shayari.published =
                req.body.published === "true";

            shayari.featured =
                req.body.featured === "true";

            shayari.trending =
                req.body.trending === "true";

            await shayari.save();

            req.flash(
                "success_msg",
                "Shayari updated successfully."
            );

            return res.redirect(
                "/admin/dashboard"
            );

        } catch (error) {

            console.error(
                "❌ Update Shayari Error:",
                error
            );

            return next(error);

        }

    }
);
/*
|--------------------------------------------------------------------------
| COMMENTS MANAGEMENT
|--------------------------------------------------------------------------
| GET /admin/comments
|--------------------------------------------------------------------------
*/

router.get(
    "/comments",
    auth,
    admin(),
    async (req, res, next) => {

        try {

            const Comment =
                require("../models/Comment");

            const page =
                Math.max(
                    parseInt(req.query.page) || 1,
                    1
                );

            const limit = 20;

            const skip =
                (page - 1) * limit;

            const query =
                (req.query.q || "").trim();

            const status =
                (req.query.status || "").trim();

            const filter = {
                isDeleted: false
            };

            if (status === "approved") {
                filter.isApproved = true;
            }

            if (status === "pending") {
                filter.isApproved = false;
            }

            if (query) {

                filter.$or = [
                    {
                        name: {
                            $regex: query,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: query,
                            $options: "i"
                        }
                    },
                    {
                        message: {
                            $regex: query,
                            $options: "i"
                        }
                    }
                ];

            }

            const total =
                await Comment.countDocuments(filter);

            const comments =
                await Comment.find(filter)
                    .populate(
                        "shayari",
                        "title slug"
                    )
                    .sort({
                        createdAt: -1
                    })
                    .skip(skip)
                    .limit(limit)
                    .lean();

            const totalPages =
                Math.ceil(total / limit);

            return res.render(
                "admin/comments",
                {
                    title: "Comments - Admin",
                    activePage: "comments",
                    activeMenu: "comments",
                    user: req.user,
                    comments,
                    query,
                    status,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages
                    },
                    csrfToken: req.csrfToken(),
                    layout: "layouts/admin"
                }
            );

        } catch (error) {

            console.error(
                "❌ Admin Comments Error:",
                error
            );

            return next(error);
        }
    }
);
module.exports = router;
