/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Category Model
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100
        },

        slug: {
            type: String,
            unique: true,
            index: true
        },

        description: {
            type: String,
            default: "",
            maxlength: 500
        },

        language: {
            type: String,
            default: "Hindi",
            enum: [
                "Hindi",
                "English",
                "Urdu"
            ]
        },

        icon: {
            type: String,
            default: ""
        },

        coverImage: {
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

        seoKeywords: [{
            type: String,
            trim: true
        }],

        sortOrder: {
            type: Number,
            default: 0
        },

        totalShayari: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

/* ==================================
   Auto Slug
================================== */

categorySchema.pre("validate", function (next) {

    if (this.isModified("name") || !this.slug) {

        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true
        });

    }

    next();

});

/* ==================================
   Indexes
================================== */

categorySchema.index({
    slug: 1
});

categorySchema.index({
    isActive: 1
});

categorySchema.index({
    sortOrder: 1
});

categorySchema.index({
    language: 1
});

/* ==================================
   Export
================================== */

module.exports = mongoose.model(
    "Category",
    categorySchema
);
