const slugify = require("slugify");

/**
 * Generate SEO Slug
 */
exports.slug = (text) => {

    return slugify(text, {

        lower: true,

        strict: true,

        trim: true

    });

};

/**
 * SEO Title
 */
exports.title = (title, siteName) => {

    return `${title} | ${siteName}`;

};

/**
 * Meta Description
 */
exports.description = (text, limit = 160) => {

    if (!text) return "";

    return text.length > limit
        ? text.substring(0, limit) + "..."
        : text;

};

/**
 * Keywords
 */
exports.keywords = (category, tags = []) => {

    return [

        category,

        ...tags

    ].join(", ");

};

/**
 * Canonical URL
 */
exports.canonical = (baseUrl, slug) => {

    return `${baseUrl}/shayari/${slug}`;

};

/**
 * Open Graph
 */
exports.openGraph = (data) => {

    return {

        title: data.title,

        description: data.description,

        image: data.image,

        url: data.url,

        type: "website"

    };

};

/**
 * Twitter Card
 */
exports.twitterCard = (data) => {

    return {

        card: "summary_large_image",

        title: data.title,

        description: data.description,

        image: data.image

    };

};

/**
 * JSON-LD
 */
exports.schema = (data) => {

    return {

        "@context": "https://schema.org",

        "@type": "Article",

        headline: data.title,

        description: data.description,

        image: data.image,

        datePublished: data.createdAt,

        dateModified: data.updatedAt,

        author: {

            "@type": "Person",

            name: data.author || "Admin"

        }

    };

};

/**
 * Breadcrumb Schema
 */
exports.breadcrumb = (items = []) => {

    return {

        "@context": "https://schema.org",

        "@type": "BreadcrumbList",

        itemListElement: items.map((item, index) => ({

            "@type": "ListItem",

            position: index + 1,

            name: item.name,

            item: item.url

        }))

    };

};

/**
 * FAQ Schema
 */
exports.faq = (questions = []) => {

    return {

        "@context": "https://schema.org",

        "@type": "FAQPage",

        mainEntity: questions.map(q => ({

            "@type": "Question",

            name: q.question,

            acceptedAnswer: {

                "@type": "Answer",

                text: q.answer

            }

        }))

    };

};

/**
 * robots.txt
 */
exports.robots = (baseUrl) => {

    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

};

/**
 * SEO Score
 */
exports.score = (data) => {

    let score = 0;

    if (data.title?.length >= 30)
        score += 20;

    if (data.description?.length >= 120)
        score += 20;

    if (data.image)
        score += 20;

    if (data.keywords)
        score += 20;

    if (data.slug)
        score += 20;

    return score;

};
