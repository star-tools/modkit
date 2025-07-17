
export const isNode = typeof process !== 'undefined' && process.versions?.node;

/**
 * Checks if a value is a valid number or numeric string.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidNumber(value) {
  if (typeof value === 'number') return isFinite(value);

  if (typeof value === 'string') {
    // Matches integer and decimal numbers, with optional sign
    return /^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(value);
  }

  return false;
}

/**
 * Determines whether a value is an integer.
 * @param {string|number} value
 * @returns {boolean}
 */
export function isInteger(value) {
  return Number.isInteger(Number(value));
}

/**
 * isNumeric
 * 
 * Determines whether a given string represents a valid number.
 * 
 * Checks that the input is a string, and verifies that it can be fully
 * parsed as a number (i.e., not just partially parseable like `parseFloat('123abc')`).
 * 
 * Returns `false` for non-strings, empty strings, whitespace-only strings,
 * or strings that cannot be fully parsed as numbers.
 * 
 * @param {string} str - The input string to test.
 * @returns {boolean} True if the string is a valid number, false otherwise.
 * 
 * @example
 * isNumeric("123")         // true
 * isNumeric(" 3.14 ")      // true
 * isNumeric("-1e5")        // true
 * isNumeric("123abc")      // false
 * isNumeric("")            // false
 * isNumeric("   ")         // false
 * isNumeric(123)           // false (not a string)
 */
export function isNumeric(str) {
  if (typeof str !== "string") return false; // Only process strings
  return !isNaN(str) && !isNaN(parseFloat(str));
}


