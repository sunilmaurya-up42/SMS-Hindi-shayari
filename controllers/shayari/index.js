/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Shayari Controller
 * Part 1
 * -------------------------------------------------------
 */

"use strict";

const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");

/* ==================================
   Home Page
================================== */

exports.home = async (req, res, next) => {

    try {

        const [
            featured,
            latest,
            trending,
            categories
        ] = await Promise.all([

            Shayari.find({
                status: "published",
                visibility: "public",
                isFeatured: true
            })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .limit(12)
            .lean(),

            Shayari.find({
                status: "published",
                visibility: "public"
            })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),

            Shayari.find({
                status: "published",
                visibility: "public",
                isTrending: true
            })
            .populate("category", "name slug")
            .sort({ views: -1 })
            .limit(10)
            .lean(),

            Category.find({
                isActive: true
            })
            .sort({
                sortOrder: 1,
                name: 1
            })
            .lean()

        ]);

        return res.render("pages/home", {

            title: "SMS Hindi Shayari",

            featured,
            latest,
            trending,
            categories,

            seo: {
                title: "SMS Hindi Shayari",
                description:
                    "Latest Hindi Shayari, Love Shayari, Sad Shayari, Attitude Shayari, Wishes, Kavita, Ghazal.",
                keywords:
                    "Hindi Shayari, Love Shayari, Sad Shayari, Attitude Shayari"
            }

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   All Shayari
================================== */

exports.allShayari = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([

            Shayari.find({
                status: "published",
                visibility: "public"
            })
            .populate("category", "name slug")
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit)
            .lean(),

            Shayari.countDocuments({
                status: "published",
                visibility: "public"
            })

        ]);

        return res.render("pages/shayari/index", {

            title: "All Shayari",

            shayari: items,

            pagination: {

                page,
                limit,
                total,
                pages: Math.ceil(total / limit)

            }

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Single Shayari
================================== */

exports.singleShayari = async (req, res, next) => {

    try {

        const { slug } = req.params;

        const shayari = await Shayari.findOne({
            slug,
            status: "published",
            visibility: "public"
        })
        .populate("category", "name slug")
        .populate("author", "name");

        if (!shayari) {
            return res.status(404).render("errors/404", {
                title: "Shayari Not Found"
            });
        }

        await shayari.incrementViews();

        const related = await Shayari.find({

            _id: { $ne: shayari._id },

            category: shayari.category._id,

            status: "published",

            visibility: "public"

        })
        .populate("category", "name slug")
        .sort({
            createdAt: -1
        })
        .limit(8)
        .lean();

        const trending = await Shayari.getTrending(10);

        return res.render("pages/shayari/detail", {

            title: shayari.seoTitle || shayari.title,

            shayari,

            related,

            trending,

            seo: {

                title: shayari.seoTitle,

                description: shayari.seoDescription,

                keywords: shayari.seoKeywords,

                canonical: shayari.canonicalUrl ||

                    `${process.env.APP_URL}/shayari/${shayari.slug}`

            }

        });

    }

    catch (error) {

        next(error);

    }

};

/* ==================================
   Featured Shayari
================================== */

exports.featured = async (req, res, next) => {

    try {

        const list = await Shayari.getFeatured(20);

        return res.render("pages/shayari/featured", {

            title: "Featured Shayari",

            shayari: list

        });

    }

    catch (error) {

        next(error);

    }

};

/* ==================================
   Trending Shayari
================================== */

exports.trending = async (req, res, next) => {

    try {

        const list = await Shayari.getTrending(20);

        return res.render("pages/shayari/trending", {

            title: "Trending Shayari",

            shayari: list

        });

    }

    catch (error) {

        next(error);

    }

};

/* ==================================
   Latest Shayari
================================== */

exports.latest = async (req, res, next) => {

    try {

        const list = await Shayari.getLatest(30);

        return res.render("pages/shayari/latest", {

            title: "Latest Shayari",

            shayari: list

        });

    }

    catch (error) {

        next(error);

    }

};
/* ==================================
   Category Wise Shayari
================================== */

exports.category = async (req, res, next) => {

    try {

        const { slug } = req.params;

        const category = await Category.findOne({
            slug,
            isActive: true
        }).lean();

        if (!category) {
            return res.status(404).render("errors/404", {
                title: "Category Not Found"
            });
        }

        const page = parseInt(req.query.page || 1);
        const limit = 20;
        const skip = (page - 1) * limit;

        const filter = {
            category: category._id,
            status: "published",
            visibility: "public"
        };

        const [shayari, total] = await Promise.all([

            Shayari.find(filter)
                .populate("category", "name slug")
                .populate("author", "name")
                .sort({
                    isPinned: -1,
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            Shayari.countDocuments(filter)

        ]);

        return res.render("pages/category/detail", {

            title: category.name,

            category,

            shayari,

            pagination: {

                page,
                limit,
                total,
                pages: Math.ceil(total / limit)

            }

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Search Shayari
================================== */

exports.search = async (req, res, next) => {

    try {

        const keyword = (req.query.q || "").trim();

        const page = parseInt(req.query.page || 1);

        const limit = 20;

        const skip = (page - 1) * limit;

        const filter = {

            status: "published",

            visibility: "public"

        };

        if (keyword.length) {

            filter.$text = {
                $search: keyword
            };

        }

        const [shayari, total] = await Promise.all([

            Shayari.find(filter)
                .populate("category", "name slug")
                .populate("author", "name")
                .sort({
                    score: {
                        $meta: "textScore"
                    }
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            Shayari.countDocuments(filter)

        ]);

        return res.render("pages/search", {

            title: "Search",

            keyword,

            shayari,

            pagination: {

                page,
                limit,
                total,
                pages: Math.ceil(total / limit)

            }

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Tag Wise Shayari
================================== */

exports.tag = async (req, res, next) => {

    try {

        const tag = req.params.tag.toLowerCase();

        const shayari = await Shayari.find({

            tags: tag,

            status: "published",

            visibility: "public"

        })

        .populate("category", "name slug")

        .populate("author", "name")

        .sort({

            createdAt: -1

        })

        .lean();

        return res.render("pages/tag", {

            title: `${tag} Shayari`,

            tag,

            shayari

        });

    } catch (error) {

        next(error);

    }

};
/* ==================================
   Language Filter
================================== */

exports.language = async (req, res, next) => {

    try {

        const language = req.params.language;

        const shayari = await Shayari.find({

            language,

            status: "published",

            visibility: "public"

        })

        .populate("category", "name slug")

        .populate("author", "name")

        .sort({

            createdAt: -1

        })

        .lean();

        return res.render("pages/language", {

            title: `${language} Shayari`,

            language,

            shayari

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Like Shayari
================================== */

exports.like = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        await shayari.incrementLikes();

        return res.json({
            success: true,
            likes: shayari.likes
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Download Shayari
================================== */

exports.download = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        await shayari.incrementDownloads();

        return res.json({
            success: true,
            downloads: shayari.downloads
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Favorite Shayari
================================== */

exports.favorite = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        await shayari.incrementFavorites();

        return res.json({
            success: true,
            favorites: shayari.favorites
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Remove Favorite
================================== */

exports.removeFavorite = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        await shayari.decrementFavorites();

        return res.json({
            success: true,
            favorites: shayari.favorites
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Share Counter
================================== */

exports.share = async (req, res, next) => {

    try {

        return res.json({
            success: true,
            message: "Share counted."
        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Export Complete Controller
================================== */

module.exports = exports;
