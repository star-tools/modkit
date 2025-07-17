import Reader from './reader.js';

interface ReaderConfig {
  name?: string;
  prefix?: string | RegExp;
  default?: boolean;
  canHandle?: (path: string) => boolean;
  reader: Reader | { path: string; options?: Record<string, any> } | Function;
  options?: Record<string, any>;
}

interface ReadOptions {
  encoding?: string;
  [key: string]: any;
}

interface WriteOptions {
  encoding?: string;
  file?: boolean;
  [key: string]: any;
}

/**
 * Virtual File System (VFS) class to manage multiple Readers and route I/O requests.
 */
declare class VFS extends Reader {
  /**
   * Get a reader config by its name.
   * @param name Reader name
   */
  reader(name: string): ReaderConfig | undefined;

  /**
   * Add multiple readers to the VFS instance.
   * @param readerConfigs One or more ReaderConfig objects
   */
  addReaders(...readerConfigs: ReaderConfig[]): void;

  /**
   * Add a single reader to the VFS instance.
   * @param readerConfig ReaderConfig to add
   */
  addReader(readerConfig: ReaderConfig): void;

  /**
   * Remove a reader from the VFS instance.
   * @param readerConfig ReaderConfig to remove
   */
  removeReader(readerConfig: ReaderConfig): void;

  /**
   * Initialize the reader responsible for a given path.
   * @param path Path to initialize reader for
   */
  init(path: string): Promise<Reader>;

  /**
   * List files for a given path using the appropriate reader.
   * @param path Path to list files from
   * @param options Optional list options
   */
  list(path?: string, options?: object): Promise<string[]>;

  /**
   * Read a file from the VFS.
   * @param path File path
   * @param options Optional read options, e.g. encoding
   */
  get(path: string, options?: ReadOptions): Promise<string | Buffer | null>;

  /**
   * Write a file into the VFS.
   * @param path File path
   * @param content File content, string or Buffer or Uint8Array
   * @param options Optional write options
   */
  set(path: string, content: string | Buffer | Uint8Array, options?: WriteOptions): Promise<void>;
}

export default VFS;
