"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = path.resolve(__dirname, "../..");

const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const FONT_DIR = path.join(PUBLIC_DIR, "fonts");
const IMAGE_DIR = path.join(PUBLIC_DIR, "images");

const GENERATED_DIR = path.join(
    PUBLIC_DIR,
    "uploads",
    "generated"
);

const TEMP_DIR = path.join(
    PUBLIC_DIR,
    "uploads",
    "temp"
);


/* =========================================================
   DIRECTORIES
========================================================= */

function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}

ensureDirectory(GENERATED_DIR);
ensureDirectory(TEMP_DIR);


/* =========================================================
   FONT SEARCH
========================================================= */

function findHindiFont(dir = FONT_DIR) {

    if (!fs.existsSync(dir)) {
        console.warn(
            "⚠️ Font directory not found:",
            dir
        );

        return null;
    }

    const preferredNames = [
        "NotoSansDevanagari-Regular.ttf",
        "Noto-Sans-Devanagari-Regular.ttf",
        "NotoSansDevanagari-Regular.otf",
        "Noto-Sans-Devanagari-Regular.otf",
        "NotoSansDevanagari-Medium.ttf",
        "NotoSansDevanagari-SemiBold.ttf",
        "Mangal.ttf",
        "Mangal-Regular.ttf",
        "Lohit-Devanagari.ttf"
    ];

    const allFonts = [];

    function walk(currentDir) {

        let entries;

        try {
            entries = fs.readdirSync(
                currentDir,
                {
                    withFileTypes: true
                }
            );
        } catch (error) {
            return;
        }

        for (const entry of entries) {

            const fullPath = path.join(
                currentDir,
                entry.name
            );

            if (entry.isDirectory()) {
                walk(fullPath);
                continue;
            }

            const lower =
                entry.name.toLowerCase();

            if (
                lower.endsWith(".ttf") ||
                lower.endsWith(".otf")
            ) {
                allFonts.push(fullPath);
            }
        }
    }

    walk(dir);

    /* First: exact preferred font */
    for (const preferred of preferredNames) {

        const found = allFonts.find(
            file =>
                path.basename(file).toLowerCase() ===
                preferred.toLowerCase()
        );

        if (found) {

            console.log(
                "✅ Hindi font:",
                found
            );

            return found;
        }
    }

    /* Second: Devanagari/Noto/Mangal/Lohit */
    const hindiFont = allFonts.find(
        file => {

            const name =
                path.basename(file)
                    .toLowerCase();

            return (
                name.includes("devanagari") ||
                name.includes("mangal") ||
                name.includes("lohit")
            );
        }
    );

    if (hindiFont) {

        console.log(
            "✅ Hindi font:",
            hindiFont
        );

        return hindiFont;
    }

    console.warn(
        "⚠️ No Devanagari font found in:",
        FONT_DIR
    );

    return null;
}


/* =========================================================
   XML ESCAPE
========================================================= */

function escapeXml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(value) {

    return String(value || "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\u0000/g, "")
        .trim();
}


/* =========================================================
   REMOVE TITLE FROM CONTENT
========================================================= */

function removeTitleFromShayari(
    content,
    title = ""
) {

    let text = normalizeText(content);

    const cleanTitle =
        normalizeText(title);

    if (!text) {
        return "";
    }

    if (cleanTitle) {

        /* Exact title at beginning */
        if (
            text === cleanTitle
        ) {
            return "";
        }

        if (
            text.startsWith(
                cleanTitle
            )
        ) {

            text = text
                .slice(cleanTitle.length)
                .trim();

        }

        /* Remove title from first line */
        const lines =
            text.split("\n");

        if (
            lines.length > 1 &&
            lines[0].trim() === cleanTitle
        ) {

            lines.shift();

            text =
                lines.join("\n")
                    .trim();
        }
    }

    return text;
}


/* =========================================================
   REMOVE HTML
========================================================= */

function removeHtml(text) {

    return String(text || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .trim();
}


/* =========================================================
   CLEAN SHAYARI
========================================================= */

function cleanShayari(
    content,
    title = ""
) {

    let text =
        removeHtml(content);

    text =
        removeTitleFromShayari(
            text,
            title
        );

    text =
        text
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

    return text;
}


/* =========================================================
   TEXT WRAP
========================================================= */

function wrapLine(
    line,
    maxCharacters
) {

    const words =
        line
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (!words.length) {
        return [""];
    }

    const result = [];

    let current = "";

    for (const word of words) {

        const candidate =
            current
                ? `${current} ${word}`
                : word;

        const length =
            Array.from(candidate)
                .length;

        if (
            length <=
            maxCharacters
        ) {

            current = candidate;

            continue;
        }

        if (current) {
            result.push(current);
        }

        /*
         * Very long word.
         */
        if (
            Array.from(word).length >
            maxCharacters
        ) {

            const chars =
                Array.from(word);

            while (
                chars.length >
                maxCharacters
            ) {

                result.push(
                    chars
                        .splice(
                            0,
                            maxCharacters
                        )
                        .join("")
                );
            }

            current =
                chars.join("");

        } else {

            current = word;

        }
    }

    if (current) {
        result.push(current);
    }

    return result;
}


function wrapShayari(
    text,
    maxCharacters
) {

    const paragraphs =
        String(text || "")
            .split("\n");

    const lines = [];

    for (
        const paragraph
        of paragraphs
    ) {

        if (!paragraph.trim()) {

            lines.push("");

            continue;
        }

        lines.push(
            ...wrapLine(
                paragraph,
                maxCharacters
            )
        );
    }

    return lines;
}


/* =========================================================
   LOGO
========================================================= */

function findLogo() {

    const possible = [

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
        ),

        path.join(
            PUBLIC_DIR,
            "logo.png"
        ),

        path.join(
            PUBLIC_DIR,
            "logo.webp"
        ),

        path.join(
            PUBLIC_DIR,
            "logo.jpg"
        )
    ];

    for (const file of possible) {

        if (fs.existsSync(file)) {

            console.log(
                "✅ Logo:",
                file
            );

            return file;
        }
    }

    console.warn(
        "⚠️ Logo not found."
    );

    return null;
}


/* =========================================================
   BACKGROUND RESOLUTION
========================================================= */

function resolveLocalBackground(
    background
) {

    if (!background) {
        return null;
    }

    if (
        path.isAbsolute(background) &&
        fs.existsSync(background)
    ) {

        return background;
    }

    const candidates = [

        path.join(
            PUBLIC_DIR,
            background
        ),

        path.join(
            ROOT_DIR,
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
        ),

        path.join(
            PUBLIC_DIR,
            "images",
            background
        )

    ];

    for (
        const candidate
        of candidates
    ) {

        if (
            fs.existsSync(candidate)
        ) {

            return candidate;
        }
    }

    return null;
}


/* =========================================================
   REMOTE BACKGROUND
========================================================= */

async function downloadRemoteBackground(
    url
) {

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Unable to download background. HTTP ${response.status}`
        );
    }

    const buffer =
        Buffer.from(
            await response.arrayBuffer()
        );

    const extension =
        url
            .split("?")[0]
            .split(".")
            .pop()
            .toLowerCase();

    const safeExtension =
        [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ].includes(extension)
            ? extension
            : "jpg";

    const filename =
        `background-${Date.now()}.${safeExtension}`;

    const filePath =
        path.join(
            TEMP_DIR,
            filename
        );

    fs.writeFileSync(
        filePath,
        buffer
    );

    return filePath;
}


async function resolveBackground(
    background
) {

    if (!background) {
        throw new Error(
            "Background image is required."
        );
    }

    /*
     * URL
     */
    if (
        /^https?:\/\//i.test(
            String(background)
        )
    ) {

        return downloadRemoteBackground(
            background
        );
    }

    /*
     * Local file
     */
    const local =
        resolveLocalBackground(
            background
        );

    if (local) {
        return local;
    }

    throw new Error(
        `Background image not found: ${background}`
    );
}


/* =========================================================
   CREATE SVG
========================================================= */

function createSvg({
    width,
    height,
    lines,
    fontFamily,
    fontData,
    logoData
}) {

    /*
     * Font embedding.
     *
     * If the font exists in public/fonts,
     * embed it directly into SVG.
     */

    let fontFace = "";

    if (fontData) {

        const base64Font =
            fontData.toString(
                "base64"
            );

        fontFace = `
            <style>
                @font-face {
                    font-family: "SMSHindiFont";
                    src: url(data:font/ttf;base64,${base64Font});
                }
            </style>
        `;

        fontFamily =
            "SMSHindiFont";
    }


    /*
     * Logo.
     */

    let logo = "";

    if (logoData) {

        logo = `
            <image
                href="data:image/png;base64,${logoData}"
                x="45"
                y="45"
                width="110"
                height="110"
                preserveAspectRatio="xMidYMid meet"
            />
        `;
    }


    /*
     * Shayari sizing.
     */

    let fontSize =
        width >= 1200
            ? 58
            : 48;

    const maxTextWidth =
        width * 0.78;

    const maxLines =
        10;

    if (
        lines.length >
        maxLines
    ) {

        fontSize =
            Math.max(
                32,
                Math.floor(
                    fontSize *
                    (
                        maxLines /
                        lines.length
                    )
                )
            );
    }


    const lineHeight =
        Math.round(
            fontSize * 1.55
        );

    const textBlockHeight =
        lines.length *
        lineHeight;


    /*
     * Center text vertically.
     */

    const centerY =
        height * 0.50;

    const firstY =
        centerY -
        (
            textBlockHeight /
            2
        ) +
        (
            lineHeight /
            2
        );


    /*
     * Shayari text.
     */

    const textSvg =
        lines
            .map(
                (
                    line,
                    index
                ) => {

                    const y =
                        firstY +
                        (
                            index *
                            lineHeight
                        );

                    return `
                        <text
                            x="${width / 2}"
                            y="${y}"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            direction="ltr"
                            unicode-bidi="plaintext"
                            font-family="${fontFamily}"
                            font-size="${fontSize}px"
                            font-weight="600"
                            fill="#ffffff"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-opacity="0.65"
                            paint-order="stroke"
                        >${escapeXml(line)}</text>
                    `;
                }
            )
            .join("\n");


    /*
     * Watermark.
     */

    const watermark = `
        <text
            x="${width / 2}"
            y="${height - 45}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="28px"
            font-weight="700"
            fill="#ffffff"
            stroke="#000000"
            stroke-width="1"
            stroke-opacity="0.35"
            paint-order="stroke"
            opacity="0.90"
        >
            SMS Hindi Shayari
        </text>
    `;


    return `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="${width}"
            height="${height}"
            viewBox="0 0 ${width} ${height}"
        >

            ${fontFace}

            ${logo}

            <!-- ONLY SHAYARI -->
            ${textSvg}

            <!-- WATERMARK -->
            ${watermark}

        </svg>
    `;
}


/* =========================================================
   GENERATE IMAGE
========================================================= */

async function generateShayariImage(
    options = {}
) {

    let backgroundPath = null;

    try {

        const {
            background,
            shayari,
            content,
            title = "",
            outputName
        } = options;


        /*
         * Accept both:
         *
         * shayari
         * content
         */

        const sourceText =
            shayari ||
            content ||
            "";


        /*
         * IMPORTANT:
         * Title is NOT rendered.
         */

        const finalShayari =
            cleanShayari(
                sourceText,
                title
            );


        if (!finalShayari) {

            throw new Error(
                "Shayari content is empty."
            );
        }


        /*
         * Background
         */

        backgroundPath =
            await resolveBackground(
                background
            );


        /*
         * Background metadata
         */

        const metadata =
            await sharp(
                backgroundPath
            )
            .metadata();


        const width =
            metadata.width ||
            1080;

        const height =
            metadata.height ||
            1080;


        /*
         * Hindi font
         */

        const hindiFont =
            findHindiFont();


        let fontData = null;

        if (hindiFont) {

            fontData =
                fs.readFileSync(
                    hindiFont
                );
        }


        /*
         * If no Hindi font exists,
         * use sans-serif only as fallback.
         */

        const fontFamily =
            hindiFont
                ? "SMSHindiFont"
                : "sans-serif";


        /*
         * Wrap Shayari.
         */

        const maxCharacters =
            width >= 1200
                ? 34
                : 27;

        const lines =
            wrapShayari(
                finalShayari,
                maxCharacters
            );


        /*
         * Logo
         */

        const logoPath =
            findLogo();

        let logoData = null;

        if (logoPath) {

            logoData =
                fs.readFileSync(
                    logoPath
                );

            /*
             * Convert logo to PNG
             * so SVG image embedding is safe.
             */

            try {

                logoData =
                    await sharp(
                        logoData
                    )
                    .png()
                    .toBuffer();

            } catch (error) {

                console.warn(
                    "⚠️ Logo conversion failed:",
                    error.message
                );
            }
        }


        /*
         * SVG
         */

        const svg =
            createSvg({

                width,
                height,

                lines,

                fontFamily,

                fontData,

                logoData

            });


        /*
         * Filename
         */

        let filename =
            outputName ||
            `shayari-${Date.now()}`;

        filename =
            String(filename)
                .replace(
                    /\.[a-z0-9]+$/i,
                    ""
                )
                .replace(
                    /[^a-zA-Z0-9_-]/g,
                    "-"
                )
                .replace(
                    /-+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );

        if (!filename) {
            filename =
                `shayari-${Date.now()}`;
        }


        const outputFilename =
            `${filename}.png`;

        const outputPath =
            path.join(
                GENERATED_DIR,
                outputFilename
            );


        /*
         * Generate PNG
         */

        await sharp(
            backgroundPath
        )
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
        .toFile(
            outputPath
        );


        console.log(
            "==========================================="
        );

        console.log(
            "✅ SHAYARI IMAGE GENERATED"
        );

        console.log(
            "📁 File:",
            outputPath
        );

        console.log(
            "📝 Shayari:",
            finalShayari
        );

        console.log(
            "🔤 Hindi Font:",
            hindiFont || "SYSTEM FALLBACK"
        );

        console.log(
            "==========================================="
        );


        /*
         * Return BOTH path and URL.
         */

        return {

            success: true,

            path:
                outputPath,

            filePath:
                outputPath,

            filename:
                outputFilename,

            url:
                `/uploads/generated/${outputFilename}`,

            downloadUrl:
                `/uploads/generated/${outputFilename}`,

            shayari:
                finalShayari

        };


    } catch (error) {

        console.error(
            "❌ IMAGE GENERATION FAILED"
        );

        console.error(
            error
        );

        throw error;


    } finally {

        /*
         * Remove temporary downloaded
         * background after generation.
         */

        if (
            backgroundPath &&
            backgroundPath.startsWith(
                TEMP_DIR
            )
        ) {

            try {

                if (
                    fs.existsSync(
                        backgroundPath
                    )
                ) {

                    fs.unlinkSync(
                        backgroundPath
                    );
                }

            } catch (error) {

                console.warn(
                    "Temporary background cleanup failed:",
                    error.message
                );
            }
        }
    }
}


/* =========================================================
   ALIASES
========================================================= */

const createShayariImage =
    generateShayariImage;


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    generateShayariImage,

    createShayariImage,

    cleanShayari,

    wrapShayari,

    findHindiFont,

    resolveBackground

};
