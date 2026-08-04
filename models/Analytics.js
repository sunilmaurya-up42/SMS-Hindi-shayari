const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },

    language: {
      type: String,
      default: "all",
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    },

    visitors: {
  type: Number,
  default: 0,
  min: 0
},
    uniqueVisitors: {
      type: Number,
      default: 0
    },

    pageViews: {
      type: Number,
      default: 0
    },

    shayariViews: {
      type: Number,
      default: 0
    },

    imageDownloads: {
      type: Number,
      default: 0
    },

    textCopies: {
      type: Number,
      default: 0
    },

    shares: {
      type: Number,
      default: 0
    },

    comments: {
      type: Number,
      default: 0
    },

    searches: {
      type: Number,
      default: 0
    },

    topSearchKeywords: {
      type: [String],
      default: []
    },

    topCountries: [
      {
        country: String,
        count: Number
      }
    ],

    topStates: [
      {
        state: String,
        count: Number
      }
    ],

    devices: {
      mobile: {
        type: Number,
        default: 0
      },
      tablet: {
        type: Number,
        default: 0
      },
      desktop: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

analyticsSchema.index({
  date: 1,
  language: 1
});

module.exports = mongoose.model("Analytics", analyticsSchema);
