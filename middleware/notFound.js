/**
 * ==========================================================
 * SMS Hindi Shayari
 * middleware/notFound.js
 * ==========================================================
 */

module.exports = (req, res, next) => {

    const response = {
        success: false,
        status: 404,
        error: "Not Found",
        message: `Route '${req.originalUrl}' does not exist.`,
        method: req.method,
        timestamp: new Date().toISOString()
    };

    console.warn(
        `[404] ${req.method} ${req.originalUrl} | ${req.ip}`
    );

    // API requests → JSON
    if (
        req.originalUrl.startsWith("/api/") ||
        req.accepts("json") && !req.accepts("html")
    ) {
        return res.status(404).json(response);
    }

    // Normal website request → 404 page
    return res.status(404).render("errors/404", {
        title: "404 - Page Not Found",

        error: response,

        // 404.ejs में इस्तेमाल होने वाले variables
        popularCategories: [],
        categories: [],
        latestShayari: [],
        popularShayari: []
    });

};
