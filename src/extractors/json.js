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
import Reader from '../readers/reader.js';

export default class JSONReader extends Reader {
    constructor(options) {
        super();
        this.name = options.name
        this.file = options.file
    }
    async init(modpath = ''){
        this.data = JSON.parse(this.file.toString())
        delete this.file
        await super.init(modpath)
    }
    async list (dirPath = "") {
        this.data
        //files.unshift(...Array.from(folders));
        return files
    }

    async isFile (path) {
        return true
    }
    async isFolder (path) {
        return true
    }
    async get (path,options) {
        return true
    }
    async set(filename, content){
        return true
    }

}

Reader.readers.JSON = JSONReader;