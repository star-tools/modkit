import Reader from './reader.js';

interface URLReaderOptions {
  baseUrl: string;
  name?: string;
}

interface URLListResult {
  files: string[];
  folders: string[];
}

declare class URLReader extends Reader {
  name: string;
  baseUrl: string;
  indexFile: string;
  index: URLListResult | null;

  constructor(options: URLReaderOptions);

  init(modpath?: string): Promise<void>;

  list(dirPath?: string, recursive?: boolean): Promise<URLListResult>;

  get(relativeFile: string): Promise<string | null>;

  set(relativeFile: string, content: string | Uint8Array | Blob): Promise<void>;
}

export default URLReader;
