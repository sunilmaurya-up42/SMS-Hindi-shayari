const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    shayari: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shayari",
      required: true,
      index: true
    },

    background: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Background",
      default: null,
      index: true
    },

    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      default: null,
      index: true
    },

    language: {
      type: String,
      default: "hi",
      index: true
    },

    downloadType: {
      type: String,
      enum: ["image", "text", "pdf"],
      default: "image",
      index: true
    },

    fileName: {
  type: String,
  default: "",
  trim: true
},

    fileSize: {
  type: Number,
  default: 0,
  min: 0
},

    ipAddress: {
  type: String,
  default: "",
  trim: true
},

    country: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "bot", "unknown"],
      default: "unknown"
    },

    browser: {
      type: String,
      default: ""
    },

    os: {
      type: String,
      default: ""
    },

    referrer: {
      type: String,
      default: ""
    },

    downloadedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

downloadSchema.index({ downloadedAt: -1 });
downloadSchema.index({ shayari: 1, downloadedAt: -1 });
downloadSchema.index({ language: 1, downloadType: 1 });

module.exports = mongoose.model("Download", downloadSchema);
