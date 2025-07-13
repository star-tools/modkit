import Reader from './reader.js';

let fs, path;
export const isNode = typeof process !== 'undefined' && process.versions?.node;

if (isNode) {
    fs = await import('fs/promises');
    path = await import('path');
}

export default class NodeReader extends Reader {
    constructor(prefix) {
        super();
        if(prefix && !prefix.endsWith("/"))prefix +="/"
        this.prefix = prefix || ""
    }
    async init(modpath){
        this.basePath = path.resolve(this.prefix + modpath);
    }

    async list(dirPath = "") {
        const fullPath = path.join(this.basePath, dirPath);
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
                console.error(`Failed to list directory: ${fullPath}`, err.message);
            }
        }
        // files.unshift(...folders)
        return files
    }

    async get(relativeFile, format = 'utf-8') {
        const fullPath = path.join(this.basePath, relativeFile);

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
        const foutput = path.join(this.basePath, filename);
        const dir = path.dirname(foutput);

        // Ensure directory exists
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

    // write(destpath){
    //     let files = this.mod.getFiles({scope: this.scope})
    //     fs.mkdirSync(destpath, {recursive: true});
    //     for(let file of files){
    //         let filedata = this.mod.read(file)
    //         let foutput = destpath + file.replace(/\\/g, "\/")
    //         fs.mkdirSync(foutput.substring(0, foutput.lastIndexOf("/")), {recursive: true});
    //         fs.writeFileSync(foutput, file.data)
    //     }
    // }