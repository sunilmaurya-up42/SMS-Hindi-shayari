const path = require("path");
const fs = require("fs/promises");

const Image = require("../../models/Image");
const logger = require("../../utils/logger");

exports.index = async (req, res, next) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = 24;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.search) {
            filter.originalName = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        const [images, total] = await Promise.all([
            Image.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Image.countDocuments(filter)
        ]);

        res.render("admin/images", {
            title: "Image Library",
            images,
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }
};

exports.upload = async (req, res, next) => {

    try {

        if (!req.files || req.files.length === 0) {

            req.flash(
                "error_msg",
                "Please select at least one image."
            );

            return res.redirect("/admin/images");

        }

        const documents = req.files.map(file => ({

            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            url: "/uploads/" + file.filename,
            uploadedBy: req.user._id

        }));

        await Image.insertMany(documents);

        req.flash(
            "success_msg",
            `${documents.length} image(s) uploaded successfully.`
        );

        res.redirect("/admin/images");

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.show = async (req, res, next) => {

    try {

        const image = await Image.findById(req.params.id);

        if (!image) {

            return res.status(404).json({
                success: false,
                message: "Image not found."
            });

        }

        res.json({
            success: true,
            image
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.destroy = async (req, res, next) => {

    try {

        const image = await Image.findById(req.params.id);

        if (!image) {

            req.flash(
                "error_msg",
                "Image not found."
            );

            return res.redirect("/admin/images");

        }

        try {

            await fs.unlink(
                path.resolve(image.path)
            );

        } catch (_) {}

        await image.deleteOne();

        req.flash(
            "success_msg",
            "Image deleted successfully."
        );

        res.redirect("/admin/images");

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.bulkDelete = async (req, res, next) => {

    try {

        const ids = req.body.ids || [];

        const images = await Image.find({
            _id: {
                $in: ids
            }
        });

        for (const image of images) {

            try {

                await fs.unlink(
                    path.resolve(image.path)
                );

            } catch (_) {}

        }

        await Image.deleteMany({
            _id: {
                $in: ids
            }
        });

        req.flash(
            "success_msg",
            "Selected images deleted successfully."
        );

        res.redirect("/admin/images");

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.copyUrl = async (req, res, next) => {

    try {

        const image = await Image.findById(req.params.id);

        if (!image) {

            return res.status(404).json({
                success: false
            });

        }

        res.json({
            success: true,
            url: image.url
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};

exports.statistics = async (req, res, next) => {

    try {

        const totalImages = await Image.countDocuments();

        const totalSize = await Image.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$size"
                    }
                }
            }
        ]);

        res.json({
            success: true,
            totalImages,
            totalStorage: totalSize[0]?.total || 0
        });

    } catch (error) {

        logger.error(error);

        next(error);

    }

};
