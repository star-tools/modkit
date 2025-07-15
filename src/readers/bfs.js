import Reader from './reader.js';

export default class WebReader extends Reader {
    constructor(dirHandle) {
        super();
        this.name = options.name || "wfs"
        this.dirHandle = dirHandle; // FileSystemDirectoryHandle
    }

    async init() {
        if (!this.dirHandle) {
            this.dirHandle = await window.showDirectoryPicker();
        }
    }

    async list(prefix = "") {
        const result = [];
        await this._listRecursive(this.dirHandle, prefix, "", result);
        return result;
    }

    async _listRecursive(dirHandle, prefix, currentPath, result) {
        for await (const entry of dirHandle.values()) {
            const fullPath = currentPath + entry.name;

            if (entry.kind === "file") {
                if (!this.ignored(fullPath)) {
                    result.push(fullPath);
                }
            } else if (entry.kind === "directory") {
                await this._listRecursive(entry, prefix, fullPath + "/", result);
            }
        }
    }

    async get(filePath, format = 'utf-8') {
        const fileHandle = await this._getFileHandle(filePath);
        const file = await fileHandle.getFile();

        if (format === 'buffer' || format === 'uint8array') {
            return new Uint8Array(await file.arrayBuffer());
        }

        if (format === 'base64') {
            const blob = await file.arrayBuffer();
            return btoa(String.fromCharCode(...new Uint8Array(blob)));
        }

        return await file.text();
    }

    async set(filePath, content) {
        const fileHandle = await this._getFileHandle(filePath, true);
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    async _getFileHandle(filePath, create = false) {
        const parts = filePath.split("/").filter(Boolean);
        let dir = this.dirHandle;

        for (let i = 0; i < parts.length - 1; i++) {
            dir = await dir.getDirectoryHandle(parts[i], { create });
        }

        return await dir.getFileHandle(parts[parts.length - 1], { create });
    }

    link(filePath) {
        return filePath; // No real links in browser FS, return logical path
    }
}

Reader.readers.Web = WebReader;