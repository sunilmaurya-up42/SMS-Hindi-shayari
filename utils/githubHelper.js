const { Octokit } = require("@octokit/rest");
const path = require("path");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

/**
 * Build Repository Path
 */
exports.buildPath = (folder, fileName) => {

    return path.posix.join(folder, fileName);

};

/**
 * Raw GitHub URL
 */
exports.rawUrl = (githubPath) => {

    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`;

};

/**
 * Repository URL
 */
exports.repoUrl = () => {

    return `https://github.com/${OWNER}/${REPO}`;

};

/**
 * Get File Information
 */
exports.getFile = async (githubPath) => {

    const { data } = await octokit.repos.getContent({

        owner: OWNER,

        repo: REPO,

        path: githubPath,

        ref: BRANCH

    });

    return data;

};

/**
 * Check File Exists
 */
exports.exists = async (githubPath) => {

    try {

        await exports.getFile(githubPath);

        return true;

    } catch {

        return false;

    }

};

/**
 * Get SHA
 */
exports.getSHA = async (githubPath) => {

    const file = await exports.getFile(githubPath);

    return file.sha;

};

/**
 * Delete File
 */
exports.delete = async (githubPath) => {

    const sha = await exports.getSHA(githubPath);

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
 * Upload File
 */
exports.upload = async (
    githubPath,
    buffer,
    message = "Upload File"
) => {

    const content = Buffer.isBuffer(buffer)
        ? buffer.toString("base64")
        : Buffer.from(buffer).toString("base64");

    const response =
        await octokit.repos.createOrUpdateFileContents({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            message,

            content,

            branch: BRANCH

        });

    return response.data;

};

/**
 * Update File
 */
exports.update = async (
    githubPath,
    buffer,
    message = "Update File"
) => {

    const sha = await exports.getSHA(githubPath);

    const content = Buffer.isBuffer(buffer)
        ? buffer.toString("base64")
        : Buffer.from(buffer).toString("base64");

    const response =
        await octokit.repos.createOrUpdateFileContents({

            owner: OWNER,

            repo: REPO,

            path: githubPath,

            message,

            content,

            sha,

            branch: BRANCH

        });

    return response.data;

};

/**
 * Image URL
 */
exports.imageUrl = (folder, fileName) => {

    return exports.rawUrl(
        exports.buildPath(folder, fileName)
    );

};

/**
 * Error Handler
 */
exports.handleError = (error) => {

    console.error("GitHub Error:", error.message);

    return {

        success: false,

        message: error.message

    };

};
