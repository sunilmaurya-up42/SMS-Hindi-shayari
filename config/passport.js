/**
 * ==========================================================
 * SMS Hindi Shayari
 * Passport Configuration
 * ==========================================================
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/*
|--------------------------------------------------------------------------
| USER LOCAL LOGIN
|--------------------------------------------------------------------------
*/

passport.use(
    "user-local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },

        async (email, password, done) => {

            try {

                const user = await User.findOne({
                    email: email.toLowerCase()
                }).select("+password");

                if (!user) {

                    return done(null, false, {
                        message: "Invalid email or password."
                    });

                }

                if (!user.isActive) {

                    return done(null, false, {
                        message: "Your account is inactive."
                    });

                }

                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!isMatch) {

                    return done(null, false, {
                        message: "Invalid email or password."
                    });

                }

                return done(null, user);

            } catch (error) {

                return done(error);

            }

        }
    )
);


/*
|--------------------------------------------------------------------------
| SERIALIZE USER
|--------------------------------------------------------------------------
*/

passport.serializeUser((user, done) => {

    done(null, {
        id: user.id,
        type: user.role === "admin" ||
              user.role === "super-admin"
            ? "admin"
            : "user"
    });

});


/*
|--------------------------------------------------------------------------
| DESERIALIZE USER
|--------------------------------------------------------------------------
*/

passport.deserializeUser(async (data, done) => {

    try {

        if (!data || !data.id) {

            return done(null, false);

        }

        if (data.type === "admin") {

            const Admin =
                require("../models/Admin");

            const admin =
                await Admin.findById(data.id)
                    .select("-password");

            return done(null, admin);

        }

        const user =
            await User.findById(data.id)
                .select("-password");

        return done(null, user);

    } catch (error) {

        return done(error);

    }

});


module.exports = passport;
