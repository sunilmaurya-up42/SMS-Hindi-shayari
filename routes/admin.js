/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Admin Routes
 * -------------------------------------------------------
 */

"use strict";

const express = require("express");
const router = express.Router();

/* Models */
const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const Contact = require("../models/Contact");
const User = require("../models/User");
const Background = require("../models/Background");
const AIImage = require("../models/AIImage");

/* Middleware */
const { isAdmin } = require("../middleware/admin");
const { upload } = require("../middleware/upload");
const { validateShayari, validateCategory } = require("../middleware/validation");
const { asyncHandler } = require("../utils/helpers");

/* ==================================
   Admin Dashboard
================================== */
const { uploadToGitHub } = require("../services/githubUpload");
const { randomString } = require("../utils/helpers");
const fs = require("fs");

router.get(
    "/",
    isAdmin,
    asyncHandler(async (req, res) => {

        const [users, shayaries, categories, contacts] = await Promise.all([
            User.countDocuments(),
            Shayari.countDocuments(),
            Category.countDocuments(),
            Contact.countDocuments({ status: "new" })
        ]);

        return res.render("admin/dashboard", {
            title: "Admin Dashboard",
            stats: {
                users,
                shayaries,
                categories,
                contacts
            },
            user: req.user
        });

    })
);

/* ==================================
   SHAYARI MANAGEMENT
================================== */

/* List */
router.get(
    "/shayari",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await Shayari.find()
            .populate("category")
            .sort({ createdAt: -1 });

        return res.render("admin/shayari/list", {
            title: "Manage Shayari",
            list
        });

    })
);

/* Create Form */
router.get(
    "/shayari/create",
    isAdmin,
    asyncHandler(async (req, res) => {

        const categories = await Category.find().sort({
            name: 1
        });

        res.render("admin/shayari/create", {
            title: "Create Shayari",
            categories
        });

    })
);

/* Create */
router.post(
    "/shayari/create",
    isAdmin,
    validateShayari,
    asyncHandler(async (req, res) => {

        await Shayari.create({

    ...req.body,

    author: req.user._id

});

        return res.redirect("/admin/shayari");

    })
);
/* Edit Form */
router.get(
    "/shayari/edit/:id",
    isAdmin,
    asyncHandler(async (req, res) => {

        const shayari = await Shayari.findById(req.params.id);

        if (!shayari) {
            return res.redirect("/admin/shayari");
        }

        const categories = await Category.find().sort({ name: 1 });

        return res.render("admin/shayari/edit", {
            title: "Edit Shayari",
            shayari,
            categories
        });

    })
);

/* Update */
router.post(
    "/shayari/edit/:id",
    isAdmin,
    validateShayari,
    asyncHandler(async (req, res) => {

        await Shayari.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                runValidators: true,
                new: true
            }
        );

        return res.redirect("/admin/shayari");

    })
);
/* Delete */
router.get(
    "/shayari/delete/:id",
    isAdmin,
    asyncHandler(async (req, res) => {

        await Shayari.findByIdAndDelete(req.params.id);

        return res.redirect("/admin/shayari");

    })
);

/* ==================================
   CATEGORY MANAGEMENT
================================== */

/* List */
router.get(
    "/category",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await Category.find().sort({ createdAt: -1 });

        return res.render("admin/category/list", {
            title: "Manage Category",
            list
        });

    })
);

/* Create */
router.post(
    "/category/create",
    isAdmin,
    validateCategory,
    asyncHandler(async (req, res) => {

        const exists = await Category.findOne({
    name: req.body.name.trim()
});

if (exists) {
    return res.redirect("/admin/category");
}

await Category.create(req.body);

        return res.redirect("/admin/category");

    })
);

/* Delete */
router.get(
    "/category/delete/:id",
    isAdmin,
    asyncHandler(async (req, res) => {

        await Category.findByIdAndDelete(req.params.id);

        return res.redirect("/admin/category");

    })
);

/* ==================================
   CONTACT MANAGEMENT
================================== */

router.get(
    "/contacts",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await Contact.find().sort({ createdAt: -1 });

        return res.render("admin/contact/list", {
            title: "Contact Messages",
            list
        });

    })
);

/* Reply Contact */
router.post(
    "/contacts/reply/:id",
    isAdmin,
    asyncHandler(async (req, res) => {

        const contact = await Contact.findById(req.params.id);

        if (contact) {
            await contact.reply(req.body.reply, req.user._id);
        }

        return res.redirect("/admin/contacts");

    })
);

/* ==================================
   USER MANAGEMENT
================================== */

router.get(
    "/users",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await User.find().sort({ createdAt: -1 });

        return res.render("admin/users/list", {
            title: "Users",
            list
        });

    })
);

/* ==================================
   IMAGE UPLOAD (BACKGROUND)
================================== */

router.post(
    "/background/upload",
    isAdmin,
    upload.single("image"),
    asyncHandler(async (req, res) => {

        // Placeholder: GitHub upload logic later
        return res.json({
            success: true,
            message: "Uploaded successfully (temp)"
        });

    })
);
/* ==================================
   BACKGROUND MANAGEMENT
================================== */

/* List */
router.get(
    "/background",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await Background.find().sort({
            createdAt: -1
        });

        return res.render("admin/background/list", {
            title: "Background Images",
            list
        });

    })
);

/* Upload Form */
router.post(
    "/background/create",
    isAdmin,
    upload.single("image"),
    asyncHandler(async (req, res) => {

        if (!req.file) {
            throw new Error("Image is required.");
        }

        const slug = req.body.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-");

        await Background.create({
            title: req.body.title,
            slug,
            fileName: req.file.filename,
            filePath: `/uploads/${req.file.filename}`,
            githubUrl: `/uploads/${req.file.filename}`,
            rawUrl: `/uploads/${req.file.filename}`,
            uploadedBy: req.user._id
        });

        return res.redirect("/admin/background");
    })
);

/* Upload */
router.post(
    "/background/create",
    isAdmin,
    upload.single("image"),
    asyncHandler(async (req, res) => {

        if (!req.file) {
            return res.redirect("/admin/background/create");
        }

        const upload = await uploadToGitHub(req.file);

        await Background.create({

            title: req.body.title,

            slug: randomString(20),

            fileName: upload.fileName,

            filePath: upload.filePath,

            githubUrl: upload.githubUrl,

            rawUrl: upload.rawUrl,

            uploadedBy: req.user._id

        });

        // Local file delete
        fs.unlinkSync(req.file.path);

        return res.redirect("/admin/background");

    })
);

/* Delete */
router.get(
    "/background/delete/:id",
    isAdmin,
    asyncHandler(async (req, res) => {

        await Background.findByIdAndDelete(req.params.id);

        return res.redirect("/admin/background");

    })
);
/* ==================================
   AI IMAGE LIST
================================== */

router.get(
    "/ai-images",
    isAdmin,
    asyncHandler(async (req, res) => {

        const list = await AIImage.find().sort({ createdAt: -1 });

        return res.render("admin/ai/list", {
            title: "AI Images",
            list
        });

    })
);

/* ==================================
   Export
================================== */

module.exports = router;
