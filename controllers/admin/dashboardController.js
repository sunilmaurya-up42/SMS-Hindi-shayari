const Admin = require("../../models/Admin");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Background = require("../../models/Background");
const Download = require("../../models/Download");
const Visitor = require("../../models/Visitor");
const Contact = require("../../models/Contact");

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
| Optimized dashboard:
| - Heavy historical Visitor aggregation removed
| - Dashboard queries run in parallel
| - Only required records are loaded
|--------------------------------------------------------------------------
*/

exports.dashboard = async (req, res) => {
    try {

        const [
            shayariCount,
            userCount,
            commentCount,
            backgroundCount,
            downloadCount,
            visitorCount,
            contactCount,
            latestShayari,
            latestUsers,
            latestComments,
            latestContacts,
            categories
        ] = await Promise.all([

            // Shayari count
            Shayari.countDocuments(),

            // Admin/User count
            Admin.countDocuments(),

            // Comments count
            Comment.countDocuments(),

            // Background count
            Background.countDocuments(),

            // Downloads count
            Download.countDocuments(),

            // Total visitors
            Visitor.countDocuments(),

            // Contact messages
            Contact.countDocuments(),

            // Latest Shayari
            Shayari.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Latest Admin/User records
            Admin.find()
                .select("name email role isActive createdAt lastLogin")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Latest comments
            Comment.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Latest contacts
            Contact.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Category counts
            Category.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $lookup: {
                        from: "shayaris",
                        localField: "_id",
                        foreignField: "category",
                        as: "shayaris"
                    }
                },
                {
                    $project: {
                        name: 1,
                        count: {
                            $size: "$shayaris"
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $limit: 10
                }
            ])

        ]);

        /*
        |--------------------------------------------------------------------------
        | Dashboard Statistics
        |--------------------------------------------------------------------------
        */

        const stats = {
            shayari: shayariCount,
            users: userCount,
            comments: commentCount,
            images: backgroundCount,
            downloads: downloadCount,
            visitors: visitorCount,
            contacts: contactCount
        };

        /*
        |--------------------------------------------------------------------------
        | Render Dashboard
        |--------------------------------------------------------------------------
        */

        return res.render("admin/dashboard", {

            title: "Admin Dashboard - SMS Hindi Shayari",

            activePage: "dashboard",

            admin: req.user,

            stats,

            latestShayari,

            latestUsers,

            latestComments,

            latestContacts,

            categories,

            visitorChart: [],

            downloadChart: [],

            categoryChart: categories

        });

    } catch (error) {

        console.error("==========================================");
        console.error("❌ ADMIN DASHBOARD ERROR");
        console.error(error);
        console.error("==========================================");

        return res.status(500).render("admin/dashboard", {

            title: "Admin Dashboard - SMS Hindi Shayari",

            activePage: "dashboard",

            admin: req.user,

            stats: {
                shayari: 0,
                users: 0,
                comments: 0,
                images: 0,
                downloads: 0,
                visitors: 0,
                contacts: 0
            },

            latestShayari: [],
            latestUsers: [],
            latestComments: [],
            latestContacts: [],
            categories: [],

            visitorChart: [],
            downloadChart: [],
            categoryChart: [],

            error_msg: "Dashboard data load nahi ho saka."
        });

    }
};
