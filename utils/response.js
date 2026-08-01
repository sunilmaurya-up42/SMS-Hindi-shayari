/**
 * Success Response
 */
exports.success = (
    res,
    data = null,
    message = "Success",
    status = 200
) => {

    return res.status(status).json({

        success: true,

        message,

        data

    });

};

/**
 * Created Response
 */
exports.created = (
    res,
    data = null,
    message = "Created Successfully"
) => {

    return res.status(201).json({

        success: true,

        message,

        data

    });

};

/**
 * Error Response
 */
exports.error = (
    res,
    message = "Internal Server Error",
    status = 500,
    errors = null
) => {

    return res.status(status).json({

        success: false,

        message,

        errors

    });

};

/**
 * Validation Error
 */
exports.validation = (
    res,
    errors = []
) => {

    return res.status(422).json({

        success: false,

        message: "Validation Failed",

        errors

    });

};

/**
 * Unauthorized
 */
exports.unauthorized = (
    res,
    message = "Unauthorized"
) => {

    return res.status(401).json({

        success: false,

        message

    });

};

/**
 * Forbidden
 */
exports.forbidden = (
    res,
    message = "Forbidden"
) => {

    return res.status(403).json({

        success: false,

        message

    });

};

/**
 * Not Found
 */
exports.notFound = (
    res,
    message = "Resource Not Found"
) => {

    return res.status(404).json({

        success: false,

        message

    });

};

/**
 * Bad Request
 */
exports.badRequest = (
    res,
    message = "Bad Request"
) => {

    return res.status(400).json({

        success: false,

        message

    });

};

/**
 * No Content
 */
exports.noContent = (res) => {

    return res.status(204).send();

};

/**
 * Pagination Response
 */
exports.paginated = (
    res,
    data,
    pagination,
    message = "Success"
) => {

    return res.status(200).json({

        success: true,

        message,

        pagination,

        data

    });

};

/**
 * Custom Response
 */
exports.custom = (
    res,
    status,
    payload
) => {

    return res.status(status).json(payload);

};
