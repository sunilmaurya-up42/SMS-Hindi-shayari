const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Log = require("../../models/Log");

/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

const generateToken = (user, type = "user") => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            type
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES || "7d"
        }
    );

};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
| User login:
| /auth/login
|--------------------------------------------------------------------------
*/

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and Password are required."
            });

        }

        const user =
            await User.findOne({
                email:
                    email.toLowerCase()
            }).select("+password");

        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });

        }

        if (!user.isActive) {

            return res.status(403).json({
                success: false,
                message:
                    "Your account is inactive."
            });

        }

        const matched =
            await user.comparePassword(password);

        if (!matched) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });

        }

        user.lastLogin = new Date();

        await user.save();

        const token =
            generateToken(user, "user");

        /*
        |--------------------------------------------------------------------------
        | Set Cookie
        |--------------------------------------------------------------------------
        */

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge:
                    1000 * 60 * 60 * 24 * 7
            }
        );

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {

        console.error(
            "User Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Admin Login
|--------------------------------------------------------------------------
| Separate function for Admin Dashboard
|--------------------------------------------------------------------------
*/

exports.adminLogin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and Password are required."
            });

        }

        const admin =
            await Admin.findOne({
                email:
                    email.toLowerCase()
            }).select("+password");

        if (!admin) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin email or password."
            });

        }

        const matched =
            await admin.comparePassword(password);

        if (!matched) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin email or password."
            });

        }

        await admin.updateLogin();

        const token =
            generateToken(
                admin,
                "admin"
            );

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge:
                    1000 * 60 * 60 * 24 * 7
            }
        );

        if (Log) {

            await Log.create({
                level: "info",
                module: "Authentication",
                action: "Admin Login",
                message:
                    "Admin logged in successfully.",
                admin: admin._id,
                ipAddress: req.ip,
                userAgent:
                    req.headers["user-agent"]
            });

        }

        return res.json({
            success: true,
            message:
                "Admin login successful.",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

exports.profile = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.id
            ).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

exports.logout = async (req, res) => {

    res.clearCookie("token");

    return res.json({
        success: true,
        message: "Logout successful."
    });

};


/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

exports.forgotPassword = async (req, res) => {

    return res.status(501).json({
        success: false,
        message:
            "Forgot password feature is not implemented yet."
    });

};


/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

exports.resetPassword = async (req, res) => {

    return res.status(501).json({
        success: false,
        message:
            "Reset password feature is not implemented yet."
    });

};


/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

exports.refreshToken = async (req, res) => {

    return res.status(501).json({
        success: false,
        message:
            "Refresh token feature is not implemented yet."
    });

};


/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

exports.changePassword = async (req, res) => {

    return res.status(501).json({
        success: false,
        message:
            "Change password feature is not implemented yet."
    });

};
/*
|--------------------------------------------------------------------------
| USER REGISTRATION
|--------------------------------------------------------------------------
*/

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password,
            avatar: req.file?.filename || ""
        });

        const token = generateToken(user, "user");

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {

        console.error("Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });

    }

};
