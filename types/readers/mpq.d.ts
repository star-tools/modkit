import Reader from './reader.js';

/**
 * Options for MpqReader
 */
interface MpqReaderOptions {
    name?: string;
}

/**
 * MpqReader class for reading MPQ archives.
 */
export default class MpqReader extends Reader {
    name: string;
    file: string | Buffer | ArrayBuffer | Uint8Array;
    mpq: any;
    files: string[];

    constructor(file: string | Buffer | ArrayBuffer | Uint8Array, options?: MpqReaderOptions);

    /**
     * Initialize the MPQ archive. Must be called before using other methods.
     */
    init(): Promise<void>;

    /**
     * List files inside the MPQ archive.
     * @param dirPath Optional path prefix to filter results.
     */
    list(dirPath?: string): Promise<string[]>;

    /**
     * Get the contents of a file in the MPQ archive.
     * Returns text if possible, otherwise returns Buffer.
     * @param filePath File path (use '/' separator)
     */
    get(filePath: string): Promise<string | Buffer>;
}
