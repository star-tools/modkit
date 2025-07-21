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
import JSZip from '../lib/zip.js';
import Reader from '../readers/reader.js';

export default class ZipReader extends Reader {
    constructor(options) {
        super();
        this.name = options.name
        this.file = options.file
    }
    async init(modpath = ''){
        if(!this.zip){
            if(this.file){
                this.zip = await JSZip.loadAsync(this.file);
            }
            else{
                this.zip = new JSZip();
            }
        }
        delete this.file
        await super.init(modpath)
    }
    async list (dirPath = "") {
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");
        const fullPath = this.modpath ? this.modpath + '/' + dirPath : dirPath

        const files = [];
        const folders = new Set();

        this.zip.forEach((relativePath) => {
            if (relativePath.startsWith(fullPath)) {
                if (!this.ignored(relativePath)){
                    if(this.modpath){
                        files.push(relativePath.replace(this.modpath + '/',''));
                    }
                    else{
                        files.push(relativePath);
                    }
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

    async isFile (path) {
        if(this.modpath) path = this.modpath + '/' + path
        return !!this.zip.file(path)
    }
    async isFolder (path) {
        if(this.modpath) path = this.modpath + '/' + path
        return !!this.zip.folder(path)
    }
    async get (path,options) {
        path = this.modpath + (this.modpath && path ? '/': '') + path
        
        if (!this.zip) throw new Error("ZIP file not loaded. Call init() first.");

        let zipEntry = this.zip.file(path);
        if (!zipEntry) {
            const lowerTarget = path.toLowerCase();
            this.zip.forEach((relativePath, zipEntry2) => {
                if (!zipEntry2.dir && relativePath.toLowerCase() === lowerTarget) {
                    zipEntry = zipEntry2;
                }
            });
        }

        if (!zipEntry) {
            throw new Error(`File "${path}" not found in the ZIP archive.`);
        }
        return await zipEntry.async(options?.binary ? 'arraybuffer': 'text');
    }
    async set(filename, content){
        if(this.modpath) filename = this.modpath + '/' + filename
        if (content) {
            zip.file(filename, content);
        }
    }

    async blob(){
        return await this.zip.generateAsync({ type: 'blob' });
    }
}

Reader.readers.Zip = ZipReader;