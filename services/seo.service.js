/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * SEO Service
 * -------------------------------------------------------
 */

"use strict";

const {
    seoConfig,
    buildMeta,
    generateCanonicalUrl,
    generateOrganizationSchema,
    generateBreadcrumbSchema
} = require("../config/seo");

/* ==================================
   Page SEO
================================== */

const getPageSEO = ({

    title = "",

    description = "",

    keywords = [],

    image = "",

    canonical = "",

    type = "website",

    robots = "index, follow"

} = {}) => {

    return buildMeta({

        title:
            title ||
            seoConfig.title,

        description:
            description ||
            seoConfig.description,

        keywords,

        image,

        canonical,

        type,

        robots

    });

};

/* ==================================
   Home SEO
================================== */

const homeSEO = () => {

    return getPageSEO({

        canonical: "/"

    });

};

/* ==================================
   About SEO
================================== */

const aboutSEO = () => {

    return getPageSEO({

        title:
            "About Us | SMS Hindi Shayari",

        description:
            "Learn more about SMS Hindi Shayari, our mission, vision and why we provide free Hindi Shayari with beautiful background images.",

        canonical:
            "/about"

    });

};

/* ==================================
   Contact SEO
================================== */

const contactSEO = () => {

    return getPageSEO({

        title:
            "Contact Us | SMS Hindi Shayari",

        description:
            "Get in touch with the SMS Hindi Shayari team for support, suggestions, copyright requests or feedback.",

        canonical:
            "/contact"

    });

};

/* ==================================
   Privacy SEO
================================== */

const privacySEO = () => {

    return getPageSEO({

        title:
            "Privacy Policy | SMS Hindi Shayari",

        description:
            "Read the Privacy Policy of SMS Hindi Shayari to understand how we collect, use and protect your personal information.",

        canonical:
            "/privacy"

    });

};

/* ==================================
   Terms SEO
================================== */

const termsSEO = () => {

    return getPageSEO({

        title:
            "Terms & Conditions | SMS Hindi Shayari",

        description:
            "Read the Terms & Conditions for using SMS Hindi Shayari and our services.",

        canonical:
            "/terms"

    });

};

/* ==================================
   Disclaimer SEO
================================== */

const disclaimerSEO = () => {

    return getPageSEO({

        title:
            "Disclaimer | SMS Hindi Shayari",

        description:
            "Read the official Disclaimer for SMS Hindi Shayari regarding website content, copyright and liability.",

        canonical:
            "/disclaimer"

    });

};

/* ==================================
   Search SEO
================================== */

const searchSEO = (query = "") => {

    return getPageSEO({

        title:
            query
                ? `Search "${query}" | SMS Hindi Shayari`
                : "Search Shayari | SMS Hindi Shayari",

        description:
            query
                ? `Search results for "${query}" on SMS Hindi Shayari.`
                : "Search thousands of Hindi Shayari by keyword or category.",

        canonical:
            "/search",

        robots:
            "noindex, follow"

    });

};

/* ==================================
   Category SEO
================================== */

const categorySEO = (category) => {

    return getPageSEO({

        title:
            `${category.name} Shayari | SMS Hindi Shayari`,

        description:
            category.description ||
            `Read the best ${category.name} Shayari in Hindi with HD background images.`,

        keywords: [

            `${category.name} Shayari`,

            `${category.name} Hindi Shayari`,

            "Hindi Shayari"

        ],

        canonical:
            `/category/${category.slug}`

    });

};

/* ==================================
   Shayari SEO
================================== */

const shayariSEO = (shayari) => {

    return getPageSEO({

        title:
            shayari.seoTitle ||
            shayari.title,

        description:
            shayari.seoDescription ||
            shayari.content.substring(0, 160),

        keywords:
            shayari.tags || [],

        canonical:
            `/shayari/${shayari.slug}`,

        image:
            shayari.background?.rawUrl ||
            seoConfig.image,

        type:
            "article"

    });

};

/* ==================================
   Common Schema Generators
================================== */

const organizationSchema = () => {

    return generateOrganizationSchema();

};

const breadcrumbSchema = (items = []) => {

    return generateBreadcrumbSchema(items);

};

const canonicalUrl = (path = "/") => {

    return generateCanonicalUrl(path);

};

/* ==================================
   Export
================================== */

module.exports = {

    getPageSEO,

    homeSEO,

    aboutSEO,

    contactSEO,

    privacySEO,

    termsSEO,

    disclaimerSEO,

    searchSEO,

    categorySEO,

    shayariSEO,

    organizationSchema,

    breadcrumbSchema,

    canonicalUrl

};
