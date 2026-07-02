/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Sitemap Generator Script
 * -------------------------------------------------------
 */

"use strict";

require("dotenv").config();

const fs = require("fs").promises;

const path = require("path");

const connectDB = require("../config/database");

const {

    generateSitemap

} = require("../services/sitemap.service");

/* ==================================
   Output Path
================================== */

const OUTPUT_FILE = path.join(

    process.cwd(),

    "public",

    "sitemap.xml"

);

/* ==================================
   Generate Sitemap
================================== */

const buildSitemap = async () => {

    try {

        await connectDB();

        const xml = await generateSitemap();

        await fs.writeFile(

            OUTPUT_FILE,

            xml,

            "utf8"

        );

        console.log("");

        console.log("==================================");

        console.log(" Sitemap Generated Successfully");

        console.log("==================================");

        console.log(` File : ${OUTPUT_FILE}`);

              console.log("==================================");

        process.exit(0);

    } catch (error) {

        console.error("");

        console.error("==================================");
        console.error(" Sitemap Generation Failed");
        console.error("==================================");
        console.error(error.message);
        console.error("==================================");

        process.exit(1);

    }

};

/* ==================================
   Execute Script
================================== */

buildSitemap();
