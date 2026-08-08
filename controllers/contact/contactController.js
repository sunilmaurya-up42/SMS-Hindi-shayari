const Contact = require("../../models/Contact");

/**
 * Submit Contact Form
 */
exports.submit = async (req, res) => {

    try {

        const contact = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully.",
            data: contact
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
 * Get All Contacts
 */
exports.getAll = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Contact.countDocuments();

        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            page,
            total,
            data: contacts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Get Single Contact
 */
exports.getOne = async (req, res) => {

    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Reply Contact
 */
exports.reply = async (req, res) => {

    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }

        contact.adminReply = req.body.reply;
        contact.status = "resolved";
        contact.isRead = true;
        contact.repliedAt = new Date();

        await contact.save();

        res.json({
            success: true,
            message: "Reply saved successfully.",
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Mark Contact As Read
 */
exports.markAsRead = async (req, res) => {

    try {

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            },
            {
                new: true
            }
        );

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Delete Contact
 */
exports.remove = async (req, res) => {

    try {

        await Contact.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Contact deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Contact Analytics
 */
exports.analytics = async (req, res) => {

    try {

        const total = await Contact.countDocuments();

        const unread = await Contact.countDocuments({
            isRead: false
        });

        const resolved = await Contact.countDocuments({
            status: "resolved"
        });

        const pending = await Contact.countDocuments({
            status: "new"
        });

        res.json({
            success: true,
            total,
            unread,
            pending,
            resolved
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};
