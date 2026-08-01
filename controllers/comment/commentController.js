const Comment = require("../../models/Comment");
const Shayari = require("../../models/Shayari");

/**
 * Add Comment
 */
exports.create = async (req, res) => {

    try {

        const shayari = await Shayari.findById(req.body.shayari);

        if (!shayari) {
            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });
        }

        const comment = await Comment.create({
            shayari: req.body.shayari,
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment
        });

        return res.status(201).json({
            success: true,
            message: "Comment submitted successfully.",
            data: comment
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
 * Get Comments By Shayari
 */
exports.getByShayari = async (req, res) => {

    try {

        const comments = await Comment.find({
            shayari: req.params.id,
            isApproved: true
        })
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            total: comments.length,
            data: comments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Approve Comment
 */
exports.approve = async (req, res) => {

    try {

        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                isApproved: true
            },
            {
                new: true
            }
        );

        if (!comment) {

            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });

        }

        res.json({
            success: true,
            message: "Comment approved.",
            data: comment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

/**
 * Reject Comment
 */
exports.reject = async (req, res) => {

    try {

        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                isApproved: false
            },
            {
                new: true
            }
        );

        res.json({
            success: true,
            message: "Comment rejected.",
            data: comment
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Admin Reply
 */
exports.reply = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {

            return res.status(404).json({
                success: false
            });

        }

        comment.adminReply = req.body.reply;
        comment.repliedAt = new Date();

        await comment.save();

        res.json({
            success: true,
            message: "Reply added successfully.",
            data: comment
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Delete Comment
 */
exports.remove = async (req, res) => {

    try {

        await Comment.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Comment deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

};

/**
 * Latest Comments
 */
exports.latest = async (req, res) => {

    const data = await Comment.find({
        isApproved: true
    })
    .sort({
        createdAt: -1
    })
    .limit(20);

    res.json({
        success: true,
        data
    });

};

/**
 * Comment Analytics
 */
exports.analytics = async (req, res) => {

    const total = await Comment.countDocuments();

    const approved = await Comment.countDocuments({
        isApproved: true
    });

    const pending = await Comment.countDocuments({
        isApproved: false
    });

    res.json({
        success: true,
        total,
        approved,
        pending
    });

};
