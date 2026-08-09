/**
 * Validate Page Number
 */
exports.page = (page = 1) => {

    page = parseInt(page, 10);

    return page > 0 ? page : 1;

};

/**
 * Validate Limit
 */
exports.limit = (limit = 20, max = 100) => {

    limit = parseInt(limit, 10);

    if (limit <= 0) return 20;

    return limit > max ? max : limit;

};

/**
 * Calculate Skip
 */
exports.skip = (page, limit) => {

    page = exports.page(page);

    limit = exports.limit(limit);

    return (page - 1) * limit;

};

/**
 * Total Pages
 */
exports.totalPages = (total, limit) => {

    return Math.max(1, Math.ceil(total / limit));

};

/**
 * Pagination Metadata
 */
exports.meta = ({
    total,
    page,
    limit
}) => {

    const pages = exports.totalPages(total, limit);

    return {

        total,

        page,

        limit,

        totalPages: pages,

        hasNext: page < pages,

        hasPrev: page > 1,

        nextPage: page < pages ? page + 1 : null,

        prevPage: page > 1 ? page - 1 : null

    };

};

/**
 * MongoDB Pagination Options
 */
exports.options = ({
    page = 1,
    limit = 20,
    sort = { createdAt: -1 }
} = {}) => {

    page = exports.page(page);

    limit = exports.limit(limit);

    return {

        skip: exports.skip(page, limit),

        limit,

        sort

    };

};

/**
 * Paginated Response
 */
exports.response = ({
    data,
    total,
    page,
    limit
}) => {

    return {

        success: true,

        pagination: exports.meta({
            total,
            page,
            limit
        }),

        data

    };

};

/**
 * Search Pagination
 */
exports.search = ({
    keyword = "",
    page = 1,
    limit = 20
}) => {

    return {

        keyword: keyword.trim(),

        ...exports.options({
            page,
            limit
        })

    };

};

/**
 * Sorting Helper
 */
exports.sort = (
    field = "createdAt",
    order = "desc"
) => {

    return {

        [field]: order === "asc" ? 1 : -1

    };

};

/**
 * Infinite Scroll Helper
 */
exports.infinite = ({
    page,
    limit,
    total
}) => {

    const pages = exports.totalPages(total, limit);

    return {

        page,

        limit,

        hasMore: page < pages

    };

};
