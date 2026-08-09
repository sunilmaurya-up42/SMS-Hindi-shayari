const mongoose = require("mongoose");

const BaseSchema = {
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },

  publishedAt: {
    type: Date,
    default: Date.now,
  }
};

module.exports = BaseSchema;
