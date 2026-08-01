const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
const Log = require("../../models/Log");

/**
 * Generate JWT Token
 */
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d"
    }
  );
};

/**
 * Admin Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required."
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const matched = await admin.comparePassword(password);

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    await admin.updateLogin();

    const token = generateToken(admin);

    await Log.create({
      level: "info",
      module: "Authentication",
      action: "Login",
      message: "Admin logged in successfully.",
      admin: admin._id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/**
 * Admin Profile
 */
exports.profile = async (req, res) => {

    const admin = await Admin.findById(req.user.id);

    res.json({
        success:true,
        admin
    });

};

/**
 * Logout
 */
exports.logout = async (req,res)=>{

    res.json({
        success:true,
        message:"Logout Successful"
    });

};
