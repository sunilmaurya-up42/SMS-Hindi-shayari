/**
 * ==========================================================
 * SMS Hindi Shayari
 * app.js
 * ==========================================================
 */

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const methodOverride = require("method-override");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");


const app = express();

/* ===========================
   Trust Proxy (Render)
=========================== */

app.set("trust proxy", 1);

/* ===========================
   View Engine
=========================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

/* ===========================
   Static Files
=========================== */

app.use(express.static(path.join(__dirname, "public")));

/* ===========================
   Body Parser
=========================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/* ===========================
   Security
=========================== */

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(mongoSanitize());

app.use(hpp());

app.use(cors());

/* ===========================
   Compression
=========================== */

app.use(compression());

/* ===========================
   Logger
=========================== */

app.use(morgan("dev"));

/* ===========================
   HTTP Method Override
=========================== */

app.use(methodOverride("_method"));

/* ===========================
   Rate Limit
=========================== */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

/* ===========================
   Local Variables
=========================== */

app.use((req, res, next) => {

    res.locals.siteName = "SMS Hindi Shayari";

    res.locals.currentYear = new Date().getFullYear();

    next();

});

/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {

    res.render("home", {

        title: "SMS Hindi Shayari"

    });

});

/* ===========================
   404
=========================== */

app.use((req, res) => {

    res.status(404).render("errors/404", {

        title: "404"

    });

});

/* ===========================
   Error Handler
=========================== */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).render("errors/500", {

        title: "Server Error"

    });

});

app.use(notFound);

app.use(errorHandler);
module.exports = app;
