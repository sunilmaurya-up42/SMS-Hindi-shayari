/**
 * ==========================================================
 * SMS Hindi Shayari
 * Passport Configuration
 * ==========================================================
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email"
        },
        async (email, password, done) => {

            try {

                const admin = await Admin.findOne({
                    email: email.toLowerCase()
                });

                if (!admin) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    admin.password
                );

                if (!isMatch) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                return done(null, admin);

            } catch (err) {

                return done(err);

            }

        }
    )
);

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {

    try {

        const admin = await Admin.findById(id).select("-password");

        done(null, admin);

    } catch (err) {

        done(err);

    }

});

module.exports = passport;
