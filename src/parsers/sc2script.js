/**
 * LineParser
 * 
 * Provides simple utilities to parse plain text into an array of lines
 * and serialize arrays of strings back into text.
 * 
 * Features:
 * - Handles both LF and CRLF line endings.
 * - Removes BOM (Byte Order Mark) if present.
 * 
 * Limitations:
 * - No comment handling or extra parsing; treats each line as raw text.
 */
export default class SC2Script {

  /**
   * Parses raw text into an array of lines.
   * 
   * @param {string} rawText - The raw text input.
   * @returns {string[]|null} Array of lines, or null if input is empty.
   */
  static parse(rawText) {
    if (!rawText) return null;

    return rawText
      .replace("\uFEFF", "") // Remove BOM if present
      .replace(/\r/g, "")    // Normalize Windows line endings
      .split("\n");          // Split into lines
  }

  /**
   * Serializes an array of strings back into a single text block.
   * 
   * @param {string[]} lines - The array of lines to join.
   * @returns {string} The resulting text with Unix line endings.
   */
  static stringify(lines) {
    return lines.join("\n");
  }
}


//possible relations
// include "TriggerLibs/Terran/TerranVyEy"
// const string c_ZR_UltraliskArmor          = "ChitinousPlating";             // ChitinousPlating
// const string c_MK_250mmStrikeCannons        = "Abil/250mmStrikeCannons"