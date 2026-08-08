const Background = require("../../models/Background");
const githubService = require("../../services/github/githubService");

/**
 * Upload Background
 */
exports.upload = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Background image is required."
            });
        }

        const github = await githubService.uploadBackground(req.file);

        const background = await Background.create({

            title: req.body.title,

            category: req.body.category || "general",

            githubUrl: github.url,

            githubPath: github.path,

            width: req.body.width,

            height: req.body.height,

            isActive: true

        });

        return res.status(201).json({

            success: true,

            message: "Background uploaded successfully.",

            data: background

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Upload failed."

        });

    }

};

/**
 * Get All Backgrounds
 */
exports.getAll = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Background.countDocuments();

    const backgrounds = await Background.find()
        .sort({
            createdAt: -1
        })
        .skip(skip)
        .limit(limit);

    res.json({

        success: true,

        page,

        total,

        data: backgrounds

    });

};

/**
 * Get Random Background
 */
exports.random = async (req, res) => {

    const background = await Background.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $sample: {
                size: 1
            }
        }
    ]);

    res.json({

        success: true,

        data: background[0]

    });

};

/**
 * Update Background
 */
exports.update = async (req, res) => {

    const background = await Background.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
            new: true,
            runValidators: true
        }

    );

    if (!background) {

        return res.status(404).json({

            success: false,

            message: "Background not found."

        });

    }

    res.json({

        success: true,

        message: "Background updated.",

        data: background

    });

};

/**
 * Enable / Disable Background
 */
exports.toggle = async (req, res) => {

    const background = await Background.findById(req.params.id);

    if (!background) {

        return res.status(404).json({

            success: false

        });

    }

    background.isActive = !background.isActive;

    await background.save();

    res.json({

        success: true,

        isActive: background.isActive

    });

};

/**
 * Delete Background
 */
exports.remove = async (req, res) => {

    const background = await Background.findById(req.params.id);

    if (!background) {

        return res.status(404).json({

            success: false

        });

    }

    await githubService.deleteBackground(background.githubPath);

    await background.deleteOne();

    res.json({

        success: true,

        message: "Background deleted successfully."

    });

};

/**
 * Background Analytics
 */
exports.analytics = async (req, res) => {

    const total = await Background.countDocuments();

    const active = await Background.countDocuments({
        isActive: true
    });

    const inactive = await Background.countDocuments({
        isActive: false
    });

    res.json({

        success: true,

        total,

        active,

        inactive

    });

};
exports.preview = async (req, res) => {
    try {
        const background = await Background.findById(req.params.id);

        if (!background) {
            return res.status(404).json({
                success: false,
                message: "Background not found."
            });
        }

        res.json({
            success: true,
            data: background
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.categories = async (req, res) => {
    try {
        const categories = await Background.distinct("category");

        res.json({
            success: true,
            data: categories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.githubUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Background image is required."
            });
        }

        const github = await githubService.uploadBackground(req.file);

        res.json({
            success: true,
            url: github.url,
            path: github.path
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "GitHub upload failed."
        });
    }
};
