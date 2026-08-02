const Page = require("../../models/Page");
const logger = require("../../utils/logger");

/**
 * Display page by slug
 */
exports.show = async (req, res, next) => {
    try {

        const page = await Page.findOne({
            slug: req.params.slug,
            status: "published"
        }).lean();

        if (!page) {
            return res.status(404).render("errors/404", {
                title: "Page Not Found"
            });
        }

        page.views = (page.views || 0) + 1;

        await Page.updateOne(
            { _id: page._id },
            {
                $set: {
                    views: page.views,
                    lastVisitedAt: new Date()
                }
            }
        );

        res.render("pages/show", {
            title: page.seoTitle || page.title,
            page,
            seo: {
                title: page.seoTitle,
                description: page.seoDescription,
                keywords: page.seoKeywords,
                image: page.featuredImage
            }
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }
};

/**
 * Admin Pages
 */
exports.admin = async (req, res, next) => {

    try {

        const pages = await Page.find()
            .sort({
                createdAt: -1
            });

        res.render("admin/pages", {
            title: "Pages",
            pages
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Create Page
 */
exports.create = async (req, res, next) => {

    try {

        const page = await Page.create(req.body);

        req.flash(
            "success_msg",
            "Page created successfully."
        );

        res.redirect(
            "/admin/pages/" + page._id + "/edit"
        );

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Edit Page
 */
exports.edit = async (req, res, next) => {

    try {

        const page = await Page.findById(req.params.id);

        if (!page) {

            return res.status(404).render("errors/404");

        }

        res.render("admin/page-edit", {
            title: "Edit Page",
            page
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Update Page
 */
exports.update = async (req, res, next) => {

    try {

        await Page.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                runValidators: true
            }
        );

        req.flash(
            "success_msg",
            "Page updated successfully."
        );

        res.redirect("/admin/pages");

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Delete Page
 */
exports.remove = async (req, res, next) => {

    try {

        await Page.findByIdAndDelete(
            req.params.id
        );

        req.flash(
            "success_msg",
            "Page deleted successfully."
        );

        res.redirect("/admin/pages");

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

/**
 * Preview Page
 */
exports.preview = async (req, res, next) => {

    try {

        const page = await Page.findById(
            req.params.id
        );

        if (!page) {

            return res.status(404).render("errors/404");

        }

        res.render("pages/show", {
            title: page.title,
            page
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};
