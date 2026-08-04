const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    avatar: {
    type: String,
    default: "",
    trim: true
    },

    role: {
      type: String,
      enum: ["super_admin", "admin"],
      default: "super_admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
    type: Date,
    default: null
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    passwordChangedAt: {
    type: Date,
    default: null
   },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Hash Password
 */
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Compare Password
 */
adminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Update Login
 */
adminSchema.methods.updateLogin = async function () {
  this.lastLogin = new Date();
  this.loginCount += 1;
  await this.save();
};

module.exports = mongoose.model("Admin", adminSchema);
