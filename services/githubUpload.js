"use strict";

const fs = require("fs");

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";

async function uploadToGitHub(file, folder = "background") {

    const fileName =
        `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    const githubPath = `public/uploads/${folder}/${fileName}`;

    const content = fs.readFileSync(file.path, "base64");

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
        throw new Error(data.message);
    }

    return {
        fileName,
        githubUrl: data.content.html_url,
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${githubPath}`,
        filePath: githubPath
    };
}

async function deleteFileFromGitHub(filePath) {

    const url =
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const getResponse = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        }
    });

    const file = await getResponse.json();

    if (!getResponse.ok) {
        throw new Error(file.message);
    }

    const deleteResponse = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Delete ${file.name}`,
            sha: file.sha,
            branch
        })
    });

    const result = await deleteResponse.json();

    if (!deleteResponse.ok) {
        throw new Error(result.message);
    }

    return true;
}

module.exports = {
    uploadToGitHub,
    deleteFileFromGitHub
};
