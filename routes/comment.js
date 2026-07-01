/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Comment Routes
 * -------------------------------------------------------
 */

"use strict";

const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment");

const {
    isAuthenticated
} = require("../middleware/auth");

/* ==================================
   Add Comment
================================== */

router.post(
    "/add",
    isAuthenticated,
    commentController.create
);

/* ==================================
   Update Comment
================================== */

router.put(
    "/:id",
    isAuthenticated,
    commentController.update
);

/* ==================================
   Delete Comment
================================== */

router.delete(
    "/:id",
    isAuthenticated,
    commentController.remove
);

/* ==================================
   Get Comments of Shayari
================================== */

router.get(
    "/shayari/:shayariId",
    commentController.list
);

/* ==================================
   Export
================================== */

module.exports = router;
