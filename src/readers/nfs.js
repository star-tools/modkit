import { isNode } from '../util/js-util.js';
import Reader from './reader.js';

const fs = isNode ? await import('fs/promises') : null;
const path = isNode ? await import('path') : null;

export default class NodeReader extends Reader {
  constructor(options = {}) {
    super(options);
    this.extension = options.extension || '';
    this.name = options.name || 'nfs';
    this.base = options.base || '';
  }

  async init(modpath) {
    let fullpath = path.resolve(this.base, modpath)
    await super.init(fullpath)
  }
  async isFile (path) {
    if(fs.access(path,fs.constants.R_OK)){
      const stats = await fs.stat(path);
      return stats.isFile() 
    }
  }
  async isFolder (path) {
    if(fs.access(path,fs.constants.R_OK)){
      const stats = await fs.stat(path);
      return stats.isDirectory()
    }
  }
  async isExists(path){
    try {
      await fs.access(path, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    } 
  }

  async list(dirPath = '') {
    const fullPath = path.join(this.modpath, dirPath);
    const files = [];
    const folders = [];

    try {
      const items = await fs.readdir(fullPath, { withFileTypes: true });

      for (const item of items) {
        const relativePath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          folders.push(relativePath);
          const sub = await this.list(relativePath);
          files.push(...sub);
        } else if (item.isFile()) {
          files.push(relativePath);
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to list base: ${fullPath}`, err.message);
      }
    }

    return files;
  }

  async get(relativeFile, options = {}) {
    const fullPath = path.join(this.modpath, relativeFile);

    try {
      if (options.encoding === 'base64') {
        const buffer = await fs.readFile(fullPath);
        return buffer.toString('base64');
      }

      if (options.binary || options.encoding === 'buffer' || options.encoding === 'uint8array') {
        return await fs.readFile(fullPath);
      }

      return await fs.readFile(fullPath, options.encoding || 'utf-8');
    } catch (err) {
      console.error(`Failed to read file: ${fullPath}`, err.message);
      return null;
    }
  }

  async set(filename, content, options) {
    if (!content) {
      console.warn('No content for file ' + filename);
      return;
    }

    const foutput = path.join(this.modpath, filename);
    const dir = path.dirname(foutput);

    await fs.mkdir(dir, { recursive: true });

    if (options?.file) {
      await fs.copyFile(content, foutput);
    } else {
      await fs.writeFile(foutput, content);
    }
  }
}

Reader.readers.Node = NodeReader;
