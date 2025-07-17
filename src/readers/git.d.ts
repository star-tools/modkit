import Reader from './reader.js';

interface GitReaderOptions {
  token?: string;
  name?: string;
}

/**
 * GitReader class to read files from a GitHub repository using Octokit.
 * 
 * Supports listing files with a fallback legacy method for repos with fewer than 1000 files.
 */
export declare class GitReader extends Reader {
  name: string;
  octokit: any;
  owner: string;
  repo: string;
  path: string;

  constructor(options?: GitReaderOptions);

  /**
   * Initializes the reader with a GitHub repo path in the format "github:owner/repo/path".
   * @param modpath The GitHub repository path string.
   */
  init(modpath: string): Promise<void>;

  /**
   * Lists all files in the repository or subdirectory.
   * Uses legacy API if under 1000 files, otherwise uses recursive tree API.
   * @returns Array of file paths.
   */
  list(): Promise<string[]>;

  /**
   * Gets the content of a file as a string.
   * Returns null if file not found or error occurs.
   * @param fileName Relative path to the file in the repository.
   */
  get(fileName: string): Promise<string | null>;
}

export default GitReader;
