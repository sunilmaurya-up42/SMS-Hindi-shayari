"use strict";

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const {
    createCanvas,
    loadImage,
    registerFont
} = require("canvas");


/*
|--------------------------------------------------------------------------
| PATHS
|--------------------------------------------------------------------------
*/

const ROOT_DIR = path.resolve(
    __dirname,
    "../.."
);

const PUBLIC_DIR = path.join(
    ROOT_DIR,
    "public"
);

const FONT_DIR = path.join(
    PUBLIC_DIR,
    "fonts"
);

const IMAGE_DIR = path.join(
    PUBLIC_DIR,
    "images"
);

const GENERATED_DIR = path.join(
    PUBLIC_DIR,
    "uploads",
    "generated"
);


/*
|--------------------------------------------------------------------------
| Create generated directory
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(
        GENERATED_DIR,
        {
            recursive: true
        }
    );
}


/*
|--------------------------------------------------------------------------
| FONT FILES
|--------------------------------------------------------------------------
*/

const LOCAL_REGULAR_FONT =
    path.join(
        FONT_DIR,
        "NotoSansDevanagari-Regular.ttf"
    );

const LOCAL_BOLD_FONT =
    path.join(
        FONT_DIR,
        "NotoSansDevanagari-Bold.ttf"
    );


/*
|--------------------------------------------------------------------------
| Render/system font locations
|--------------------------------------------------------------------------
*/

const SYSTEM_FONT_PATHS = [

    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",

    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-SemiCondensed.ttf",

    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-ExtraCondensed.ttf",

    "/usr/share/fonts/truetype/noto/NotoSansDevanagariUI-Regular.ttf",

    "/usr/share/fonts/opentype/noto/NotoSansDevanagari-Regular.ttf",

    "/usr/share/fonts/truetype/lohit-devanagari/Lohit-Devanagari.ttf"

];


/*
|--------------------------------------------------------------------------
| Online font sources
|--------------------------------------------------------------------------
|
| First source may redirect.
| Second source is direct raw GitHub.
|--------------------------------------------------------------------------
*/

const FONT_URLS = [

    "https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf",

    "https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf"

];


let devanagariReady = false;
let devanagariLoading = null;

let DEVANAGARI_FONT_FILE = null;


/*
|--------------------------------------------------------------------------
| Validate TTF
|--------------------------------------------------------------------------
*/

function isValidFontBuffer(buffer) {

    if (!Buffer.isBuffer(buffer)) {
        return false;
    }

    if (buffer.length < 1000) {
        return false;
    }

    const signature =
        buffer
            .subarray(0, 4)
            .toString("ascii");

    /*
     * TTF
     */
    if (
        signature === "\u0000\u0001\u0000\u0000"
    ) {
        return true;
    }

    /*
     * OpenType
     */
    if (
        signature === "OTTO"
    ) {
        return true;
    }

    /*
     * TrueType collection
     */
    if (
        signature === "ttcf"
    ) {
        return true;
    }

    return false;
}


/*
|--------------------------------------------------------------------------
| Find local/system Hindi font
|--------------------------------------------------------------------------
*/

function findExistingHindiFont() {

    const candidates = [

        LOCAL_REGULAR_FONT,

        LOCAL_BOLD_FONT,

        ...SYSTEM_FONT_PATHS

    ];

    for (
        const file
        of candidates
    ) {

        try {

            if (
                fs.existsSync(file) &&
                fs.statSync(file).size > 10000
            ) {

                console.log(
                    "✅ Devanagari font found:",
                    file
                );

                return file;
            }

        } catch (error) {

            // Continue searching.

        }
    }

    return null;
}


/*
|--------------------------------------------------------------------------
| Download Hindi font
|--------------------------------------------------------------------------
*/

async function downloadHindiFont() {

    for (
        const url
        of FONT_URLS
    ) {

        try {

            console.log(
                "📥 Downloading Hindi font:",
                url
            );

            const response =
                await fetch(url);

            if (!response.ok) {

                console.warn(
                    "⚠️ Font HTTP status:",
                    response.status
                );

                continue;
            }

            const buffer =
                Buffer.from(
                    await response.arrayBuffer()
                );


            if (
                !isValidFontBuffer(
                    buffer
                )
            ) {

                console.warn(
                    "⚠️ Downloaded file is not a valid TTF/OTF."
                );

                continue;
            }


            fs.mkdirSync(
                FONT_DIR,
                {
                    recursive: true
                }
            );


            fs.writeFileSync(
                LOCAL_REGULAR_FONT,
                buffer
            );


            console.log(
                "✅ Hindi font saved:",
                LOCAL_REGULAR_FONT
            );


            return LOCAL_REGULAR_FONT;

        } catch (error) {

            console.warn(
                "⚠️ Hindi font download failed:",
                error.message
            );

        }
    }

    return null;
}


/*
|--------------------------------------------------------------------------
| Register Hindi font
|--------------------------------------------------------------------------
*/

async function ensureDevanagariFonts() {

    if (
        devanagariReady &&
        DEVANAGARI_FONT_FILE
    ) {

        return DEVANAGARI_FONT_FILE;
    }


    if (devanagariLoading) {
        return devanagariLoading;
    }


    devanagariLoading =
        (async () => {

            try {

                /*
                 * 1. Local/system font
                 */

                let font =
                    findExistingHindiFont();


                /*
                 * 2. Download if unavailable
                 */

                if (!font) {

                    font =
                        await downloadHindiFont();

                }


                /*
                 * IMPORTANT:
                 *
                 * Do NOT generate image with
                 * an unregistered Hindi font.
                 *
                 * Otherwise boxes like 01F / 496
                 * appear.
                 */

                if (!font) {

                    throw new Error(
                        "Devanagari font is unavailable. Hindi image generation stopped to prevent broken Unicode boxes."
                    );

                }


                /*
                 * Register font
                 */

                registerFont(
                    font,
                    {
                        family:
                            "SMSNotoDevanagari",
                        weight:
                            "normal"
                    }
                );


                /*
                 * If bold font exists,
                 * register it too.
                 */

                if (
                    fs.existsSync(
                        LOCAL_BOLD_FONT
                    ) &&
                    fs.statSync(
                        LOCAL_BOLD_FONT
                    ).size > 10000
                ) {

                    registerFont(
                        LOCAL_BOLD_FONT,
                        {
                            family:
                                "SMSNotoDevanagari",
                            weight:
                                "bold"
                        }
                    );

                }


                DEVANAGARI_FONT_FILE =
                    font;

                devanagariReady =
                    true;


                console.log(
                    "✅ Devanagari font registered successfully."
                );


                return font;

            } catch (error) {

                console.error(
                    "❌ Devanagari font setup failed:",
                    error.message
                );

                devanagariReady =
                    false;

                DEVANAGARI_FONT_FILE =
                    null;

                throw error;
            }

        })();


    return devanagariLoading;
}


/*
|--------------------------------------------------------------------------
| BASIC IMAGE FUNCTIONS
|--------------------------------------------------------------------------
*/

exports.resize = async (
    input,
    output,
    width,
    height
) => {

    await sharp(input)
        .resize(
            width,
            height
        )
        .toFile(output);

    return output;
};


exports.compress = async (
    input,
    output,
    quality = 80
) => {

    await sharp(input)
        .jpeg({
            quality
        })
        .toFile(output);

    return output;
};


exports.toWebP = async (
    input,
    output,
    quality = 90
) => {

    await sharp(input)
        .webp({
            quality
        })
        .toFile(output);

    return output;
};


/*
|--------------------------------------------------------------------------
| Keep old alias
|--------------------------------------------------------------------------
*/

exports.toWebp =
    exports.toWebP;


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


exports.thumbnail = async (
    input,
    output
) => {

    await sharp(input)
        .resize(
            300,
            300
        )
        .webp({
            quality: 85
        })
        .toFile(output);

    return output;
};


exports.blur = async (
    input,
    output
) => {

    await sharp(input)
        .blur()
        .toFile(output);

    return output;
};


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


exports.flip = async (
    input,
    output
) => {

    await sharp(input)
        .flip()
        .toFile(output);

    return output;
};


exports.metadata = async (
    input
) => {

    return sharp(input)
        .metadata();
};


exports.delete = (
    file
) => {

    if (
        file &&
        fs.existsSync(file)
    ) {

        fs.unlinkSync(file);
    }
};


exports.exists = (
    file
) => {

    return fs.existsSync(file);
};


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


exports.info = async (
    file
) => {

    const meta =
        await sharp(file)
            .metadata();

    const stat =
        fs.statSync(file);

    return {

        name:
            path.basename(file),

        size:
            stat.size,

        width:
            meta.width,

        height:
            meta.height,

        format:
            meta.format,

        created:
            stat.birthtime,

        modified:
            stat.mtime

    };
};


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
| TEXT HELPERS
|--------------------------------------------------------------------------
*/


function normalizeText(text) {

    return String(
        text || ""
    )
        .replace(
            /\r\n/g,
            "\n"
        )
        .replace(
            /\r/g,
            "\n"
        )
        .replace(
            /\u0000/g,
            ""
        )
        .trim();
}


function removeHtml(text) {

    return String(
        text || ""
    )
        .replace(
            /<br\s*\/?>/gi,
            "\n"
        )
        .replace(
            /<\/p>/gi,
            "\n"
        )
        .replace(
            /<[^>]*>/g,
            ""
        )
        .replace(
            /&nbsp;/gi,
            " "
        )
        .replace(
            /&amp;/gi,
            "&"
        )
        .replace(
            /&lt;/gi,
            "<"
        )
        .replace(
            /&gt;/gi,
            ">"
        );
}


/*
|--------------------------------------------------------------------------
| Clean Shayari
|--------------------------------------------------------------------------
|
| IMPORTANT:
| title is intentionally NOT rendered.
|
|--------------------------------------------------------------------------
*/

function cleanShayari(
    content
) {

    let text =
        removeHtml(
            content
        );

    text =
        normalizeText(
            text
        );

    /*
     * Keep line breaks.
     */

    text =
        text
            .replace(
                /[ \t]+/g,
                " "
            )
            .replace(
                /\n{3,}/g,
                "\n\n"
            )
            .trim();

    return text;
}


/*
|--------------------------------------------------------------------------
| Escape HTML/XML
|--------------------------------------------------------------------------
*/

function escapeXml(text) {

    return String(
        text || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&apos;"
        );
}


/*
|--------------------------------------------------------------------------
| Canvas Text Wrap
|--------------------------------------------------------------------------
*/

function wrapText(
    ctx,
    text,
    maxWidth
) {

    const lines = [];

    const paragraphs =
        String(
            text || ""
        )
        .split(/\r?\n/);


    for (
        const paragraph
        of paragraphs
    ) {

        const cleanParagraph =
            paragraph.trim();


        if (!cleanParagraph) {

            lines.push("");

            continue;
        }


        const words =
            cleanParagraph
                .split(/\s+/);


        let line = "";


        for (
            const word
            of words
        ) {

            const testLine =
                line
                    ? `${line} ${word}`
                    : word;


            if (
                ctx.measureText(
                    testLine
                ).width <= maxWidth
            ) {

                line =
                    testLine;

                continue;
            }


            /*
             * Current line is full.
             */

            if (line) {

                lines.push(
                    line
                );
            }


            /*
             * Handle long word.
             */

            if (
                ctx.measureText(
                    word
                ).width > maxWidth
            ) {

                let part = "";


                for (
                    const character
                    of Array.from(word)
                ) {

                    const testPart =
                        part +
                        character;


                    if (
                        ctx.measureText(
                            testPart
                        ).width > maxWidth &&
                        part
                    ) {

                        lines.push(
                            part
                        );

                        part =
                            character;

                    } else {

                        part =
                            testPart;
                    }
                }


                line =
                    part;

            } else {

                line =
                    word;
            }
        }


        if (line) {

            lines.push(
                line
            );
        }
    }


    return lines;
}


/*
|--------------------------------------------------------------------------
| Find Website Logo
|--------------------------------------------------------------------------
*/

function findLogo() {

    const logoCandidates = [

        path.join(
            IMAGE_DIR,
            "logo.png"
        ),

        path.join(
            IMAGE_DIR,
            "logo.webp"
        ),

        path.join(
            IMAGE_DIR,
            "logo.jpg"
        )

    ];


    for (
        const file
        of logoCandidates
    ) {

        try {

            if (
                fs.existsSync(file)
            ) {

                return file;
            }

        } catch (_) {}

    }


    return null;
}


/*
|--------------------------------------------------------------------------
| Draw Logo
|--------------------------------------------------------------------------
*/

async function drawLogo(
    ctx,
    width,
    height
) {

    const logoPath =
        findLogo();


    if (!logoPath) {

        console.warn(
            "⚠️ public/images/logo.png not found."
        );

        return;
    }


    try {

        const logo =
            await loadImage(
                logoPath
            );


        /*
         * Top-left logo.
         */

        const maxWidth =
            Math.min(
                width * 0.16,
                180
            );

        const maxHeight =
            Math.min(
                height * 0.12,
                120
            );


        const ratio =
            Math.min(
                maxWidth / logo.width,
                maxHeight / logo.height
            );


        const logoWidth =
            logo.width * ratio;

        const logoHeight =
            logo.height * ratio;


        ctx.drawImage(
            logo,
            35,
            35,
            logoWidth,
            logoHeight
        );


    } catch (error) {

        console.warn(
            "⚠️ Logo could not be loaded:",
            error.message
        );
    }
}


/*
|--------------------------------------------------------------------------
| Download Background
|--------------------------------------------------------------------------
*/

async function loadBackground(
    backgroundUrl
) {

    if (!backgroundUrl) {

        throw new Error(
            "Background image URL is required."
        );
    }


    console.log(
        "🖼️ Background:",
        backgroundUrl
    );


    const response =
        await fetch(
            backgroundUrl
        );


    if (!response.ok) {

        throw new Error(
            `Background download failed: HTTP ${response.status}`
        );
    }


    const buffer =
        Buffer.from(
            await response.arrayBuffer()
        );


    if (!buffer.length) {

        throw new Error(
            "Downloaded background is empty."
        );
    }


    return buffer;
}


/*
|--------------------------------------------------------------------------
| Generate Image Buffer
|--------------------------------------------------------------------------
|
| FINAL DESIGN:
|
| Background
|     ↓
| Dark transparent overlay
|     ↓
| Shayari box
|     ↓
| ONLY SHAYARI
|     ↓
| Logo top-left
|     ↓
| SMS Hindi Shayari watermark
|
| TITLE IS NEVER DRAWN.
|
|--------------------------------------------------------------------------
*/

exports.generateShayariImage =
async ({
    backgroundUrl,
    title,
    content,
    watermark = "SMS Hindi Shayari"
}) => {

    /*
     * title is intentionally ignored.
     *
     * It is kept in the function signature because
     * the existing controller sends it.
     */

    void title;


    /*
     * Font must be ready BEFORE canvas creation.
     */

    await ensureDevanagariFonts();


    if (
        !DEVANAGARI_FONT_FILE
    ) {

        throw new Error(
            "Hindi font unavailable."
        );
    }


    /*
     * Shayari content only.
     */

    const shayari =
        cleanShayari(
            content
        );


    if (!shayari) {

        throw new Error(
            "Shayari content is empty."
        );
    }


    /*
     * Background.
     */

    const backgroundBuffer =
        await loadBackground(
            backgroundUrl
        );


    const background =
        await loadImage(
            backgroundBuffer
        );


    const width =
        background.width;

    const height =
        background.height;


    if (
        !width ||
        !height
    ) {

        throw new Error(
            "Invalid background dimensions."
        );
    }


    /*
     * Canvas.
     */

    const canvas =
        createCanvas(
            width,
            height
        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    /*
     * Background.
     */

    ctx.drawImage(
        background,
        0,
        0,
        width,
        height
    );


    /*
     * Slight dark overlay.
     */

    ctx.fillStyle =
        "rgba(0,0,0,0.20)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * Logo.
     */

    await drawLogo(
        ctx,
        width,
        height
    );


    /*
     * Shayari box.
     */

    const boxWidth =
        width * 0.86;

    const boxX =
        (width - boxWidth) / 2;

    const boxY =
        height * 0.18;

    const boxHeight =
        height * 0.60;


    /*
     * Box background.
     */

    ctx.fillStyle =
        "rgba(0,0,0,0.42)";


    ctx.fillRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
    );


    /*
     * Box border.
     */

    ctx.strokeStyle =
        "rgba(255,255,255,0.48)";

    ctx.lineWidth =
        Math.max(
            2,
            Math.round(
                width * 0.002
            )
        );


    ctx.strokeRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
    );


    /*
     * Shayari font.
     */

    let fontSize =
        Math.max(
            30,
            Math.floor(
                width * 0.040
            )
        );


    const maxTextWidth =
        boxWidth - 90;


    /*
     * Text wrapping.
     */

    ctx.font =
        `${fontSize}px "SMSNotoDevanagari"`;


    let lines =
        wrapText(
            ctx,
            shayari,
            maxTextWidth
        );


    /*
     * If too many lines,
     * reduce font size.
     */

    while (
        lines.length > 10 &&
        fontSize > 28
    ) {

        fontSize -= 2;

        ctx.font =
            `${fontSize}px "SMSNotoDevanagari"`;

        lines =
            wrapText(
                ctx,
                shayari,
                maxTextWidth
            );
    }


    /*
     * Text line height.
     */

    const lineHeight =
        Math.round(
            fontSize * 1.55
        );


    const totalTextHeight =
        lines.length *
        lineHeight;


    /*
     * Center Shayari inside box.
     */

    const contentCenterY =
        boxY +
        boxHeight / 2;


    let textY =
        contentCenterY -
        totalTextHeight / 2 +
        lineHeight / 2;


    /*
     * Text style.
     */

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.font =
        `${fontSize}px "SMSNotoDevanagari"`;


    ctx.fillStyle =
        "#ffffff";


    ctx.strokeStyle =
        "rgba(0,0,0,0.72)";


    ctx.lineWidth =
        Math.max(
            1.5,
            fontSize * 0.035
        );


    ctx.shadowColor =
        "rgba(0,0,0,0.55)";

    ctx.shadowBlur =
        3;

    ctx.shadowOffsetX =
        1;

    ctx.shadowOffsetY =
        1;


    /*
     * ONLY SHAYARI.
     *
     * No title.
     */

    for (
        const line
        of lines
    ) {

        ctx.strokeText(
            line,
            width / 2,
            textY
        );


        ctx.fillText(
            line,
            width / 2,
            textY
        );


        textY +=
            lineHeight;
    }


    /*
     * Reset shadow.
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
     * Watermark.
     */

    const watermarkText =
        String(
            watermark ||
            "SMS Hindi Shayari"
        );


    const watermarkSize =
        Math.max(
            18,
            Math.floor(
                width * 0.023
            )
        );


    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "bottom";


    ctx.font =
        `bold ${watermarkSize}px Arial, sans-serif`;


    ctx.fillStyle =
        "rgba(255,255,255,0.90)";


    ctx.strokeStyle =
        "rgba(0,0,0,0.55)";


    ctx.lineWidth =
        1;


    ctx.strokeText(
        watermarkText,
        width / 2,
        height - 25
    );


    ctx.fillText(
        watermarkText,
        width / 2,
        height - 25
    );


    /*
     * PNG.
     */

    const output =
        canvas.toBuffer(
            "image/png"
        );


    if (
        !output ||
        output.length < 100
    ) {

        throw new Error(
            "Generated PNG is empty."
        );
    }


    console.log(
        "✅ Shayari PNG generated successfully."
    );


    return output;
};


/*
|--------------------------------------------------------------------------
| ADMIN GENERATE FUNCTION
|--------------------------------------------------------------------------
|
| Existing shayariController.js calls:
|
| imageService.generate({
|     title,
|     text,
|     background
| })
|
| Keep this API working.
|--------------------------------------------------------------------------
*/

exports.generate =
async ({
    title,
    text,
    background
}) => {

    const output =
        await exports.generateShayariImage({

            backgroundUrl:
                background,

            title,

            content:
                text,

            watermark:
                "SMS Hindi Shayari"

        });


    const filename =
        `shayari-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}.png`;


    const outputPath =
        path.join(
            GENERATED_DIR,
            filename
        );


    fs.writeFileSync(
        outputPath,
        output
    );


    return {

        success:
            true,

        path:
            outputPath,

        filePath:
            outputPath,

        filename,

        url:
            `/uploads/generated/${filename}`

    };
};


/*
|--------------------------------------------------------------------------
| Export helper functions
|--------------------------------------------------------------------------
*/

exports.cleanShayari =
    cleanShayari;

exports.wrapText =
    wrapText;

exports.ensureDevanagariFonts =
    ensureDevanagariFonts;

exports.findExistingHindiFont =
    findExistingHindiFont;
