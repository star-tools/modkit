export default class Reader {
  constructor(options = {}) {
    this.name = options.name
    // Options can be stored or used in subclasses
  }

  async init(fullPath) {
      // if(!type){
      //     if (this.extension && !modpath.endsWith(this.extension)) {
      //         fullPath += this.extension;
      //     }
      // }
      if(this.isExists(fullPath)){
          this.type = await this.isFile(fullPath) ? "file" : "folder"
      }
      else{
          console.error(`${fullPath} directory cant be read`)
      }
      this.modpath = fullPath
  }

  async list(prefix = '') {
    return null;
  }

  async set(key, value) {
    return false;
  }

  async get(key) {
    return null;
  }

  async delete(key) {
    return false;
  }

  async isFile(file) {
    return null
  }
  async isFolder(file) {
    return null
  }
  async isExists(path){
    return this.isFile(path) || this.isFolder(isFile)
  }
  async clear() {
    // Override in subclass
  }

  IGNORED_PATTERNS = [
    /^__macosx\//i,
    /\.ds_store$/i,
    /^\.git(?:\/|$)/i,
    /^\.gitignore$/i,
    /^thumbs\.db$/i,
    /\/$/, // directory placeholder ending with slash
  ];

  ignored(filename) {
    const lower = filename.toLowerCase();
    return this.IGNORED_PATTERNS.some(pattern => pattern.test(lower));
  }

  static readers = [];

  static create(options) {
    return new this(options);
  }
}
