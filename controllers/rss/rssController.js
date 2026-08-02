const RSS = require("rss");

const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Setting = require("../../models/Setting");

const logger = require("../../utils/logger");

/**
 * Main RSS Feed
 */
exports.feed = async (req, res, next) => {

    try {

        const settings = await Setting.findOne();

        const siteUrl =
            settings?.siteUrl ||
            process.env.APP_URL ||
            `${req.protocol}://${req.get("host")}`;

        const feed = new RSS({

            title: settings?.siteName || "SMS Hindi Shayari",

            description:
                settings?.siteDescription ||
                "Latest Hindi Shayari RSS Feed",

            site_url: siteUrl,

            feed_url: `${siteUrl}/rss.xml`,

            language: "hi-IN"

        });

        const shayari = await Shayari.find({

            status: "published"

        })
        .populate("category")
        .sort({

            createdAt: -1

        })
        .limit(30);

        shayari.forEach(item => {

            feed.item({

                title: item.title,

                description: item.content,

                url: `${siteUrl}/shayari/${item.slug}`,

                categories: [
                    item.category?.name
                ],

                date: item.createdAt

            });

        });

        res.type("application/xml");

        res.send(feed.xml());

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Category Feed
 */
exports.categoryFeed = async (req, res, next) => {

    try {

        const category = await Category.findOne({

            slug: req.params.slug

        });

        if (!category) {

            return res.status(404).render(
                "errors/404"
            );

        }

        const siteUrl =
            process.env.APP_URL ||
            `${req.protocol}://${req.get("host")}`;

        const feed = new RSS({

            title: category.name,

            site_url: siteUrl,

            feed_url:
                `${siteUrl}/rss/${category.slug}.xml`

        });

        const shayari = await Shayari.find({

            category: category._id,

            status: "published"

        })
        .sort({

            createdAt: -1

        });

        shayari.forEach(item => {

            feed.item({

                title: item.title,

                description: item.content,

                url: `${siteUrl}/shayari/${item.slug}`,

                date: item.createdAt

            });

        });

        res.type("application/xml");

        res.send(feed.xml());

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Latest Feed API
 */
exports.latest = async (req, res, next) => {

    try {

        const latest = await Shayari.find({

            status: "published"

        })
        .sort({

            createdAt: -1

        })
        .limit(20)
        .populate("category");

        res.json({

            success: true,

            data: latest

        });

    } catch (error) {

        next(error);

    }

};

/**
 * Feed Status
 */
exports.status = (req, res) => {

    res.json({

        success: true,

        service: "RSS Feed",

        status: "active",

        timestamp: new Date()

    });

};
