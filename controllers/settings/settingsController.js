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
exports.updateAdsense = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});

        settings.adsense = {
            enabled: req.body.enabled === "true",
            clientId: req.body.clientId
        };

        await settings.save();

        req.flash("success_msg", "Adsense settings updated.");
        res.redirect("/admin/settings");
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

exports.updateGithub = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});

        settings.github = {
            username: req.body.username,
            repository: req.body.repository,
            branch: req.body.branch,
            backgroundFolder: req.body.backgroundFolder
        };

        await settings.save();

        req.flash("success_msg", "Github settings updated.");
        res.redirect("/admin/settings");
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

exports.updateAI = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});

        settings.aiImage = {
            enabled: req.body.enabled === "true",
            defaultFont: req.body.defaultFont,
            textColor: req.body.textColor,
            strokeColor: req.body.strokeColor,
            shadow: req.body.shadow === "true"
        };

        await settings.save();

        req.flash("success_msg", "AI settings updated.");
        res.redirect("/admin/settings");
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

exports.toggleMaintenance = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});

        settings.maintenanceMode = !settings.maintenanceMode;

        await settings.save();

        req.flash("success_msg", "Maintenance mode updated.");
        res.redirect("/admin/settings");
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

exports.backup = async (req, res, next) => {
    try {
        const settings = await Setting.findOne();

        res.json({
            success: true,
            settings
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

exports.restore = async (req, res, next) => {
    try {
        await Setting.deleteMany({});
        await Setting.create(req.body);

        req.flash("success_msg", "Settings restored successfully.");
        res.redirect("/admin/settings");
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
console.log(Object.keys(module.exports));
