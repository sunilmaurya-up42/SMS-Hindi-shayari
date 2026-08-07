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
const hpp = require("hpp");
const methodOverride = require("method-override");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const maintenance = require("./middleware/maintenance");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const csrf = require("csurf");
const indexRoutes = require("./routes");
const authRoutes = require("./routes/auth");
const shayariRoutes = require("./routes/shayari");
const adminRoutes = require("./routes/admin");
const reportApiRoutes = require("./routes/api/report");
const pageRoutes = require("./routes/page");
const searchRoutes = require("./routes/search");
const rssRoutes = require("./routes/rss");
const sitemapRoutes = require("./routes/sitemap");
const healthRoutes = require("./routes/health");
const reportRoutes = require("./routes/report");
const settingsRoutes = require("./routes/settings");
const contactAdminRoutes = require("./routes/contactAdmin");

require("./config/passport");

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

/* ==========================
   Body Parser
=========================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(csrf({ cookie: true }));

/* ===========================
   Security
=========================== */

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

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

    res.locals.user = req.user || null;

    res.locals.success_msg = req.flash("success_msg");

    res.locals.error_msg = req.flash("error_msg");

    res.locals.error = req.flash("error");

    if (req.csrfToken) {

        res.locals.csrfToken = req.csrfToken();

    }

    next();

});

/* ===========================
   Maintenance Mode
=========================== */

app.use(maintenance);

/* ===========================
   Routes
=========================== */

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/shayari", shayariRoutes);
app.use("/admin", adminRoutes);
app.use("/api/report", reportApiRoutes);
app.use("/", pageRoutes);
app.use("/search", searchRoutes);
app.use("/", rssRoutes);
app.use("/", sitemapRoutes);
app.use("/", healthRoutes);
app.use("/reports", reportRoutes);
app.use("/settings", settingsRoutes);
app.use("/contact-admin", contactAdminRoutes);

/* ===========================
   404 Handler
=========================== */

app.use(notFound);

/* ===========================
   Global Error Handler
=========================== */

app.use(errorHandler);

module.exports = app;
