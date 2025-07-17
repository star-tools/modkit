import Reader from './reader.js';

/**
 * IDBReader
 * 
 * IndexedDB-based storage backend for StarCraft II mods and assets.
 * 
 * Stores files as key-value pairs where the key is `${modName}:${filename}`.
 * Supports namespaces to isolate mods inside a single IndexedDB store.
 * 
 * Usage:
 * 
 * ```js
 * const reader = new IDBReader({ dbName: 'starcraft2', storeName: 'mods' });
 * await reader.init('MyMod');
 * await reader.set('Data/Unit.xml', '<xml>...</xml>');
 * const data = await reader.get('Data/Unit.xml');
 * ```
 */
export default class IDBReader extends Reader {
    /**
     * @param {Object} options
     * @param {string} [options.name] - Reader name (default: 'idb')
     * @param {string} [options.dbName] - IndexedDB database name (default: 'storage')
     * @param {string} [options.storeName] - Object store name (default: 'store')
     */
    constructor(options = {}) {
        super();
        this.name = options.name || 'idb';
        this.dbName = options.dbName || 'storage';
        this.storeName = options.storeName || 'store';
        this.db = null;
        this.modName = ''; // Namespace/prefix for keys
    }

    /**
     * Initializes the IndexedDB connection and creates store if needed.
     * @param {string} [modName=''] - Optional namespace to prefix keys.
     */
    async init(modName = '') {
        this.modName = modName;

        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    _getStore(mode = 'readonly') {
        if (!this.db) {
            throw new Error('IDBReader: Database not initialized. Call init() first.');
        }
        return this.db.transaction(this.storeName, mode).objectStore(this.storeName);
    }

    _makeKey(filename) {
        return this.modName ? `${this.modName}:${filename}` : filename;
    }

    /**
     * Lists all files starting with a given prefix.
     * @param {string} [prefix=''] - Optional file prefix to filter results.
     * @returns {Promise<string[]>}
     */
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
                        results.push(key.replace(`${this.modName}:`, ''));
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Retrieves a file.
     * @param {string} filename
     * @returns {Promise<any>}
     */
    async get(filename) {
        const store = this._getStore('readonly');
        const key = this._makeKey(filename);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Stores a file.
     * @param {string} filename
     * @param {any} value
     */
    async set(filename, value) {
        const store = this._getStore('readwrite');
        const key = this._makeKey(filename);

        return new Promise((resolve, reject) => {
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Deletes a file.
     * @param {string} filename
     */
    async delete(filename) {
        const store = this._getStore('readwrite');
        const key = this._makeKey(filename);

        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clears the database or only this mod's namespace.
     */
    async clear() {
        const store = this._getStore('readwrite');

        return new Promise((resolve, reject) => {
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const key = cursor.key;
                    if (!this.modName || key.startsWith(`${this.modName}:`)) {
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

// Register globally if needed
Reader.readers.IndexedDB = IDBReader;
