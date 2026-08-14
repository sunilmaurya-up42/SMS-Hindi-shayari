const Comment = require("../../models/Comment");
const Shayari = require("../../models/Shayari");
/**
 * Add Comment
 */
exports.create = async (req, res) => {

    try {

        const shayariId =
            (req.body.shayari || "").trim();

        const name =
            (req.body.name || "").trim();

        const email =
            (req.body.email || "").trim();

        const message =
            (req.body.comment || req.body.message || "").trim();


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (!shayariId) {

            return res.status(400).json({
                success: false,
                message: "Shayari ID is required."
            });

        }

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Name is required."
            });

        }

        if (!message) {

            return res.status(400).json({
                success: false,
                message: "Comment is required."
            });

        }


        // --------------------------------------------------
        // CHECK SHAYARI
        // --------------------------------------------------

        const shayari =
            await Shayari.findById(shayariId);

        if (!shayari) {

            return res.status(404).json({
                success: false,
                message: "Shayari not found."
            });

        }


        // --------------------------------------------------
        // CREATE COMMENT
        // --------------------------------------------------

        const comment =
            await Comment.create({

                shayari:
                    shayari._id,

                name:
                    name,

                email:
                    email,

                message:
                    message,

                ipAddress:
                    req.ip || "",

                userAgent:
                    req.get("user-agent") || "",

                isApproved:
                    false,

                isSpam:
                    false,

                isDeleted:
                    false

            });


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Comment submitted successfully.",

            data:
                comment

        });

    } catch (error) {

        console.error(
            "❌ Create Comment Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

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
exports.updateReply = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        comment.adminReply = req.body.reply;
        comment.repliedAt = new Date();

        await comment.save();

        res.json({
            success: true,
            message: "Reply updated successfully.",
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.report = async (req, res) => {
    res.json({
        success: true,
        message: "Comment reported successfully."
    });
};

exports.like = async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found."
        });
    }

    comment.likes = (comment.likes || 0) + 1;
    await comment.save();

    res.json({
        success: true,
        likes: comment.likes
    });
};
