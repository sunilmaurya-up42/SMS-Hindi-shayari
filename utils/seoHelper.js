/**
 * Generate Meta Tags
 */
exports.metaTags = ({
    title,
    description,
    keywords,
    image,
    url
}) => {

    return {
        title,
        description,
        keywords,
        canonical: url,
        image
    };

};

/**
 * Open Graph Tags
 */
exports.openGraph = ({
    title,
    description,
    image,
    url,
    type = "website"
}) => {

    return {
        "og:title": title,
        "og:description": description,
        "og:image": image,
        "og:url": url,
        "og:type": type
    };

};

/**
 * Twitter Card
 */
exports.twitterCard = ({
    title,
    description,
    image
}) => {

    return {
        "twitter:card": "summary_large_image",
        "twitter:title": title,
        "twitter:description": description,
        "twitter:image": image
    };

};

/**
 * Canonical URL
 */
exports.canonical = (baseUrl, path = "") => {

    return `${baseUrl}${path}`;

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
 * JSON-LD Article
 */
exports.articleSchema = (data) => {

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
 * Website Schema
 */
exports.websiteSchema = (name, url) => {

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url
    };

};

/**
 * FAQ Schema
 */
exports.faqSchema = (faqs = []) => {

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
            }
        }))
    };

};

/**
 * Generate robots.txt
 */
exports.robots = (baseUrl) => {

    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

};

/**
 * SEO Score
 */
exports.score = ({
    title,
    description,
    keywords,
    image
}) => {

    let score = 0;

    if (title && title.length >= 30) score += 25;

    if (description && description.length >= 120) score += 25;

    if (keywords) score += 25;

    if (image) score += 25;

    return {
        score,
        percentage: `${score}%`
    };

};

/**
 * Generate Page Title
 */
exports.pageTitle = (
    title,
    siteName
) => {

    return `${title} | ${siteName}`;

};

/**
 * Truncate Meta Description
 */
exports.metaDescription = (
    text,
    max = 160
) => {

    if (!text) return "";

    return text.length > max
        ? text.substring(0, max) + "..."
        : text;

};
