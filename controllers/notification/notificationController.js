const Notification = require("../../models/Notification");

exports.index = async (req, res, next) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([

            Notification.find({
                user: req.user._id
            })
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

            Notification.countDocuments({
                user: req.user._id
            })

        ]);

        res.render("user/notifications", {
            title: "Notifications",
            notifications,
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

exports.read = async (req, res, next) => {

    try {

        await Notification.findOneAndUpdate({

            _id: req.params.id,
            user: req.user._id

        }, {

            isRead: true,
            readAt: new Date()

        });

        res.json({

            success: true,
            message: "Notification marked as read."

        });

    } catch (error) {

        next(error);

    }

};

exports.readAll = async (req, res, next) => {

    try {

        await Notification.updateMany({

            user: req.user._id,
            isRead: false

        }, {

            $set: {
                isRead: true,
                readAt: new Date()
            }

        });

        req.flash(

            "success_msg",

            "All notifications marked as read."

        );

        res.redirect("/user/notifications");

    } catch (error) {

        next(error);

    }

};

exports.delete = async (req, res, next) => {

    try {

        await Notification.findOneAndDelete({

            _id: req.params.id,
            user: req.user._id

        });

        res.json({

            success: true,
            message: "Notification deleted."

        });

    } catch (error) {

        next(error);

    }

};

exports.clear = async (req, res, next) => {

    try {

        await Notification.deleteMany({

            user: req.user._id

        });

        req.flash(

            "success_msg",

            "All notifications cleared."

        );

        res.redirect("/user/notifications");

    } catch (error) {

        next(error);

    }

};

exports.create = async ({

    user,
    title,
    message,
    type = "info",
    url = null,
    icon = null

}) => {

    return Notification.create({

        user,
        title,
        message,
        type,
        url,
        icon

    });

};

exports.unreadCount = async (req, res, next) => {

    try {

        const count = await Notification.countDocuments({

            user: req.user._id,
            isRead: false

        });

        res.json({

            success: true,
            unread: count

        });

    } catch (error) {

        next(error);

    }

};
