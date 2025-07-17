import { Reader, ReaderOptions } from './sc2-readers.js';

/**
 * WebReaderOptions extends ReaderOptions.
 * You can pass an optional FileSystemDirectoryHandle directly.
 */
export interface WebReaderOptions extends ReaderOptions {
    dirHandle?: FileSystemDirectoryHandle;
}

/**
 * WebReader for browser File System Access API.
 * Inherits standard Reader API.
 */
export class WebReader extends Reader {
    dirHandle: FileSystemDirectoryHandle;

    constructor(options?: WebReaderOptions);

    /**
     * Initializes the reader. Opens directory picker if not provided.
     */
    init(): Promise<void>;
}

export default WebReader;
