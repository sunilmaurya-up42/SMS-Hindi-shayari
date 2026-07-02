/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * User Model
 * -------------------------------------------------------
 */

"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        username: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            index: true
        },

        avatar: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "",
            maxlength: 300
        },

        language: {
            type: String,
            default: "Hindi"
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        },

        favoriteCount: {
            type: Number,
            default: 0
        },

        imageDownloadCount: {
            type: Number,
            default: 0
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/* ==============================
   Indexes
============================== */

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

/* ==============================
   Password Hash
============================== */

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    next();

});

/* ==============================
   Compare Password
============================== */

userSchema.methods.comparePassword = async function (password) {

    return bcrypt.compare(password, this.password);

};

/* ==============================
   Public Profile
============================== */

userSchema.methods.toJSON = function () {

    const user = this.toObject();

    delete user.password;

    return user;

};

module.exports = mongoose.model("User", userSchema);
