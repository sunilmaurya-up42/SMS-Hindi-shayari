const mongoose = require("mongoose");

const backgroundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    githubFileName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    githubUrl: {
      type: String,
      required: true,
      trim: true
    },

    githubDownloadUrl: {
      type: String,
      required: true,
      trim: true
    },

    sha: {
  type: String,
  default: "",
  trim: true
},

    width: {
      type: Number,
      default: 0
    },

    height: {
      type: Number,
      default: 0
    },

    fileSize: {
      type: Number,
      default: 0
    },

    mimeType: {
      type: String,
      default: "image/jpeg"
    },

    orientation: {
      type: String,
      enum: ["portrait", "landscape", "square"],
      default: "portrait"
    },

    dominantColor: {
      type: String,
      default: "#ffffff"
    },

    hash: {
      type: String,
      unique: true,
      sparse: true
    },

    usageCount: {
      type: Number,
      default: 0
    },

    lastUsedAt: {
      type: Date
    },

    tags: {
      type: [String],
      default: []
    },

    language: {
      type: String,
      default: "all"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

backgroundSchema.index({ usageCount: 1 });
backgroundSchema.index({ isActive: 1 });
backgroundSchema.index({ language: 1 });

module.exports = mongoose.model("Background", backgroundSchema);
