/**
 * SC2TextureMap
 * =========
 * 
 * StarCraft II Texture Mapping Parser & Stringifier
 * 
 * Parses and serializes SC2 texture mapping metadata, typically found in `TextureReductionValues.txt` 
 * or similar asset mapping files.
 * 
 * Format:
 * -------
 * Each line represents a texture and its mipmap reduction data.
 * 
 * Syntax per line:
 *   <texture_file>:<number1>:<number2>:<number3>:<number4>:<number5>:
 * 
 * Example Input:
 * --------------
 * _base_diffuse.dds:7:8:8:10:6:
 * _details.dds:5:5:5:5:5:
 * 
 * Parsed Output:
 * --------------
 * [
 *   { file: "_base_diffuse.dds", value: [7, 8, 8, 10, 6] },
 *   { file: "_details.dds", value: [5, 5, 5, 5, 5] }
 * ]
 * 
 * Usage:
 * ------
 * import { SC2TextureMap } from './SC2TextureMap.js';
 * 
 * const input = `
 * _base_diffuse.dds:7:8:8:10:6:
 * _details.dds:5:5:5:5:5:
 * `;
 * 
 * const parsed = SC2TextureMap.parse(input);
 * console.log(parsed);
 * 
 * const output = SC2TextureMap.stringify(parsed);
 * console.log(output);
 * 
 * Resulting Output String:
 * ------------------------
 * _base_diffuse.dds:7:8:8:10:6:
 * _details.dds:5:5:5:5:5:
 */
export default class SC2TextureMap {
  
  /**
   * Parses texture mapping text into structured data.
   * 
   * @param {string} rawText - The raw input string.
   * @returns {Array<{file: string, value: number[]}>} Parsed mapping array.
   */
  static parse(rawText) {
    if (!rawText) return [];

    const result = [];

    rawText
      .replace("\uFEFF", "") // Remove BOM if present
      .replace(/\r/g, "")    // Normalize line endings
      .split("\n")           // Split into lines
      .forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return; // Skip empty lines

        const parts = trimmed.split(":").filter(p => p !== "");

        if (parts.length < 6) {
          console.warn(`Skipping malformed line: ${line}`);
          return;
        }

        const [file, ...numbers] = parts;
        result.push({
          file,
          value: numbers.map(Number)
        });
      });

    return result;
  }

  /**
   * Converts structured texture mapping data back into text format.
   * 
   * @param {Array<{file: string, value: number[]}>} mappings - Mapping data to serialize.
   * @returns {string} Serialized text in texture mapping format.
   */
  static stringify(mappings) {
    return mappings
      .map(mapping => `${mapping.file}:${mapping.value.join(":")}:`)
      .join('\n');
  }
}
