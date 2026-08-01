const Setting = require("../../models/Setting");

/**
 * Get Website Settings
 */
exports.getSettings = async (req, res) => {

    try {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = await Setting.create({});
        }

        return res.json({
            success: true,
            data: settings
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Update Website Settings
 */
exports.updateSettings = async (req, res) => {

    try {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = await Setting.create({});
        }

        Object.assign(settings, req.body);

        await settings.save();

        return res.json({
            success: true,
            message: "Settings updated successfully.",
            data: settings
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Toggle Maintenance Mode
 */
exports.toggleMaintenance = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        settings.maintenanceMode = !settings.maintenanceMode;

        await settings.save();

        return res.json({
            success: true,
            maintenanceMode: settings.maintenanceMode
        });

    } catch (error) {

        return res.status(500).json({
            success: false
        });

    }

};

/**
 * Update SEO Settings
 */
exports.updateSeo = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        settings.seo = req.body;

        await settings.save();

        res.json({
            success: true,
            message: "SEO settings updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Update AdSense Settings
 */
exports.updateAdsense = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        settings.adsense = req.body;

        await settings.save();

        res.json({
            success: true,
            message: "Adsense settings updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Update AI Image Settings
 */
exports.updateAI = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        settings.aiImage = req.body;

        await settings.save();

        res.json({
            success: true,
            message: "AI Image settings updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Update GitHub Settings
 */
exports.updateGithub = async (req, res) => {

    try {

        const settings = await Setting.findOne();

        settings.github = req.body;

        await settings.save();

        res.json({
            success: true,
            message: "GitHub settings updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Upload Logo
 */
exports.uploadLogo = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Logo file required."
            });

        }

        const settings = await Setting.findOne();

        settings.logo = `/uploads/logo/${req.file.filename}`;

        await settings.save();

        res.json({
            success: true,
            logo: settings.logo
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Upload Favicon
 */
exports.uploadFavicon = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false
            });

        }

        const settings = await Setting.findOne();

        settings.favicon = `/uploads/favicon/${req.file.filename}`;

        await settings.save();

        res.json({
            success: true,
            favicon: settings.favicon
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Backup Settings
 */
exports.backup = async (req, res) => {

    const settings = await Setting.findOne();

    res.json({
        success: true,
        backup: settings
    });

};

/**
 * Restore Settings
 */
exports.restore = async (req, res) => {

    await Setting.deleteMany({});

    const settings = await Setting.create(req.body);

    res.json({
        success: true,
        data: settings
    });

};
