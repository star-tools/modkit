export default class VFS {
    constructor() {
        this.readers = [];
    }


    /**
     * Add a reader with optional prefix and canHandle function
     * @param {Object} reader - Reader instance with get, set, list methods
     * @param {Object} options
     * @param {string} options.prefix - path prefix for routing (e.g. "git:", "https://")
     * @param {Function} options.canHandle - optional fn(path) => boolean for custom routing
     */
    addReader(reader, options = {}) {
        reader.prefix = options.prefix || reader.prefix || "";
        if (options.canHandle) reader.canHandle = options.canHandle;
        this.readers.push(reader);
    }

    /**
     * Find the appropriate reader for a given path
     * @param {string} path
     * @returns {Object} reader or null
     */
    _getReader(path) {
        for (const reader of this.readers) {
            if (typeof reader.canHandle === "function" && reader.canHandle(path)) {
                return reader;
            }
            if (reader.prefix && path.startsWith(reader.prefix)) {
                return reader;
            }
        }
        return null;
    }

    /**
     * Normalize path by removing the prefix from path for the matched reader
     */
    _normalizePath(path, reader) {
        if (reader.prefix && path.startsWith(reader.prefix)) {
            return path.slice(reader.prefix.length);
        }
        return path;
    }

    async get(path, format = "utf-8") {
        const reader = this._getReader(path);
        if (!reader) {
            throw new Error(`VFS: No reader found for path '${path}'`);
        }
        const normPath = this._normalizePath(path, reader);
        return reader.get(normPath, format);
    }

    async set(path, content, options) {
        const reader = this._getReader(path);
        if (!reader) {
            throw new Error(`VFS: No reader found for path '${path}'`);
        }
        const normPath = this._normalizePath(path, reader);
        if (!reader.set) {
            throw new Error(`VFS: Reader for path '${path}' does not support set()`);
        }
        return reader.set(normPath, content, options);
    }

    async list(path = "") {
        // Try to find a reader for this path, if none found, list from all and merge?
        // Here we try to find first matching reader by prefix, else empty array
        for (const reader of this.readers) {
            if (!path && reader.list) {
                return reader.list(path);
            }
            if (reader.prefix && path.startsWith(reader.prefix)) {
                const normPath = this._normalizePath(path, reader);
                if (reader.list) return reader.list(normPath);
            }
        }
        return [];
    }
}