const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const User = require("../../models/User");
const logger = require("../../utils/logger");

/**
 * Global Search
 */
exports.search = async (req, res, next) => {
    try {

        const keyword = (req.query.q || "").trim();

        if (!keyword) {
            return res.render("search/index", {
                title: "Search",
                keyword,
                results: []
            });
        }

        const results = await Shayari.find({
            status: "published",
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        })
        .populate("category")
        .sort({
            createdAt: -1
        })
        .limit(50);

        res.render("search/index", {
            title: `Search: ${keyword}`,
            keyword,
            results
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }
};

/**
 * AJAX Suggestions
 */
exports.suggestions = async (req, res, next) => {

    try {

        const keyword = req.query.q || "";

        const suggestions = await Shayari.find({
            title: {
                $regex: keyword,
                $options: "i"
            }
        })
        .select("title slug")
        .limit(10);

        res.json({
            success: true,
            suggestions
        });

    } catch (error) {

        next(error);

    }

};

/**
 * Category Search
 */
exports.category = async (req, res, next) => {

    try {

        const category = await Category.findOne({
            slug: req.params.slug
        });

        if (!category) {

            return res.status(404).render("errors/404");

        }

        const shayari = await Shayari.find({
            category: category._id,
            status: "published"
        })
        .populate("category")
        .sort({
            createdAt: -1
        });

        res.render("search/category", {
            title: category.name,
            category,
            shayari
        });

    } catch (error) {

        next(error);

    }

};

/**
 * Tag Search
 */
exports.tag = async (req, res, next) => {

    try {

        const tag = req.params.tag;

        const shayari = await Shayari.find({
            tags: tag,
            status: "published"
        })
        .populate("category");

        res.render("search/tag", {
            title: tag,
            tag,
            shayari
        });

    } catch (error) {

        next(error);

    }

};

/**
 * Search Statistics
 */
exports.statistics = async (req, res, next) => {

    try {

        res.json({
            success: true,
            totalShayari: await Shayari.countDocuments(),
            totalCategories: await Category.countDocuments(),
            totalUsers: await User.countDocuments()
        });

    } catch (error) {

        next(error);

    }

};
