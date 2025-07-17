
// ====== Base Data Type Class ======

/**
 * Abstract base class for all data types.
 * Provides default validate and parse methods.
 */
export class CDataType {
  constructor(name) {
    this.name = name;
  }
  static isValue = true
  /**
   * Validate a given value against the data type.
   * Default implementation always returns true.
   * Override in subclasses.
   * @param {*} val - value to validate
   * @returns {boolean}
   */
  static validate(val) {
    return true;
  }

  /**
   * Parse a string value to the internal representation.
   * Default implementation returns the string itself.
   * Override to convert to number, etc.
   * @param {string} str
   * @returns {*}
   */
  static parse(str , json) {
    if (!this.validate(str , json)) {
      console.warn('Invalid data: ' + str);
      return null;
    }
    return str;
  }
}

// ====== Enum Type ======

/**
 * Enum class validates string against allowed enum values.
 */
export class CEnum extends CDataType {
  static enum = [];

  constructor() {
    super('Enum');
  }

  /**
   * Validate if value is in enum list.
   * If enum list is empty, allow all values.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    if (!this.enum.length) return true;
    if(val === "Unknown") return true; //is it correct?
    if(!this.enum.includes(val)){
      console.log(`value ${val} is missing in Enum ` + this.name)
    return false
    }
    return true
  }
}


// ====== List Types ======

/**
 * Base class for list types.
 * Validates lists of subtypes separated by separator regex.
 */
export class CList extends CDataType {
  static separator = /[\s,]+/; // default separator: spaces or commas
  static subType = null;

  /**
   * Validate a list string by splitting and validating each element with subType.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    const subType = this.subType;
    const pattern = this.separator;

    if (!subType || typeof subType.validate !== 'function') {
      throw new Error('Missing static subType with validate()');
    }

    const normalized = val.trim().replace(/\s+/g, ' ');
    const values = normalized.split(pattern).filter(Boolean);

    return values.every((v) => subType.validate(v));
  }
}


// ====== Misc Types ======

/** CUnknown Enum placeholder */
export class EUnknown extends CEnum {
  static validate(val) {
    console.log("unknown Enum. value " + val)
    return true
  }
}

/** Generic unknown data type */
export class CUnknown extends CDataType {}