// SC2ENV.d.ts

export interface SC2EnvCommentEntry {
  type: 'comment';
  value: string;
}

export interface SC2EnvPairEntry {
  type: 'pair';
  key: string;
  value: string;
}

export type SC2EnvEntry = SC2EnvCommentEntry | SC2EnvPairEntry;

export interface SC2EnvParseOptions {
  keepComments?: boolean;
}

export interface SC2EnvStringifyOptions {
  keepComments?: boolean;
}

export default class SC2ENV {
  /**
   * Parses ENV text into structured entries or plain object.
   */
  static parse(
    rawText: string,
    options?: SC2EnvParseOptions
  ): SC2EnvEntry[] | Record<string, string>;

  /**
   * Serializes ENV data back into text.
   */
  static stringify(
    data: SC2EnvEntry[] | Record<string, string>,
    options?: SC2EnvStringifyOptions
  ): string;

  /**
   * Converts parsed entries into a plain object.
   */
  static toObject(entries: SC2EnvEntry[]): Record<string, string>;

  /**
   * Converts a plain object into an ENV token list (no comments).
   */
  static fromObject(obj: Record<string, string>): SC2EnvPairEntry[];
}
