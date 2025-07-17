// SC2INI.d.ts

export type SC2IniValue = string | string[];

export interface SC2IniEntity {
  id: string;
  [key: string]: SC2IniValue;
}

export interface SC2IniData {
  [group: string]: SC2IniEntity[];
}

export default class SC2INI {
  /**
   * Parses SC2-style INI text into structured JSON.
   * @param iniText - Raw INI text.
   * @returns Parsed data.
   */
  static parse(iniText: string): SC2IniData;

  /**
   * Converts structured JSON back into SC2 INI text.
   * @param data - JSON object representing the INI structure.
   * @returns INI formatted string.
   */
  static stringify(data: SC2IniData): string;
}
