const User = require("../../models/User");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Image = require("../../models/Image");
const Visitor = require("../../models/Visitor");

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
| Fast and safe dashboard queries.
|--------------------------------------------------------------------------
*/

exports.dashboard = async (req, res, next) => {
    const startedAt = Date.now();

    try {

        console.log("📊 Admin Dashboard: START");

        /*
        |--------------------------------------------------------------------------
        | Basic Statistics
        |--------------------------------------------------------------------------
        */

        const [
            totalShayari,
            totalUsers,
            totalComments,
            totalImages
        ] = await Promise.all([

            Shayari.countDocuments({})
                .maxTimeMS(5000),

            User.countDocuments({})
                .maxTimeMS(5000),

            Comment.countDocuments({})
                .maxTimeMS(5000),

            Image.countDocuments({})
                .maxTimeMS(5000)

        ]);

        console.log(
            `📊 Dashboard stats loaded in ${Date.now() - startedAt}ms`
        );

        /*
        |--------------------------------------------------------------------------
        | Latest Shayari
        |--------------------------------------------------------------------------
        */

        const latestShayari = await Shayari.find({})
            .select("_id title slug createdAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .maxTimeMS(5000);

        /*
        |--------------------------------------------------------------------------
        | Latest Users
        |--------------------------------------------------------------------------
        */

        const latestUsers = await User.find({})
            .select("_id name email createdAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .maxTimeMS(5000);

        /*
        |--------------------------------------------------------------------------
        | Category Statistics
        |--------------------------------------------------------------------------
        |
        | Category model already contains totalShayari.
        | इसलिए हर request पर Shayari collection का भारी $lookup नहीं होगा।
        |
        |--------------------------------------------------------------------------
        */

        const categories = await Category.find({
            isActive: true
        })
            .select("name totalShayari")
            .sort({
                totalShayari: -1,
                sortOrder: 1
            })
            .limit(10)
            .lean()
            .maxTimeMS(5000);

        /*
        |--------------------------------------------------------------------------
        | Visitor Statistics - Last 30 Days Only
        |--------------------------------------------------------------------------
        |
        | पहले पूरा Visitor collection scan हो रहा था।
        |
        | अब lastVisit index का उपयोग होगा।
        |
        |--------------------------------------------------------------------------
        */

        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 29
        );

        thirtyDaysAgo.setHours(
            0,
            0,
            0,
            0
        );

        console.log(
            "📊 Loading visitor statistics from:",
            thirtyDaysAgo.toISOString()
        );

        const visitorStats = await Visitor.aggregate([

            {
                $match: {
                    lastVisit: {
                        $gte: thirtyDaysAgo
                    }
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$lastVisit"
                        }
                    },

                    visitors: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]).option({
            maxTimeMS: 5000
        });

        console.log(
            `📊 Visitor statistics loaded in ${Date.now() - startedAt}ms`
        );

        /*
        |--------------------------------------------------------------------------
        | Traffic Chart
        |--------------------------------------------------------------------------
        */

        const trafficChartData = {
            labels: visitorStats.map(
                item => item._id
            ),

            datasets: [
                {
                    label: "Visitors",

                    data: visitorStats.map(
                        item => item.visitors
                    ),

                    tension: 0.3,

                    fill: false
                }
            ]
        };

        /*
        |--------------------------------------------------------------------------
        | Category Chart
        |--------------------------------------------------------------------------
        */

        const categoryChartData = {
            labels: categories.map(
                item => item.name
            ),

            datasets: [
                {
                    label: "Shayari",

                    data: categories.map(
                        item =>
                            Number(
                                item.totalShayari || 0
                            )
                    )
                }
            ]
        };

        /*
        |--------------------------------------------------------------------------
        | Render Dashboard
        |--------------------------------------------------------------------------
        */

        const dashboardData = {

            title:
                "Admin Dashboard - SMS Hindi Shayari",

            activePage:
                "dashboard",

            user:
                req.user,

            stats: {

                shayari:
                    totalShayari,

                users:
                    totalUsers,

                comments:
                    totalComments,

                images:
                    totalImages

            },

            latestShayari,

            latestUsers,

            trafficChartData:
                JSON.stringify(
                    trafficChartData
                ),

            categoryChartData:
                JSON.stringify(
                    categoryChartData
                )

        };

        console.log(
            `✅ Admin Dashboard ready in ${Date.now() - startedAt}ms`
        );

        return res.render(
    "admin/dashboard",
    {
        ...dashboardData,

        layout: "layouts/admin",

        activeMenu: "dashboard"
    }
);

    } catch (error) {

        console.error(
            "❌ Admin Dashboard Error:"
        );

        console.error(
            error
        );

        return next(error);
    }
};
