export default class IDBReader {
  constructor(dbName = 'storage', storeName = 'store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
    this.modName = ''; // should be set externally or by caller
  }

  async init(modName) {
    this.modName = modName
    // Step 1: Open DB to get current version
    const oldDb = await new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    const currentVersion = oldDb.version;
    oldDb.close();

    // Step 2: Check if store exists
    const hasStore = oldDb.objectStoreNames.contains(this.storeName);
    if (hasStore) {
      // Open normally if store exists
      this.db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(this.dbName, currentVersion);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } else {
      // Upgrade version to add new store
      this.db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(this.dbName, currentVersion + 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
  }

  async list(prefix = '') {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.openCursor();
      const result = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const key = cursor.key;
          // if (key.startsWith(`${this.modName}:${prefix}`)) {
          if (key.startsWith(`${this.modName}`)) {
            result.push(key);
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set(filename, value) {
    const key = filename//`${this.modName}:${filename}`;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(filename) {
    const key = filename//`${this.modName}:${filename}`;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(filename) {
    const key = filename//`${this.modName}:${filename}`;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.key.startsWith(this.modName)) {
            store.delete(cursor.key);
          }
          cursor.continue();
        } else {
          resolve(); // Done
        }
      };

      request.onerror = () => reject(request.error);
    });
  }


  // async clear() {
  //   return new Promise((resolve, reject) => {
  //     const tx = this.db.transaction(this.storeName, 'readwrite');
  //     const store = tx.objectStore(this.storeName);
  //     store.clear();
  //     tx.oncomplete = () => resolve();
  //     tx.onerror = () => reject(tx.error);
  //   });
  // }
}
