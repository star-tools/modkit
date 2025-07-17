import { CDataType, CEnum } from './cdatatype';

/**
 * Represents a nested schema definition.
 */
export interface SchemaDefinition {
  [key: string]: SchemaField;
}

/**
 * Represents a valid field type in the schema.
 */
export type SchemaField =
  | NumberConstructor              // Number type
  | StringConstructor              // String type
  | BooleanConstructor             // Boolean type
  | CDataTypeConstructor
  | SchemaDefinition
  | SchemaArray;

/**
 * SchemaArray can represent:
 * - Simple array with one subtype
 * - Indexed array with a CEnum indexer
 */
export type SchemaArray =
  | [SchemaField] // Simple array
  | [SchemaField, CEnumConstructor]; // Indexed array

/**
 * For supporting constructors of data types
 */
export interface CDataTypeConstructor {
  new (...args: any[]): CDataType;
  validate: (val: any, json?: any) => boolean;
  parse: (str: string, json?: any) => any;
}

/**
 * For supporting constructors of enums
 */
export interface CEnumConstructor extends CDataTypeConstructor {
  new (...args: any[]): CEnum;
  enum: string[];
}

/**
 * Example usage:
 *
 * const exampleSchema: SchemaDefinition = {
 *   id: ParentType,
 *   default: BitType,
 *   '@class': ClassIdEnum,
 *   '%token': [STokenType],
 *   attributes: [{ key: StringType, value: NumberType }, AttributeEnum]
 * };
 */
