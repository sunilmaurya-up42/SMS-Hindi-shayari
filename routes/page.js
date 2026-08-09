const express = require("express");
const router = express.Router();
const Shayari = require("../models/Shayari");
const Category = require("../models/Category");

async function getCategories() {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
}

router.get("/latest", async (req, res, next) => {
    try {
        const [latestShayari, categories] = await Promise.all([
            Shayari.find({ published: true }).sort({ createdAt: -1 }).limit(30).lean(),
            getCategories()
        ]);
        res.render("pages/latest", { title: "Latest Hindi Shayari", activePage: "latest", latestShayari, categories });
    } catch (error) { next(error); }
});

router.get("/popular", async (req, res, next) => {
    try {
        const [popularShayari, categories] = await Promise.all([
            Shayari.find({ published: true }).sort({ views: -1, createdAt: -1 }).limit(30).lean(),
            getCategories()
        ]);
        res.render("pages/popular", { title: "Popular Hindi Shayari", activePage: "popular", popularShayari, categories });
    } catch (error) { next(error); }
});

router.get("/categories", async (req, res, next) => {
    try {
        const categories = await getCategories();
        res.render("pages/categories", { title: "Shayari Categories", activePage: "categories", categories });
    } catch (error) { next(error); }
});

router.get("/festival", async (req, res, next) => {
    try {
        const [categories, festivalShayari] = await Promise.all([
            getCategories(),
            Shayari.find({
                published: true,
                $or: [
                    { tags: { $regex: "festival", $options: "i" } },
                    { title: { $regex: "festival|त्योहार|होली|दीवाली|दिवाली|रक्षाबंधन|जन्माष्टमी|दशहरा|ईद|क्रिसमस", $options: "i" } }
                ]
            }).sort({ createdAt: -1 }).limit(30).lean()
        ]);
        res.render("pages/festival", {
            title: "Festival Shayari",
            activePage: "festival",
            categories,
            festivalShayari
        });
    } catch (error) { next(error); }
});

router.get("/about", (req, res) => res.render("pages/about", { title: "About Us", activePage: "about" }));
router.get("/contact", (req, res) => res.render("pages/contact", { title: "Contact Us", activePage: "contact" }));
router.get("/privacy-policy", (req, res) => res.render("pages/privacy-policy", { title: "Privacy Policy", activePage: "privacy" }));
router.get("/terms", (req, res) => res.render("pages/terms", { title: "Terms & Conditions", activePage: "terms" }));
router.get("/disclaimer", (req, res) => res.render("pages/disclaimer", { title: "Disclaimer", activePage: "disclaimer" }));

router.post("/newsletter", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.redirect("/contact?newsletter=error");
    req.flash("success_msg", "Newsletter subscription request received.");
    return res.redirect("/contact?newsletter=success");
});

// Friendly root aliases used by the header/footer
router.get("/login", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("auth/login", { title: "Login", activePage: "login", redirect: req.query.redirect || "" });
});
router.get("/register", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("auth/register", { title: "Register", activePage: "register" });
});
router.get("/logout", (req, res, next) => {
    if (!req.logout) return res.redirect("/");
    req.logout(err => {
        if (err) return next(err);
        req.session?.destroy(() => res.redirect("/"));
    });
});

module.exports = router;


const authMiddleware = require("../middleware/auth");
router.get("/profile", authMiddleware, async (req, res, next) => {
    try {
        res.render("auth/profile", { title: "My Profile", activePage: "profile", user: req.user });
    } catch (e) { next(e); }
});

router.get("/downloads", authMiddleware, async (req, res, next) => {
    try {
        res.render("pages/downloads", { title: "My Downloads", activePage: "downloads", downloads: [] });
    } catch (e) { next(e); }
});
