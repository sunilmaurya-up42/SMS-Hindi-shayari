const Visitor = require("../../models/Visitor");
const Shayari = require("../../models/Shayari");
const Category = require("../../models/Category");
const Download = require("../../models/Download");

/**
 * Dashboard Overview
 */
exports.dashboard = async (req, res) => {
    try {

        
        const [
            totalVisitors,
            totalDownloads,
            totalShayari,
            totalCategories
        ] = await Promise.all([
            Visitor.countDocuments(),
            Download.countDocuments(),
            Shayari.countDocuments({ published: true }),
            Category.countDocuments({ isActive: true })
        ]);

        res.json({
            success: true,
            data: {
                totalVisitors,
                totalDownloads,
                totalShayari,
                totalCategories
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

/**
 * Daily Visitors
 */
exports.dailyVisitors = async (req, res) => {

    const data = await Visitor.aggregate([
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
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Monthly Visitors
 */
exports.monthlyVisitors = async (req, res) => {

    const data = await Visitor.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m",
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
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Top Shayari
 */
exports.topShayari = async (req, res) => {

    const data = await Shayari.find()
        .sort({
            views: -1
        })
        .limit(10)
        .select("title slug views downloads shares copies");

    res.json({
        success: true,
        data
    });

};

/**
 * Top Categories
 */
exports.topCategories = async (req, res) => {

    const data = await Category.find()
        .sort({
            totalShayari: -1
        })
        .limit(10);

    res.json({
        success: true,
        data
    });

};

/**
 * Download Report
 */
exports.downloadReport = async (req, res) => {

    const total = await Download.countDocuments();

    const image = await Download.countDocuments({
        downloadType: "image"
    });

    const text = await Download.countDocuments({
        downloadType: "text"
    });

    res.json({
        success: true,
        total,
        image,
        text
    });

};

/**
 * Device Statistics
 */
exports.deviceStatistics = async (req, res) => {

    const data = await Visitor.aggregate([
        {
            $group: {
                _id: "$device",
                total: {
                    $sum: 1
                }
            }
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Browser Statistics
 */
exports.browserStatistics = async (req, res) => {

    const data = await Visitor.aggregate([
        {
            $group: {
                _id: "$browser",
                total: {
                    $sum: 1
                }
            }
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Country Statistics
 */
exports.countryStatistics = async (req, res) => {

    const data = await Visitor.aggregate([
        {
            $group: {
                _id: "$country",
                total: {
                    $sum: 1
                }
            }
        }
    ]);

    res.json({
        success: true,
        data
    });

};

/**
 * Dashboard Graph API
 */
exports.graph = async (req, res) => {

    const visitors = await Visitor.countDocuments();

    const downloads = await Download.countDocuments();

    const shayari = await Shayari.countDocuments({
        published: true
    });

    res.json({
        success: true,
        graph: {
            visitors,
            downloads,
            shayari
        }
    });

};
