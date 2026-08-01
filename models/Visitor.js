const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    ipAddress: {
      type: String,
      default: ""
    },

    userAgent: {
      type: String,
      default: ""
    },

    browser: {
      type: String,
      default: ""
    },

    os: {
      type: String,
      default: ""
    },

    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "bot", "unknown"],
      default: "unknown"
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

    language: {
      type: String,
      default: "hi"
    },

    referrer: {
      type: String,
      default: ""
    },

    currentUrl: {
      type: String,
      default: ""
    },

    landingPage: {
      type: String,
      default: ""
    },

    lastPage: {
      type: String,
      default: ""
    },

    totalPageViews: {
      type: Number,
      default: 1
    },

    visitCount: {
      type: Number,
      default: 1
    },

    isBot: {
      type: Boolean,
      default: false
    },

    firstVisit: {
      type: Date,
      default: Date.now
    },

    lastVisit: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

visitorSchema.index({ sessionId: 1 });
visitorSchema.index({ country: 1 });
visitorSchema.index({ state: 1 });
visitorSchema.index({ device: 1 });
visitorSchema.index({ lastVisit: -1 });

module.exports = mongoose.model("Visitor", visitorSchema);
