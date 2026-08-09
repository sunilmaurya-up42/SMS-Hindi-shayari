const Favorite = require("../../models/Favorite");
const Shayari = require("../../models/Shayari");

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const [favorites, total] = await Promise.all([

            Favorite.find({
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

            Favorite.countDocuments({
                user: req.user._id
            })

        ]);

        res.render("user/favorites", {
            title: "My Favorites",
            favorites,
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

exports.add = async (req, res, next) => {

    try {

        const { shayariId } = req.body;

        const shayari = await Shayari.findById(shayariId);

        if (!shayari) {

            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });

        }

        const exists = await Favorite.findOne({

            user: req.user._id,
            shayari: shayariId

        });

        if (exists) {

            return res.status(409).json({
                success: false,
                message: "Already added to favorites."
            });

        }

        await Favorite.create({

            user: req.user._id,
            shayari: shayariId

        });

        res.json({

            success: true,
            message: "Added to favorites."

        });

    } catch (error) {

        next(error);

    }

};

exports.remove = async (req, res, next) => {

    try {

        await Favorite.findOneAndDelete({

            user: req.user._id,
            shayari: req.params.id

        });

        res.json({

            success: true,
            message: "Removed from favorites."

        });

    } catch (error) {

        next(error);

    }

};

exports.toggle = async (req, res, next) => {

    try {

        const { shayariId } = req.body;

        const favorite = await Favorite.findOne({

            user: req.user._id,
            shayari: shayariId

        });

        if (favorite) {

            await favorite.deleteOne();

            return res.json({

                success: true,
                action: "removed"

            });

        }

        await Favorite.create({

            user: req.user._id,
            shayari: shayariId

        });

        res.json({

            success: true,
            action: "added"

        });

    } catch (error) {

        next(error);

    }

};

exports.clear = async (req, res, next) => {

    try {

        await Favorite.deleteMany({

            user: req.user._id

        });

        req.flash(
            "success_msg",
            "All favorites removed successfully."
        );

        res.redirect("/user/favorites");

    } catch (error) {

        next(error);

    }

};
