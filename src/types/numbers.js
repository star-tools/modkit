
// ====== Integer Types ======
// Example usage:
// console.log(Bit.validate("1"));        // true
// console.log(Bit.toNumber("0"));        // 0
// console.log(Real32.validate(1.5));     // true
// console.log(Int8.validate(127));       // true
// console.log(Int8.validate("128"));     // false
// console.log(UInt64.validate("18446744073709551615")); // true
// console.log(Int64.validate(-9223372036854775808n));   // true

import { CDataType } from "./core.js";
import { isValidNumber } from "../lib/js-util.js";


/**
 * Integer base class with optional min/max range checks.
 */
export class Int extends CDataType {
  /**
   * Validate an integer value or numeric string against min/max.
   * @param {number|string} val
   * @returns {boolean}
   */
  static validate(val) {
    let min = this.min;
    let max = this.max;

    if (typeof val === 'string') {
      val = Number(val);
      if (Number.isNaN(val)) return false;
    }
    if (typeof val !== 'number' || !Number.isInteger(val)) return false;

    if (min !== undefined && val < min) return false;
    if (max !== undefined && val > max) return false;

    return true;
  }

  /**
   * Parse a string to number if valid, else return input.
   * @param {string} str
   * @returns {number|string}
   */
  static parse(str) {
    return isValidNumber(str) ? +str : str;
  }
}


// ====== Floating Point Types ======

/**
 * Real (floating point) base class with min/max validation.
 */
export class Real extends CDataType {
  static validate(val) {
    let min = this.min;
    let max = this.max;

    if (typeof val === 'string') {
      val = Number(val);
      if (Number.isNaN(val)) return false;
    }
    if (typeof val !== 'number' || !isFinite(val)) return false;

    if (min !== undefined && val < min) return false;
    if (max !== undefined && val > max) return false;

    return true;
  }

  static parse(str) {
    return isValidNumber(str) ? +str : str;
  }
}

/** 32-bit float */
export class Real32 extends Real {}


/** Unsigned integer base class (min=0) */
export class UInt extends Int {
  static min = 0;
}

/** 8-bit signed integer (-128 to 127) */
export class Int8 extends Int {
  static min = -(2 ** 7);
  static max = 2 ** 7 - 1;
}

/** 16-bit signed integer */
export class Int16 extends Int {
  static min = -(2 ** 15);
  static max = 2 ** 15 - 1;
}

/** 32-bit signed integer */
export class Int32 extends Int {
  static min = -(2 ** 31);
  static max = 2 ** 31 - 1;
}

/** Bit (boolean represented as 0 or 1) */
export class Bit extends Int {
  static min = 0;
  static max = 1;
}

/** 8-bit unsigned integer */
export class UInt8 extends Int {
  static min = 0;
  static max = 2 ** 8 - 1;
}

/** 16-bit unsigned integer */
export class UInt16 extends Int {
  static min = 0;
  static max = 2 ** 16 - 1;
}

/** 32-bit unsigned integer */
export class UInt32 extends Int {
  static min = 0;
  static max = 2 ** 32 - 1;
}

export default {
  Int,
  Real,
  Real32,
  Bit,
  Int8,
  Int16,
  Int32,
  UInt,
  UInt8,
  UInt16,
  UInt32,
} 
