export default class IDBReader {
  constructor(dbName = 'storage', storeName = 'store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
    this.modName = ''; // Optional namespace/prefix for keys
  }

  async init(modName = '') {
    this.modName = modName;

    // Open DB once with upgrade if needed
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  _getStore(mode = 'readonly') {
    if (!this.db) throw new Error('IDBReader: DB not initialized. Call init() first.');
    return this.db.transaction(this.storeName, mode).objectStore(this.storeName);
  }

  _makeKey(filename) {
    return this.modName ? `${this.modName}:${filename}` : filename;
  }

  async list(prefix = '') {
    const store = this._getStore('readonly');
    const results = [];

    return new Promise((resolve, reject) => {
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const key = cursor.key;
          if (key.startsWith(this._makeKey(prefix))) {
            results.push(key);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  async get(filename) {
    const store = this._getStore('readonly');
    const key = this._makeKey(filename);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async set(filename, value) {
    const store = this._getStore('readwrite');
    const key = this._makeKey(filename);

    return new Promise((resolve, reject) => {
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(filename) {
    const store = this._getStore('readwrite');
    const key = this._makeKey(filename);

    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear() {
    // Delete only keys that start with modName prefix
    if (!this.modName) {
      // If no modName set, clear entire store
      const store = this._getStore('readwrite');
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Delete keys matching modName prefix only
      const store = this._getStore('readwrite');
      return new Promise((resolve, reject) => {
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.key.startsWith(this.modName + ':')) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = (event) => reject(event.target.error);
      });
    }
  }
}
