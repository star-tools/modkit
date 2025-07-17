// ====== Base Data Type Class ======

/**
 * Abstract base class for all data types.
 * Provides default validate and parse methods.
 */
export class CDataType {
  constructor(name) {
    this.name = name;
  }

  static isValue = true;

  /**
   * Validate a given value against the data type.
   * Default implementation always returns true.
   * @param {*} val - Value to validate.
   * @returns {boolean}
   */
  static validate(val) {
    return true;
  }

  /**
   * Parse a string value to the internal representation.
   * Default implementation returns the string itself.
   * @param {string} str
   * @param {object} json - Optional context.
   * @returns {*}
   */
  static parse(str, json) {
    if (!this.validate(str, json)) {
      console.warn(`Invalid data: ${str}`);
      return null;
    }
    return str;
  }
}

// ====== Enum Type ======

/**
 * Enum type that validates strings against allowed enum values.
 */
export class CEnum extends CDataType {
  static enum = [];

  constructor() {
    super('Enum');
  }

  /**
   * Validate if value is in enum list.
   * Allows "Unknown" as fallback.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    if (!this.enum.length) return true;
    if (val === "Unknown") return true;
    if (!this.enum.includes(val)) {
      console.log(`Value '${val}' is missing in Enum ${this.name}`);
      return false;
    }
    return true;
  }
}

// ====== List Types ======

/**
 * Base class for list types.
 * Validates lists of subtypes separated by a pattern.
 */
export class CList extends CDataType {
  static separator = /[\s,]+/; // default: spaces or commas
  static subType = null;

  /**
   * Validate a list string by splitting and validating each element.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    if (!this.subType || typeof this.subType.validate !== 'function') {
      throw new Error('CList requires a static subType with validate()');
    }

    const values = val.trim().split(this.separator).filter(Boolean);
    return values.every((v) => this.subType.validate(v));
  }
}

// ====== Misc Types ======
// These classes should be replaced with actual enum and data types

/**
 * EUnknown: Placeholder Enum for unknown values.
 */
export class EUnknown extends CEnum {
  static validate(val) {
    console.log(`Unknown Enum: ${val}`);
    return true;
  }
}

/**
 * CUnknown: Generic placeholder data type.
 */
export class CUnknown extends CDataType { }
