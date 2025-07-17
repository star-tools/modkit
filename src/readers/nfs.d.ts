import Reader from './reader.js';

interface NodeReaderOptions {
  extension?: string;
  name?: string;
  base?: string;
}

export default class NodeReader extends Reader {
  extension: string;
  name: string;
  base: string;
  modpath: string;

  constructor(options?: NodeReaderOptions);

  init(modpath: string): Promise<void>;

  list(dirPath?: string): Promise<string[]>;

  get(relativeFile: string, options?: { encoding?: 'utf-8' | 'base64' | 'buffer' | 'uint8array' }): Promise<string | Buffer | null>;

  link(file: string): string;

  set(filename: string, content: string | Buffer, options?: { file?: boolean }): Promise<void>;
}
