/**
 * ==========================================================
 * SMS Hindi Shayari
 * Seed Default Pages
 * ==========================================================
 */

"use strict";

require("dotenv").config();

const connectDB = require("../config/db");
const Page = require("../models/Page");
const slugify = require("slugify");

const pages = [
    {
        title: "About Us",
        content: "<h2>About SMS Hindi Shayari</h2><p>Welcome to SMS Hindi Shayari.</p>"
    },
    {
        title: "Contact Us",
        content: "<h2>Contact Us</h2><p>Contact us using the contact form.</p>"
    },
    {
        title: "Privacy Policy",
        content: "<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>"
    },
    {
        title: "Terms & Conditions",
        content: "<h2>Terms & Conditions</h2><p>Please read these terms carefully.</p>"
    },
    {
        title: "Disclaimer",
        content: "<h2>Disclaimer</h2><p>Information provided for educational purposes only.</p>"
    },
    {
        title: "Cookies Policy",
        content: "<h2>Cookies Policy</h2><p>We use cookies to improve user experience.</p>"
    }
];

async function seedPages() {

    try {

        await connectDB();

        let inserted = 0;

        for (const page of pages) {

            const slug = slugify(page.title, {
                lower: true,
                strict: true
            });

            const exists = await Page.findOne({ slug });

            if (exists) continue;

            await Page.create({

                title: page.title,

                slug,

                content: page.content,

                status: "published",

                seoTitle: page.title,

                seoDescription: page.title,

                isActive: true

            });

            inserted++;

        }

        console.log("==================================");
        console.log(`✅ ${inserted} Pages Seeded Successfully`);
        console.log("==================================");

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

seedPages();
