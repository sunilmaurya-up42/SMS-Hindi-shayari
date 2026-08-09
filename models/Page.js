const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    content: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
    isActive: { type: Boolean, default: true, index: true },
    featuredImage: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    lastVisitedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Page", pageSchema);
