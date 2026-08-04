const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const commentSchema = new mongoose.Schema(
  {
    shayari: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shayari",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    ipAddress: {
  type: String,
  default: "",
  trim: true
},

    userAgent: {
  type: String,
  default: "",
  trim: true
},

    likes: {
      type: Number,
      default: 0
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    isSpam: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    adminReply: replySchema
  },
  {
    timestamps: true,
    versionKey: false
  }
);

commentSchema.index({
  shayari: 1,
  createdAt: -1
});

module.exports = mongoose.model("Comment", commentSchema);
