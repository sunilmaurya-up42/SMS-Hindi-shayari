module.exports = (req, res) => {
    const response = {
        success: false,
        status: 404,
        error: "Not Found",
        message: `Route '${req.originalUrl}' does not exist.`,
        method: req.method,
        timestamp: new Date().toISOString()
    };

    console.warn(`[404] ${req.method} ${req.originalUrl} | ${req.ip}`);

    if (req.originalUrl.startsWith("/api/") || (req.accepts("json") && !req.accepts("html"))) {
        return res.status(404).json(response);
    }

    return res.status(404).render("errors/404", {
        title: "404 - Page Not Found",
        error: response,
        popularCategories: [],
        categories: [],
        latestShayari: [],
        popularShayari: []
    });
};
