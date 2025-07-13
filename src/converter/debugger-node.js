import SC2JSONDebugger from './debugger.js';

let fs;
let performance;
let isNode = typeof process !== 'undefined' && process.versions?.node;

if (isNode) {
  fs = await import('fs/promises');
  ({ performance } = await import('perf_hooks'));
} else {
  // Fallbacks for browser
  fs = {
    readFile: async () => { throw new Error('fs.readFile is not available in browser'); },
    writeFile: async () => { throw new Error('fs.writeFile is not available in browser'); },
    mkdir: async () => {},
  };

  performance = window.performance || {
    now: () => Date.now()
  };
}


/**
 * JSON.stringify but with inline arrays and formatted nested objects.
 * @param {Object} obj - The JSON object to stringify.
 * @param {number} [indent=2] - Number of spaces for indentation.
 * @returns {string}
 */
export function JSONStringifyWithInlineArrays(obj, indent = 2) {
  const space = ' '.repeat(indent);

  function format(value, level) {
    if (Array.isArray(value)) {
      return `[${value.map(v => format(v, 0)).join(',')}]`;
    } else if (value && typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      const inner = entries
        .map(([k, v]) => `${space.repeat(level + 1)}"${k}": ${format(v, level + 1)}`)
        .join(',\n');
      return `{
${inner}
${space.repeat(level)}}`;
    } else {
      return JSON.stringify(value);
    }
  }

  return format(obj, 0);
}

export default class SC2JSONDebuggerNode extends SC2JSONDebugger {

  /** Start timing the execution */
  start(stage) {
    this.timers[stage] = {start: performance.now()}
    this.trace = []
  }

  /** Finish timing the execution and record duration */
  finish(stage) {
    this.timers[stage].end = performance.now()
    this.timers[stage].time = this.timers[stage].end - this.timers[stage].start
    this.trace = []
  }
  performace(){
    return this.timers
  }

  /**
   * Save the collected debug data to disk as JSON
   * @param {string} [file=this.options.file] Output path
   */
  async save(file = this.options.file) {
    // Recursively convert Sets into arrays for serialization
    const serializeSets = (obj) => {
      if (obj instanceof Set) {
        return [...obj];
      } else if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key in obj) {
          result[key] = serializeSets(obj[key]);
        }
        return result;
      }
      return obj;
    };

    try {
      const json = JSONStringifyWithInlineArrays(serializeSets(this.data), 1);
      await fs.writeFile(file, json, 'utf8');
    } catch (err) {
      console.error('Error saving debug data:', err);
      throw err;
    }
  }

  /**
   * Load debug data from disk and restore Set structures
   * @param {string} [file=this.options.file] Input path
   */
  async load(file = this.options.file) {
    try {
      const json = await fs.readFile(file, 'utf8');
      const loaded = JSON.parse(json);

      const restoreSets = (obj) => {
        if (Array.isArray(obj)) return new Set(obj);
        if (typeof obj === 'object' && obj !== null) {
          const restored = {};
          for (const key in obj) {
            restored[key] = restoreSets(obj[key]);
          }
          return restored;
        }
        return obj;
      };

      this.data = {
        missingSchema: restoreSets(loaded.missingSchema || {}),
        unknownEnumIndex: restoreSets(loaded.unknownEnumIndex || {}),
        missingEnum: restoreSets(loaded.missingEnum || {})
      };
    } catch (err) {
      if (err.code === 'ENOENT') return null; // No file to load
      console.error('Error loading debug data:', err);
      throw err;
    }
  }
}