const { Octokit } = require("@octokit/rest");
const path = require("path");
const fs = require("fs");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const GITHUB_REPOSITORY =
    (
        process.env.GITHUB_REPO ||
        process.env.GITHUB_REPOSITORY ||
        ""
    ).trim()
        .replace(/^https?:\/\/github\.com\//i, "")
        .replace(/\/+$/, "");


const OWNER =
    (
        process.env.GITHUB_OWNER ||
        process.env.GITHUB_USERNAME ||
        GITHUB_REPOSITORY.split("/")[0] ||
        ""
    ).trim();


const REPO =
    (
        GITHUB_REPOSITORY.includes("/")
            ? GITHUB_REPOSITORY.split("/")[1]
            : GITHUB_REPOSITORY
    ).trim();

const BRANCH =
    process.env.GITHUB_BRANCH || "main";

const BACKGROUND_FOLDER =
    (process.env.GITHUB_BACKGROUND_FOLDER || "backgrounds")
        .replace(/^\/+|\/+$/g, "");


/*
|--------------------------------------------------------------------------
| CHECK GITHUB CONFIG
|--------------------------------------------------------------------------
*/

function checkConfig() {

    if (!process.env.GITHUB_TOKEN) {
        throw new Error("GITHUB_TOKEN is missing.");
    }

    if (!OWNER) {
        throw new Error(
            "GITHUB_OWNER or GITHUB_USERNAME is missing."
        );
    }

    if (!REPO) {
        throw new Error(
            "GITHUB_REPO or GITHUB_REPOSITORY is missing."
        );
    }

}


/*
|--------------------------------------------------------------------------
| UPLOAD FILE
|--------------------------------------------------------------------------
*/

exports.uploadFile = async (
    localFile,
    folder = "uploads"
) => {

    checkConfig();

    if (!localFile) {
        throw new Error("Local file is required.");
    }

    if (!fs.existsSync(localFile)) {
        throw new Error(
            `File not found: ${localFile}`
        );
    }

    const buffer =
        fs.readFileSync(localFile);

    const originalName =
        path.basename(localFile);

    const safeName =
        originalName
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9._-]/g, "");

    const fileName =
        `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;

    const githubPath =
        `${folder}/${fileName}`;


    /*
    |--------------------------------------------------------------------------
    | UPLOAD TO GITHUB
    |--------------------------------------------------------------------------
    */

    const response =
        await octokit.repos.createOrUpdateFileContents({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            message:
                `Upload ${fileName}`,

            content:
                buffer.toString("base64"),

            branch: BRANCH

        });


    /*
    |--------------------------------------------------------------------------
    | URLS
    |--------------------------------------------------------------------------
    */

    const githubUrl =
        `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${githubPath}`;

    const githubDownloadUrl =
        `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`;


    return {

        success: true,

        fileName,

        githubFileName: fileName,

        githubPath,

        path: githubPath,

        githubUrl,

        githubDownloadUrl,

        // Backward compatibility
        downloadUrl: githubDownloadUrl,

        sha:
            response.data.content.sha

    };

};


/*
|--------------------------------------------------------------------------
| UPLOAD BACKGROUND
|--------------------------------------------------------------------------
*/

exports.uploadBackground = async (
    file
) => {

    if (!file) {
        throw new Error(
            "Background file is required."
        );
    }

    const localFile =
        file.path || file;

    return await exports.uploadFile(
        localFile,
        BACKGROUND_FOLDER
    );

};


/*
|--------------------------------------------------------------------------
| DELETE FILE
|--------------------------------------------------------------------------
*/

exports.deleteFile = async (
    githubPath,
    sha
) => {

    checkConfig();

    if (!githubPath) {
        throw new Error(
            "GitHub file path is required."
        );
    }

    if (!sha) {

        const file =
            await exports.getFile(
                githubPath
            );

        sha =
            file.sha;
    }

    await octokit.repos.deleteFile({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        message:
            `Delete ${githubPath}`,

        sha,

        branch: BRANCH

    });

    return true;

};


/*
|--------------------------------------------------------------------------
| DELETE BACKGROUND
|--------------------------------------------------------------------------
*/

exports.deleteBackground = async (
    githubPath,
    sha
) => {

    if (!githubPath) {
        return false;
    }

    return await exports.deleteFile(
        githubPath,
        sha
    );

};


/*
|--------------------------------------------------------------------------
| UPDATE FILE
|--------------------------------------------------------------------------
*/

exports.updateFile = async (
    localFile,
    githubPath,
    sha
) => {

    checkConfig();

    if (!localFile) {
        throw new Error(
            "Local file is required."
        );
    }

    if (!fs.existsSync(localFile)) {
        throw new Error(
            `File not found: ${localFile}`
        );
    }

    if (!githubPath) {
        throw new Error(
            "GitHub file path is required."
        );
    }

    const buffer =
        fs.readFileSync(localFile);

    const response =
        await octokit.repos.createOrUpdateFileContents({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            message:
                `Update ${githubPath}`,

            content:
                buffer.toString("base64"),

            sha,

            branch: BRANCH

        });

    return {

        success: true,

        sha:
            response.data.content.sha

    };

};


/*
|--------------------------------------------------------------------------
| GET FILE
|--------------------------------------------------------------------------
*/

exports.getFile = async (
    githubPath
) => {

    checkConfig();

    if (!githubPath) {
        throw new Error(
            "GitHub file path is required."
        );
    }

    const response =
        await octokit.repos.getContent({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            ref: BRANCH

        });

    return response.data;

};


/*
|--------------------------------------------------------------------------
| LIST FILES
|--------------------------------------------------------------------------
*/

exports.listFiles = async (
    folder = BACKGROUND_FOLDER
) => {

    checkConfig();

    try {

        const response =
            await octokit.repos.getContent({

                owner: OWNER,

                repo: REPO,

                path: folder,

                ref: BRANCH

            });

        return Array.isArray(response.data)
            ? response.data
            : [response.data];

    } catch (error) {

        if (error.status === 404) {
            return [];
        }

        throw error;

    }

};
