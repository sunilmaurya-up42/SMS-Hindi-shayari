/**
 * ==========================================================
 * SMS Hindi Shayari
 * Seed Sample Shayari
 * ==========================================================
 */

"use strict";

require("dotenv").config();

const connectDB = require("../config/db");
const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const slugify = require("slugify");

const shayariList = [
    {
        title: "Love Shayari 1",
        category: "Love Shayari",
        content: `तेरी मुस्कान मेरी पहचान बन गई,
तेरी खुशी मेरी जान बन गई।`
    },
    {
        title: "Sad Shayari 1",
        category: "Sad Shayari",
        content: `जो अपना था वही पराया निकला,
दिल का हर सपना अधूरा निकला।`
    },
    {
        title: "Attitude Shayari 1",
        category: "Attitude Shayari",
        content: `हमसे जलने वालों का इलाज नहीं होता,
क्योंकि हमारी बराबरी का कोई राज नहीं होता।`
    },
    {
        title: "Friendship Shayari 1",
        category: "Friendship Shayari",
        content: `दोस्ती वो नहीं जो जान देती है,
दोस्ती वो है जो पहचान देती है।`
    },
    {
        title: "Motivational Shayari 1",
        category: "Motivational Shayari",
        content: `मंज़िल उन्हीं को मिलती है,
जिनके सपनों में जान होती है।`
    }
];

async function seedShayari() {

    try {

        await connectDB();

        let inserted = 0;

        for (const item of shayariList) {

            const exists = await Shayari.findOne({
                title: item.title
            });

            if (exists) continue;

            const category = await Category.findOne({
                name: item.category
            });

            if (!category) continue;

            await Shayari.create({

                title: item.title,

                slug: slugify(item.title, {
                    lower: true,
                    strict: true
                }),

                content: item.content,

                category: category._id,

                language: "hi",

                status: "published",

                isPublished: true,

                views: 0,

                likes: 0

            });

            inserted++;

        }

        console.log("==================================");
        console.log(`✅ ${inserted} Shayari Inserted`);
        console.log("==================================");

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

seedShayari();
