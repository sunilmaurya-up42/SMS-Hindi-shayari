const Visitor = require("../../models/Visitor");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Download = require("../../models/Download");

/**
 * Dashboard Statistics
 */
exports.dashboard = async () => {

    const [
        totalVisitors,
        totalShayari,
        totalCategories,
        totalDownloads
    ] = await Promise.all([
        Visitor.countDocuments(),
        Shayari.countDocuments(),
        Category.countDocuments(),
        Download.countDocuments()
    ]);

    return {
        totalVisitors,
        totalShayari,
        totalCategories,
        totalDownloads
    };

};

/**
 * Top Shayari
 */
exports.topShayari = async (limit = 10) => {

    return Shayari.find()
        .sort({ views: -1 })
        .limit(limit)
        .populate("category");

};

/**
 * Top Categories
 */
exports.topCategories = async (limit = 10) => {

    return Category.find()
        .sort({ totalViews: -1 })
        .limit(limit);

};

/**
 * Monthly Visitors
 */
exports.monthlyVisitors = async () => {

    return Visitor.aggregate([

        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt"
                    },
                    month: {
                        $month: "$createdAt"
                    }
                },
                total: {
                    $sum: 1
                }
            }
        },

        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }

    ]);

};

/**
 * Device Statistics
 */
exports.deviceStats = async () => {

    return Visitor.aggregate([

        {
            $group: {
                _id: "$device",
                total: {
                    $sum: 1
                }
            }
        }

    ]);

};

/**
 * Browser Statistics
 */
exports.browserStats = async () => {

    return Visitor.aggregate([

        {
            $group: {
                _id: "$browser",
                total: {
                    $sum: 1
                }
            }
        }

    ]);

};

/**
 * Country Statistics
 */
exports.countryStats = async () => {

    return Visitor.aggregate([

        {
            $group: {
                _id: "$country",
                total: {
                    $sum: 1
                }
            }
        }

    ]);

};

/**
 * Download Report
 */
exports.downloadReport = async () => {

    return Download.aggregate([

        {
            $group: {
                _id: "$createdAt",
                total: {
                    $sum: 1
                }
            }
        }

    ]);

};

/**
 * Search Report
 */
exports.searchReport = async () => {

    return Visitor.aggregate([

        {
            $match: {
                endpoint: {
                    $regex: "/search"
                }
            }
        },

        {
            $group: {
                _id: "$endpoint",
                total: {
                    $sum: 1
                }
            }
        }

    ]);

};

/**
 * Active Visitors
 */
exports.activeVisitors = async () => {

    const last5Minutes = new Date(
        Date.now() - 5 * 60 * 1000
    );

    return Visitor.countDocuments({

        lastVisit: {
            $gte: last5Minutes
        }

    });

};

/**
 * Dashboard Summary
 */
exports.summary = async () => {

    return {

        dashboard:
            await exports.dashboard(),

        activeVisitors:
            await exports.activeVisitors(),

        topShayari:
            await exports.topShayari(5),

        topCategories:
            await exports.topCategories(5)

    };

};
