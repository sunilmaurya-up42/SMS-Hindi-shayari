const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
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
        "contact",
        "feedback",
        "support",
        "bug",
        "business",
        "other"
      ],
      default: "contact",
      index: true
    },

    status: {
      type: String,
      enum: [
        "new",
        "in_progress",
        "resolved",
        "closed"
      ],
      default: "new",
      index: true
    },

    adminReply: {
  type: String,
  default: "",
  trim: true
},

    repliedAt: {
      type: Date,
      default: null
    },

    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
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

    isRead: {
  type: Boolean,
  default: false,
  index: true
}
  },
  {
    timestamps: true,
    versionKey: false
  }
);

contactSchema.index({
  status: 1,
  createdAt: -1
});

module.exports = mongoose.model("Contact", contactSchema);
