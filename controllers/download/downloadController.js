const Download = require("../../models/Download");
const Shayari = require("../../models/Shayari");

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const [downloads, total] = await Promise.all([

            Download.find({
                user: req.user._id
            })
            .populate({
                path: "shayari",
                populate: {
                    path: "category"
                }
            })
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

            Download.countDocuments({
                user: req.user._id
            })

        ]);

        res.render("user/downloads", {
            title: "My Downloads",
            downloads,
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

exports.download = async (req, res, next) => {

    try {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {

            req.flash("error_msg", "Shayari not found.");

            return res.redirect("back");

        }

        await Download.create({

            user: req.user._id,
            shayari: shayari._id,
            ip: req.ip,
            userAgent: req.headers["user-agent"]

        });

        shayari.downloads = (shayari.downloads || 0) + 1;

        await shayari.save();

        return res.download(

            shayari.filePath,

            shayari.slug + ".txt"

        );

    } catch (error) {

        next(error);

    }

};

exports.history = async (req, res, next) => {

    try {

        const history = await Download.find({

            user: req.user._id

        })
        .populate("shayari")
        .sort({
            createdAt: -1
        });

        res.json({

            success: true,
            history

        });

    } catch (error) {

        next(error);

    }

};

exports.delete = async (req, res, next) => {

    try {

        await Download.findOneAndDelete({

            _id: req.params.id,
            user: req.user._id

        });

        req.flash(

            "success_msg",

            "Download history deleted successfully."

        );

        res.redirect("/user/downloads");

    } catch (error) {

        next(error);

    }

};

exports.clear = async (req, res, next) => {

    try {

        await Download.deleteMany({

            user: req.user._id

        });

        req.flash(

            "success_msg",

            "Download history cleared successfully."

        );

        res.redirect("/user/downloads");

    } catch (error) {

        next(error);

    }

};

exports.adminList = async (req, res, next) => {

    try {

        const downloads = await Download.find()
            .populate("user", "name email")
            .populate("shayari", "title slug")
            .sort({
                createdAt: -1
            });

        res.render("admin/downloads", {

            title: "Download Reports",

            downloads

        });

    } catch (error) {

        next(error);

    }

};
