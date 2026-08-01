const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "error",
        "system",
        "contact",
        "comment",
        "download",
        "background",
        "seo"
      ],
      default: "info",
      index: true
    },

    target: {
      type: String,
      enum: [
        "admin",
        "all",
        "system"
      ],
      default: "admin"
    },

    referenceModel: {
      type: String,
      default: ""
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    priority: {
      type: String,
      enum: [
        "low",
        "normal",
        "high",
        "critical"
      ],
      default: "normal",
      index: true
    },

    actionUrl: {
      type: String,
      default: ""
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

notificationSchema.index({
  isRead: 1,
  createdAt: -1
});

notificationSchema.index({
  type: 1,
  priority: 1
});

module.exports = mongoose.model("Notification", notificationSchema);
