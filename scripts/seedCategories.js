/**
 * ==========================================================
 * SMS Hindi Shayari
 * Seed Default Categories
 * ==========================================================
 */

"use strict";

require("dotenv").config();

const connectDB = require("../config/db");
const Category = require("../models/Category");
const slugify = require("slugify");

const categories = [
    {
        name: "Love Shayari",
        description: "Beautiful Love Shayari Collection"
    },
    {
        name: "Sad Shayari",
        description: "Heart Touching Sad Shayari"
    },
    {
        name: "Attitude Shayari",
        description: "Best Attitude Shayari"
    },
    {
        name: "Friendship Shayari",
        description: "Dosti Shayari Collection"
    },
    {
        name: "Romantic Shayari",
        description: "Romantic Hindi Shayari"
    },
    {
        name: "Motivational Shayari",
        description: "Motivational Shayari"
    },
    {
        name: "Good Morning Shayari",
        description: "Good Morning Wishes"
    },
    {
        name: "Good Night Shayari",
        description: "Good Night Wishes"
    },
    {
        name: "Birthday Shayari",
        description: "Birthday Wishes"
    },
    {
        name: "Festival Shayari",
        description: "Festival Special Shayari"
    },
    {
        name: "Mother Shayari",
        description: "Maa Par Shayari"
    },
    {
        name: "Father Shayari",
        description: "Papa Par Shayari"
    }
];

async function seedCategories() {

    try {

        await connectDB();

        let inserted = 0;

        for (const item of categories) {

            const exists = await Category.findOne({
                name: item.name
            });

            if (exists) continue;

            await Category.create({

                name: item.name,

                slug: slugify(item.name, {

                    lower: true,
                    strict: true

                }),

                description: item.description,

                isActive: true

            });

            inserted++;

        }

        console.log("==================================");
        console.log(`✅ ${inserted} Categories Added`);
        console.log("==================================");

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

seedCategories();
