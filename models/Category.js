const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100
    },

    slug: {
      type: String,
      unique: true,
      index: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    language: {
      type: String,
      default: "hi",
      index: true
    },

    icon: {
      type: String,
      default: "📝"
    },

    color: {
      type: String,
      default: "#e53935"
    },

    sortOrder: {
      type: Number,
      default: 0
    },

    totalShayari: {
      type: Number,
      default: 0
    },

    totalViews: {
      type: Number,
      default: 0
    },

    seoTitle: {
      type: String,
      default: ""
    },

    seoDescription: {
      type: String,
      default: ""
    },

    seoKeywords: {
      type: [String],
      default: []
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

categorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true
    });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
