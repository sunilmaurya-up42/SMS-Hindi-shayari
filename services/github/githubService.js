const { Octokit } = require("@octokit/rest");
const path = require("path");
const fs = require("fs");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

/**
 * Upload File To GitHub
 */
exports.uploadFile = async (localFile, folder = "uploads") => {

    if (!fs.existsSync(localFile)) {
        throw new Error("File not found.");
    }

    const buffer = fs.readFileSync(localFile);

    const fileName =
        Date.now() +
        "-" +
        path.basename(localFile);

    const githubPath =
        `${folder}/${fileName}`;

    const response = await octokit.repos.createOrUpdateFileContents({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        message: `Upload ${fileName}`,

        content: buffer.toString("base64"),

        branch: BRANCH

    });

    return {

        success: true,

        fileName,

        githubPath,

        downloadUrl:
            `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`,

        sha: response.data.content.sha

    };

};

/**
 * Delete File
 */
exports.deleteFile = async (githubPath, sha) => {

    await octokit.repos.deleteFile({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        message: `Delete ${githubPath}`,

        sha,

        branch: BRANCH

    });

    return true;

};

/**
 * Update File
 */
exports.updateFile = async (localFile, githubPath, sha) => {

    const buffer = fs.readFileSync(localFile);

    await octokit.repos.createOrUpdateFileContents({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        message: `Update ${githubPath}`,

        content: buffer.toString("base64"),

        sha,

        branch: BRANCH

    });

    return true;

};

/**
 * Get File Info
 */
exports.getFile = async (githubPath) => {

    const file = await octokit.repos.getContent({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        ref: BRANCH

    });

    return file.data;

};

/**
 * List Files
 */
exports.listFiles = async (folder = "uploads") => {

    const files = await octokit.repos.getContent({

        owner: OWNER,

        repo: REPO,

        path: folder,

        ref: BRANCH

    });

    return files.data;

};
