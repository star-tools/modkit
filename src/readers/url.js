import Reader from './reader.js';

const fetchUniversal = globalThis.fetch || await import('node-fetch').then(mod => mod.default);

export default class URLReader extends Reader {

    constructor(options) {
        super(options);
        this.name = options?.name || "url"
    }
    async init(modpath){
        if (!baseUrl.endsWith("/")) baseUrl += "/";
        this.baseUrl = baseUrl;
        this.indexFile = indexFile = "index.json"
        this.index = null;  // cached index
    }
    
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

    async list(dirPath = "", recoursive = true) {
        const index = await this._loadIndex();

        if (!dirPath) return index;

        // Filter files/folders by dirPath prefix (assuming flat index with relative paths)
        const files = index.files.filter(f => f.startsWith(dirPath));
        const folders = index.folders.filter(f => f.startsWith(dirPath));

        return { files, folders };
    }

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
}


// Notes:
// Index file: You need to host an index.json file listing all files and folders, e.g.:

// {
//   "files": [
//     "data/mod.json",
//     "data/units/keiron.json"
//   ],
//   "folders": [
//     "data",
//     "data/units"
//   ]
// }
// Usage
// const reader = new WebSCComponentReader("https://example.com/mods/mymod/");
// const { files, folders } = await reader.getFilesList();
// const modJson = await reader.readFile("data/mod.json");

Reader.readers.URL = URLReader;