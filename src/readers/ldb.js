import level from 'level';
import Reader from './reader.js';

/**
 * 
 * 
 * 
// const reader = new LevelDBReader('./mydb');
// await reader.init('mod1');

// await reader.set('file.txt', 'Hello LevelDB');
// console.log(await reader.get('file.txt'));

// const files = await reader.list();
// console.log(files);

// await reader.delete('file.txt');
// await reader.clear();
// await reader.close();
 */
export default class LevelDBReader extends Reader {
  constructor(dbName = './leveldb') {
    this.dbName = dbName;
    this.db = null;
    this.name = options.name || "ldb"
    this.modName = ''; // Namespace prefix (optional)
  }

  async init(modName = '') {
    this.modName = modName;
    this.db = level(this.dbName, { valueEncoding: 'json' }); // Can store text, buffers, or JSON
  }

  _makeKey(filename) {
    return this.modName ? `${this.modName}:${filename}` : filename;
  }

  async get(filename) {
    const key = this._makeKey(filename);
    try {
      return await this.db.get(key);
    } catch (err) {
      if (err.notFound) return null;
      throw err;
    }
  }

  async set(filename, value) {
    const key = this._makeKey(filename);
    return this.db.put(key, value);
  }

  async delete(filename) {
    const key = this._makeKey(filename);
    return this.db.del(key);
  }

  async list(prefix = '') {
    const results = [];
    const fullPrefix = this._makeKey(prefix);

    return new Promise((resolve, reject) => {
      const stream = this.db.createKeyStream({
        gte: fullPrefix,
        lt: fullPrefix + '\xFF'
      });

      stream.on('data', (key) => {
        results.push(key);
      });

      stream.on('end', () => resolve(results));
      stream.on('error', (err) => reject(err));
    });
  }

  async clear() {
    const keys = await this.list('');
    const batch = this.db.batch();
    for (const key of keys) {
      batch.del(key);
    }
    return batch.write();
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
Reader.readers.LevelDB = LevelDBReader;
