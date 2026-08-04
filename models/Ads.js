const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    provider: {
      type: String,
      enum: [
        "adsense",
        "adsterra",
        "custom",
        "other"
      ],
      default: "adsense",
      index: true
    },

    adType: {
      type: String,
      enum: [
        "header",
        "footer",
        "sidebar",
        "between_shayari",
        "before_content",
        "after_content",
        "popup",
        "sticky"
      ],
      required: true,
      index: true
    },

    adSlot: {
  type: String,
  default: ""
},

    adClient: {
  type: String,
  default: "",
  trim: true
},

    code: {
      type: String,
      default: ""
    },

    displayOrder: {
      type: Number,
      default: 0
    },

    page: {
      type: String,
      enum: [
        "all",
        "home",
        "category",
        "shayari",
        "search",
        "contact"
      ],
      default: "all",
      index: true
    },

    device: {
  type: String,
  enum: [
    "all",
    "mobile",
    "tablet",
    "desktop"
  ],
  default: "all",
  index: true
},

    startDate: {
      type: Date,
      default: null
    },

    endDate: {
      type: Date,
      default: null
    },

    impressions: {
  type: Number,
  default: 0,
  min: 0
},
    clicks: {
      type: Number,
      default: 0
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

adsSchema.index({
  page: 1,
  adType: 1,
  isActive: 1
});

module.exports = mongoose.model("Ads", adsSchema);
