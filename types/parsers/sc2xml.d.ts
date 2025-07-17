// SC2XML.d.ts

import { Document } from "domhandler"; // or lib.dom.d.ts (built-in) if targeting browser XML

export interface SC2XMLNode {
  tag: string;
  attributes?: Record<string, string>;
  value?: string;
  children?: SC2XMLNode[] | string[];
  directives?: Array<{ directive: string; [key: string]: string }>;
  comment?: string;
}
export type SC2XMLValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | SC2XMLData
  | SC2XMLData[]
  | Record<string, SC2XMLValue>;

export interface SC2XMLData {
  [key: string]: SC2XMLValue;
}

export interface SC2XMLParsed extends SC2XMLNode, SC2XMLData {}


export interface SC2XMLLog {
  missingEnum?: Record<string, Set<string | number>>;
  missingSchema?: Record<string, any>;
  unknownEnumIndex?: Record<string, Set<string | number>>;
}

export default class SC2XML {
  /**
   * Parses XML into structured JSON.
   * 
   * @param xmlText - The XML source as string or Document.
   * @param schema - Optional schema to apply.
   * @param log - Optional log object to capture missing enums/schema.
   * @returns JSON object representing the XML data.
   */
  static parse(
    xmlText: string | Document,
    schema?: SCSchema,
    log?: SC2XMLLog
  ): SC2XMLParsed;

  /**
   * Converts structured JSON back to XML string.
   * 
   * @param jsonObject - The JSON object to convert.
   * @param schema - Optional schema to guide serialization.
   * @returns XML string.
   */
  static stringify(
    jsonObject: SC2XMLParsed,
    schema?: SCSchema
  ): string;
}
