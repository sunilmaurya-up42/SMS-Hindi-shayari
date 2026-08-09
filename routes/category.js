const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Shayari = require("../models/Shayari");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const categoryController = require("../controllers/category/categoryController");

const wantsJson = (req) => req.xhr || req.query.format === "json" || req.get("Accept")?.includes("application/json");

router.get("/", async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
        if (wantsJson(req)) return res.json({ success: true, categories });
        return res.render("pages/categories", { title: "Shayari Categories", activePage: "categories", categories });
    } catch (e) { next(e); }
});

router.get("/analytics/report", auth, admin, categoryController.analytics);

router.get("/:slug/shayari", async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
        if (!category) return res.status(404).render("errors/404", { title: "Category Not Found", popularCategories: [], categories: [], latestShayari: [], popularShayari: [] });
        const shayari = await Shayari.find({ category: category._id, published: true }).sort({ createdAt: -1 }).lean();
        if (wantsJson(req)) return res.json({ success: true, category, shayari });
        return res.render("shayari/category", {
            title: `${category.name} Shayari`,
            activePage: "categories",
            category, shayari,
            sort: "latest",
            pagination: { totalItems: shayari.length, totalPages: 1, currentPage: 1 }
        });
    } catch (e) { next(e); }
});

router.get("/:slug", async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
        if (!category) return res.status(404).render("errors/404", { title: "Category Not Found", popularCategories: [], categories: [], latestShayari: [], popularShayari: [] });
        const shayari = await Shayari.find({ category: category._id, published: true }).sort({ createdAt: -1 }).lean();
        if (wantsJson(req)) return res.json({ success: true, category, shayari });
        return res.render("shayari/category", {
            title: `${category.name} Shayari`,
            activePage: "categories",
            category, shayari,
            sort: req.query.sort || "latest",
            pagination: { totalItems: shayari.length, totalPages: 1, currentPage: 1 }
        });
    } catch (e) { next(e); }
});

// Existing admin API operations
router.post("/create", auth, admin, categoryController.create);
router.put("/update/:id", auth, admin, categoryController.update);
router.delete("/delete/:id", auth, admin, categoryController.remove);
router.patch("/toggle/:id", auth, admin, categoryController.toggle);
router.patch("/featured/:id", auth, admin, categoryController.featured);
router.post("/seo/:id", auth, admin, categoryController.seo);

module.exports = router;
