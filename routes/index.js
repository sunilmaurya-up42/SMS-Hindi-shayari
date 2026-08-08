const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Shayari = require("../models/Shayari");

/*
|--------------------------------------------------------------------------
| HOME PAGE
|--------------------------------------------------------------------------
*/
/* =========================
   LATEST SHAYARI
========================= */

router.get("/latest", async (req, res, next) => {
    try {

        const latestShayari = await Shayari.find({
            published: true
        })
            .populate("category", "name slug icon")
            .sort({
                createdAt: -1
            })
            .limit(30)
            .lean();

        const categories = await Category.find({
            isActive: true
        })
            .sort({
                sortOrder: 1,
                name: 1
            })
            .lean();

        return res.render("shayari/latest", {
            title: "Latest Shayari - SMS Hindi Shayari",
            activePage: "latest",
            latestShayari,
            shayari: latestShayari,
            categories
        });

    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {

        const [
            categories,
            latestShayari,
            popularShayari
        ] = await Promise.all([

            Category.find({
                isActive: true
            })
            .sort({
                sortOrder: 1,
                name: 1
            })
            .lean(),

            Shayari.find({
                published: true
            })
            .sort({
                createdAt: -1
            })
            .limit(9)
            .lean(),

            Shayari.find({
                published: true
            })
            .sort({
                views: -1
            })
            .limit(6)
            .lean()

        ]);

        res.render("home/index", {
            title: "SMS Hindi Shayari",
            activePage: "home",
            categories,
            latestShayari,
            popularShayari
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
