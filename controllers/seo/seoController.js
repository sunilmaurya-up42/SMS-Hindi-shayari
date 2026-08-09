const Seo = require("../../models/Seo");
const Sitemap = require("../../models/Sitemap");
const Setting = require("../../models/Setting");

/**
 * Get SEO Settings
 */
exports.getSeo = async (req, res) => {

    try {

        const seo = await Seo.find();

        return res.json({
            success: true,
            data: seo
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Create / Update SEO
 */
exports.saveSeo = async (req, res) => {

    try {

        const seo = await Seo.findOneAndUpdate(

            {
                pageType: req.body.pageType,
                referenceId: req.body.referenceId
            },

            req.body,

            {
                new: true,
                upsert: true,
                runValidators: true
            }

        );

        res.json({

            success: true,

            message: "SEO saved successfully.",

            data: seo

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

/**
 * Delete SEO
 */
exports.removeSeo = async (req, res) => {

    try {

        await Seo.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "SEO deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false

        });

    }

};

/**
 * Generate Sitemap
 */
exports.generateSitemap = async (req, res) => {

    try {

        const sitemap = await Sitemap.find({

            isActive: true

        }).sort({

            priority: -1

        });

        res.json({

            success: true,

            total: sitemap.length,

            data: sitemap

        });

    } catch (error) {

        res.status(500).json({

            success: false

        });

    }

};

/**
 * Generate robots.txt
 */
exports.robots = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        const siteUrl = settings?.siteUrl || "";

        res.type("text/plain");

        res.send(
`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`
        );

    } catch (error) {

        res.status(500).send("Server Error");

    }

};

/**
 * Generate ads.txt
 */
exports.ads = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        res.type("text/plain");

        res.send(settings?.adsense?.adsTxt || "");

    } catch (error) {

        res.status(500).send("");

    }

};

/**
 * JSON-LD Schema
 */
exports.schema = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        const schema = {

            "@context": "https://schema.org",

            "@type": "WebSite",

            name: settings.siteName,

            url: settings.siteUrl

        };

        res.json(schema);

    } catch (error) {

        res.status(500).json({

            success: false

        });

    }

};

/**
 * Open Graph
 */
exports.openGraph = async (req, res) => {

    const seo = await Seo.findById(req.params.id);

    if (!seo) {

        return res.status(404).json({

            success: false

        });

    }

    res.json({

        success: true,

        openGraph: seo.openGraph

    });

};

/**
 * Twitter Card
 */
exports.twitterCard = async (req, res) => {

    const seo = await Seo.findById(req.params.id);

    if (!seo) {

        return res.status(404).json({

            success: false

        });

    }

    res.json({

        success: true,

        twitter: seo.twitter

    });

};

/**
 * Canonical URL
 */
exports.canonical = async (req, res) => {

    const seo = await Seo.findById(req.params.id);

    if (!seo) {

        return res.status(404).json({

            success: false

        });

    }

    res.json({

        success: true,

        canonical: seo.canonicalUrl

    });

};
