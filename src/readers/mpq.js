import Reader from './reader.js';
import MPQArchive from './../lib/js-mpq.js';

/**
 * MpqReader class for reading MPQ archives.
 *
 * Usage:
 *   const mpqReader = new MpqReader(fileOrBuffer, { name: "mod" });
 *   await mpqReader.init();
 *   const files = await mpqReader.list();
 *   const fileContent = await mpqReader.get("Base.SC2Data\\UI\\FontStyles.SC2Style");
 */

export default class MPQReader extends Reader {
    constructor(file, options = {}) {
        super();
        this.name = options.name || "mpq";
        this.file = file; // Can be Buffer, File, or path string
    }

    async init() {
        let buffer;

        if (typeof this.file === 'string') {
            // Load from path (Node.js only)
            const fs = await import('fs/promises');
            buffer = await fs.readFile(this.file);
        } else if (this.file instanceof ArrayBuffer) {
            buffer = Buffer.from(this.file);
        } else if (this.file instanceof Uint8Array) {
            buffer = Buffer.from(this.file);
        } else if (this.file instanceof Buffer) {
            buffer = this.file;
        } else {
            throw new Error("Unsupported file input. Use path, Buffer, or ArrayBuffer.");
        }

        this.mpq = new MPQArchive(buffer);
        this.files = this.mpq.files;
    }

    async list(dirPath = "") {
        if (!this.mpq) throw new Error("MPQ file not loaded. Call init() first.");

        const files = [];
        for (let filename of this.files) {
            const normalized = filename.replace(/\\/g, '/');
            if (normalized.startsWith(dirPath) && !this.ignored(normalized)) {
                files.push(normalized);
            }
        }
        return files;
    }

    async get(filePath) {
        if (!this.mpq) throw new Error("MPQ file not loaded. Call init() first.");

        // Normalize to MPQ format
        const mpqPath = filePath.replace(/\//g, '\\');

        const data = this.mpq.readFile(mpqPath);
        if (!data) {
            throw new Error(`File "${filePath}" not found in MPQ archive.`);
        }

        // Assume text if UTF-8 decodable, otherwise return buffer
        try {
            return data.toString('utf8');
        } catch (e) {
            return data;
        }
    }

    // MPQ is read-only in this version, so no `set()` or `blob()`
}

Reader.readers.MPQ = MPQReader;
