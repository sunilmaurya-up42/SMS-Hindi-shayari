/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * SEO Configuration
 * -------------------------------------------------------
 */

"use strict";

const SITE_URL =
    process.env.SITE_URL ||
    "https://sms-hindi-shayari.onrender.com";

const seoConfig = {

    siteName: "SMS Hindi Shayari",

    siteUrl: SITE_URL,

    title:
        "SMS Hindi Shayari - Best Love, Sad, Attitude & Romantic Shayari",

    description:
        "Read, copy, share and download thousands of beautiful Hindi Shayari with HD background images. Love, Sad, Attitude, Friendship, Romantic, Motivational and Festival Shayari.",

    keywords: [

        "Hindi Shayari",

        "SMS Shayari",

        "Love Shayari",

        "Sad Shayari",

        "Attitude Shayari",

        "Romantic Shayari",

        "Friendship Shayari",

        "Motivational Shayari",

        "Hindi Status",

        "Hindi Quotes",

        "Shayari Images",

        "Hindi SMS"

    ],

    language: "en",

    locale: "en_IN",

    charset: "UTF-8",

    robots: "index, follow",

    author: "SMS Hindi Shayari",

    publisher: "SMS Hindi Shayari",

    themeColor: "#dc3545",

    favicon: "/favicon/favicon.ico",

    logo: "/logos/logo.png",

    image: "/banners/default-banner.jpg",

    twitter: {

        card: "summary_large_image",

        site: "@SMSHindiShayari",

        creator: "@SMSHindiShayari"

    },

    openGraph: {

        type: "website",

        locale: "en_IN"

    }

};

/* ==================================
   Default Meta Generator
================================== */

const defaultMeta = () => ({

    title: seoConfig.title,

    description: seoConfig.description,

    keywords: seoConfig.keywords.join(", "),

    canonical: seoConfig.siteUrl,

    robots: seoConfig.robots,

    image: `${seoConfig.siteUrl}${seoConfig.image}`

});

/* ==================================
   Build SEO Meta
================================== */

const buildMeta = (options = {}) => {

    const title =
        options.title || seoConfig.title;

    const description =
        options.description || seoConfig.description;

    const keywords = Array.isArray(options.keywords)
        ? options.keywords.join(", ")
        : (options.keywords || seoConfig.keywords.join(", "));

    const canonical =
        options.canonical
            ? `${seoConfig.siteUrl}${options.canonical}`
            : seoConfig.siteUrl;

    const image =
        options.image
            ? `${seoConfig.siteUrl}${options.image}`
            : `${seoConfig.siteUrl}${seoConfig.image}`;

    return {

        title,

        description,

        keywords,

        canonical,

        robots:
            options.robots || seoConfig.robots,

        image,

        openGraph: {

            type:
                options.type ||
                seoConfig.openGraph.type,

            locale:
                seoConfig.openGraph.locale,

            url: canonical,

            siteName:
                seoConfig.siteName,

            title,

            description,

            image

        },

        twitter: {

            card:
                seoConfig.twitter.card,

            site:
                seoConfig.twitter.site,

            creator:
                seoConfig.twitter.creator,

            title,

            description,

            image

        }

    };

};

/* ==================================
   Generate Canonical URL
================================== */

const generateCanonicalUrl = (path = "") => {

    if (!path) {
        return seoConfig.siteUrl;
    }

    return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

};

/* ==================================
   Organization Schema
================================== */

const generateOrganizationSchema = () => ({

    "@context": "https://schema.org",

    "@type": "Organization",

    name: seoConfig.siteName,

    url: seoConfig.siteUrl,

    logo: `${seoConfig.siteUrl}${seoConfig.logo}`,

    image: `${seoConfig.siteUrl}${seoConfig.image}`

});

/* ==================================
   Breadcrumb Schema
================================== */

const generateBreadcrumbSchema = (items = []) => ({

    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: items.map((item, index) => ({

        "@type": "ListItem",

        position: index + 1,

        name: item.name,

        item: generateCanonicalUrl(item.url)

    }))

});

/* ==================================
   Export
================================== */

module.exports = {

    seoConfig,

    defaultMeta,

    buildMeta,

    generateCanonicalUrl,

    generateOrganizationSchema,

    generateBreadcrumbSchema

};

