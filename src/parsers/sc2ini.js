/**
 * SC2INI
 * ======
 * 
 * StarCraft II INI-style Parser and Stringifier
 * 
 * Features:
 * - Parses SC2 INI-like formats into structured JSON.
 * - Supports nested entities within sections, split by `id=`.
 * - Aggregates repeated keys into arrays.
 * - Splits comma-separated values into arrays.
 * - Ignores empty lines, comments, and empty properties like `Effect` or `Effect=`.
 * - Converts back to INI text preserving structure.
 * 
 * Usage:
 * ------
 * 
 * import SC2INI from './SC2INI.js';
 * 
 * const parser = new SC2INI();
 * 
 * const input = `
 * [Abil]
 * id=GhostHoldFire
 * asset=Assets\\Textures\\WayPointLine.dds
 * asset=Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3
 * Actor=CommandUIHarnessAttackProtoss,CommandUIHarnessAttackTerran,CommandUIHarnessAttackZerg
 * Effect
 * 
 * id=GhostWeaponsFree
 * asset=Assets\\Textures\\WayPointLine.dds
 * asset=Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3
 * Actor=CommandUIHarnessAttackProtoss,CommandUIHarnessAttackTerran,CommandUIHarnessAttackZerg
 * Effect=
 * `;
 * 
 * const json = parser.parse(input);
 * console.log(json);
 * 
 * Output (JSON):
 * ---------------
 * {
 *   Abil: [
 *     {
 *       id: "GhostHoldFire",
 *       asset: [
 *         "Assets\\Textures\\WayPointLine.dds",
 *         "Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3"
 *       ],
 *       Actor: [
 *         "CommandUIHarnessAttackProtoss",
 *         "CommandUIHarnessAttackTerran",
 *         "CommandUIHarnessAttackZerg"
 *       ]
 *     },
 *     {
 *       id: "GhostWeaponsFree",
 *       asset: [
 *         "Assets\\Textures\\WayPointLine.dds",
 *         "Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3"
 *       ],
 *       Actor: [
 *         "CommandUIHarnessAttackProtoss",
 *         "CommandUIHarnessAttackTerran",
 *         "CommandUIHarnessAttackZerg"
 *       ]
 *     }
 *   ]
 * }
 * 
 * Convert back to INI:
 * --------------------
 * 
 * const output = parser.stringify(json);
 * console.log(output);
 * 
 * Resulting INI string:
 * ---------------------
 * [Abil]
 * id=GhostHoldFire
 * asset=Assets\Textures\WayPointLine.dds
 * asset=Assets\UI\Cursors\WayPointAttack_Void\WayPointAttack_Void.m3
 * Actor=CommandUIHarnessAttackProtoss,CommandUIHarnessAttackTerran,CommandUIHarnessAttackZerg
 * 
 * id=GhostWeaponsFree
 * asset=Assets\Textures\WayPointLine.dds
 * asset=Assets\UI\Cursors\WayPointAttack_Void\WayPointAttack_Void.m3
 * Actor=CommandUIHarnessAttackProtoss,CommandUIHarnessAttackTerran,CommandUIHarnessAttackZerg
 * 
 */

export default class SC2INI {

  /**
   * Parses SC2-style INI text into structured JSON.
   * @param {string} iniText 
   * @returns {Object} Parsed data.
   */
  static parse(iniText) {
    const result = {};
    let currentGroup = null;
    let currentEntity = null;

    const lines = iniText.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // Skip empty lines and comments
      if (!line || line.startsWith(";") || line.startsWith("#")) continue;

      // Section header
      const sectionMatch = line.match(/^\[(.+?)\]$/);
      if (sectionMatch) {
        currentGroup = sectionMatch[1];
        result[currentGroup] = [];
        currentEntity = null;
        continue;
      }

      if (!currentGroup) continue; // Skip lines outside sections

      // Key-value or bare key
      let [key, ...rest] = line.split("=");
      key = key.trim();
      let value = rest.join("=").trim();

      // Remove empty fields like "Effect" or "Effect="
      if (!value && rest.length === 0) {
        continue; // Skip bare keys without values
      }

      // "id" starts a new entity
      if (key === "id") {
        currentEntity = { id: value };
        result[currentGroup].push(currentEntity);
        continue;
      }

      if (!currentEntity) {
        // If no entity started yet, skip or warn
        console.warn(`Skipping property "${key}" without 'id' in section [${currentGroup}]`);
        continue;
      }

      // Multi-value support (comma-separated or multiple lines)
      if (key in currentEntity) {
        if (!Array.isArray(currentEntity[key])) {
          currentEntity[key] = [currentEntity[key]];
        }
        currentEntity[key].push(this._parseValue(value));
      } else {
        // Split comma lists into arrays, otherwise store as single string
        const val = this._parseValue(value);
        currentEntity[key] = val;
      }
    }

    return result;
  }

  static _parseValue(value) {
    if (value.includes(",")) {
      return value.split(",").map(v => v.trim());
    }
    return value;
  }

  /**
   * Converts structured JSON back into SC2 INI text.
   * @param {Object} data 
   * @returns {string}
   */
  static stringify(data) {
    let output = "";

    for (const group in data) {
      output += `[${group}]\n`;

      for (const entity of data[group]) {
        if (!entity.id) continue; // Skip entities without ID
        output += `id=${entity.id}\n`;

        for (const key in entity) {
          if (key === "id") continue;

          const values = Array.isArray(entity[key]) ? entity[key] : [entity[key]];

          for (const val of values) {
            if (Array.isArray(val)) {
              output += `${key}=${val.join(",")}\n`;
            } else {
              output += `${key}=${val}\n`;
            }
          }
        }
        output += "\n";
      }
    }

    return output.trimEnd();
  }
}




