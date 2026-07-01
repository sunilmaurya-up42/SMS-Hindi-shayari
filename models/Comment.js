
/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Comment Model
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        shayari: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shayari",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 1000
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "approved",
            index: true
        },

        isAdminReply: {
            type: Boolean,
            default: false,
            index: true
        },

        likes: {
            type: Number,
            default: 0
        },

        ipAddress: {
            type: String,
            default: ""
        },

        userAgent: {
            type: String,
            default: ""
        },

        isEdited: {
            type: Boolean,
            default: false
        },

        editedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/* ==================================
   Indexes
================================== */

commentSchema.index({
    shayari: 1,
    status: 1,
    createdAt: -1
});

commentSchema.index({
    parent: 1
});

/* ==================================
   Instance Methods
================================== */

commentSchema.methods.like = async function () {

    this.likes += 1;

    return this.save({
        validateBeforeSave: false
    });

};

commentSchema.methods.editMessage = async function (message) {

    this.message = message;
    this.isEdited = true;
    this.editedAt = new Date();

    return this.save();

};

/* ==================================
   Static Methods
================================== */

commentSchema.statics.getApprovedByShayari = function (shayariId) {

    return this.find({
        shayari: shayariId,
        status: "approved"
    })
        .populate("user", "name avatar")
        .sort({
            createdAt: 1
        });

};

/* ==================================
   Export
================================== */

module.exports = mongoose.model(
    "Comment",
    commentSchema
);
