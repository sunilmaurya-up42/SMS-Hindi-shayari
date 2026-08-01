const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category/categoryController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get All Categories
router.get(
    "/",
    categoryController.getAll
);

// Get Category By ID
router.get(
    "/:id",
    categoryController.getOne
);

// Category Wise Shayari
router.get(
    "/:id/shayari",
    categoryController.shayari
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Create Category
router.post(
    "/create",
    auth,
    admin,
    categoryController.create
);

// Update Category
router.put(
    "/update/:id",
    auth,
    admin,
    categoryController.update
);

// Delete Category
router.delete(
    "/delete/:id",
    auth,
    admin,
    categoryController.remove
);

// Toggle Active Status
router.patch(
    "/toggle/:id",
    auth,
    admin,
    categoryController.toggle
);

// Toggle Featured
router.patch(
    "/featured/:id",
    auth,
    admin,
    categoryController.featured
);

// Category Analytics
router.get(
    "/analytics/report",
    auth,
    admin,
    categoryController.analytics
);

// Category SEO
router.post(
    "/seo/:id",
    auth,
    admin,
    categoryController.seo
);

module.exports = router;
