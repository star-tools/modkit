
/**
 * Checks if a value is a plain object (non-null, not an array, not a function).
 * @param {any} val 
 * @returns {boolean}
 */
function isPlainObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Clones a value deeply if needed (primitive-safe).
 * @param {any} val 
 * @returns {any}
 */
function cloneValue(val) {
  if (Array.isArray(val)) return val.map(cloneValue);
  if (isPlainObject(val)) return deepMergeFlexible({}, val, 'merge');
  return val; // Primitive
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
  const { clone = false } = options;

  if (target === undefined || target === null) return cloneValue(source);
  if (source === undefined || source === null) return cloneValue(target);

  // Create initial clone if needed
  if (clone) {
    target = Array.isArray(target) ? [...target] : { ...target };
  }

  for (const key of Object.keys(source)) {
    let sourceVal = source[key];
    let targetVal = target[key];

    if (sourceVal === undefined || sourceVal === null) continue;

    const sourceIsArray = Array.isArray(sourceVal);
    const sourceIsObject = isPlainObject(sourceVal);

    if (sourceIsArray) {
      sourceVal = objectsDeepMerge([], sourceVal, mode); // Clone array
    } else if (sourceIsObject) {
      sourceVal = objectsDeepMerge({}, sourceVal, mode); // Clone object
    }

    if (targetVal === undefined || targetVal === null) {
      target[key] = sourceVal;
    } else {
      const targetIsArray = Array.isArray(targetVal);
      const targetIsObject = isPlainObject(targetVal);

      if (typeof sourceVal !== typeof targetVal ||
          (sourceIsArray !== targetIsArray) ||
          (sourceIsObject !== targetIsObject)) {
        // Type mismatch: overwrite
        target[key] = sourceVal;
      } else if (sourceIsArray) {
        if (mode === 'replace') {
          target[key] = sourceVal;
        } else if (mode === 'unite') {
          const length = Math.max(targetVal.length, sourceVal.length);
          const united = [];
          for (let i = 0; i < length; i++) {
            if (targetVal[i] !== undefined && sourceVal[i] !== undefined) {
              united[i] = objectsDeepMerge(targetVal[i], sourceVal[i], mode);
            } else {
              united[i] = targetVal[i] !== undefined ? targetVal[i] : sourceVal[i];
            }
          }
          target[key] = united;
        } else { // Default 'merge'
          target[key] = [...targetVal, ...sourceVal];
        }
      } else if (targetIsObject) {
        target[key] = objectsDeepMerge(targetVal, sourceVal, mode);
      } else {
        // Primitive overwrite
        target[key] = sourceVal;
      }
    }
  }

  return target;
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
export function objectDeepTransform(obj, testVal, testProp, cb, id, _path = [], _pathids = []) {
    const keys = Object.keys(obj)
    for (let i = 0, len = keys.length; i < len; i++) {
        let prop = keys[i], val = obj[prop]
        let path = [..._path, obj]
        let crumbs = [..._pathids, prop]
        if ((!testVal || testVal(val)) && (!testProp || testProp(prop))){
            let result = cb({val, value: val,property: prop, object: obj, prop, obj, id, path,crumbs})
            if(result !== undefined) {
                obj[prop] = result;
                val = result;
            }
        }
        if (val && typeof val === 'object'){
            objectDeepTransform(val, testVal, testProp, cb, prop, path,crumbs)
        }
    }
}

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

    return result;
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
