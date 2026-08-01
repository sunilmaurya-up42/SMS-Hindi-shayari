const Visitor = require("../models/Visitor");
const crypto = require("crypto");

module.exports = async (req, res, next) => {

    try {

        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress ||
            req.ip;

        const userAgent = req.headers["user-agent"] || "";

        let visitorId = req.cookies?.visitorId;

        if (!visitorId) {

            visitorId = crypto.randomUUID();

            res.cookie("visitorId", visitorId, {

                httpOnly: true,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 365

            });

        }

        req.visitor = {

            visitorId,
            ip,
            userAgent

        };

        const exists = await Visitor.findOne({

            visitorId,

            ipAddress: ip

        });

        if (!exists) {

            await Visitor.create({

                visitorId,

                ipAddress: ip,

                userAgent,

                browser: getBrowser(userAgent),

                os: getOS(userAgent),

                device: getDevice(userAgent),

                isBot: isBot(userAgent),

                country: "Unknown",

                state: "Unknown",

                city: "Unknown",

                lastVisit: new Date()

            });

        } else {

            exists.lastVisit = new Date();

            exists.visitCount = (exists.visitCount || 0) + 1;

            await exists.save();

        }

        next();

    } catch (error) {

        console.error(error);

        next();

    }

};

/**
 * Browser Detection
 */
function getBrowser(ua) {

    if (/Chrome/i.test(ua)) return "Chrome";

    if (/Firefox/i.test(ua)) return "Firefox";

    if (/Safari/i.test(ua)) return "Safari";

    if (/Edge/i.test(ua)) return "Edge";

    return "Unknown";

}

/**
 * Operating System
 */
function getOS(ua) {

    if (/Android/i.test(ua)) return "Android";

    if (/iPhone|iPad/i.test(ua)) return "iOS";

    if (/Windows/i.test(ua)) return "Windows";

    if (/Linux/i.test(ua)) return "Linux";

    if (/Mac/i.test(ua)) return "MacOS";

    return "Unknown";

}

/**
 * Device Detection
 */
function getDevice(ua) {

    if (/Mobile/i.test(ua)) return "Mobile";

    if (/Tablet|iPad/i.test(ua)) return "Tablet";

    return "Desktop";

}

/**
 * Bot Detection
 */
function isBot(ua) {

    return /bot|crawl|spider|slurp|facebook|whatsapp|telegram/i.test(ua);

}

/**
 * Get Unique Visitors
 */
module.exports.uniqueVisitors = async () => {

    return await Visitor.distinct("visitorId");

};

/**
 * Returning Visitors
 */
module.exports.returningVisitors = async () => {

    return await Visitor.countDocuments({

        visitCount: {

            $gt: 1

        }

    });

};

/**
 * Total Visitors
 */
module.exports.totalVisitors = async () => {

    return await Visitor.countDocuments();

};
