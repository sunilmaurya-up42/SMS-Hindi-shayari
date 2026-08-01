const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Resize Image
 */
exports.resize = async (
    input,
    output,
    width,
    height
) => {

    await sharp(input)
        .resize(width, height)
        .toFile(output);

    return output;

};

/**
 * Compress Image
 */
exports.compress = async (
    input,
    output,
    quality = 80
) => {

    await sharp(input)
        .jpeg({ quality })
        .toFile(output);

    return output;

};

/**
 * Convert To WebP
 */
exports.toWebP = async (
    input,
    output,
    quality = 90
) => {

    await sharp(input)
        .webp({ quality })
        .toFile(output);

    return output;

};

/**
 * Crop Image
 */
exports.crop = async (
    input,
    output,
    width,
    height,
    left,
    top
) => {

    await sharp(input)
        .extract({
            width,
            height,
            left,
            top
        })
        .toFile(output);

    return output;

};

/**
 * Generate Thumbnail
 */
exports.thumbnail = async (
    input,
    output
) => {

    await sharp(input)
        .resize(300, 300)
        .webp({
            quality: 85
        })
        .toFile(output);

    return output;

};

/**
 * Blur Image
 */
exports.blur = async (
    input,
    output
) => {

    await sharp(input)
        .blur()
        .toFile(output);

    return output;

};

/**
 * Rotate Image
 */
exports.rotate = async (
    input,
    output,
    angle = 90
) => {

    await sharp(input)
        .rotate(angle)
        .toFile(output);

    return output;

};

/**
 * Flip Image
 */
exports.flip = async (
    input,
    output
) => {

    await sharp(input)
        .flip()
        .toFile(output);

    return output;

};

/**
 * Get Metadata
 */
exports.metadata = async (input) => {

    return await sharp(input).metadata();

};

/**
 * Delete Image
 */
exports.delete = (file) => {

    if (
        file &&
        fs.existsSync(file)
    ) {

        fs.unlinkSync(file);

    }

};

/**
 * File Exists
 */
exports.exists = (file) => {

    return fs.existsSync(file);

};

/**
 * Copy Image
 */
exports.copy = (
    source,
    destination
) => {

    fs.copyFileSync(
        source,
        destination
    );

    return destination;

};

/**
 * Move Image
 */
exports.move = (
    source,
    destination
) => {

    fs.renameSync(
        source,
        destination
    );

    return destination;

};

/**
 * Image Information
 */
exports.info = async (file) => {

    const meta =
        await sharp(file).metadata();

    const stat =
        fs.statSync(file);

    return {

        name: path.basename(file),

        size: stat.size,

        width: meta.width,

        height: meta.height,

        format: meta.format,

        created: stat.birthtime,

        modified: stat.mtime

    };

};

/**
 * Optimize Image
 */
exports.optimize = async (
    input,
    output
) => {

    await sharp(input)
        .webp({
            quality: 88
        })
        .toFile(output);

    return output;

};
