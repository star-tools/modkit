import fs from "fs";
import path from "path";
import SCComponentReader from './scmod-reader.js';



export default class NodeSCComponentReader extends SCComponentReader {
    constructor(options) {
        super(options);
    }
    async load(modpath){
        this.basePath = path.resolve(modpath);
        return await this.read()
    }

    async getFiles(dirPath = "", recursive = true) {
        const fullPath = path.join(this.basePath, dirPath);
        const files = [];
        const folders = [];

        try {
            const items = await fs.promises.readdir(fullPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(fullPath, item.name);
                const relativePath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    folders.push(relativePath);

                    if (recursive) {
                        const sub = await this.getFiles(relativePath, true);
                        files.push(...sub.files);
                        folders.push(...sub.folders);
                    }
                } else if (item.isFile()) {
                    files.push(relativePath);
                }
            }
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error(`Failed to list directory: ${fullPath}`, err.message);
            }
        }

        return { files, folders };
    }

    async readFile(relativeFile, format = 'utf-8') {
        const fullPath = path.join(this.basePath, relativeFile);
        if(format === 'base64'){
            const buffer = fs.readFileSync('example.png');
            return buffer.toString('base64');
        }
        try {
            return await fs.promises.readFile(fullPath, { encoding: "utf-8" });
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error(`Failed to read file: ${fullPath}`, err.message);
            }
            return null;
        }
    }
}

//Usage
// const reader = new NodeSCComponentReader("./mods/mymod");
// const { files, folders } = await reader.getFilesList("data");
// const content = await reader.readFile("data/mod.json");
// console.log("Files:", files);
// console.log("Content:", content);
