const Admin = require("../../models/Admin");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Background = require("../../models/Background");
const Download = require("../../models/Download");
const Contact = require("../../models/Contact");
const Visitor = require("../../models/Visitor");

exports.dashboard = async (req, res) => {
  try {

    const [
      totalAdmins,
      totalShayari,
      totalCategories,
      totalComments,
      totalBackgrounds,
      totalDownloads,
      totalVisitors,
      totalContacts
    ] = await Promise.all([

      Admin.countDocuments({ isActive: true }),

      Shayari.countDocuments({
        published: true
      }),

      Category.countDocuments({
        isActive: true
      }),

      Comment.countDocuments({
        isApproved: true
      }),

      Background.countDocuments({
        isActive: true
      }),

      Download.countDocuments(),

      Visitor.countDocuments(),

      Contact.countDocuments()

    ]);

    const latestComments = await Comment.find()
      .populate("shayari", "title slug")
      .sort({ createdAt: -1 })
      .limit(10);

    const latestContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const latestShayari = await Shayari.find()
      .select("title slug createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      success: true,

      statistics: {
        totalAdmins,
        totalShayari,
        totalCategories,
        totalComments,
        totalBackgrounds,
        totalDownloads,
        totalVisitors,
        totalContacts
      },

      latestShayari,
      latestComments,
      latestContacts

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};
