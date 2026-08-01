const Setting = require("../models/Setting");

module.exports = async (req, res, next) => {

    try {

        // Skip Health Check
        if (
            req.originalUrl === "/health" ||
            req.originalUrl === "/api/health"
        ) {
            return next();
        }

        // Admin Login Accessible
        if (
            req.originalUrl.startsWith("/api/auth/login")
        ) {
            return next();
        }

        const settings = await Setting.findOne();

        if (!settings || !settings.maintenanceMode) {
            return next();
        }

        // Admin Bypass
        if (
            req.user &&
            (
                req.user.role === "admin" ||
                req.user.role === "super-admin"
            )
        ) {
            return next();
        }

        // IP Whitelist
        const whitelist = settings.whitelistIPs || [];

        if (whitelist.includes(req.ip)) {
            return next();
        }

        const response = {

            success: false,

            maintenance: true,

            title: "Website Under Maintenance",

            message:
                settings.maintenanceMessage ||
                "Website is temporarily unavailable. Please try again later.",

            estimatedTime:
                settings.maintenanceEnd || null

        };

        // API Response
        if (req.originalUrl.startsWith("/api")) {

            return res.status(503).json(response);

        }

        // HTML Response
        if (req.accepts("html")) {

            return res.status(503).render(
                "maintenance",
                response
            );

        }

        // Plain Text
        return res
            .status(503)
            .type("text")
            .send(response.message);

    } catch (error) {

        console.error(error);

        return next();

    }

};
