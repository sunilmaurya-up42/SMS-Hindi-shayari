const Background = require("../../models/Background");
const githubService = require("../../services/github/githubService");


/*
|--------------------------------------------------------------------------
| UPLOAD BACKGROUND
|--------------------------------------------------------------------------
*/

exports.upload = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Background image is required."
            });

        }


        const github =
            await githubService.uploadBackground(
                req.file
            );


        const background =
            await Background.create({

                title:
                    (req.body.title || "Background")
                        .trim(),

                githubFileName:
                    github.fileName,

                githubUrl:
                    github.githubUrl,

                githubDownloadUrl:
                    github.githubDownloadUrl,

                sha:
                    github.sha,

                width:
                    Number(req.body.width) || 0,

                height:
                    Number(req.body.height) || 0,

                fileSize:
                    Number(req.file.size) || 0,

                mimeType:
                    req.file.mimetype || "image/jpeg",

                isActive:
                    true

            });


        return res.status(201).json({

            success: true,

            message:
                "Background uploaded to GitHub successfully.",

            data: background

        });


    } catch (error) {

        console.error(
            "❌ Background Upload Error:",
            error
        );

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
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 20;

        const skip =
            (page - 1) * limit;


        const total =
            await Background.countDocuments();


        const backgrounds =
            await Background.find()
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
                Math.ceil(total / limit),

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

        const background =
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
                background[0] || null

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
            await Background.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!background) {

            return res.status(404).json({

                success: false,

                message:
                    "Background not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Background updated.",

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
| TOGGLE
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

            isActive:
                background.isActive

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error."

        });

    }

};


/*
|--------------------------------------------------------------------------
| DELETE
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
        | Delete From GitHub
        |--------------------------------------------------------------------------
        */

        if (background.githubPath) {

            await githubService.deleteBackground(

                background.githubPath,

                background.sha

            );

        }


        /*
        |--------------------------------------------------------------------------
        | Delete MongoDB Record
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

exports.githubUpload = async (req, res) => {

    return exports.upload(req, res);

};
