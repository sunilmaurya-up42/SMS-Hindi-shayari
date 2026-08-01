module.exports = (options = {}) => {

    return (req, res, next) => {

        try {

            if (!req.user) {

                return res.status(401).json({
                    success: false,
                    message: "Authentication required."
                });

            }

            const userRole = req.user.role;

            // Super Admin
            if (userRole === "super-admin") {
                return next();
            }

            // Admin
            if (userRole === "admin") {

                if (!options.roles) {
                    return next();
                }

                if (options.roles.includes(userRole)) {
                    return next();
                }

            }

            // Custom Roles
            if (
                options.roles &&
                options.roles.includes(userRole)
            ) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "Permission denied."
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Authorization failed."
            });

        }

    };

};

/**
 * Super Admin Middleware
 */
module.exports.superAdmin = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    if (req.user.role !== "super-admin") {

        return res.status(403).json({
            success: false,
            message: "Super Admin access required."
        });

    }

    next();

};

/**
 * Permission Middleware
 */
module.exports.permission = (...permissions) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false
            });

        }

        if (req.user.role === "super-admin") {
            return next();
        }

        const userPermissions = req.user.permissions || [];

        const allowed = permissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!allowed) {

            return res.status(403).json({
                success: false,
                message: "Permission denied."
            });

        }

        next();

    };

};

/**
 * Read Permission
 */
module.exports.canRead =
    module.exports.permission("read");

/**
 * Write Permission
 */
module.exports.canWrite =
    module.exports.permission("write");

/**
 * Delete Permission
 */
module.exports.canDelete =
    module.exports.permission("delete");

/**
 * Manage Settings Permission
 */
module.exports.manageSettings =
    module.exports.permission("settings");
