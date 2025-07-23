

/**
 * Checks if a value is a plain object (non-null, not an array, not a function).
 * @param {any} val 
 * @returns {boolean}
 */
export function isPlainObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Clones a value deeply if needed (primitive-safe).
 * @param {any} val 
 * @returns {any}
 */
export function cloneValue(val) {
  if (Array.isArray(val)) {
    const out = new Array(val.length);
    for (let i = 0; i < val.length; i++) {
      out[i] = cloneValue(val[i]);
    }
    return out;
  }
  if (isPlainObject(val)) {
    const out = {};
    for (const k in val) {
      out[k] = cloneValue(val[k]);
    }
    return out;
  }
  return val;
}

/**
 * objectsDeepMerge
 * 
 * Recursively merges two objects or arrays with flexible array handling.
 * Supports different merge strategies via the `mode` parameter.
 * 
 * @param {Object|Array} target - The target object or array. Mutated unless `clone` is true.
 * @param {Object|Array} source - The source object or array to merge into target.
 * @param {string} [mode='merge'] - Array merge strategy:
 *   - 'merge'   : Concatenate arrays (default).
 *   - 'replace' : Replace arrays entirely.
 *   - 'unite'   : Merge arrays by index (deep merge each element).
 * @param {Object} [options] - Additional options.
 * @param {boolean} [options.clone=false] - If true, creates a new structure instead of mutating `target`.
 * 
 * @returns {Object|Array} The merged result.
 * 
 * @example
 * const a = { foo: [1, 2], bar: { x: 1 } };
 * const b = { foo: [3, 4], bar: { y: 2 } };
 * 
 * objectsDeepMerge(a, b, 'merge');
 * // => { foo: [1, 2, 3, 4], bar: { x: 1, y: 2 } }
 * 
 * objectsDeepMerge(a, b, 'replace');
 * // => { foo: [3, 4], bar: { x: 1, y: 2 } }
 * 
 * objectsDeepMerge(a, b, 'unite');
 * // => { foo: [3, 4], bar: { x: 1, y: 2 } }
 */
export function objectsDeepMerge(target, source, mode = 'merge', options = {}) {
  if (source == null) return options.clone ? cloneValue(target) : target;
  if (target == null) return cloneValue(source);

  const clone = options.clone;
  const result = clone
    ? (Array.isArray(target) ? target.slice() : Object.assign({}, target))
    : target;

  for (const key in source) {
    const sVal = source[key];
    if (sVal == null) continue;

    const tVal = result[key];
    const sArr = Array.isArray(sVal);
    const sObj = isPlainObject(sVal);
    const tArr = Array.isArray(tVal);
    const tObj = isPlainObject(tVal);

    if (tVal == null) {
      result[key] = sArr || sObj ? cloneValue(sVal) : sVal;
      continue;
    }

    // Type mismatch → overwrite
    if (typeof sVal !== typeof tVal || sArr !== tArr || sObj !== tObj) {
      result[key] = sArr || sObj ? cloneValue(sVal) : sVal;
      continue;
    }

    // Arrays
    if (sArr) {
      if (mode === 'replace') {
        result[key] = sVal.length ? cloneValue(sVal) : [];
      } else if (mode === 'unite') {
        const len = Math.max(tVal.length, sVal.length);
        const merged = new Array(len);
        for (let i = 0; i < len; i++) {
          const sItem = sVal[i];
          const tItem = tVal[i];
          merged[i] =
            sItem != null && tItem != null
              ? objectsDeepMerge(tItem, sItem, mode)
              : sItem != null
              ? (Array.isArray(sItem) || isPlainObject(sItem) ? cloneValue(sItem) : sItem)
              : tItem;
        }
        result[key] = merged;
      } else { // merge mode
        result[key] = sVal.length ? tVal.concat(sVal) : tVal;
      }
      continue;
    }

    // Plain objects
    if (sObj) {
      result[key] = objectsDeepMerge(tVal, sVal, mode);
      continue;
    }

    // Primitives (number, string, etc.)
    result[key] = sVal;
  }

  return result;
}


/**
 * objectDeepTransform
 * 
 * Recursively traverses an object or nested structure, and conditionally replaces values
 * matching specific criteria. Provides detailed context (path, parent, property, etc.) to the callback.
 * 
 * Supports:
 * - Deep object traversal (arrays and objects)
 * - Conditional matching by property name or value
 * - Dynamic replacement via callback
 * 
 * @param {Object} obj - The object to traverse and modify.
 * @param {Function} [testVal] - Optional function `(val) => boolean` to test values.
 * @param {Function} [testProp] - Optional function `(prop) => boolean` to test property keys.
 * @param {Function} cb - Callback called on each match. Can return a replacement value.
 *   Callback receives:
 *   {
 *     val,           // The current value
 *     value,         // Alias of val
 *     property,      // The current property name
 *     object,        // The parent object (or array)
 *     prop,          // Alias of property
 *     obj,           // Alias of object
 *     id,            // Parent property in previous level (or null for root)
 *     path,          // Array of parent objects (object chain)
 *     crumbs         // Array of keys leading to current property (property chain)
 *   }
 * @param {string} [id] - Optional identifier for the current object level (used internally for recursion).
 * @param {Array} [_path] - Internal recursion tracker: list of parent objects.
 * @param {Array} [_pathids] - Internal recursion tracker: list of property keys.
 * 
 * @example
 * // Replace all numbers with their square
 * const data = { a: 2, b: { c: 3, d: 4 } };
 * objectDeepTransform(data, val => typeof val === 'number', null, ({ val }) => val * val);
 * 
 * // Result:
 * // { a: 4, b: { c: 9, d: 16 } }
 * 
 * @example
 * // Remove all properties named 'debug'
 * const data = { foo: 1, debug: true, nested: { debug: false, bar: 2 } };
 * objectDeepTransform(data, null, prop => prop === 'debug', () => undefined);
 * 
 * // Result:
 * // { foo: 1, nested: { bar: 2 } }
 * 
 * @example
 * // Log all string values with their path
 * objectDeepTransform(obj, val => typeof val === 'string', null, ({ crumbs, val }) => {
 *   console.log(`Found string at ${crumbs.join('.')}:`, val);
 * });
 * 
 */
export function objectDeepTransform(obj, testVal, testKey, cb, id, path = null, crumbs = null) {
  if (obj == null || typeof obj !== 'object') return;

  for (const key in obj) {
    let value = obj[key];

    // Run tests
    const shouldTestVal = !testVal || testVal(value);
    const shouldTestKey = !testKey || testKey(key);

    if (shouldTestVal && shouldTestKey) {
      const result = cb(key, value, obj, id, path, crumbs);
      if (result !== undefined) {
        obj[key] = value = result;
      }
    }

    if (value && typeof value === 'object') {
      if (path) path.push(obj);
      if (crumbs) crumbs.push(key);
      objectDeepTransform(value, testVal, testKey, cb, key, path, crumbs);
      if (crumbs) crumbs.pop();
      if (path) path.pop();
    }
  }
}



// export function objectDeepTransform(obj, testVal, testProp, cb, id, _path = [], _pathids = []) {
//     const keys = Object.keys(obj)
//     for (let i = 0, len = keys.length; i < len; i++) {
//         let prop = keys[i], val = obj[prop]
//         let path = [..._path, obj]
//         let crumbs = [..._pathids, prop]
//         if ((!testVal || testVal(val)) && (!testProp || testProp(prop))){
//             let result = cb({val, value: val,property: prop, object: obj, prop, obj, id, path,crumbs})
//             if(result !== undefined) {
//                 obj[prop] = result;
//                 val = result;
//             }
//         }
//         if (val && typeof val === 'object'){
//             objectDeepTransform(val, testVal, testProp, cb, prop, path,crumbs)
//         }
//     }
// }

/**
 * applyArrayPatches
 * 
 * Applies StarCraft II XML-style patches to arrays and objects.
 * 
 * Supports:
 * - Array patching via `index` and `removed`
 * - Inserting primitives or objects via `{ index, value }`
 * - Object merging at array indices if additional fields exist
 * - Deep recursion (default) or shallow processing (if `deep = false`)
 * 
 * Typical use case: Merging `Catalog.xml` patches or `SC2Components` diffs into base data.
 * 
 * @param {any} data - The source data to patch (arrays/objects).
 * @param {boolean} [deep=true] - If true, patch recursively. If false, only top-level is patched.
 * @returns {any} The patched data.
 * 
 * @example
 * // Base array:
 * const base = [ "A", "B", "C" ];
 * 
 * // Patch array:
 * const patch = [
 *   { index: 1, value: "B_Patched" },    // Replace "B" with "B_Patched"
 *   { index: 3, value: "D" },             // Add "D" at index 3
 *   { index: 0, removed: 1 }              // Remove "A" at index 0
 * ];
 * 
 * applyArrayPatches(patch);
 * 
 * // Result:
 * [ "B_Patched", "C", "D" ]
 * 
 * @example
 * // Deep patch example:
 * const data = [
 *   {
 *     name: "Unit",
 *     upgrades: [
 *       { index: 1, value: "UpgradeB" },
 *       { index: 2, other: "Extra" }
 *     ]
 *   }
 * ];
 * 
 * const result = applyArrayPatches(data);
 * 
 * // Output:
 * [
 *   {
 *     name: "Unit",
 *     upgrades: [ null, "UpgradeB", { other: "Extra" } ]
 *   }
 * ]
 * 
 * @example
 * // Shallow patch example (deep = false):
 * applyArrayPatches(data, false);
 * 
 * // Only top-level patches applied, nested structures remain untouched.
 */
export function applyArrayPatches(data, deep = true) {
  if (Array.isArray(data)) {
    const result = [];

    for (const item of data) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        // Primitive or nested array – recurse if deep
        result.push(deep ? applyArrayPatches(item, deep) : item);
        continue;
      }

      if ('index' in item) {
        const index = item.index;

        // Ensure enough elements in the array
        while (result.length < index) result.push(null);

        const keys = Object.keys(item);
        const patch = { ...item };
        delete patch.index;

        if ('removed' in item) {
          result.splice(index, item.removed);
        } else if (keys.length === 1 && 'value' in item) {
          // { index, value } shorthand
          result[index] = deep ? applyArrayPatches(item.value, deep) : item.value;
        } else {
          // Multiple fields - merge object at index
          const current = result[index] ?? {};
          const merged = { ...current, ...patch };

          result[index] = deep ? applyArrayPatches(merged, deep) : merged;
        }
      } else {
        // Normal object in array
        result.push(deep ? applyArrayPatches(item, deep) : item);
      }
    }

    return trimTrailingNulls(result)
  }

  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key in data) {
      result[key] = deep ? applyArrayPatches(data[key], deep) : data[key];
    }
    return result;
  }

  // Primitive value
  return data;
}

export function trimTrailingNulls(arr) {
  let i = arr.length - 1;
  while (i >= 0 && arr[i] === null) {
    i--;
  }
  return arr.slice(0, i + 1);
}


export function groupObjectKeys(input,separator = '/') {
    const result = {};

    for (const [path, value] of Object.entries(input)) {
        const parts = path.split(separator);
        let current = result;

        for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If it's the last part, set the value
        if (i === parts.length - 1) {
            current[part] = value;
        } else {
            // If the key doesn't exist or isn't an object, create/replace it
            if (typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
            }
            current = current[part];
        }
        }
    }

    return result;
}
