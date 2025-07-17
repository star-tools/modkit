export default class Reader {
  constructor(options) {
    // Options can be stored or used in subclasses
  }

  async init() {
    // Override in subclass
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
