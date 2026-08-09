const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Download = require("../../models/Download");

exports.dashboard = async (req, res, next) => {
    try {
        const [
            totalShayari,
            publishedShayari,
            draftShayari,
            totalCategories,
            totalUsers,
            totalDownloads,
            latestShayari
        ] = await Promise.all([
            Shayari.countDocuments(),

            Shayari.countDocuments({
                published: true
            }),

            Shayari.countDocuments({
                published: false
            }),

            Category.countDocuments(),

            User.countDocuments(),

            Download.countDocuments(),

            Shayari.find()
                .populate("category", "name slug")
                .sort({
                    createdAt: -1
                })
                .limit(10)
                .lean()
        ]);

        return res.render("admin/dashboard", {
            title: "Admin Dashboard - SMS Hindi Shayari",

            activePage: "dashboard",

            stats: {
                totalShayari,
                publishedShayari,
                draftShayari,
                totalCategories,
                totalUsers,
                totalDownloads
            },

            totalShayari,
            publishedShayari,
            draftShayari,
            totalCategories,
            totalUsers,
            totalDownloads,

            latestShayari
        });

    } catch (error) {
        console.error(
            "Admin Dashboard Error:",
            error
        );

        next(error);
    }
};
