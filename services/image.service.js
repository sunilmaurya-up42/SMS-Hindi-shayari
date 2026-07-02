/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * Image Service
 * -------------------------------------------------------
 */

"use strict";

const path = require("path");
const fs = require("fs").promises;

const AIImage = require("../models/AIImage");
const Background = require("../models/Background");

const githubService = require("./github.service");

/* ==================================
   Upload Directories
================================== */

const UPLOAD_DIR = path.join(
    process.cwd(),
    "uploads"
);

const AI_DIR = path.join(
    UPLOAD_DIR,
    "ai-images"
);

const BG_DIR = path.join(
    UPLOAD_DIR,
    "backgrounds"
);

/* ==================================
   Ensure Directories
================================== */

const ensureDirectories = async () => {

    await fs.mkdir(AI_DIR, {
        recursive: true
    });

    await fs.mkdir(BG_DIR, {
        recursive: true
    });

};

/* ==================================
   File Extension
================================== */

const getExtension = (fileName = "") => {

    return path.extname(fileName)
        .toLowerCase();

};

/* ==================================
   Generate File Name
================================== */

const generateFileName = (
    originalName = ""
) => {

    const extension =
        getExtension(originalName);

    return `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2,10)}${extension}`;

};

/* ==================================
   Image Validation
================================== */

const isValidImage = (
    mimeType = ""
) => {

    return [

        "image/jpeg",

        "image/png",

        "image/webp",

        "image/gif"

    ].includes(mimeType);

};

/* ==================================
   Save Background
================================== */

const saveBackground = async (data) => {

    const background = await Background.create(data);

    return background;

};

/* ==================================
   Save AI Image
================================== */

const saveAIImage = async (data) => {

    const image = await AIImage.create(data);

    return image;

};

/* ==================================
   Delete Image
================================== */

const deleteImage = async (model, id) => {

    const document = await model.findById(id);

    if (!document) {

        throw new Error("Image not found");

    }

    try {

        await fs.unlink(document.filePath);

    } catch (_) {

        /* Ignore if file doesn't exist */

    }

    await document.deleteOne();

    return true;

};

/* ==================================
   Increment Usage
================================== */

const incrementUsage = async (model, id) => {

    const document = await model.findById(id);

    if (!document) {

        return null;

    }

    document.usageCount += 1;

    await document.save({
        validateBeforeSave: false
    });

    return document;

};

/* ==================================
   Upload To GitHub
================================== */

const uploadToGithub = async (

    localFile,

    githubPath

) => {

    const buffer = await fs.readFile(localFile);

    const result = await githubService.uploadFile(

        githubPath,

        buffer,

        `Upload ${path.basename(localFile)}`

    );

    return result;

};

/* ==================================
   Get AI Images
================================== */

const getAIImages = async (filter = {}) => {

    return AIImage.find({
        isActive: true,
        ...filter
    })
        .populate("background", "title slug rawUrl")
        .populate("uploadedBy", "name")
        .sort({
            createdAt: -1
        });

};

/* ==================================
   Get Backgrounds
================================== */

const getBackgrounds = async (filter = {}) => {

    return Background.find({
        isActive: true,
        ...filter
    })
        .populate("uploadedBy", "name")
        .sort({
            createdAt: -1
        });

};

/* ==================================
   Export
================================== */

module.exports = {

    ensureDirectories,

    getExtension,

    generateFileName,

    isValidImage,

    saveBackground,

    saveAIImage,

    deleteImage,

    incrementUsage,

    uploadToGithub,

    getAIImages,

    getBackgrounds

};
