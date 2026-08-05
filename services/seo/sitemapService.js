const fs = require("fs");
const path = require("path");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");

const PUBLIC_DIR = path.join(__dirname, "../../public");
const SITEMAP_FILE = path.join(PUBLIC_DIR, "sitemap.xml");

const BASE_URL =
    process.env.APP_URL || "http://localhost:10000";

/**
 * Generate XML
 */
function buildXml(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;
}

/**
 * Create URL
 */
function createUrl(loc, lastmod) {
    return `
<url>
    <loc>${loc}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
</url>`;
}

/**
 * Generate Full Sitemap
 */
exports.generate = async () => {

    const urls = [];

    urls.push(createUrl(BASE_URL, new Date()));

    const categories = await Category.find({
        isActive: true
    });

    categories.forEach(category => {

        urls.push(
            createUrl(
                `${BASE_URL}/category/${category.slug}`,
                category.updatedAt || category.createdAt
            )
        );

    });

    const shayari = await Shayari.find({
        published: true
    });

    shayari.forEach(item => {

        urls.push(
            createUrl(
                `${BASE_URL}/shayari/${item.slug}`,
                item.updatedAt || item.createdAt
            )
        );

    });

    fs.writeFileSync(
        SITEMAP_FILE,
        buildXml(urls),
        "utf8"
    );

    return true;

};

/**
 * Update After Shayari Create/Edit
 */
exports.updateShayari = async () => {

    return exports.generate();

};

/**
 * Update After Category Create/Edit
 */
exports.updateCategory = async () => {

    return exports.generate();

};

/**
 * Rebuild Sitemap
 */
exports.rebuild = async () => {

    return exports.generate();

};
