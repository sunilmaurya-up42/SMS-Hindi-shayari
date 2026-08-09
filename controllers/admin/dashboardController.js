const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const Image = require("../../models/Image");
const Visitor = require("../../models/Visitor");

exports.dashboard = async (req, res, next) => {
    try {

        const [
            totalShayari,
            totalUsers,
            totalComments,
            totalImages,
            latestShayari,
            latestUsers,
            categoryStats,
            visitorStats
        ] = await Promise.all([

            Shayari.countDocuments(),

            User.countDocuments(),

            Comment.countDocuments(),

            Image.countDocuments(),

            Shayari.find()
                .select("title slug createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(10)
                .lean(),

            User.find()
                .select("name email createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(10)
                .lean(),

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
                        as: "shayari"
                    }
                },
                {
                    $project: {
                        name: 1,
                        count: {
                            $size: "$shayari"
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
            ]),

            Visitor.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
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
                },
                {
                    $limit: 30
                }
            ])
        ]);

        const trafficChartData = {
            labels: visitorStats.map(item => item._id),

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

        const categoryChartData = {
            labels: categoryStats.map(
                item => item.name
            ),

            datasets: [
                {
                    label: "Shayari",
                    data: categoryStats.map(
                        item => item.count
                    )
                }
            ]
        };

        return res.render(
            "admin/dashboard",
            {
                title: "Admin Dashboard - SMS Hindi Shayari",

                activePage: "dashboard",

                user: req.user,

                stats: {
                    shayari: totalShayari,
                    users: totalUsers,
                    comments: totalComments,
                    images: totalImages
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
            }
        );

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

        next(error);
    }
};
