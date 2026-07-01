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
