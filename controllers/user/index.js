/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * User Controller
 * -------------------------------------------------------
 */

"use strict";

const bcrypt = require("bcrypt");

const User = require("../../models/User");
const Favorite = require("../../models/Favorite");
const Download = require("../../models/Download");

/* ==================================
   Dashboard
================================== */

exports.dashboard = async (req, res, next) => {

    try {

        const [favorites, downloads] = await Promise.all([

            Favorite.countDocuments({
                user: req.user._id
            }),

            Download.countDocuments({
                user: req.user._id
            })

        ]);

        return res.render("user/dashboard", {

            title: "Dashboard",

            user: req.user,

            stats: {
                favorites,
                downloads
            }

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Profile
================================== */

exports.profile = async (req, res, next) => {

    try {

        return res.render("user/profile", {

            title: "My Profile",

            user: req.user

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Update Profile
================================== */

exports.updateProfile = async (req, res, next) => {

    try {

        const {

            name

        } = req.body;

        await User.findByIdAndUpdate(

            req.user._id,

            {
                name
            }

        );

        return res.redirect("/user/profile");

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Favorites
================================== */

exports.favorites = async (req, res, next) => {

    try {

        const list = await Favorite.find({

            user: req.user._id

        })

        .populate("shayari")

        .sort({

            createdAt: -1

        });

        return res.render("user/favorites", {

            title: "My Favorites",

            list

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Downloads
================================== */

exports.downloads = async (req, res, next) => {

    try {

        const list = await Download.find({

            user: req.user._id

        })

        .populate("shayari")

        .sort({

            createdAt: -1

        });

        return res.render("user/downloads", {

            title: "My Downloads",

            list

        });

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Change Password
================================== */

exports.changePassword = async (req, res, next) => {

    try {

        const hash = await bcrypt.hash(

            req.body.password,

            12

        );

        await User.findByIdAndUpdate(

            req.user._id,

            {
                password: hash
            }

        );

        return res.redirect("/user/profile");

    } catch (error) {

        next(error);

    }

};

/* ==================================
   Delete Account
================================== */

exports.deleteAccount = async (req, res, next) => {

    try {

        await User.findByIdAndUpdate(

            req.user._id,

            {
                isActive: false
            }

        );

        req.logout(() => {

            res.redirect("/");

        });

    } catch (error) {

        next(error);

    }

};

module.exports = exports;
