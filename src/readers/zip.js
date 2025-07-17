import JSZip from '../lib/zip.js';
import Reader from './reader.js';
/**
 * ZipReader class for reading and manipulating ZIP archives.
 *
 * This reader allows loading a ZIP file, listing its contents,
 * reading individual files as text, adding or updating files inside the ZIP,
 * and exporting the entire ZIP as a Blob.
 *
 * Usage:
 *   const zipReader = new ZipReader(file , { name: "zip" });
 *   await zipReader.init();
 *   const files = await zipReader.list();
 *   const fileContent = await zipReader.get("path/to/file.txt");
 *   await zipReader.set("newfile.txt", "Hello, world!");
 *   const zipBlob = await zipReader.blob();
 *
 * Notes:
 * - The `init()` method must be called before other operations.
 * - The `list()` method returns an array of file paths inside the ZIP.
 * - The `set()` method adds or replaces a file in the archive.
 * - The `blob()` method generates a Blob representing the current ZIP state.
 */

export default class ZipReader extends Reader {
    constructor(file) {
        super();
        this.name = file.name
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

Reader.readers.Zip = ZipReader;