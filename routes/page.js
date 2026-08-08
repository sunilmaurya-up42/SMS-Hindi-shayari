const express = require("express");
const router = express.Router();

/*
|--------------------------------------------------------------------------
| About
|--------------------------------------------------------------------------
*/

router.get("/about", (req, res) => {

    res.render("pages/about", {
        title: "About Us",
        activePage: "about"
    });

});


/*
|--------------------------------------------------------------------------
| Contact
|--------------------------------------------------------------------------
*/

router.get("/contact", (req, res) => {

    res.render("pages/contact", {
        title: "Contact Us",
        activePage: "contact"
    });

});


/*
|--------------------------------------------------------------------------
| Privacy Policy
|--------------------------------------------------------------------------
*/

router.get("/privacy-policy", (req, res) => {

    res.render("pages/privacy-policy", {
        title: "Privacy Policy"
    });

});


/*
|--------------------------------------------------------------------------
| Terms & Conditions
|--------------------------------------------------------------------------
*/

router.get("/terms", (req, res) => {

    res.render("pages/terms", {
        title: "Terms & Conditions"
    });

});


/*
|--------------------------------------------------------------------------
| Disclaimer
|--------------------------------------------------------------------------
*/

router.get("/disclaimer", (req, res) => {

    res.render("pages/disclaimer", {
        title: "Disclaimer"
    });

});


/*
|--------------------------------------------------------------------------
| Festival
|--------------------------------------------------------------------------
*/

router.get("/festival", (req, res) => {

    res.render("pages/festival", {
        title: "Festival Shayari",
        activePage: "festival"
    });

});


/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

router.get("/categories", (req, res) => {

    res.redirect("/category");

});

// Login Page
router.get("/login", (req, res) => {
    res.render("auth/login", {
        title: "Login - SMS Hindi Shayari"
    });
});

// Register Page
router.get("/register", (req, res) => {
    res.render("auth/register", {
        title: "Register - SMS Hindi Shayari"
    });
});
module.exports = router;
