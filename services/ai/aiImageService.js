const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");

const githubService = require("../github/githubService");
const Background = require("../../models/Background");
const AIImage = require("../../models/AIImage");

/**
 * Random Background
 */
exports.getRandomBackground = async () => {

    const backgrounds = await Background.find({
        isActive: true
    });

    if (!backgrounds.length) {
        throw new Error("Background not found.");
    }

    return backgrounds[
        Math.floor(Math.random() * backgrounds.length)
    ];

};

/**
 * Generate Image
 */
exports.generateImage = async ({
    text,
    fontSize = 60,
    color = "#ffffff"
}) => {

    const background =
        await exports.getRandomBackground();

    const image = await loadImage(background.imageUrl);

    const canvas = createCanvas(
        image.width,
        image.height
    );

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height
    );

    ctx.fillStyle = color;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font = `bold ${fontSize}px Arial`;

    wrapText(
        ctx,
        text,
        image.width / 2,
        image.height / 2,
        image.width - 150,
        fontSize + 15
    );

    const fileName =
        Date.now() + ".png";

    const output =
        path.join(
            __dirname,
            "../../uploads/generated",
            fileName
        );

    fs.mkdirSync(
        path.dirname(output),
        { recursive: true }
    );

    fs.writeFileSync(
        output,
        canvas.toBuffer()
    );

    return {

        output,

        fileName,

        background

    };

};

/**
 * Optimize WebP
 */
exports.optimizeImage = async (file) => {

    const output =
        file.replace(".png", ".webp");

    await sharp(file)
        .webp({
            quality: 90
        })
        .toFile(output);

    return output;

};

/**
 * Upload To GitHub
 */
exports.uploadGeneratedImage =
async (localFile) => {

    return await githubService.uploadFile(
        localFile,
        "generated"
    );

};

/**
 * Save Database
 */
exports.saveHistory = async (data) => {

    return await AIImage.create(data);

};

/**
 * Full Generate
 */
exports.generate = async (text) => {

    const generated =
        await exports.generateImage({
            text
        });

    const optimized =
        await exports.optimizeImage(
            generated.output
        );

    const github =
        await exports.uploadGeneratedImage(
            optimized
        );

    const history =
        await exports.saveHistory({

            text,

            imageUrl: github.downloadUrl,

            githubPath: github.githubPath,

            fileName: github.fileName,

            background:
                generated.background._id

        });

    return {

        success: true,

        imageUrl: github.downloadUrl,

        history

    };

};

/**
 * Wrap Text
 */
function wrapText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const words = text.split(" ");

    let line = "";

    let lines = [];

    for (let n = 0; n < words.length; n++) {

        const testLine =
            line + words[n] + " ";

        const metrics =
            ctx.measureText(testLine);

        if (
            metrics.width > maxWidth &&
            n > 0
        ) {

            lines.push(line);

            line = words[n] + " ";

        } else {

            line = testLine;

        }

    }

    lines.push(line);

    let startY =
        y -
        (lines.length * lineHeight) / 2;

    for (const l of lines) {

        ctx.strokeStyle = "#000";

        ctx.lineWidth = 5;

        ctx.strokeText(
            l,
            x,
            startY
        );

        ctx.fillText(
            l,
            x,
            startY
        );

        startY += lineHeight;

    }

}
