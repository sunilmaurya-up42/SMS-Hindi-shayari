const Visitor = require("../models/Visitor");

module.exports = async (req, res, next) => {

    const startTime = Date.now();

    res.on("finish", async () => {

        try {

            const responseTime = Date.now() - startTime;

            const ip =
                req.headers["x-forwarded-for"]?.split(",")[0] ||
                req.socket.remoteAddress ||
                req.ip;

            const userAgent = req.headers["user-agent"] || "";

            await Visitor.create({

                ipAddress: ip,

                method: req.method,

                endpoint: req.originalUrl,

                statusCode: res.statusCode,

                responseTime,

                browser: userAgent,

                device: req.headers["sec-ch-ua-mobile"] === "?1"
                    ? "Mobile"
                    : "Desktop",

                referer: req.headers.referer || "",

                language: req.headers["accept-language"] || "",

                createdAt: new Date()

            });

        } catch (error) {

            console.error("Analytics Error:", error.message);

        }

    });

    next();

};

/**
 * Ignore Routes
 */
module.exports.ignoreRoutes = [

    "/favicon.ico",

    "/robots.txt",

    "/ads.txt",

    "/health"

];

/**
 * Performance Logger
 */
module.exports.performance = (req, res, next) => {

    const start = process.hrtime();

    res.on("finish", () => {

        const diff = process.hrtime(start);

        const ms = diff[0] * 1000 + diff[1] / 1e6;

        console.log(
            `${req.method} ${req.originalUrl} - ${ms.toFixed(2)}ms`
        );

    });

    next();

};

/**
 * Active User Counter
 */
module.exports.activeUsers = async () => {

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    return await Visitor.countDocuments({

        createdAt: {

            $gte: fiveMinutesAgo

        }

    });

};

/**
 * Daily Visitors
 */
module.exports.todayVisitors = async () => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return await Visitor.countDocuments({

        createdAt: {

            $gte: today

        }

    });

};
