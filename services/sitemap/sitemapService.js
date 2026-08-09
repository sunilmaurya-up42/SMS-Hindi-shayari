const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");

/**
 * XML Header
 */
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;

/**
 * Build URL
 */
function buildUrl(loc, lastmod, priority = "0.8", changefreq = "daily") {

    return `
<url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
</url>`;

}

/**
 * Main Sitemap
 */
exports.generate = async (baseUrl) => {

    let urls = [];

    urls.push(
        buildUrl(
            `${baseUrl}/`,
            new Date().toISOString(),
            "1.0",
            "daily"
        )
    );

    const categories = await Category.find({
        isActive: true
    });

    categories.forEach(category => {

        urls.push(

            buildUrl(
                `${baseUrl}/category/${category.slug}`,
                category.updatedAt.toISOString()
            )

        );

    });

    const shayari = await Shayari.find({
        isPublished: true
    });

    shayari.forEach(item => {

        urls.push(

            buildUrl(
                `${baseUrl}/shayari/${item.slug}`,
                item.updatedAt.toISOString(),
                "0.9"
            )

        );

    });

    return `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

};

/**
 * Image Sitemap
 */
exports.imageSitemap = async (baseUrl) => {

    const shayari = await Shayari.find({
        imageUrl: {
            $exists: true,
            $ne: ""
        }
    });

    let xml = `${xmlHeader}
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    shayari.forEach(item => {

        xml += `
<url>
<loc>${baseUrl}/shayari/${item.slug}</loc>
<image:image>
<image:loc>${item.imageUrl}</image:loc>
</image:image>
</url>`;

    });

    xml += `
</urlset>`;

    return xml;

};

/**
 * Sitemap Index
 */
exports.index = (baseUrl) => {

    return `${xmlHeader}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<sitemap>
<loc>${baseUrl}/sitemap.xml</loc>
</sitemap>

<sitemap>
<loc>${baseUrl}/image-sitemap.xml</loc>
</sitemap>

</sitemapindex>`;

};

/**
 * robots.txt
 */
exports.robots = (baseUrl) => {

    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

Sitemap: ${baseUrl}/image-sitemap.xml`;

};

/**
 * Ping Search Engines
 */
exports.searchEnginePing = (baseUrl) => {

    return [

        `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`,

        `https://www.bing.com/ping?sitemap=${baseUrl}/sitemap.xml`

    ];

};
