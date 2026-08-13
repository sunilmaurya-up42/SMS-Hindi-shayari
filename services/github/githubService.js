"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

/*
|--------------------------------------------------------------------------
| IMAGE SERVICE
|--------------------------------------------------------------------------
| Creates Shayari image on uploaded/GitHub background.
|--------------------------------------------------------------------------
*/

const ROOT = path.resolve(__dirname, "../../");

const PUBLIC_DIR = path.join(ROOT, "public");
const FONT_DIR = path.join(PUBLIC_DIR, "fonts");
const IMAGE_DIR = path.join(PUBLIC_DIR, "images");
const GENERATED_DIR = path.join(PUBLIC_DIR, "uploads", "generated");

function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}

ensureDirectory(GENERATED_DIR);


/*
|--------------------------------------------------------------------------
| FIND DEVANAGARI FONT
|--------------------------------------------------------------------------
*/

function findHindiFont() {

    const possibleFonts = [

        path.join(
            FONT_DIR,
            "NotoSansDevanagari-Regular.ttf"
        ),

        path.join(
            FONT_DIR,
            "Noto-Sans-Devanagari-Regular.ttf"
        ),

        path.join(
            FONT_DIR,
            "NotoSansDevanagari-Regular.otf"
        ),

        path.join(
            FONT_DIR,
            "Noto-Sans-Devanagari-Regular.otf"
        ),

        path.join(
            FONT_DIR,
            "Mangal.ttf"
        ),

        path.join(
            FONT_DIR,
            "Mangal-Regular.ttf"
        ),

        "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",

        "/usr/share/fonts/opentype/noto/NotoSansDevanagari-Regular.ttf",

        "/usr/share/fonts/truetype/lohit-devanagari/Lohit-Devanagari.ttf"

    ];

    for (const font of possibleFonts) {

        try {

            if (fs.existsSync(font)) {
                console.log(
                    "✅ Hindi font found:",
                    font
                );

                return font;
            }

        } catch (error) {

            console.error(
                "Font check error:",
                error.message
            );

        }
    }

    console.warn(
        "⚠️ Hindi font file not found. Using system font fallback."
    );

    return null;
}


/*
|--------------------------------------------------------------------------
| ESCAPE SVG
|--------------------------------------------------------------------------
*/

function escapeXml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}


/*
|--------------------------------------------------------------------------
| NORMALIZE SHAYARI
|--------------------------------------------------------------------------
*/

function normalizeShayari(text) {

    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .trim();

}


/*
|--------------------------------------------------------------------------
| REMOVE TITLE-LIKE FIRST LINE
|--------------------------------------------------------------------------
|
| Controller may accidentally pass:
|
| title + content
|
| This function keeps only actual Shayari content.
|--------------------------------------------------------------------------
*/

function cleanShayari(text, title = "") {

    let content = normalizeShayari(text);

    const cleanTitle = normalizeShayari(title);

    if (!content) {
        return "";
    }

    /*
    |--------------------------------------------------------------------------
    | If the entire text starts with the title, remove it.
    |--------------------------------------------------------------------------
    */

    if (
        cleanTitle &&
        content.startsWith(cleanTitle)
    ) {

        content = content
            .substring(cleanTitle.length)
            .trim();

    }

    /*
    |--------------------------------------------------------------------------
    | Remove common title separators
    |--------------------------------------------------------------------------
    */

    content = content
        .replace(/^[:：\-–—|]+/g, "")
        .trim();

    /*
    |--------------------------------------------------------------------------
    | Remove accidental title line if it exactly matches title.
    |--------------------------------------------------------------------------
    */

    const lines = content
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    if (
        cleanTitle &&
        lines.length > 1 &&
        lines[0] === cleanTitle
    ) {

        lines.shift();

    }

    return lines.join("\n").trim();

}


/*
|--------------------------------------------------------------------------
| WRAP HINDI TEXT
|--------------------------------------------------------------------------
|
| Do NOT split Unicode characters blindly.
| Array.from() keeps Unicode code points together.
|--------------------------------------------------------------------------
*/

function wrapText(text, maxChars = 28) {

    const paragraphs = String(text || "")
        .split("\n");

    const output = [];

    for (const paragraph of paragraphs) {

        const line = paragraph.trim();

        if (!line) {

            output.push("");

            continue;
        }

        const words = line.split(/\s+/);

        let current = "";

        for (const word of words) {

            const candidate =
                current
                    ? `${current} ${word}`
                    : word;

            if (
                Array.from(candidate).length <=
                maxChars
            ) {

                current = candidate;

            } else {

                if (current) {
                    output.push(current);
                }

                /*
                |--------------------------------------------------------------------------
                | Very long single word
                |--------------------------------------------------------------------------
                */

                if (
                    Array.from(word).length >
                    maxChars
                ) {

                    const chars =
                        Array.from(word);

                    while (
                        chars.length >
                        maxChars
                    ) {

                        output.push(
                            chars
                                .splice(0, maxChars)
                                .join("")
                        );

                    }

                    current =
                        chars.join("");

                } else {

                    current = word;

                }
            }
        }

        if (current) {
            output.push(current);
        }
    }

    return output;

}


/*
|--------------------------------------------------------------------------
| CREATE SVG TEXT
|--------------------------------------------------------------------------
*/

function createTextSvg({
    width,
    height,
    shayari,
    logoData,
    fontFamily = "Noto Sans Devanagari",
    fontSize = 48
}) {

    const lines =
        wrapText(shayari, 30);

    const lineHeight =
        Math.round(fontSize * 1.55);

    const totalTextHeight =
        lines.length * lineHeight;

    /*
    |--------------------------------------------------------------------------
    | Keep text inside safe area
    |--------------------------------------------------------------------------
    */

    const maxTextHeight =
        height * 0.58;

    let actualFontSize =
        fontSize;

    if (
        totalTextHeight >
        maxTextHeight
    ) {

        actualFontSize =
            Math.max(
                30,
                Math.floor(
                    maxTextHeight /
                    (lines.length * 1.55)
                )
            );

    }

    const actualLineHeight =
        Math.round(
            actualFontSize * 1.55
        );

    const textHeight =
        lines.length * actualLineHeight;

    const startY =
        Math.max(
            120,
            (height - textHeight) / 2
        );

    /*
    |--------------------------------------------------------------------------
    | Logo
    |--------------------------------------------------------------------------
    */

    let logoSvg = "";

    if (logoData) {

        logoSvg = `
            <image
                href="data:image/png;base64,${logoData}"
                x="45"
                y="45"
                width="120"
                height="120"
                preserveAspectRatio="xMidYMid meet"
            />
        `;

    }

    /*
    |--------------------------------------------------------------------------
    | Shayari lines
    |--------------------------------------------------------------------------
    */

    const textLines = lines
        .map((line, index) => {

            const y =
                startY +
                index * actualLineHeight;

            return `
                <text
                    x="${width / 2}"
                    y="${y}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="${fontFamily}"
                    font-size="${actualFontSize}px"
                    font-weight="600"
                    fill="#ffffff"
                    stroke="#000000"
                    stroke-width="1.5"
                    paint-order="stroke"
                >${escapeXml(line)}</text>
            `;

        })
        .join("\n");


    /*
    |--------------------------------------------------------------------------
    | Watermark
    |--------------------------------------------------------------------------
    */

    const watermark = `
        <text
            x="${width / 2}"
            y="${height - 55}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="28px"
            font-weight="600"
            fill="#ffffff"
            opacity="0.88"
        >
            SMS Hindi Shayari
        </text>
    `;


    /*
    |--------------------------------------------------------------------------
    | SVG
    |--------------------------------------------------------------------------
    */

    return `
        <svg
            width="${width}"
            height="${height}"
            viewBox="0 0 ${width} ${height}"
            xmlns="http://www.w3.org/2000/svg"
        >

            ${logoSvg}

            <!-- Shayari only -->
            ${textLines}

            <!-- Watermark -->
            ${watermark}

        </svg>
    `;

}


/*
|--------------------------------------------------------------------------
| LOAD LOGO
|--------------------------------------------------------------------------
*/

function loadLogo() {

    const possibleLogos = [

        path.join(
            IMAGE_DIR,
            "logo.png"
        ),

        path.join(
            IMAGE_DIR,
            "logo.webp"
        ),

        path.join(
            PUBLIC_DIR,
            "logo.png"
        ),

        path.join(
            PUBLIC_DIR,
            "logo.webp"
        )

    ];

    for (const logo of possibleLogos) {

        try {

            if (fs.existsSync(logo)) {

                return fs.readFileSync(
                    logo
                );

            }

        } catch (error) {

            console.error(
                "Logo error:",
                error.message
            );

        }
    }

    return null;

}


/*
|--------------------------------------------------------------------------
| RESOLVE BACKGROUND
|--------------------------------------------------------------------------
*/

function resolveBackground(background) {

    if (!background) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Already absolute local path
    |--------------------------------------------------------------------------
    */

    if (
        path.isAbsolute(background) &&
        fs.existsSync(background)
    ) {

        return background;

    }

    /*
    |--------------------------------------------------------------------------
    | Relative local path
    |--------------------------------------------------------------------------
    */

    const localPaths = [

        path.join(
            PUBLIC_DIR,
            background
        ),

        path.join(
            ROOT,
            background
        ),

        path.join(
            PUBLIC_DIR,
            "uploads",
            background
        ),

        path.join(
            PUBLIC_DIR,
            "uploads",
            "backgrounds",
            background
        )

    ];

    for (const file of localPaths) {

        try {

            if (fs.existsSync(file)) {
                return file;
            }

        } catch (error) {

            // continue
        }

    }

    return null;

}


/*
|--------------------------------------------------------------------------
| MAIN IMAGE GENERATOR
|--------------------------------------------------------------------------
|
| Supported:
|
| generateShayariImage({
|   background,
|   shayari,
|   title
| })
|--------------------------------------------------------------------------
*/

async function generateShayariImage(options = {}) {

    try {

        const {
            background,
            shayari,
            title = "",
            outputName
        } = options;


        /*
        |--------------------------------------------------------------------------
        | Validate Shayari
        |--------------------------------------------------------------------------
        */

        const finalShayari =
            cleanShayari(
                shayari,
                title
            );

        if (!finalShayari) {

            throw new Error(
                "Shayari content is required."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Resolve background
        |--------------------------------------------------------------------------
        */

        const backgroundPath =
            resolveBackground(
                background
            );

        if (!backgroundPath) {

            throw new Error(
                `Background image not found: ${background}`
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Read background metadata
        |--------------------------------------------------------------------------
        */

        const metadata =
            await sharp(backgroundPath)
                .metadata();


        const width =
            metadata.width || 1080;

        const height =
            metadata.height || 1080;


        /*
        |--------------------------------------------------------------------------
        | Logo
        |--------------------------------------------------------------------------
        */

        const logo =
            loadLogo();


        const logoBase64 =
            logo
                ? logo.toString("base64")
                : null;


        /*
        |--------------------------------------------------------------------------
        | Hindi font
        |--------------------------------------------------------------------------
        */

        const hindiFont =
            findHindiFont();

        const fontFamily =
            hindiFont
                ? "Noto Sans Devanagari"
                : "sans-serif";


        /*
        |--------------------------------------------------------------------------
        | SVG overlay
        |--------------------------------------------------------------------------
        */

        const svg =
            createTextSvg({

                width,
                height,

                shayari:
                    finalShayari,

                logoData:
                    logoBase64,

                fontFamily,

                fontSize:
                    width >= 1200
                        ? 54
                        : 44

            });


        /*
        |--------------------------------------------------------------------------
        | Output filename
        |--------------------------------------------------------------------------
        */

        const safeName =
            String(
                outputName ||
                `shayari-${Date.now()}`
            )
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );

        const outputPath =
            path.join(
                GENERATED_DIR,
                `${safeName}.png`
            );


        /*
        |--------------------------------------------------------------------------
        | Generate PNG
        |--------------------------------------------------------------------------
        */

        await sharp(backgroundPath)
            .resize(
                width,
                height,
                {
                    fit: "cover"
                }
            )
            .composite([
                {
                    input:
                        Buffer.from(
                            svg
                        ),
                    top: 0,
                    left: 0
                }
            ])
            .png({
                compressionLevel: 9,
                adaptiveFiltering: true
            })
            .toFile(outputPath);


        console.log(
            "✅ Shayari image generated:",
            outputPath
        );


        /*
        |--------------------------------------------------------------------------
        | Return result
        |--------------------------------------------------------------------------
        */

        return {

            success: true,

            path:
                outputPath,

            filename:
                `${safeName}.png`,

            url:
                `/uploads/generated/${safeName}.png`

        };


    } catch (error) {

        console.error(
            "❌ Shayari Image Generation Error:",
            error
        );

        throw error;

    }

}


/*
|--------------------------------------------------------------------------
| SIMPLE ALIAS
|--------------------------------------------------------------------------
*/

const createShayariImage =
    generateShayariImage;


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    generateShayariImage,

    createShayariImage,

    cleanShayari,

    wrapText,

    findHindiFont

};
