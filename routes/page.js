/**
 * ==========================================================
 * SMS Hindi Shayari
 * routes/page.js
 * Public Static Pages
 * ==========================================================
 */

const express = require("express");
const router = express.Router();

/* ==========================================================
   LOGIN
   URL: /login
========================================================== */

router.get("/login", (req, res) => {
    res.render("auth/login", {
        title: "Login - SMS Hindi Shayari",
        activePage: "login"
    });
});

/* ==========================================================
   REGISTER
   URL: /register
========================================================== */

router.get("/register", (req, res) => {
    res.render("auth/register", {
        title: "Register - SMS Hindi Shayari",
        activePage: "register"
    });
});

/* ==========================================================
   ABOUT
   URL: /about
========================================================== */

router.get("/about", (req, res) => {
    res.render("pages/about", {
        title: "About Us - SMS Hindi Shayari",
        activePage: "about"
    });
});

/* ==========================================================
   CONTACT
   URL: /contact
========================================================== */

router.get("/contact", (req, res) => {
    res.render("pages/contact", {
        title: "Contact Us - SMS Hindi Shayari",
        activePage: "contact"
    });
});

/* ==========================================================
   PRIVACY POLICY
   URL: /privacy-policy
========================================================== */

router.get("/privacy-policy", (req, res) => {
    res.render("pages/privacy-policy", {
        title: "Privacy Policy - SMS Hindi Shayari",
        activePage: "privacy-policy"
    });
});

/* ==========================================================
   TERMS & CONDITIONS
   URL: /terms
========================================================== */

router.get("/terms", (req, res) => {
    res.render("pages/terms", {
        title: "Terms & Conditions - SMS Hindi Shayari",
        activePage: "terms"
    });
});

/* ==========================================================
   DISCLAIMER
   URL: /disclaimer
========================================================== */

router.get("/disclaimer", (req, res) => {
    res.render("pages/disclaimer", {
        title: "Disclaimer - SMS Hindi Shayari",
        activePage: "disclaimer"
    });
});

/* ==========================================================
   EXPORT
========================================================== */

module.exports = router;
