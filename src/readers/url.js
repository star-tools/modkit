import Reader from './reader.js';

const fetchUniversal = globalThis.fetch || await import('node-fetch').then(mod => mod.default);

/**
 * URLReader class for reading and writing files from a remote HTTP(S) server.
 * 
 * Requires hosting an `index.json` file on the server that lists available files and folders.
 * The `index.json` should be a JSON object with two arrays: `files` and `folders`, e.g.:
 * 
 * ```json
 * {
 *   "files": [
 *     "data/mod.json",
 *     "data/units/keiron.json"
 *   ],
 *   "folders": [
 *     "data",
 *     "data/units"
 *   ]
 * }
 * ```
 * 
 * This index allows the reader to efficiently list directory contents.
 * 
 * Example usage:
 * ```js
 * const reader = new URLReader({ baseUrl: "https://example.com/mods/mymod/" });
 * const { files, folders } = await reader.list();
 * const content = await reader.get("data/mod.json");
 * await reader.set("data/newfile.json", JSON.stringify({ foo: "bar" }));
 * ```
 */
export default class URLReader extends Reader {

    /**
     * @param {object} options - Configuration options.
     * @param {string} options.baseUrl - Base URL where files and `index.json` are hosted.
     * @param {string} [options.name] - Optional reader name.
     */
    constructor(options = {}) {
        super(options);
        this.name = options.name || "url";
        this.baseUrl = options.baseUrl || "";
        if (this.baseUrl && !this.baseUrl.endsWith("/")) {
            this.baseUrl += "/";
        }
        this.indexFile = "index.json";
        this.index = null;  // Cache for the index.json content
    }

    /**
     * Initialize the reader with a mod path if needed.
     * @param {string} modpath - Optional mod path.
     */
    async init(modpath) {
        // Can implement modpath-based adjustment if necessary
        // For now, baseUrl is set in constructor
    }

    /**
     * Loads and caches the index.json file listing files and folders.
     * @returns {Promise<{files: string[], folders: string[]}>}
     */
    async _loadIndex() {
        if (this.index) return this.index;

        try {
            const response = await fetchUniversal(this.baseUrl + this.indexFile);
            if (!response.ok) {
                console.warn(`Index file not found at ${this.baseUrl + this.indexFile}`);
                this.index = { files: [], folders: [] };
            } else {
                this.index = await response.json();
            }
        } catch (err) {
            console.error("Failed to load index file:", err);
            this.index = { files: [], folders: [] };
        }
        return this.index;
    }

    /**
     * Lists files and folders optionally filtered by a directory path.
     * @param {string} [dirPath=""] - Directory path prefix to filter the listing.
     * @param {boolean} [recursive=true] - (Not implemented, index assumed flat)
     * @returns {Promise<{files: string[], folders: string[]}>}
     */
    async list(dirPath = "", recursive = true) {
        const index = await this._loadIndex();

        if (!dirPath) return index;

        // Filter files/folders that start with dirPath prefix (flat index assumed)
        const files = index.files.filter(f => f.startsWith(dirPath));
        const folders = index.folders.filter(f => f.startsWith(dirPath));

        return { files, folders };
    }

    /**
     * Retrieves the content of a remote file as text.
     * @param {string} relativeFile - Relative file path to fetch.
     * @returns {Promise<string|null>} File content as string, or null if not found or error.
     */
    async get(relativeFile) {
        try {
            const url = this.baseUrl + relativeFile;
            const response = await fetchUniversal(url);
            if (!response.ok) {
                console.warn(`File not found: ${url}`);
                return null;
            }
            return await response.text();
        } catch (err) {
            console.error(`Failed to fetch file ${relativeFile}:`, err);
            return null;
        }
    }

    /**
     * Uploads file content via HTTP POST to the server.
     * Note: Server must accept POST requests at the file URL and handle them accordingly.
     * @param {string} relativeFile - Relative file path to upload.
     * @param {string|Uint8Array|Blob} content - File content to upload.
     * @returns {Promise<void>}
     */
    async set(relativeFile, content) {
        try {
            const url = this.baseUrl + relativeFile;
            const response = await fetchUniversal(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                body: content
            });
            if (!response.ok) {
                console.warn(`Failed to upload file: ${url} - Status: ${response.status}`);
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }
        } catch (err) {
            console.error(`Failed to upload file ${relativeFile}:`, err);
            throw err;
        }
    }
}

Reader.readers.URL = URLReader;
