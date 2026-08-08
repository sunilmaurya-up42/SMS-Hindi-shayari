const express = require("express");
const router = express.Router();

const Shayari = require("../models/Shayari");
const Category = require("../models/Category");

/* ==========================================================
   Latest Shayari
========================================================== */

router.get("/latest", async (req, res, next) => {
    try {

        const latestShayari = await Shayari.find({
            published: true
        })
            .sort({
                createdAt: -1
            })
            .limit(30)
            .lean();

        const categories = await Category.find({
            isActive: true
        })
            .sort({
                sortOrder: 1,
                name: 1
            })
            .lean();

        res.render("pages/latest", {
            title: "Latest Hindi Shayari",
            activePage: "latest",
            latestShayari,
            categories
        });

    } catch (error) {
        next(error);
    }
});


/* ==========================================================
   Popular Shayari
========================================================== */

router.get("/popular", async (req, res, next) => {
    try {

        const popularShayari = await Shayari.find({
            published: true
        })
            .sort({
                views: -1,
                createdAt: -1
            })
            .limit(30)
            .lean();

        const categories = await Category.find({
            isActive: true
        })
            .sort({
                sortOrder: 1,
                name: 1
            })
            .lean();

        res.render("pages/popular", {
            title: "Popular Hindi Shayari",
            activePage: "popular",
            popularShayari,
            categories
        });

    } catch (error) {
        next(error);
    }
});


/* ==========================================================
   About
========================================================== */

router.get("/about", (req, res, next) => {
    res.render("pages/about", {
        title: "About Us",
        activePage: "about"
    });
});


/* ==========================================================
   Contact
========================================================== */

router.get("/contact", (req, res, next) => {
    res.render("pages/contact", {
        title: "Contact Us",
        activePage: "contact"
    });
});


/* ==========================================================
   Privacy Policy
========================================================== */

router.get("/privacy-policy", (req, res, next) => {
    res.render("pages/privacy-policy", {
        title: "Privacy Policy",
        activePage: "privacy"
    });
});


/* ==========================================================
   Terms
========================================================== */

router.get("/terms", (req, res, next) => {
    res.render("pages/terms", {
        title: "Terms & Conditions",
        activePage: "terms"
    });
});


/* ==========================================================
   Disclaimer
========================================================== */

router.get("/disclaimer", (req, res, next) => {
    res.render("pages/disclaimer", {
        title: "Disclaimer",
        activePage: "disclaimer"
    });
});


module.exports = router;
