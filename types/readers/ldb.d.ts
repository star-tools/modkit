import type { LevelDB } from 'level';
import { Reader, ReaderOptions } from './sc2-readers.js';

export interface LevelDBReaderOptions extends ReaderOptions {
  dbName?: string;
}

/**
 * LevelDBReader for Node.js environment.
 * Inherits standard Reader API and adds `close()`.
 */
export class LevelDBReader extends Reader {
  dbName: string;
  db: LevelDB | null;
  modName: string;

  constructor(options?: LevelDBReaderOptions);

  /**
   * Closes the LevelDB database.
   */
  close(): Promise<void>;
}

export default LevelDBReader;
