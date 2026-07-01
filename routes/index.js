/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Main Routes
 * -------------------------------------------------------
 */

"use strict";

const express = require("express");
const router = express.Router();

const shayariController = require("../controllers/shayari");
const pageController = require("../controllers/page");

const { optionalAuth } = require("../middleware/auth");

/* ==================================
   Home
================================== */

router.get(
    "/",
    optionalAuth,
    shayariController.home
);

/* ==================================
   Shayari
================================== */

router.get(
    "/shayari",
    optionalAuth,
    shayariController.allShayari
);

router.get(
    "/shayari/:slug",
    optionalAuth,
    shayariController.singleShayari
);

/* ==================================
   Category
================================== */

router.get(
    "/category/:slug",
    optionalAuth,
    shayariController.category
);

/* ==================================
   Search
================================== */

router.get(
    "/search",
    optionalAuth,
    shayariController.search
);

/* ==================================
   Tags
================================== */

router.get(
    "/tag/:tag",
    optionalAuth,
    shayariController.tag
);

/* ==================================
   Language
================================== */

router.get(
    "/language/:language",
    optionalAuth,
    shayariController.language
);

/* ==================================
   Static Pages
================================== */

router.get(
    "/about",
    optionalAuth,
    pageController.about
);

router.get(
    "/contact",
    optionalAuth,
    pageController.contact
);

router.get(
    "/privacy-policy",
    optionalAuth,
    pageController.privacyPolicy
);

router.get(
    "/terms",
    optionalAuth,
    pageController.terms
);

router.get(
    "/disclaimer",
    optionalAuth,
    pageController.disclaimer
);

/* ==================================
   Export
================================== */

module.exports = router;
