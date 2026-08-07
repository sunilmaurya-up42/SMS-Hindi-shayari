const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
    res.render("pages/about");
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

router.get("/privacy-policy", (req, res) => {
    res.render("pages/privacy-policy");
});

router.get("/terms", (req, res) => {
    res.render("pages/terms");
});

router.get("/disclaimer", (req, res) => {
    res.render("pages/disclaimer");
});

module.exports = router;
