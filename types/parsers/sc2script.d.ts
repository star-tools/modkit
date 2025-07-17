// SC2Script.d.ts

/**
 * SC2Script
 * 
 * Provides simple utilities to parse plain text into an array of lines
 * and serialize arrays of strings back into text.
 */
export default class SC2Script {
  
  /**
   * Parses raw text into an array of lines.
   * 
   * @param rawText - The raw text input.
   * @returns Array of lines, or null if input is empty.
   */
  static parse(rawText: string): string[] | null;

  /**
   * Serializes an array of strings back into a single text block.
   * 
   * @param lines - The array of lines to join.
   * @returns The resulting text with Unix line endings.
   */
  static stringify(lines: string[]): string;
}
