/**
 * ENV Parser and Stringifier (SC2 Localization Compatible)
 * ========================================================
 * 
 * Parses and serializes `.env`-style SC2 files:
 * 
 * Supported Features:
 * -------------------
 * - Key-Value pairs: `KEY=VALUE`
 * - Comments: Lines starting with `;` or `//`
 * - Preserves or ignores comments (configurable)
 * - Handles BOM and Windows line endings
 * 
 * Usage Example:
 * --------------
 * Input:
 *   ; UI Buttons
 *   UI/Button=Assets\\Textures\\Button.dds
 * 
 * Parsed Output (keepComments: true):
 * [
 *   { type: 'comment', value: 'UI Buttons' },
 *   { type: 'pair', key: 'UI/Button', value: 'Assets\\Textures\\Button.dds' }
 * ]
 * 
 * Parsed Output (keepComments: false):
 * {
 *   "UI/Button": "Assets\\Textures\\Button.dds"
 * }
 */

export default class SC2ENV {

  /**
   * Parses ENV text into structured entries or plain object.
   * 
   * @param {string} rawText - The raw text of the .env file.
   * @param {Object} options
   * @param {boolean} [options.keepComments=false] - Whether to keep comments as parsed entries.
   * @returns {Array|Object} If keepComments is true, returns entries array. Otherwise, returns plain object.
   */
  static parse(rawText, { keepComments = false } = {}) {
    if (!rawText) return keepComments ? [] : {};

    const entries = keepComments ? [] : {};
    rawText
      .replace("\uFEFF", "") // Remove BOM if present
      .replace(/\r/g, "")    // Normalize Windows line endings
      .split("\n")
      .forEach(line => {
        const trimmed = line.trim();

        if (!trimmed) return; // Skip empty lines

        if (trimmed.startsWith(";") || trimmed.startsWith("//")) {
          if (keepComments) {
            entries.push({ type: 'comment', value: trimmed.replace(/^;|^\/\//, '').trim() });
          }
          return;
        }

        const index = trimmed.indexOf("=");
        if (index === -1) return; // Skip malformed lines

        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();

        if (keepComments) {
          entries.push({ type: 'pair', key, value });
        } else {
          entries[key] = value;
        }
      });

    return entries;
  }

  /**
   * Serializes ENV data back into text.
   * 
   * @param {Array|Object} data - Array of entries (from parse with keepComments), or plain object.
   * @param {Object} options
   * @param {boolean} [options.keepComments=false] - Whether to treat input as entries with comments.
   * @returns {string} Serialized ENV text.
   */
  static stringify(data, { keepComments = false } = {}) {
    if (keepComments) {
      return data.map(entry => {
        if (entry.type === 'comment') {
          return `; ${entry.value}`;
        }
        if (entry.type === 'pair') {
          return `${entry.key}=${entry.value}`;
        }
        return '';
      }).join('\n').trimEnd();
    } else {
      return Object.entries(data).map(([key, value]) => `${key}=${value}`).join('\n').trimEnd();
    }
  }

  /**
   * Converts parsed entries into a plain object.
   * 
   * @param {Array} entries - Array from parse({ keepComments: true })
   * @returns {Object} Key-value pairs only.
   */
  static toObject(entries) {
    const obj = {};
    for (const entry of entries) {
      if (entry.type === 'pair') {
        obj[entry.key] = entry.value;
      }
    }
    return obj;
  }

  /**
   * Converts a plain object into an ENV token list (no comments).
   * 
   * @param {Object} obj - Key-value pairs.
   * @returns {Array} Entries array.
   */
  static fromObject(obj) {
    return Object.entries(obj).map(([key, value]) => ({
      type: 'pair',
      key,
      value
    }));
  }
}
