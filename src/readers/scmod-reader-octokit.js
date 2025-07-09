import { Octokit } from "octokit";
import SCComponentReader from "./scmod-reader.js";

export class GithubSCComponentReader extends SCComponentReader {
    constructor(options,token) {
        super(options);
        this.octokit = new Octokit(token ? { auth: token } : {});
    }
    async load(modpath){
        super();
        const [owner, repo, ...pathParts] = modpath.split(":")[1].split("/");

        this.owner = owner;
        this.repo = repo;
        this.path = pathParts.join("/");

    }
    //get full list of files getFi;es only returs 1000
    async listAllFiles() {
    const { data } = await octokit.rest.git.getTree({
        owner: "star-assets",
        repo: "models-a",
        tree_sha: "HEAD",
        recursive: true,
    });

    const files = data.tree
        .filter(item => item.type === "blob") // blobs = files
        .map(item => item.path);

    console.log(files);
    }
    async getFiles(dirPath = "", recursive = false) {
        const fullPath = dirPath ? `${this.path}/${dirPath}` : this.path;
        const files = [];
        const folders = [];

        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path: fullPath,
            });

            for (const item of data) {
                if (item.type === "file") {
                    files.push(recursive ? `${dirPath}/${item.name}`.replace(/^\/+/, '') : item.name);
                } else if (item.type === "dir") {
                    folders.push(item.name);
                    if (recursive) {
                        // Recursively fetch files in subfolder
                        const subDirFiles = await this.files((dirPath ? dirPath + "/" : "") + item.name, true);
                        files.push(...subDirFiles.files);
                    }
                }
            }

            return { files, folders };
        } catch (error) {
            if (error.status === 404) {
                console.warn(`Directory not found: ${dirPath}`);
            } else {
                console.error(`GitHub API error: ${error.message}`);
            }
            return { files: [], folders: [] };
        }
    }

    async read (fineName) {
        const fullPath = `${this.path}/${fineName}`;

        try {
            const { data: fileInfo } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path: fullPath,
            });

            const { data: blob } = await this.octokit.rest.git.getBlob({
                owner: this.owner,
                repo: this.repo,
                file_sha: fileInfo.sha,
            });

            return Buffer.from(blob.content, "base64").toString();
        } catch (error) {
            if (error.status === 404) {
                console.warn(`File not found: ${fineName}`);
            } else {
                console.error(`GitHub API error: ${error.message}`);
            }
            return null;
        }
    }
}

//Usage
// const reader = new GithubSCComponentReader("github:user/repo/path", "ghp_...");
// const { files, folders } = await reader.getFilesList();
// const fileContent = await reader.readFile("mod.json");


// To get a GitHub Personal Access Token (PAT), often starting with ghp_, follow these steps:

// How to create a GitHub Personal Access Token (PAT)
// Log in to GitHub
// Go to https://github.com and log into your account.

// Go to Developer Settings
// Click your profile icon (top right) → Settings → Developer settings (bottom left menu).

// Select Personal Access Tokens
// Click Personal access tokens → then Tokens (classic) (or the new fine-grained tokens if you prefer).

// Generate new token
// Click Generate new token → choose Tokens (classic) or Fine-grained token.

// Configure token

// Give it a descriptive name (e.g., "My App Access Token").

// Set an expiration (e.g., 30 days, 60 days, or no expiration).

// Select scopes — permissions you want to grant. For reading repos, select:

// repo (Full control of private repositories, or choose only repo:read if available)

// read:org (if needed)

// public_repo (for public repos)

// For just reading public repos, minimal scopes are needed.

// Generate token
// Click Generate token at the bottom.

// Copy your token
// Important: Copy the token immediately. You won’t see it again!

