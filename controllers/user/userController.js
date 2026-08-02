const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Favorite = require("../../models/Favorite");
const Download = require("../../models/Download");
const Comment = require("../../models/Comment");
const Notification = require("../../models/Notification");

exports.dashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [
            favorites,
            downloads,
            comments,
            notifications
        ] = await Promise.all([
            Favorite.countDocuments({ user: userId }),
            Download.countDocuments({ user: userId }),
            Comment.countDocuments({ user: userId }),
            Notification.countDocuments({
                user: userId,
                isRead: false
            })
        ]);

        res.render("user/dashboard", {
            title: "Dashboard",
            stats: {
                favorites,
                downloads,
                comments,
                notifications
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.render("user/profile", {
            title: "My Profile",
            user
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const {
            name,
            username,
            phone,
            bio
        } = req.body;

        const update = {
            name,
            username,
            phone,
            bio
        };

        if (req.file) {
            update.avatar = req.file.path;
        }

        await User.findByIdAndUpdate(
            req.user._id,
            update,
            {
                new: true,
                runValidators: true
            }
        );

        req.flash("success_msg", "Profile updated successfully.");

        res.redirect("/user/profile");

    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (newPassword !== confirmPassword) {
            req.flash("error_msg", "Passwords do not match.");
            return res.redirect("/user/change-password");
        }

        const user = await User.findById(req.user._id);

        const valid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!valid) {
            req.flash("error_msg", "Current password is incorrect.");
            return res.redirect("/user/change-password");
        }

        user.password = await bcrypt.hash(newPassword, 12);

        await user.save();

        req.flash("success_msg", "Password changed successfully.");

        res.redirect("/user/profile");

    } catch (err) {
        next(err);
    }
};

exports.favorites = async (req, res, next) => {
    try {

        const list = await Favorite.find({
            user: req.user._id
        })
        .populate("shayari")
        .sort({ createdAt: -1 });

        res.render("user/favorites", {
            title: "My Favorites",
            favorites: list
        });

    } catch (err) {
        next(err);
    }
};

exports.downloads = async (req, res, next) => {
    try {

        const list = await Download.find({
            user: req.user._id
        })
        .populate("shayari")
        .sort({ createdAt: -1 });

        res.render("user/downloads", {
            title: "My Downloads",
            downloads: list
        });

    } catch (err) {
        next(err);
    }
};

exports.notifications = async (req, res, next) => {
    try {

        const notifications = await Notification.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.render("user/notifications", {
            title: "Notifications",
            notifications
        });

    } catch (err) {
        next(err);
    }
};

exports.settings = (req, res) => {

    res.render("user/settings", {
        title: "Account Settings"
    });

};
