// SC2TextureMap.d.ts

/**
 * SC2TextureMap
 * 
 * StarCraft II Texture Mapping Parser & Stringifier
 */
export default class SC2TextureMap {
  
  /**
   * Parses texture mapping text into structured data.
   * 
   * @param rawText - The raw input string.
   * @returns Array of parsed mappings.
   */
  static parse(rawText: string): Array<{ file: string; value: number[] }>;

  /**
   * Converts structured texture mapping data back into text format.
   * 
   * @param mappings - Mapping data to serialize.
   * @returns Serialized text in texture mapping format.
   */
  static stringify(mappings: Array<{ file: string; value: number[] }>): string;
}
