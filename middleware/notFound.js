module.exports = (req, res, next) => {

    const acceptsHTML = req.accepts("html");
    const acceptsJSON = req.accepts("json");

    const response = {
        success: false,
        status: 404,
        error: "Not Found",
        message: `Route '${req.originalUrl}' does not exist.`,
        method: req.method,
        timestamp: new Date().toISOString()
    };

    // Log Invalid Route
    console.warn(
        `[404] ${req.method} ${req.originalUrl} | ${req.ip}`
    );

    // HTML Response
    if (acceptsHTML) {

        return res.status(404).render("errors/404", {
            title: "404 - Page Not Found",
            error: response
        });

    }

    // JSON Response
    if (acceptsJSON) {

        return res.status(404).json(response);

    }

    // Plain Text Response
    res.status(404).type("text").send("404 - Page Not Found");

};
