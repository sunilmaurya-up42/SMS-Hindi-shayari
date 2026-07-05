/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Shayari Model
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");
const slugify = require("slugify");

const shayariSchema = new mongoose.Schema({
    background: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Background",
    default: null,
    index: true
},

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    slug: {
        type: String,
        unique: true,
        index: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    language: {
        type: String,
        enum: [
            "Hindi",
            "English",
            "Urdu"
        ],
        default: "Hindi",
        index: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    aiImage: {
        type: String,
        default: ""
    },

    backgroundImage: {
        type: String,
        default: ""
    },

    thumbnail: {
        type: String,
        default: ""
    },

    imageAlt: {
        type: String,
        default: ""
    },

    imageTitle: {
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

    canonicalUrl: {
        type: String,
        default: ""
    },

    excerpt: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "draft",
            "published"
        ],
        default: "published",
        index: true
    },

    visibility: {
        type: String,
        enum: [
            "public",
            "private"
        ],
        default: "public"
    },

    isFeatured: {
        type: Boolean,
        default: false,
        index: true
    },

    isTrending: {
        type: Boolean,
        default: false,
        index: true
    },

    isPinned: {
        type: Boolean,
        default: false
    },

    allowComments: {
        type: Boolean,
        default: true
    },

    views: {
        type: Number,
        default: 0
    },

    likes: {
        type: Number,
        default: 0
    },

    downloads: {
        type: Number,
        default: 0
    },

    favorites: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true,
    versionKey: false
});

/* ==================================
   Indexes
================================== */

shayariSchema.index({ createdAt: -1 });
shayariSchema.index({ updatedAt: -1 });

shayariSchema.index({
    title: "text",
    content: "text",
    tags: "text"
});

/* ==================================
   Virtuals
================================== */

shayariSchema.virtual("url").get(function () {
    return `/shayari/${this.slug}`;
});

/* ==================================
   Auto Slug
================================== */

shayariSchema.pre("validate", function (next) {

    if (this.isModified("title") || !this.slug) {

        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            trim: true
        });

    }

    next();

});

/* ==================================
   Auto Excerpt
================================== */

shayariSchema.pre("save", function (next) {

    if (
        (!this.excerpt || this.excerpt.trim() === "") &&
        this.content
    ) {

        this.excerpt = this.content
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 160);

    }

    next();

});

/* ==================================
   Auto SEO
================================== */

shayariSchema.pre("save", function (next) {

    if (!this.seoTitle) {
        this.seoTitle = this.title;
    }

    if (!this.seoDescription) {
        this.seoDescription = this.excerpt;
    }

    if (!this.imageAlt) {
        this.imageAlt = this.title;
    }

    if (!this.imageTitle) {
        this.imageTitle = this.title;
    }

    next();

});

/* ==================================
   Reading Time
================================== */

shayariSchema.virtual("readingTime").get(function () {

    const words = this.content
        ? this.content.trim().split(/\s+/).length
        : 0;

    return Math.max(1, Math.ceil(words / 180));

});

/* ==================================
   Publish Scope
================================== */

shayariSchema.statics.published = function () {

    return this.find({
        status: "published",
        visibility: "public"
    });

};

/* ==================================
   Instance Methods
================================== */

shayariSchema.methods.incrementViews = async function () {

    this.views += 1;

    return this.save({
        validateBeforeSave: false
    });

};

shayariSchema.methods.incrementLikes = async function () {

    this.likes += 1;

    return this.save({
        validateBeforeSave: false
    });

};

shayariSchema.methods.incrementDownloads = async function () {

    this.downloads += 1;

    return this.save({
        validateBeforeSave: false
    });

};

shayariSchema.methods.incrementFavorites = async function () {

    this.favorites += 1;

    return this.save({
        validateBeforeSave: false
    });

};

shayariSchema.methods.decrementFavorites = async function () {

    if (this.favorites > 0) {
        this.favorites -= 1;
    }

    return this.save({
        validateBeforeSave: false
    });

};

/* ==================================
   Static Methods
================================== */

shayariSchema.statics.getTrending = function (limit = 10) {

    return this.find({
        status: "published",
        visibility: "public",
        isTrending: true
    })
    .sort({
        createdAt: -1
    })
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name");

};

shayariSchema.statics.getFeatured = function (limit = 10) {

    return this.find({
        status: "published",
        visibility: "public",
        isFeatured: true
    })
    .sort({
        createdAt: -1
    })
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name");

};

shayariSchema.statics.getLatest = function (limit = 20) {

    return this.find({
        status: "published",
        visibility: "public"
    })
    .sort({
        createdAt: -1
    })
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name");

};

/* ==================================
   JSON Transform
================================== */

shayariSchema.methods.toJSON = function () {

    const data = this.toObject({
        virtuals: true
    });

    return data;

};

/* ==================================
   Export
================================== */

module.exports = mongoose.model(
    "Shayari",
    shayariSchema
);
