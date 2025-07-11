import JSZip from '../lib/jszip.js';
import Reader from './reader.js';

export default class ZipReader extends Reader {
    constructor(file) {
        super();
        this.file = file;
    }
    async init(){
        if(this.file){
            this.zip = await JSZip.loadAsync(this.file);
            delete this.file
        }
        else{
            this.zip = new JSZip();
        }
    }
    async list (dirPath = "") {
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");

        const files = [];
        const folders = new Set();

        this.zip.forEach((relativePath) => {
            if (relativePath.startsWith(dirPath)) {
                if (!this.ignored(relativePath)){
                    files.push(relativePath);
                    const parts = relativePath.split('/');
                    if (parts.length > 1) {
                        folders.add(parts[0] + "/");
                    }
                }
            }
        });
        //files.unshift(...Array.from(folders));
        return files 
    }

    async get (path) {
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");

        const zipEntry = this.zip.file(path);
        if (!zipEntry) {
            throw new Error(`File "${path}" not found in the ZIP archive.`);
        }

        return await zipEntry.async('text');
    }
    async set(filename, content){
        if (content) {
            zip.file(filename, content);
        }
    }
    async blob(){
        return await this.zip.generateAsync({ type: 'blob' });
    }
}
