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
/*
|--------------------------------------------------------------------------
| Generate Shayari Image
|--------------------------------------------------------------------------
| GitHub Background + Shayari + Watermark
|--------------------------------------------------------------------------
*/

const {
    createCanvas,
    loadImage
} = require("canvas");


exports.generateShayariImage =
async ({
    backgroundUrl,
    title,
    content,
    watermark = "SMS Hindi Shayari"
}) => {

    /*
    |--------------------------------------------------------------------------
    | Download GitHub Background
    |--------------------------------------------------------------------------
    */

    const response =
        await fetch(
            backgroundUrl
        );


    if (!response.ok) {

        throw new Error(
            `Background download failed: ${response.status}`
        );

    }


    const arrayBuffer =
        await response.arrayBuffer();


    const backgroundImage =
        await loadImage(
            Buffer.from(arrayBuffer)
        );


    /*
    |--------------------------------------------------------------------------
    | Canvas
    |--------------------------------------------------------------------------
    */

    const width =
        backgroundImage.width;

    const height =
        backgroundImage.height;


    const canvas =
        createCanvas(
            width,
            height
        );


    const ctx =
        canvas.getContext("2d");


    /*
    |--------------------------------------------------------------------------
    | Draw Background
    |--------------------------------------------------------------------------
    */

    ctx.drawImage(
        backgroundImage,
        0,
        0,
        width,
        height
    );


    /*
    |--------------------------------------------------------------------------
    | Dark Transparent Overlay
    |--------------------------------------------------------------------------
    */

    ctx.fillStyle =
        "rgba(0,0,0,0.28)";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
    |--------------------------------------------------------------------------
    | Shayari Box
    |--------------------------------------------------------------------------
    */

    const boxWidth =
        width * 0.86;


    const boxX =
        (width - boxWidth) / 2;


    const boxY =
        height * 0.20;


    const boxHeight =
        height * 0.55;


    ctx.fillStyle =
        "rgba(0,0,0,0.48)";


    ctx.fillRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
    );


    /*
    |--------------------------------------------------------------------------
    | Title
    |--------------------------------------------------------------------------
    */

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "top";


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        `bold ${Math.max(
            34,
            Math.floor(width * 0.055)
        )}px sans-serif`;


    ctx.fillText(
        title,
        width / 2,
        boxY + 35
    );


    /*
    |--------------------------------------------------------------------------
    | Shayari Content
    |--------------------------------------------------------------------------
    */

    const fontSize =
        Math.max(
            25,
            Math.floor(width * 0.038)
        );


    ctx.font =
        `${fontSize}px sans-serif`;


    ctx.fillStyle =
        "#ffffff";


    const maxTextWidth =
        boxWidth - 70;


    const lineHeight =
        fontSize * 1.55;


    const lines =
        [];


    const paragraphs =
        String(content || "")
            .split(/\r?\n/);


    for (
        const paragraph
        of paragraphs
    ) {

        const words =
            paragraph
                .trim()
                .split(/\s+/);


        let line = "";


        for (
            const word
            of words
        ) {

            const test =
                line
                    ? `${line} ${word}`
                    : word;


            if (
                ctx.measureText(test).width
                >
                maxTextWidth
            ) {

                if (line) {

                    lines.push(line);

                }

                line =
                    word;

            } else {

                line =
                    test;

            }

        }


        if (line) {

            lines.push(line);

        }

    }


    const totalHeight =
        lines.length *
        lineHeight;


    let textY =
        boxY +
        (
            boxHeight -
            totalHeight
        ) / 2;


    for (
        const line
        of lines
    ) {

        /*
        | Text shadow
        */

        ctx.shadowColor =
            "rgba(0,0,0,0.8)";

        ctx.shadowBlur =
            4;

        ctx.shadowOffsetX =
            2;

        ctx.shadowOffsetY =
            2;


        ctx.fillText(
            line,
            width / 2,
            textY
        );


        textY +=
            lineHeight;

    }


    /*
    |--------------------------------------------------------------------------
    | Reset Shadow
    |--------------------------------------------------------------------------
    */

    ctx.shadowColor =
        "transparent";

    ctx.shadowBlur =
        0;

    ctx.shadowOffsetX =
        0;

    ctx.shadowOffsetY =
        0;


    /*
    |--------------------------------------------------------------------------
    | Website Watermark
    |--------------------------------------------------------------------------
    */

    ctx.textAlign =
        "right";

    ctx.textBaseline =
        "bottom";


    ctx.font =
        `bold ${Math.max(
            18,
            Math.floor(width * 0.025)
        )}px sans-serif`;


    ctx.fillStyle =
        "rgba(255,255,255,0.85)";


    ctx.fillText(
        watermark,
        width - 30,
        height - 25
    );


    /*
    |--------------------------------------------------------------------------
    | Return PNG
    |--------------------------------------------------------------------------
    */

    return canvas.toBuffer(
        "image/png"
    );

};
