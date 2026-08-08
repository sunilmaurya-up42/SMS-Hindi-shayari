const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Shayari = require("../models/Shayari");

router.use("/auth", require("./auth"));
router.use("/admin", require("./admin"));
router.use("/shayari", require("./shayari"));
router.use("/category", require("./category"));
router.use("/comment", require("./comment"));
router.use("/background", require("./background"));
router.use("/analytics", require("./analytics"));
router.use("/contact", require("./contact"));
router.use("/settings", require("./settings"));
router.use("/seo", require("./seo"));

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
                    views: -1,
                    createdAt: -1
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
