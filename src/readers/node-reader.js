import fs from "fs";
import path from "path";
import Reader from './reader.js';



export default class NodeReader extends Reader {
    constructor(options) {
        super(options);
    }
    async init(modpath){
        this.basePath = path.resolve(modpath);
    }

    async list(dirPath = "") {
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

    set(filename,content){
        let foutput = this.basePath + filename.replace(/\\/g, "\/")
        fs.mkdirSync(foutput.substring(0, foutput.lastIndexOf("/")), {recursive: true});
        fs.writeFileSync(foutput, content)
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