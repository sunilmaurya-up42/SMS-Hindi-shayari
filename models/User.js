const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        avatar: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        lastLogin: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    try {

        const salt = await bcrypt.genSalt(10);

        this.password =
            await bcrypt.hash(this.password, salt);

        next();

    } catch (error) {

        next(error);

    }

});

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword =
    async function (password) {

        return bcrypt.compare(
            password,
            this.password
        );

    };

module.exports =
    mongoose.model("User", userSchema);
