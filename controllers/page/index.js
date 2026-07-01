/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Page Controller
 * -------------------------------------------------------
 */

"use strict";

/* ==================================
   About Page
================================== */

exports.about = async (req, res, next) => {

    try {

        return res.render("pages/about", {
            title: "About Us",
            user: req.user || null
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Contact Page
================================== */

exports.contact = async (req, res, next) => {

    try {

        return res.render("pages/contact", {
            title: "Contact Us",
            user: req.user || null
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Privacy Policy
================================== */

exports.privacyPolicy = async (req, res, next) => {

    try {

        return res.render("pages/privacy", {
            title: "Privacy Policy",
            user: req.user || null
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Terms & Conditions
================================== */

exports.terms = async (req, res, next) => {

    try {

        return res.render("pages/terms", {
            title: "Terms & Conditions",
            user: req.user || null
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Disclaimer
================================== */

exports.disclaimer = async (req, res, next) => {

    try {

        return res.render("pages/disclaimer", {
            title: "Disclaimer",
            user: req.user || null
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Export
================================== */

module.exports = exports;
