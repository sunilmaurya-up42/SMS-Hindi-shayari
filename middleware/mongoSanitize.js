function sanitize(obj) {
    if (!obj || typeof obj !== "object") return;

    for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete obj[key];
            continue;
        }

        sanitize(obj[key]);
    }
}

module.exports = (req, res, next) => {
    sanitize(req.body);
    sanitize(req.params);
    next();
};
