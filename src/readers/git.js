import { Octokit } from "octokit";
import Reader from './reader.js';

/**
 * GitReader provides an interface for reading files from a GitHub repository.
 * 
 * Supports two listing methods:
 * 1. Legacy directory listing via `repos.getContent` - limited to ~1000 files.
 * 2. Full repository recursive listing via `git.getTree` - supports unlimited files.
 * 
 * The reader will attempt the legacy method first for performance and simplicity,
 * then fallback to the recursive tree method if the file count exceeds the legacy limit.
 * 
 * Usage example:
 * ```js
 * const reader = new GitReader({ token: 'ghp_...' });
 * await reader.init("github:owner/repo/path");
 * const files = await reader.list();
 * const content = await reader.get("some/file.txt");
 * ```
 * 
 * === How to get a GitHub Personal Access Token (PAT) ===
 * 1. Log in to your GitHub account at https://github.com.
 * 2. Click your profile icon (top right), then select **Settings**.
 * 3. In the left sidebar, select **Developer settings**.
 * 4. Click **Personal access tokens** → **Tokens (classic)** (or choose Fine-grained tokens if preferred).
 * 5. Click **Generate new token** and give it a descriptive name (e.g., "MyApp Access Token").
 * 6. Set the expiration period (e.g., 30 days, 60 days, or no expiration).
 * 7. Select scopes required for reading repositories:
 *    - For public repos only: `public_repo`
 *    - For private repos: `repo` (or more limited scopes if available)
 * 8. Click **Generate token** at the bottom.
 * 9. Copy the token immediately (you won't see it again).
 * 10. Use this token as the `token` option when creating the GitReader instance.
 * 
 * Keep your token secure and never share it publicly.

 */
export class GitReader extends Reader {
  /**
   * Create a GitReader instance.
   * @param {Object} options - Options object.
   * @param {string} [options.name] - Optional reader name.
   * @param {string} [options.token] - Optional GitHub Personal Access Token.
   */
  constructor(options = {}) {
    super(options);
    this.name = options.name || "git";
    this.octokit = new Octokit(options.token ? { auth: options.token } : {});
  }

  /**
   * Initialize the reader with a repository path.
   * Extracts owner, repo, and optional subpath.
   * @param {string} modpath - GitHub repo path in the form "github:owner/repo/path".
   */
  async init(modpath) {
    const [, pathStr] = modpath.split(":");
    const [owner, repo, ...pathParts] = pathStr.split("/");
    this.owner = owner;
    this.repo = repo;
    this.path = pathParts.join("/");
  }

  /**
   * Legacy method to list files recursively using the GitHub API `repos.getContent`.
   * Limited to about 1000 files due to API pagination constraints.
   * 
   * @param {string} [dirPath=""] - Directory path relative to the repo root.
   * @returns {Promise<string[]>} - Array of file paths.
   */
  async _listOld(dirPath = "") {
    const files = [];
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: dirPath || this.path,
      });

      for (const item of data) {
        if (item.type === "file") {
          files.push(item.path || item.name);
        } else if (item.type === "dir") {
          const subFiles = await this._listOld((dirPath ? dirPath + "/" : "") + item.name);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      if (error.status === 404) {
        console.warn(`Directory not found: ${dirPath}`);
      } else {
        console.error(`GitHub API error during _listOld: ${error.message}`);
      }
    }
    return files;
  }

  /**
   * Modern method to list all files using the GitHub API `git.getTree`.
   * Retrieves the entire repository tree recursively.
   * Suitable for repos with more than 1000 files.
   * 
   * @returns {Promise<string[]>} - Array of file paths.
   */
  async _listNew() {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: "HEAD",
        recursive: true,
      });

      if (!data.tree || data.tree.length === 0) {
        return [];
      }

      return data.tree
        .filter(item => item.type === "blob")  // Only files, no directories
        .map(item => item.path);
    } catch (error) {
      console.error(`Git tree API error during _listNew: ${error.message}`);
      return [];
    }
  }

  /**
   * List files in the repository path.
   * Attempts legacy method first for efficiency, falls back to modern method if needed.
   * 
   * @returns {Promise<string[]>} - Array of file paths.
   */
  async list() {
    const oldFiles = await this._listOld();

    if (oldFiles.length >= 1000) {
      console.warn("Legacy listing returned 1000+ files, switching to full repository tree listing.");
      return await this._listNew();
    }

    return oldFiles;
  }

  /**
   * Retrieve the contents of a file from the repository.
   * Uses GitHub's `repos.getContent` and `git.getBlob` APIs.
   * 
   * @param {string} fileName - Relative path to the file.
   * @returns {Promise<string|null>} - File contents as a string, or null if not found.
   */
  async get(fileName) {
    const fullPath = this.path ? `${this.path}/${fileName}` : fileName;

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
        console.warn(`File not found: ${fileName}`);
      } else {
        console.error(`GitHub API error during get(): ${error.message}`);
      }
      return null;
    }
  }
}

Reader.readers.Git = GitReader;
