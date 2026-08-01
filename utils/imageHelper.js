const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");

/**
 * Allowed Image Types
 */
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

/**
 * Validate Image
 */
exports.validate = (file) => {

    if (!file) {
        throw new Error("Image is required.");
    }

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Invalid image type.");
    }

    return true;

};

/**
 * Check Image Size
 */
exports.checkSize = (file, max = 5 * 1024 * 1024) => {

    if (file.size > max) {
        throw new Error("Image size exceeded.");
    }

    return true;

};

/**
 * Get Metadata
 */
exports.metadata = async (file) => {

    return await sharp(file).metadata();

};

/**
 * Resize
 */
exports.resize = async (
    input,
    output,
    width,
    height
) => {

    return sharp(input)
        .resize(width, height)
        .toFile(output);

};

/**
 * Convert To WebP
 */
exports.toWebP = async (
    input,
    output,
    quality = 90
) => {

    return sharp(input)
        .webp({ quality })
        .toFile(output);

};

/**
 * Thumbnail
 */
exports.thumbnail = async (
    input,
    output
) => {

    return sharp(input)
        .resize(300, 300)
        .webp({ quality: 85 })
        .toFile(output);

};

/**
 * Optimize
 */
exports.optimize = async (
    input,
    output
) => {

    return sharp(input)
        .jpeg({
            quality: 85,
            mozjpeg: true
        })
        .toFile(output);

};

/**
 * Generate Image Hash
 */
exports.hash = (file) => {

    const buffer = fs.readFileSync(file);

    return crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");

};

/**
 * Duplicate Detection
 */
exports.isDuplicate = (
    hash,
    hashes = []
) => {

    return hashes.includes(hash);

};

/**
 * Base64 Encode
 */
exports.toBase64 = (file) => {

    return fs.readFileSync(file)
        .toString("base64");

};

/**
 * Base64 Decode
 */
exports.fromBase64 = (
    base64,
    output
) => {

    fs.writeFileSync(
        output,
        Buffer.from(base64, "base64")
    );

    return output;

};

/**
 * Delete Image
 */
exports.remove = (file) => {

    if (fs.existsSync(file)) {

        fs.unlinkSync(file);

    }

};

/**
 * Image Exists
 */
exports.exists = (file) => {

    return fs.existsSync(file);

};

/**
 * Image Dimensions
 */
exports.dimensions = async (file) => {

    const meta = await sharp(file).metadata();

    return {

        width: meta.width,

        height: meta.height

    };

};

/**
 * Watermark Placeholder
 */
exports.watermark = async (
    input,
    output
) => {

    // Future watermark implementation

    return sharp(input)
        .toFile(output);

};
