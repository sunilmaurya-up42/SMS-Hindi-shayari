import mongoose from "mongoose";
import ROLES from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    profilePhoto: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: true
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shayari"
      }
    ],

    lastLogin: Date
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
