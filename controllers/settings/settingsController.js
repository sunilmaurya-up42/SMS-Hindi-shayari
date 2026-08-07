const fs = require("fs/promises");
const path = require("path");

const Setting = require("../../models/Setting");
const logger = require("../../utils/logger");

exports.index = async (req, res, next) => {
    try {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = await Setting.create({});
        }

        res.render("admin/settings/index", {
            title: "Website Settings",
            settings
        });

    } catch (err) {

        logger.error(err);

        next(err);

    }
};

exports.updateGeneral = async (req, res, next) => {

    try {

        const settings = await Setting.findOne();

        Object.assign(settings, {
            siteName: req.body.siteName,
            siteDescription: req.body.siteDescription,
            siteUrl: req.body.siteUrl,
            siteEmail: req.body.siteEmail,
            sitePhone: req.body.sitePhone,
            siteAddress: req.body.siteAddress,
            maintenanceMode: req.body.maintenanceMode === "true"
        });

        await settings.save();

        req.flash(
            "success_msg",
            "General settings updated successfully."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

exports.updateSeo = async (req, res, next) => {

    try {

        const settings = await Setting.findOne();

        settings.seo = {
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            metaKeywords: req.body.metaKeywords,
            googleVerification: req.body.googleVerification
        };

        await settings.save();

        req.flash(
            "success_msg",
            "SEO settings updated."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

exports.updateSocial = async (req, res, next) => {

    try {

        const settings = await Setting.findOne();

        settings.social = {
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            twitter: req.body.twitter,
            telegram: req.body.telegram
        };

        await settings.save();

        req.flash(
            "success_msg",
            "Social links updated."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

exports.uploadLogo = async (req, res, next) => {

    try {

        if (!req.file) {

            req.flash(
                "error_msg",
                "Please select logo."
            );

            return res.redirect("/admin/settings");

        }

        const settings = await Setting.findOne();

        settings.logo = "/uploads/" + req.file.filename;

        await settings.save();

        req.flash(
            "success_msg",
            "Logo uploaded successfully."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

exports.uploadFavicon = async (req, res, next) => {

    try {

        if (!req.file) {

            req.flash(
                "error_msg",
                "Please select favicon."
            );

            return res.redirect("/admin/settings");

        }

        const settings = await Setting.findOne();

        settings.favicon = "/uploads/" + req.file.filename;

        await settings.save();

        req.flash(
            "success_msg",
            "Favicon uploaded successfully."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

exports.clearCache = async (req, res, next) => {

    try {

        const cachePath = path.join(
            process.cwd(),
            "cache"
        );

        await fs.rm(cachePath, {
            recursive: true,
            force: true
        });

        req.flash(
            "success_msg",
            "Website cache cleared."
        );

        res.redirect("/admin/settings");

    } catch (err) {

        logger.error(err);

        next(err);

    }

};
console.log(Object.keys(module.exports));
