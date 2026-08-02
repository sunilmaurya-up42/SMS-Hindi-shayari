const Contact = require("../../models/Contact");
const { Parser } = require("json2csv");
const logger = require("../../utils/logger");

/**
 * Contact Messages List
 */
exports.index = async (req, res, next) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status === "read") {
            filter.readAt = { $ne: null };
        }

        if (req.query.status === "unread") {
            filter.readAt = null;
        }

        if (req.query.status === "replied") {
            filter.replied = true;
        }

        if (req.query.q) {

            filter.$or = [
                {
                    name: {
                        $regex: req.query.q,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: req.query.q,
                        $options: "i"
                    }
                },
                {
                    subject: {
                        $regex: req.query.q,
                        $options: "i"
                    }
                }
            ];

        }

        const [contacts, total] = await Promise.all([

            Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Contact.countDocuments(filter)

        ]);

        res.render("admin/contacts", {
            title: "Contact Messages",
            contacts,
            query: req.query,
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });

    } catch (err) {

        logger.error(err);

        next(err);

    }
};

/**
 * View Contact
 */
exports.show = async (req, res, next) => {

    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {

            req.flash("error_msg", "Message not found.");

            return res.redirect("/admin/contacts");

        }

        if (!contact.readAt) {

            contact.readAt = new Date();

            await contact.save();

        }

        res.render("admin/contact-details", {
            title: "Contact Details",
            contact
        });

    } catch (err) {

        logger.error(err);

        next(err);

    }

};

/**
 * Mark Read
 */
exports.markRead = async (req, res, next) => {

    try {

        await Contact.findByIdAndUpdate(
            req.params.id,
            {
                readAt: new Date()
            }
        );

        res.redirect("/admin/contacts");

    } catch (err) {

        next(err);

    }

};

/**
 * Mark Unread
 */
exports.markUnread = async (req, res, next) => {

    try {

        await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $unset: {
                    readAt: ""
                }
            }
        );

        res.redirect("/admin/contacts");

    } catch (err) {

        next(err);

    }

};

/**
 * Delete
 */
exports.destroy = async (req, res, next) => {

    try {

        await Contact.findByIdAndDelete(req.params.id);

        req.flash(
            "success_msg",
            "Message deleted successfully."
        );

        res.redirect("/admin/contacts");

    } catch (err) {

        next(err);

    }

};

/**
 * Bulk Delete
 */
exports.bulkDelete = async (req, res, next) => {

    try {

        const ids = req.body.ids || [];

        await Contact.deleteMany({

            _id: {
                $in: ids
            }

        });

        req.flash(
            "success_msg",
            "Selected messages deleted."
        );

        res.redirect("/admin/contacts");

    } catch (err) {

        next(err);

    }

};

/**
 * Dashboard Stats
 */
exports.statistics = async (req, res, next) => {

    try {

        const [

            total,

            unread,

            replied

        ] = await Promise.all([

            Contact.countDocuments(),

            Contact.countDocuments({
                readAt: null
            }),

            Contact.countDocuments({
                replied: true
            })

        ]);

        res.json({

            success: true,

            total,

            unread,

            replied

        });

    } catch (err) {

        next(err);

    }

};

/**
 * Export CSV
 */
exports.exportCsv = async (req, res, next) => {

    try {

        const contacts = await Contact.find().lean();

        const parser = new Parser();

        const csv = parser.parse(contacts);

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment("contacts.csv");

        res.send(csv);

    } catch (err) {

        next(err);

    }

};
