/**
 * -------------------------------------------------------
 * SMS Hindi Shayari
 * GitHub Configuration
 * -------------------------------------------------------
 */

"use strict";

const axios = require("axios");

const GITHUB_API = "https://api.github.com";

const githubConfig = Object.freeze({

    token: process.env.GITHUB_TOKEN || "",

    owner: process.env.GITHUB_OWNER || "",

    repo: process.env.GITHUB_REPO || "",

    branch: process.env.GITHUB_BRANCH || "main",

    api: GITHUB_API,

    rawBaseUrl() {
        return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}`;
    },

    repoBaseUrl() {
        return `https://github.com/${this.owner}/${this.repo}`;
    }

});

/* ==========================================
   Axios Client
========================================== */

const githubClient = axios.create({

    baseURL: GITHUB_API,

    timeout: 30000,

    headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubConfig.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "SMS-Hindi-Shayari"
    }

});

/* ==========================================
   Validation
========================================== */

function validateGitHubConfig() {

    const required = [
        "GITHUB_TOKEN",
        "GITHUB_OWNER",
        "GITHUB_REPO"
    ];

    const missing = required.filter(
        (key) => !process.env[key]
    );

    if (missing.length) {

        throw new Error(
            `Missing GitHub Environment Variables: ${missing.join(", ")}`
        );

    }

}

/* ==========================================
   Exports
========================================== */

module.exports = {

    githubConfig,

    githubClient,

    validateGitHubConfig

};
