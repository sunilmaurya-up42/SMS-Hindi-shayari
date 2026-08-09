const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error", "debug"],
      required: true,
      default: "info",
      index: true
    },

    module: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    referenceModel: {
      type: String,
      default: ""
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    ipAddress: {
      type: String,
      default: ""
    },

    userAgent: {
      type: String,
      default: ""
    },

    requestMethod: {
      type: String,
      default: ""
    },

    requestUrl: {
      type: String,
      default: ""
    },

    statusCode: {
      type: Number,
      default: 200
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    stack: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

logSchema.index({
  createdAt: -1
});

logSchema.index({
  level: 1,
  module: 1
});

module.exports = mongoose.model("Log", logSchema);
