/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Passport Configuration
 * -------------------------------------------------------
 */

"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");

/* ==========================================
   Local Strategy
========================================== */

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: true
        },
        async (email, password, done) => {

            try {

                const user = await User.findOne({
                    email: email.toLowerCase().trim(),
                    isActive: true
                });

                if (!user) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                const matched = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!matched) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                await User.findByIdAndUpdate(user._id, {
                    lastLogin: new Date()
                });

                return done(null, user);

            } catch (error) {

                return done(error);

            }

        }
    )
);

/* ==========================================
   Serialize User
========================================== */

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

/* ==========================================
   Deserialize User
========================================== */

passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id)
            .select("-password");

        done(null, user);

    } catch (error) {

        done(error);

    }

});

/* ==========================================
   Export
========================================== */

module.exports = passport;
