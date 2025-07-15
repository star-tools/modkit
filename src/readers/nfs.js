import Reader from './reader.js';

let fs, path;
export const isNode = typeof process !== 'undefined' && process.versions?.node;

if (!!process?.versions?.node) {
    fs = await import('fs/promises');
    path = await import('path');
}

export default class NodeReader extends Reader {
    constructor(options) {
        super(options);
        this.extension = options.extension || ""
        this.name = options.name || "nfs"
        this.base = options.base || ""
    }
    async init(modpath){
        if(this.extension && !modpath.endsWith(this.extension))modpath += this.extension
        this.modpath = path.resolve(this.base, modpath);
    }

    async list(dirPath = "") {
        const fullPath = path.join(this.modpath, dirPath);
        const files = [];
        const folders = [];

        try {
            const items = await fs.readdir(fullPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(fullPath, item.name);
                const relativePath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    folders.push(relativePath);

                    const sub = await this.list(relativePath, true);
                    files.push(...sub);
                        
                } else if (item.isFile()) {
                    files.push(relativePath);
                }
            }
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error(`Failed to list base: ${fullPath}`, err.message);
            }
        }
        // files.unshift(...folders)
        return files
    }

    async get(relativeFile, format = 'utf-8') {
        const fullPath = path.join(this.modpath, relativeFile);

        try {
            if (format === 'base64') {
                const buffer = await fs.readFile(fullPath);
                return buffer.toString('base64');
            }

            if (format === 'buffer' || format === 'uint8array') {
                return await fs.readFile(fullPath); // returns Buffer (which is a Uint8Array)
            }

            return await fs.readFile(fullPath, { encoding: 'utf-8' });

        } catch (err) {
            console.error(`Failed to read file: ${fullPath}`, err.message);
            return null;
        }
    }

    link(file){
        return path.resolve(file)
    }

    async set(filename, content, options) {
        const foutput = path.join(this.modpath, filename);
        const dir = path.dirname(foutput);

        // Ensure base exists
        await fs.mkdir(dir, { recursive: true });

        if (options?.file) {
            // Copy file from source path (content is the source path here)
            await fs.copyFile(content, foutput);
        } else {
            // Write text/binary content directly
            await fs.writeFile(foutput, content);
        }
    }
    
}

Reader.readers.Node = NodeReader;