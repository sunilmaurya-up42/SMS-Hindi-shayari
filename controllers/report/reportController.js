const User = require("../../models/User");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Download = require("../../models/Download");
const Favorite = require("../../models/Favorite");
const logger = require("../../utils/logger");

exports.dashboard = async (req, res, next) => {
    try {

        const [
            users,
            shayari,
            categories,
            comments,
            downloads,
            favorites
        ] = await Promise.all([
            User.countDocuments(),
            Shayari.countDocuments(),
            Category.countDocuments(),
            Comment.countDocuments(),
            Download.countDocuments(),
            Favorite.countDocuments()
        ]);

        res.render("admin/reports/dashboard", {
            title: "Reports Dashboard",
            reports: {
                users,
                shayari,
                categories,
                comments,
                downloads,
                favorites
            }
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }
};

exports.userReport = async (req, res, next) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.render("admin/reports/users", {
            title: "User Report",
            users
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.shayariReport = async (req, res, next) => {

    try {

        const shayari = await Shayari.find()
            .populate("category")
            .sort({ views: -1 });

        res.render("admin/reports/shayari", {
            title: "Shayari Report",
            shayari
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.downloadReport = async (req, res, next) => {

    try {

        const downloads = await Download.find()
            .populate("user", "name email")
            .populate("shayari", "title slug")
            .sort({ createdAt: -1 });

        res.render("admin/reports/downloads", {
            title: "Download Report",
            downloads
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.commentReport = async (req, res, next) => {

    try {

        const comments = await Comment.find()
            .populate("user", "name")
            .populate("shayari", "title")
            .sort({ createdAt: -1 });

        res.render("admin/reports/comments", {
            title: "Comment Report",
            comments
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.summary = async (req, res, next) => {

    try {

        const summary = {
            users: await User.countDocuments(),
            shayari: await Shayari.countDocuments(),
            categories: await Category.countDocuments(),
            comments: await Comment.countDocuments(),
            downloads: await Download.countDocuments(),
            favorites: await Favorite.countDocuments()
        };

        res.json({
            success: true,
            summary
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};
