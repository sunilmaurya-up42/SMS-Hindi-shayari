const jwt = require("jsonwebtoken");
const User = require("../../models/User");

/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || "7d"
        }
    );
};

/*
|--------------------------------------------------------------------------
| Register User
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

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        if (
            confirmPassword !== undefined &&
            password !== confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "user"
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

/*
|--------------------------------------------------------------------------
| User Login
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
                message: "Email and password are required."
            });
        }

        const user =
            await User.findOne({
                email: email.trim().toLowerCase()
            }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive."
            });
        }

        const matched =
            await user.comparePassword(password);

        if (!matched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user);

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
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
            await User.findById(req.user.id);

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

        console.error("Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
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
        message: "Forgot password feature is not implemented yet."
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
        message: "Reset password feature is not implemented yet."
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
        message: "Refresh token feature is not implemented yet."
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
        message: "Change password feature is not implemented yet."
    });
};
