import JSZip from './../lib/jszip.js';

import SCComponentReader from './scmod-reader.js';

export default class JSZipComponentReader extends SCComponentReader {
    constructor(options) {
        super(options);
    }
    async load(file){
        this.zip = await JSZip.loadAsync(file);
        return this;

    }

    getFiles (dirPath = "", recoursive = true) {
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");

        const files = [];
        const folders = new Set();

        this.zip.forEach((relativePath) => {
            if (relativePath.startsWith(dirPath)) {
                files.push(relativePath);
                const parts = relativePath.split('/');
                if (parts.length > 1) {
                    folders.add(parts[0]);
                }
            }
        });

        return { files, folders: Array.from(folders) };
    }

    async read (path) {
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");

        const zipEntry = this.zip.file(path);
        if (!zipEntry) {
            throw new Error(`File "${path}" not found in the ZIP archive.`);
        }

        return await zipEntry.async('text');
    }
}
