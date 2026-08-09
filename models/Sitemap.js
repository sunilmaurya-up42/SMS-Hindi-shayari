const mongoose = require("mongoose");

const sitemapSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      enum: [
        "home",
        "category",
        "shayari",
        "language",
        "page"
      ],
      required: true,
      index: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },

    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    slug: {
      type: String,
      default: "",
      index: true
    },

    language: {
      type: String,
      default: "hi",
      index: true
    },

    priority: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1
    },

    changeFrequency: {
      type: String,
      enum: [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never"
      ],
      default: "weekly"
    },

    lastModified: {
      type: Date,
      default: Date.now,
      index: true
    },

    isIndexed: {
      type: Boolean,
      default: true,
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

sitemapSchema.index({
  pageType: 1,
  language: 1
});

sitemapSchema.index({
  lastModified: -1
});

module.exports = mongoose.model("Sitemap", sitemapSchema);
