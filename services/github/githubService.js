const { Octokit } = require("@octokit/rest");
const path = require("path");
const fs = require("fs");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";


/*
|--------------------------------------------------------------------------
| GitHub Configuration Check
|--------------------------------------------------------------------------
*/

function checkConfig() {

    if (!process.env.GITHUB_TOKEN) {
        throw new Error("GITHUB_TOKEN is missing.");
    }

    if (!OWNER) {
        throw new Error("GITHUB_OWNER is missing.");
    }

    if (!REPO) {
        throw new Error("GITHUB_REPO is missing.");
    }

}


/*
|--------------------------------------------------------------------------
| Upload File To GitHub
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


    const fileName =
        `${Date.now()}-${path.basename(localFile)}`
            .replace(/\s+/g, "-");


    const githubPath =
        `${folder}/${fileName}`;


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


    return {

        success: true,

        fileName,

        githubPath,

        path: githubPath,

        url:
            `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${githubPath}`,

        githubUrl:
            `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${githubPath}`,

        downloadUrl:
            `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`,

        githubDownloadUrl:
            `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`,

        sha:
            response.data.content.sha

    };

};


/*
|--------------------------------------------------------------------------
| Upload Background To GitHub
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


    /*
    |--------------------------------------------------------------------------
    | Upload Into backgrounds Folder
    |--------------------------------------------------------------------------
    */

    return await exports.uploadFile(
        file.path,
        "backgrounds"
    );

};


/*
|--------------------------------------------------------------------------
| Delete File From GitHub
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

        /*
        |--------------------------------------------------------------------------
        | Get SHA Automatically
        |--------------------------------------------------------------------------
        */

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
| Delete Background
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
| Update File
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

    if (!githubPath) {
        throw new Error(
            "GitHub file path is required."
        );
    }

    if (!fs.existsSync(localFile)) {
        throw new Error(
            `File not found: ${localFile}`
        );
    }


    const buffer =
        fs.readFileSync(localFile);


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


    return true;

};


/*
|--------------------------------------------------------------------------
| Get File Info
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


    const file =
        await octokit.repos.getContent({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            ref: BRANCH

        });


    return file.data;

};


/*
|--------------------------------------------------------------------------
| List Files
|--------------------------------------------------------------------------
*/

exports.listFiles = async (
    folder = "uploads"
) => {

    checkConfig();


    const files =
        await octokit.repos.getContent({

            owner: OWNER,

            repo: REPO,

            path: folder,

            ref: BRANCH

        });


    return files.data;

};
