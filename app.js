/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Main App Configuration
 * -------------------------------------------------------
 */

"use strict";

/* Core Modules */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");

/* Config */
require("dotenv").config();
require("./config/passport");

/* Routes */
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shayariRoutes = require("./routes/shayari");
const apiRoutes = require("./routes/api");
const pageRoutes = require("./routes/page");

/* Middleware */
const { globalLimiter } = require("./middleware/rateLimiter");
const { requestLogger } = require("./utils/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

/* Utils */
const { logger } = require("./utils/logger");
/* main.ejs */
const expressLayouts = require("express-ejs-layouts");
/* ==================================
   Express App
================================== */

const app = express();

/* ==================================
   Trust Proxy (Render deploy fix)
================================== */

app.set("trust proxy", 1);

/* ==================================
   View Engine
================================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

app.set("layout", "layouts/main");

app.set("layout extractScripts", true);

app.set("layout extractStyles", true);

/* ==================================
   Static Files
================================== */

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.request = req;
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==================================
   Body Parsers
================================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ==================================
   Cookies
================================== */

app.use(cookieParser(process.env.SESSION_SECRET));

/* ==================================
   Session (MongoDB Store)
================================== */

app.use(
    session({
        secret: process.env.SESSION_SECRET || "sms-shayari-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

/* ==================================
   Passport Init
================================== */

app.use(passport.initialize());
app.use(passport.session());

/* ==================================
   Flash Messages
================================== */

app.use(flash());

/* ==================================
   Global Middlewares
================================== */

app.use(globalLimiter);
app.use(requestLogger);

/* ==================================
   Global Variables (EJS)
================================== */

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

/* ==================================
   Routes
================================== */

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/shayari", shayariRoutes);
app.use("/api", apiRoutes);
app.use("/", pageRoutes);

/* ==================================
   404 Handler
================================== */

app.use(notFound);

/* ==================================
   Global Error Handler
================================== */

app.use(errorHandler);

<script>
document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll("#mainNavbar .nav-link");
    const navbar = document.getElementById("mainNavbar");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth < 992) {

                const bsCollapse = bootstrap.Collapse.getInstance(navbar);

                if (bsCollapse) {
                    bsCollapse.hide();
                }

            }

        });

    });

});
</script>
/* ==================================
   Export App
================================== */

module.exports = app;
