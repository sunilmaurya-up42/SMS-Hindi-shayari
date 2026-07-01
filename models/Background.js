/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Background Image Model
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");

const backgroundSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },

        fileName: {
            type: String,
            required: true,
            trim: true
        },

        filePath: {
            type: String,
            required: true,
            trim: true
        },

        githubUrl: {
            type: String,
            required: true,
            trim: true
        },

        rawUrl: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            default: "General",
            trim: true,
            index: true
        },

        orientation: {
            type: String,
            enum: [
                "square",
                "portrait",
                "landscape"
            ],
            default: "square",
            index: true
        },

        width: {
            type: Number,
            default: 1080
        },

        height: {
            type: Number,
            default: 1080
        },

        fileSize: {
            type: Number,
            default: 0
        },

        mimeType: {
            type: String,
            default: "image/jpeg"
        },

        alt: {
            type: String,
            default: ""
        },

        seoTitle: {
            type: String,
            default: ""
        },

        seoDescription: {
            type: String,
            default: ""
        },

        tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        usageCount: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
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

backgroundSchema.index({
    slug: 1
});

backgroundSchema.index({
    category: 1,
    isActive: 1
});

backgroundSchema.index({
    isFeatured: 1
});

/* ==================================
   Instance Methods
================================== */

backgroundSchema.methods.incrementUsage = function () {

    this.usageCount += 1;

    return this.save({
        validateBeforeSave: false
    });

};

/* ==================================
   Export
================================== */

module.exports = mongoose.model(
    "Background",
    backgroundSchema
);
