const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

exports.home = async (req, res, next) => {
    try {

        const [
            latest,
            trending,
            categories
        ] = await Promise.all([

            Shayari.find({ status: "published" })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("category"),

            Shayari.find({ status: "published" })
                .sort({ views: -1, likes: -1 })
                .limit(10)
                .populate("category"),

            Category.find({ status: true })
                .sort({ name: 1 })

        ]);

        res.json({
            success: true,
            latest,
            trending,
            categories
        });

    } catch (error) {

        next(error);

    }
};

exports.search = async (req, res, next) => {

    try {

        const keyword = req.query.q || "";

        const shayari = await Shayari.find({
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
        .limit(20);

        res.json({
            success: true,
            total: shayari.length,
            data: shayari
        });

    } catch (error) {

        next(error);

    }

};

exports.categories = async (req, res, next) => {

    try {

        const categories = await Category.find({
            status: true
        }).sort({
            name: 1
        });

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {

        next(error);

    }

};

exports.category = async (req, res, next) => {

    try {

        const shayari = await Shayari.find({
            category: req.params.id,
            status: "published"
        })
        .populate("category")
        .sort({
            createdAt: -1
        });

        res.json({
            success: true,
            total: shayari.length,
            data: shayari
        });

    } catch (error) {

        next(error);

    }

};

exports.shayari = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id)
            .populate("category");

        if (!shayari) {

            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });

        }

        res.json({
            success: true,
            data: shayari
        });

    } catch (error) {

        next(error);

    }

};

exports.stats = async (req, res, next) => {

    try {

        const [
            shayari,
            users,
            comments,
            categories
        ] = await Promise.all([

            Shayari.countDocuments(),

            User.countDocuments(),

            Comment.countDocuments(),

            Category.countDocuments()

        ]);

        res.json({

            success: true,

            stats: {
                shayari,
                users,
                comments,
                categories
            }

        });

    } catch (error) {

        next(error);

    }

};

exports.trending = async (req, res, next) => {

    try {

        const trending = await Shayari.find({
            status: "published"
        })
        .sort({
            views: -1,
            likes: -1,
            downloads: -1
        })
        .limit(10)
        .populate("category");

        res.json({
            success: true,
            data: trending
        });

    } catch (error) {

        next(error);

    }

};

exports.latest = async (req, res, next) => {

    try {

        const latest = await Shayari.find({
            status: "published"
        })
        .sort({
            createdAt: -1
        })
        .limit(10)
        .populate("category");

        res.json({
            success: true,
            data: latest
        });

    } catch (error) {

        next(error);

    }

};
