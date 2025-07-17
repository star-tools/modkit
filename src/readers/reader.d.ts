/**
 * Base reader options.
 */
export interface ReaderOptions {
    name?: string;
    base?: string;
    [key: string]: any;
}

/**
 * Base file reader interface.
 */
export default class Reader {
    static readers: Record<string, typeof Reader>;

    name: string;

    constructor(options?: ReaderOptions);

    /**
     * Initializes the reader.
     * @param modName Optional namespace or prefix for storage separation.
     */
    init(modName?: string): Promise<void>;

    /**
     * Lists available files.
     * @param prefix Optional prefix filter.
     */
    list(prefix?: string): Promise<string[]>;

    /**
     * Reads a file.
     */
    get(filename: string): Promise<any>;

    /**
     * Writes a file.
     * @param filename The file name or key.
     * @param data File contents.
     * @param options Additional write options.
     */
    set(filename: string, data: any, options?: { file?: boolean }): Promise<void>;

    /**
     * Deletes a file.
     */
    delete(filename: string): Promise<void>;

    /**
     * Clears all files or namespace-prefixed entries.
     */
    clear(): Promise<void>;
}

