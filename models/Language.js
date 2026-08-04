const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 10,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    nativeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    flag: {
  type: String,
  default: "",
  trim: true
},

    direction: {
      type: String,
      enum: ["ltr", "rtl"],
      default: "ltr"
    },

    fontFamily: {
  type: String,
  default: "Noto Sans",
  trim: true
},

    sortOrder: {
  type: Number,
  default: 0,
  min: 0
},

    totalShayari: {
  type: Number,
  default: 0,
  min: 0
},

    totalCategories: {
      type: Number,
      default: 0
    },

    isDefault: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

languageSchema.index({
  isActive: 1,
  sortOrder: 1
});

module.exports = mongoose.model("Language", languageSchema);
