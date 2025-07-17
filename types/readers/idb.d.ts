import Reader, { ReaderOptions } from './reader.js';

// Specific options for IDBReader
export interface IDBReaderOptions extends ReaderOptions {
    dbName?: string;
    storeName?: string;
}

/**
 * IndexedDB Reader - inherits Reader methods.
 */
export class IDBReader extends Reader {
    dbName: string;
    storeName: string;
    db: IDBDatabase | null;
    modName: string;

    constructor(options?: IDBReaderOptions);
}
