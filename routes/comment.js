const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment/commentController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Add Comment
router.post(
    "/",
    commentController.create
);

// Get Comments By Shayari
router.get(
    "/shayari/:id",
    commentController.getByShayari
);

// Latest Comments
router.get(
    "/latest",
    commentController.latest
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Approve Comment
router.patch(
    "/approve/:id",
    auth,
    admin,
    commentController.approve
);

// Reject Comment
router.patch(
    "/reject/:id",
    auth,
    admin,
    commentController.reject
);

// Reply Comment
router.post(
    "/reply/:id",
    auth,
    admin,
    commentController.reply
);

// Update Reply
router.put(
    "/reply/:id",
    auth,
    admin,
    commentController.updateReply
);

// Delete Comment
router.delete(
    "/:id",
    auth,
    admin,
    commentController.remove
);

// Comment Analytics
router.get(
    "/analytics",
    auth,
    admin,
    commentController.analytics
);

// Report Comment
router.post(
    "/report/:id",
    commentController.report
);

// Like Comment
router.post(
    "/like/:id",
    commentController.like
);

module.exports = router;
