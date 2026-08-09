/*
|--------------------------------------------------------------------------
| Admin Authorization Middleware
|--------------------------------------------------------------------------
| Checks whether the authenticated user has admin privileges.
|--------------------------------------------------------------------------
*/

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

            /*
            |--------------------------------------------------------------------------
            | Super Admin
            |--------------------------------------------------------------------------
            */

            if (userRole === "super_admin") {
                return next();
            }

            /*
            |--------------------------------------------------------------------------
            | Admin
            |--------------------------------------------------------------------------
            */

            if (userRole === "admin") {

                if (!options.roles) {
                    return next();
                }

                if (options.roles.includes("admin")) {
                    return next();
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Custom Roles
            |--------------------------------------------------------------------------
            */

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

            console.error(
                "Admin Authorization Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Authorization failed."
            });

        }

    };

};


/*
|--------------------------------------------------------------------------
| Super Admin Middleware
|--------------------------------------------------------------------------
*/

module.exports.superAdmin = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    if (req.user.role !== "super_admin") {

        return res.status(403).json({
            success: false,
            message: "Super Admin access required."
        });

    }

    next();

};


/*
|--------------------------------------------------------------------------
| Permission Middleware
|--------------------------------------------------------------------------
*/

module.exports.permission = (...permissions) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }

        /*
        |--------------------------------------------------------------------------
        | Super Admin has all permissions
        |--------------------------------------------------------------------------
        */

        if (req.user.role === "super_admin") {
            return next();
        }

        const userPermissions =
            req.user.permissions || [];

        const allowed =
            permissions.every(
                permission =>
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


/*
|--------------------------------------------------------------------------
| Standard Permissions
|--------------------------------------------------------------------------
*/

module.exports.canRead =
    module.exports.permission("read");

module.exports.canWrite =
    module.exports.permission("write");

module.exports.canDelete =
    module.exports.permission("delete");

module.exports.manageSettings =
    module.exports.permission("settings");
