const fs = require("fs");

const Background =
    require("../../models/Background");

const githubService =
    require("../../services/github/githubService");


/*
|--------------------------------------------------------------------------
| UPLOAD BACKGROUND
|--------------------------------------------------------------------------
*/

exports.upload = async (req, res) => {

    let uploadedFile = null;

    try {

        /*
        |--------------------------------------------------------------------------
        | CHECK FILE
        |--------------------------------------------------------------------------
        */

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Background image is required."

            });

        }


        uploadedFile =
            req.file;


        /*
        |--------------------------------------------------------------------------
        | UPLOAD TO GITHUB
        |--------------------------------------------------------------------------
        */

        const github =
            await githubService.uploadBackground(
                req.file
            );


        /*
        |--------------------------------------------------------------------------
        | CREATE MONGODB RECORD
        |--------------------------------------------------------------------------
        */

        const background =
            await Background.create({

                title:
                    (req.body.title ||
                        req.file.originalname ||
                        "Background"
                    ).trim(),


                githubFileName:
                    github.githubFileName ||
                    github.fileName,


                githubPath:
                    github.githubPath ||
                    github.path,


                githubUrl:
                    github.githubUrl,


                githubDownloadUrl:
                    github.githubDownloadUrl ||
                    github.downloadUrl,


                sha:
                    github.sha || "",


                width:
                    Number(req.body.width) || 0,


                height:
                    Number(req.body.height) || 0,


                fileSize:
                    Number(req.file.size) || 0,


                mimeType:
                    req.file.mimetype ||
                    "image/jpeg",


                isActive:
                    true

            });


        /*
        |--------------------------------------------------------------------------
        | REMOVE TEMPORARY LOCAL FILE
        |--------------------------------------------------------------------------
        */

        if (
            req.file.path &&
            fs.existsSync(req.file.path)
        ) {

            try {

                fs.unlinkSync(
                    req.file.path
                );

            } catch (fileError) {

                console.warn(
                    "⚠️ Temporary background file could not be removed:",
                    fileError.message
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Background uploaded to GitHub successfully.",

            data:
                background

        });


    } catch (error) {

        console.error(
            "❌ Background Upload Error:",
            error
        );


        /*
        |--------------------------------------------------------------------------
        | CLEAN TEMP FILE ON ERROR
        |--------------------------------------------------------------------------
        */

        if (
            uploadedFile &&
            uploadedFile.path &&
            fs.existsSync(uploadedFile.path)
        ) {

            try {

                fs.unlinkSync(
                    uploadedFile.path
                );

            } catch (fileError) {

                console.warn(
                    "⚠️ Temporary file cleanup failed:",
                    fileError.message
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | ERROR RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Upload failed."

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET ALL BACKGROUNDS
|--------------------------------------------------------------------------
*/

exports.getAll = async (req, res) => {

    try {

        const page =
            Math.max(
                Number(req.query.page) || 1,
                1
            );


        const limit =
            Math.min(
                Math.max(
                    Number(req.query.limit) || 20,
                    1
                ),
                100
            );


        const skip =
            (page - 1) * limit;


        const total =
            await Background.countDocuments();


        const backgrounds =
            await Background.find({})
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean();


        return res.json({

            success: true,

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),

            data:
                backgrounds

        });


    } catch (error) {

        console.error(
            "❌ Get Backgrounds Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| RANDOM BACKGROUND
|--------------------------------------------------------------------------
*/

exports.random = async (req, res) => {

    try {

        const backgrounds =
            await Background.aggregate([

                {
                    $match: {
                        isActive: true
                    }
                },

                {
                    $sample: {
                        size: 1
                    }
                }

            ]);


        return res.json({

            success: true,

            data:
                backgrounds[0] || null

        });


    } catch (error) {

        console.error(
            "❌ Random Background Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| PREVIEW
|--------------------------------------------------------------------------
*/

exports.preview = async (req, res) => {

    try {

        const background =
            await Background.findById(
                req.params.id
            ).lean();


        if (!background) {

            return res.status(404).json({

                success: false,

                message:
                    "Background not found."

            });

        }


        return res.json({

            success: true,

            data:
                background

        });


    } catch (error) {

        console.error(
            "❌ Preview Background Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

exports.categories = async (req, res) => {

    try {

        const categories =
            await Background.distinct(
                "category"
            );


        return res.json({

            success: true,

            data:
                categories

        });


    } catch (error) {

        console.error(
            "❌ Background Categories Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (req, res) => {

    try {

        const background =
            await Background.findById(
                req.params.id
            );


        if (!background) {

            return res.status(404).json({

                success: false,

                message:
                    "Background not found."

            });

        }


        if (
            typeof req.body.title === "string"
        ) {

            const title =
                req.body.title.trim();


            if (title) {

                background.title =
                    title;

            }

        }


        if (
            typeof req.body.width !==
            "undefined"
        ) {

            background.width =
                Number(req.body.width) || 0;

        }


        if (
            typeof req.body.height !==
            "undefined"
        ) {

            background.height =
                Number(req.body.height) || 0;

        }


        if (
            typeof req.body.language ===
            "string"
        ) {

            background.language =
                req.body.language.trim();

        }


        if (
            typeof req.body.tags ===
            "string"
        ) {

            background.tags =
                req.body.tags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(Boolean);

        }


        await background.save();


        return res.json({

            success: true,

            message:
                "Background updated successfully.",

            data:
                background

        });


    } catch (error) {

        console.error(
            "❌ Update Background Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| TOGGLE ACTIVE / INACTIVE
|--------------------------------------------------------------------------
*/

exports.toggle = async (req, res) => {

    try {

        const background =
            await Background.findById(
                req.params.id
            );


        if (!background) {

            return res.status(404).json({

                success: false,

                message:
                    "Background not found."

            });

        }


        background.isActive =
            !background.isActive;


        await background.save();


        return res.json({

            success: true,

            message:
                background.isActive
                    ? "Background activated."
                    : "Background deactivated.",

            isActive:
                background.isActive

        });


    } catch (error) {

        console.error(
            "❌ Toggle Background Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| DELETE BACKGROUND
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {

    try {

        const background =
            await Background.findById(
                req.params.id
            );


        if (!background) {

            return res.status(404).json({

                success: false,

                message:
                    "Background not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | DELETE FROM GITHUB
        |--------------------------------------------------------------------------
        */

        if (
            background.githubPath
        ) {

            await githubService.deleteBackground(

                background.githubPath,

                background.sha

            );

        }


        /*
        |--------------------------------------------------------------------------
        | DELETE FROM MONGODB
        |--------------------------------------------------------------------------
        */

        await background.deleteOne();


        return res.json({

            success: true,

            message:
                "Background deleted successfully."

        });


    } catch (error) {

        console.error(
            "❌ Delete Background Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Delete failed."

        });

    }

};


/*
|--------------------------------------------------------------------------
| ANALYTICS
|--------------------------------------------------------------------------
*/

exports.analytics = async (req, res) => {

    try {

        const total =
            await Background.countDocuments();


        const active =
            await Background.countDocuments({

                isActive: true

            });


        const inactive =
            await Background.countDocuments({

                isActive: false

            });


        return res.json({

            success: true,

            total,

            active,

            inactive

        });


    } catch (error) {

        console.error(
            "❌ Background Analytics Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| GITHUB UPLOAD
|--------------------------------------------------------------------------
*/

exports.githubUpload = async (
    req,
    res
) => {

    return exports.upload(
        req,
        res
    );

};
