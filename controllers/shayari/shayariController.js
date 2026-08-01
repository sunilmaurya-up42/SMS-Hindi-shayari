const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Background = require("../../models/Background");
const Comment = require("../../models/Comment");
const Shayari = require("../../models/Shayari");
const Background = require("../../models/Background");

const imageService = require("../../services/image/imageService");
const githubService = require("../../services/github/githubService");
const sitemapService = require("../../services/seo/sitemapService");
const analyticsService = require("../../services/analytics/analyticsService");

/**
 * Create Shayari
 */
exports.create = async (req, res) => {
    try {

        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        const shayari = await Shayari.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Shayari created successfully.",
            data: shayari
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
 * Get All Shayari
 */
exports.getAll = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {
            published: true
        };

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.language) {
            filter.language = req.query.language;
        }

        if (req.query.search) {

            filter.$or = [
                {
                    title: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                }
            ];

        }

        const total = await Shayari.countDocuments(filter);

        const shayari = await Shayari.find(filter)
            .populate("category", "name slug")
            .populate("background", "githubDownloadUrl")
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);

        return res.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: shayari
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
 * Get Single Shayari
 */
exports.getOne = async (req, res) => {

    try {

        const shayari = await Shayari.findOne({
            slug: req.params.slug,
            published: true
        })
            .populate("category")
            .populate("background");

        if (!shayari) {

            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });

        }

        shayari.views += 1;

        await shayari.save();

        return res.json({
            success: true,
            data: shayari
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
 * Update Shayari
 */
exports.update = async (req, res) => {
    try {

        const shayari = await Shayari.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        return res.json({
            success: true,
            message: "Shayari updated successfully.",
            data: shayari
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
 * Soft Delete Shayari
 */
exports.remove = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {

            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });

        }

        shayari.published = false;

        await shayari.save();

        return res.json({
            success: true,
            message: "Shayari deleted successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Trending Shayari
 */
exports.trending = async (req, res) => {

    const data = await Shayari.find({
        published: true,
        trending: true
    })
    .sort({ views: -1 })
    .limit(20);

    res.json({
        success: true,
        data
    });

};

/**
 * Featured Shayari
 */
exports.featured = async (req, res) => {

    const data = await Shayari.find({
        published: true,
        featured: true
    })
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
        success: true,
        data
    });

};

/**
 * Latest Shayari
 */
exports.latest = async (req, res) => {

    const data = await Shayari.find({
        published: true
    })
    .sort({
        createdAt: -1
    })
    .limit(20);

    res.json({
        success: true,
        data
    });

};

/**
 * Random Shayari
 */
exports.random = async (req, res) => {

    const data = await Shayari.aggregate([
        {
            $match: {
                published: true
            }
        },
        {
            $sample: {
                size: 20
            }
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Related Shayari
 */
exports.related = async (req, res) => {

    const shayari = await Shayari.findById(req.params.id);

    if (!shayari) {

        return res.status(404).json({
            success: false,
            message: "Shayari not found."
        });

    }

    const related = await Shayari.find({

        _id: {
            $ne: shayari._id
        },

        category: shayari.category,

        published: true

    }).limit(10);

    res.json({

        success: true,

        data: related

    });

};

/**
 * Copy Counter
 */
exports.copy = async (req, res) => {

    const shayari = await Shayari.findById(req.params.id);

    if (!shayari) {

        return res.status(404).json({
            success: false
        });

    }

    shayari.copies++;

    await shayari.save();

    res.json({
        success: true,
        copies: shayari.copies
    });

};

/**
 * Share Counter
 */
exports.share = async (req, res) => {

    const shayari = await Shayari.findById(req.params.id);

    if (!shayari) {

        return res.status(404).json({
            success: false
        });

    }

    shayari.shares++;

    await shayari.save();

    res.json({
        success: true,
        shares: shayari.shares
    });

};

/**
 * Download Counter
 */
exports.download = async (req, res) => {

    const shayari = await Shayari.findById(req.params.id);

    if (!shayari) {

        return res.status(404).json({
            success: false
        });

    }

    shayari.downloads++;

    await shayari.save();

    res.json({
        success: true,
        downloads: shayari.downloads
    });

};

/**
 * Generate AI Image
 */
exports.generateImage = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.params.id)
            .populate("background");

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        let background = shayari.background;

        if (!background) {

            background = await Background.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $sample: {
                        size: 1
                    }
                }
            ]);

            background = background[0];

        }

        if (!background) {

            return res.status(404).json({
                success: false,
                message: "Background not found."
            });

        }

        const image = await imageService.generate({

            title: shayari.title,
            text: shayari.content,
            background: background.githubDownloadUrl

        });

        shayari.aiImage = image.url;
        shayari.imageGenerated = true;

        await shayari.save();

        return res.json({

            success: true,
            image: image.url

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Image generation failed."

        });

    }

};

/**
 * Upload Generated Image To GitHub
 */
exports.uploadImage = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari || !shayari.aiImage) {

            return res.status(404).json({

                success: false,
                message: "Generated image not found."

            });

        }

        const github = await githubService.uploadImage({

            shayariId: shayari._id,

            image: shayari.aiImage

        });

        shayari.aiImage = github.url;

        await shayari.save();

        res.json({

            success: true,

            image: github.url

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "GitHub upload failed."

        });

    }

};

/**
 * Download Image
 */
exports.downloadImage = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {

            return res.status(404).json({

                success: false

            });

        }

        shayari.downloads++;

        await shayari.save();

        await analyticsService.download(shayari);

        return res.json({

            success: true,

            image: shayari.aiImage

        });

    } catch (error) {

        return res.status(500).json({

            success: false

        });

    }

};

/**
 * Update SEO + Sitemap
 */
exports.refreshSeo = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {

            return res.status(404).json({

                success: false

            });

        }

        await sitemapService.updateShayari(shayari);

        return res.json({

            success: true,

            message: "SEO updated."

        });

    } catch (error) {

        return res.status(500).json({

            success: false

        });

    }

};

/**
 * Bulk Import
 */
exports.bulkImport = async (req, res) => {

    try {

        const result = await imageService.importShayari(req.file);

        res.json({

            success: true,

            result

        });

    } catch (error) {

        res.status(500).json({

            success: false

        });

    }

};

/**
 * Bulk Export
 */
exports.bulkExport = async (req, res) => {

    try {

        const result = await imageService.exportShayari();

        res.json({

            success: true,

            result

        });

    } catch (error) {

        res.status(500).json({

            success: false

        });

    }

};

/**
 * Home API
 */
exports.home = async (req, res) => {

    const [

        latest,
        featured,
        trending,
        random

    ] = await Promise.all([

        Shayari.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(10),

        Shayari.find({
            featured: true,
            published: true
        }).limit(10),

        Shayari.find({
            trending: true,
            published: true
        }).limit(10),

        Shayari.aggregate([
            {
                $match: {
                    published: true
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])

    ]);

    res.json({

        success: true,

        latest,
        featured,
        trending,
        random

    });

};

/**
 * Search Suggestions
 */
exports.suggestions = async (req, res) => {

    const keyword = req.query.q || "";

    const data = await Shayari.find({

        title: {

            $regex: keyword,

            $options: "i"

        }

    })
    .select("title slug")
    .limit(10);

    res.json({

        success: true,

        data

    });

};
