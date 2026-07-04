"use strict";

const fs = require("fs");
const path = require("path");

async function uploadToGitHub(file, folder = "public/backgrounds") {

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    const githubPath = `${folder}/${fileName}`;

    const content = fs.readFileSync(file.path, {
        encoding: "base64"
    });

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload ${fileName}`,
                content,
                branch
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "GitHub upload failed.");
    }

    return {
        fileName,
        githubUrl: data.content.html_url,
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${githubPath}`,
        filePath: githubPath
    };
}

module.exports = {
    uploadToGitHub
};
