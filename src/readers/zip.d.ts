import Reader from './reader.js';

interface ZipReaderOptions {
  name?: string;
}

export default class ZipReader extends Reader {
  name: string;
  file?: File | Blob;
  zip: any; // JSZip instance, you can type more specifically if you want

  constructor(file?: File | Blob, options?: ZipReaderOptions);

  init(): Promise<void>;

  list(dirPath?: string): Promise<string[]>;

  get(path: string): Promise<string>;

  set(filename: string, content: string | Uint8Array | ArrayBuffer): Promise<void>;

  blob(): Promise<Blob>;
}
