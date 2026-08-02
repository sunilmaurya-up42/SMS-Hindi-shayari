const SitemapStream = require("sitemap").SitemapStream;
const { streamToPromise } = require("sitemap");

const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Setting = require("../../models/Setting");

const logger = require("../../utils/logger");

exports.sitemap = async (req, res, next) => {

    try {

        const settings = await Setting.findOne();

        const hostname = settings?.siteUrl ||
            process.env.APP_URL ||
            `${req.protocol}://${req.get("host")}`;

        const stream = new SitemapStream({
            hostname
        });

        stream.write({
            url: "/",
            changefreq: "daily",
            priority: 1.0
        });

        stream.write({
            url: "/categories",
            changefreq: "daily",
            priority: 0.9
        });

        stream.write({
            url: "/about",
            changefreq: "monthly",
            priority: 0.6
        });

        stream.write({
            url: "/contact",
            changefreq: "monthly",
            priority: 0.6
        });

        const categories = await Category.find({
            status: true
        });

        for (const category of categories) {

            stream.write({

                url: `/category/${category.slug}`,

                changefreq: "daily",

                priority: 0.8

            });

        }

        const shayari = await Shayari.find({

            status: "published"

        }).select("slug updatedAt");

        for (const item of shayari) {

            stream.write({

                url: `/shayari/${item.slug}`,

                lastmod: item.updatedAt,

                changefreq: "weekly",

                priority: 0.7

            });

        }

        stream.end();

        const xml = await streamToPromise(stream);

        res.header(
            "Content-Type",
            "application/xml"
        );

        res.send(xml.toString());

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.robots = async (req, res, next) => {

    try {

        const baseUrl =
            process.env.APP_URL ||
            `${req.protocol}://${req.get("host")}`;

        res.type("text/plain");

        res.send(
`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`
        );

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.newsSitemap = async (req, res, next) => {

    try {

        res.type("application/xml");

        res.send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
        );

    } catch (error) {

        next(error);

    }

};

exports.imageSitemap = async (req, res, next) => {

    try {

        res.type("application/xml");

        res.send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
        );

    } catch (error) {

        next(error);

    }

};

exports.ping = async (req, res, next) => {

    try {

        res.json({

            success: true,

            message: "Sitemap generated successfully."

        });

    } catch (error) {

        next(error);

    }

};
