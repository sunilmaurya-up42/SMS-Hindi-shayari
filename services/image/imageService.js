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
| Devanagari Font Configuration
|--------------------------------------------------------------------------
*/

const FONT_DIR = path.join(
    __dirname,
    "../../public/fonts"
);

const REGULAR_FONT = path.join(
    FONT_DIR,
    "NotoSansDevanagari-Regular.ttf"
);

const BOLD_FONT = path.join(
    FONT_DIR,
    "NotoSansDevanagari-Bold.ttf"
);


/*
|--------------------------------------------------------------------------
| Official Noto Sans Devanagari Fonts
|--------------------------------------------------------------------------
*/

const REGULAR_FONT_URL =
    "https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf";

const BOLD_FONT_URL =
    "https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Bold.ttf";


let fontsRegistered = false;
let fontsLoading = null;


/*
|--------------------------------------------------------------------------
| Download Font
|--------------------------------------------------------------------------
*/

async function downloadFont(
    url,
    destination
) {

    try {

        if (
            fs.existsSync(destination) &&
            fs.statSync(destination).size > 10000
        ) {

            return destination;

        }


        fs.mkdirSync(
            path.dirname(destination),
            {
                recursive: true
            }
        );


        console.log(
            `📥 Downloading font: ${path.basename(destination)}`
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Font download failed: ${response.status}`
            );

        }


        const buffer =
            Buffer.from(
                await response.arrayBuffer()
            );


        fs.writeFileSync(
            destination,
            buffer
        );


        console.log(
            `✅ Font saved: ${destination}`
        );


        return destination;

    } catch (error) {

        console.error(
            `❌ Font download error (${path.basename(destination)}):`,
            error.message
        );

        return null;

    }

}


/*
|--------------------------------------------------------------------------
| Register Devanagari Fonts
|--------------------------------------------------------------------------
*/

async function ensureDevanagariFonts() {

    if (fontsRegistered) {

        return true;

    }


    if (fontsLoading) {

        return fontsLoading;

    }


    fontsLoading =
        (async () => {

            try {

                const regular =
                    await downloadFont(
                        REGULAR_FONT_URL,
                        REGULAR_FONT
                    );


                const bold =
                    await downloadFont(
                        BOLD_FONT_URL,
                        BOLD_FONT
                    );


                if (regular) {

                    registerFont(
                        regular,
                        {
                            family: "SMSNotoDevanagari",
                            weight: "normal"
                        }
                    );

                    console.log(
                        "✅ Regular Devanagari font registered."
                    );

                }


                if (bold) {

                    registerFont(
                        bold,
                        {
                            family: "SMSNotoDevanagari",
                            weight: "bold"
                        }
                    );

                    console.log(
                        "✅ Bold Devanagari font registered."
                    );

                }


                fontsRegistered =
                    Boolean(
                        regular ||
                        bold
                    );


                return fontsRegistered;

            } catch (error) {

                console.error(
                    "❌ Devanagari font registration error:",
                    error
                );

                return false;

            }

        })();


    return fontsLoading;

}


/*
|--------------------------------------------------------------------------
| Resize Image
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


/*
|--------------------------------------------------------------------------
| Compress Image
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Convert To WebP
|--------------------------------------------------------------------------
*/

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
| Crop Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Generate Thumbnail
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Blur Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Rotate Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Flip Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Get Metadata
|--------------------------------------------------------------------------
*/

exports.metadata = async (
    input
) => {

    return await sharp(
        input
    ).metadata();

};


/*
|--------------------------------------------------------------------------
| Delete Image
|--------------------------------------------------------------------------
*/

exports.delete = (
    file
) => {

    if (
        file &&
        fs.existsSync(file)
    ) {

        fs.unlinkSync(
            file
        );

    }

};


/*
|--------------------------------------------------------------------------
| File Exists
|--------------------------------------------------------------------------
*/

exports.exists = (
    file
) => {

    return fs.existsSync(
        file
    );

};


/*
|--------------------------------------------------------------------------
| Copy Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Move Image
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Image Information
|--------------------------------------------------------------------------
*/

exports.info = async (
    file
) => {

    const meta =
        await sharp(
            file
        ).metadata();


    const stat =
        fs.statSync(
            file
        );


    return {

        name:
            path.basename(
                file
            ),

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


/*
|--------------------------------------------------------------------------
| Optimize Image
|--------------------------------------------------------------------------
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
| Text Wrapping
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
        ).split(
            /\r?\n/
        );


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
            cleanParagraph.split(
                /\s+/
            );


        let line = "";


        for (
            const word
            of words
        ) {

            const testLine =
                line
                    ? `${line} ${word}`
                    : word;


            const testWidth =
                ctx.measureText(
                    testLine
                ).width;


            if (
                testWidth >
                maxWidth
            ) {

                if (line) {

                    lines.push(
                        line
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | Very Long Hindi Word
                |--------------------------------------------------------------------------
                */

                if (
                    ctx.measureText(
                        word
                    ).width >
                    maxWidth
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
                            ).width >
                            maxWidth &&
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

            } else {

                line =
                    testLine;

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
| Generate Shayari Image
|--------------------------------------------------------------------------
| GitHub Background
| +
| Shayari Title
| +
| Shayari Content
| +
| Website Watermark
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
    |--------------------------------------------------------------------------
    | Make Sure Hindi Font Is Ready
    |--------------------------------------------------------------------------
    */

    await ensureDevanagariFonts();


    /*
    |--------------------------------------------------------------------------
    | Validate Background URL
    |--------------------------------------------------------------------------
    */

    if (!backgroundUrl) {

        throw new Error(
            "Background image URL is required."
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Download GitHub Background
    |--------------------------------------------------------------------------
    */

    console.log(
        "🖼️ Downloading background:",
        backgroundUrl
    );


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


    const backgroundBuffer =
        Buffer.from(
            arrayBuffer
        );


    const backgroundImage =
        await loadImage(
            backgroundBuffer
        );


    /*
    |--------------------------------------------------------------------------
    | Canvas Size
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
        canvas.getContext(
            "2d"
        );


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
    | Dark Overlay
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
        height * 0.18;


    const boxHeight =
        height * 0.60;


    ctx.fillStyle =
        "rgba(0,0,0,0.50)";


    ctx.fillRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
    );


    /*
    |--------------------------------------------------------------------------
    | Box Border
    |--------------------------------------------------------------------------
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.30)";


    ctx.lineWidth =
        Math.max(
            2,
            Math.floor(
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


    const titleFontSize =
        Math.max(
            34,
            Math.floor(
                width * 0.055
            )
        );


    ctx.font =
        `bold ${titleFontSize}px "SMSNotoDevanagari", "Noto Sans Devanagari", sans-serif`;


    ctx.shadowColor =
        "rgba(0,0,0,0.85)";


    ctx.shadowBlur =
        5;


    ctx.shadowOffsetX =
        2;


    ctx.shadowOffsetY =
        2;


    const safeTitle =
        String(
            title || ""
        ).trim();


    const titleMaxWidth =
        boxWidth - 60;


    const titleLines =
        wrapText(
            ctx,
            safeTitle,
            titleMaxWidth
        );


    let titleY =
        boxY + 35;


    const titleLineHeight =
        titleFontSize * 1.35;


    for (
        const line
        of titleLines
    ) {

        ctx.fillText(
            line,
            width / 2,
            titleY
        );


        titleY +=
            titleLineHeight;

    }


    /*
    |--------------------------------------------------------------------------
    | Shayari Content
    |--------------------------------------------------------------------------
    */

    const fontSize =
        Math.max(
            25,
            Math.floor(
                width * 0.038
            )
        );


    ctx.font =
        `${fontSize}px "SMSNotoDevanagari", "Noto Sans Devanagari", sans-serif`;


    ctx.fillStyle =
        "#ffffff";


    const maxTextWidth =
        boxWidth - 70;


    const lineHeight =
        fontSize * 1.55;


    const lines =
        wrapText(
            ctx,
            content,
            maxTextWidth
        );


    /*
    |--------------------------------------------------------------------------
    | Calculate Text Position
    |--------------------------------------------------------------------------
    */

    const titleSpace =
        titleLines.length *
        titleLineHeight;


    const contentAreaTop =
        boxY +
        35 +
        titleSpace +
        30;


    const contentAreaBottom =
        boxY +
        boxHeight -
        35;


    const contentAreaHeight =
        contentAreaBottom -
        contentAreaTop;


    const totalTextHeight =
        lines.length *
        lineHeight;


    let textY =
        contentAreaTop +
        (
            contentAreaHeight -
            totalTextHeight
        ) / 2;


    /*
    |--------------------------------------------------------------------------
    | Prevent Text From Going Outside Box
    |--------------------------------------------------------------------------
    */

    if (
        textY <
        contentAreaTop
    ) {

        textY =
            contentAreaTop;

    }


    /*
    |---------------------------------------------------------
