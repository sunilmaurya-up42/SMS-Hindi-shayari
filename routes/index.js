const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/admin", require("./admin"));
router.use("/shayari", require("./shayari"));
router.use("/category", require("./category"));
router.use("/comment", require("./comment"));
router.use("/background", require("./background"));
router.use("/analytics", require("./analytics"));
router.use("/contact", require("./contact"));
router.use("/settings", require("./settings"));
router.use("/seo", require("./seo"));

router.get("/", (req, res) => {
    res.json({
        success: true,
        name: "SMS Hindi Shayari API",
        version: "1.0.0",
        status: "Running"
    });
});

router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });
});

module.exports = router;
