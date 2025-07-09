import fs from 'fs/promises';
import { performance } from 'perf_hooks';
import { JSONStringifyWithInlineArrays } from '../lib/util.js';

/**
 * SC2JSONDebugger collects debug metadata while parsing SC2 XML data.
 * 
 * It tracks:
 * - Missing schema fields
 * - Unknown enum values
 * - Execution time of the parsing process
 * 
 * It supports saving/loading debug info from disk, and prevents duplicates using Set structures.
 */
export class SC2JSONDebugger {
  /**
   * @param {Object} options
   * @param {string} [options.file='./debug.json'] Path to debug data file
   */
  constructor(options = {}) {
    this.options = {
      file: './debug.json',
      ...options
    };

    this.timers = { }
    this.executionDurationMs = null;

    // Main debug data object
    this.data = {
      missingSchema: {},        // Nested object for missing fields in schema
      unknownEnumIndex: {},     // Map of enum name → Set of unknown enum values
      missingEnum: {}           // Map of tag paths → Set of missing enum values
    };
  }
  push(data){
    return this.trace?.push(data.tag)
  }
  pop(data){
    return this.trace?.pop()
  }
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

  /** Reset all data and timers */
  reset() {
    this.startTime = null;
    this.endTime = null;
    this.executionDurationMs = null;
    this.data = {
      missingSchema: {},
      unknownEnumIndex: {},
      missingEnum: {}
    };
  }

  /**
   * Returns a summary of the captured debug data
   * @returns {Object} Summary object with counts and duration
   */
  summary() {
    return {
      durationMs: this.executionDurationMs?.toFixed(3) ?? null,
      enumsTracked: Object.keys(this.data.unknownEnumIndex).length,
      missingEnums: Object.keys(this.data.missingEnum).length,
      schemaPaths: Object.keys(this.data.missingSchema).length
    };
  }

  /**
   * Record an unknown enum value by its enum name
   * @param {string} enumName Name of the enum
   * @param {string|number} value Unknown value encountered
   */
  unknownEnumIndex(enumName, value) {
    const target = this.data.unknownEnumIndex;
    if (!target[enumName]) {
      target[enumName] = new Set();
    }
    target[enumName].add(value);
  }

  /**
   * Record a missing enum mapping by tag trace
   * @param {Array<Object>} trace Array of objects with `.tagName`
   * @param {string|number} value Missing enum value
   */
  missingEnum(trace, value) {
    const tag = trace.map(i => i.tagName).join('.');
    const target = this.data.missingEnum;
    if (!target[tag]) {
      target[tag] = new Set();
    }
    target[tag].add(value);
  }

  /**
   * Record a missing schema field and its encountered value
   * @param {Array<Object>} trace Trace of tagName objects to current context
   * @param {Object} entry Parsed object entry
   * @param {string} field Missing field name
   */
  missingSchema(trace, entry, field) {
    const tag = [...trace.map(i => i.tagName), field].join('.');
    const value = entry[field];

    const parts = tag.split('.');
    let current = this.data.missingSchema;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // If last part — ensure it's a Set
      if (i === parts.length - 1) {
        if (!current[part]) {
          current[part] = new Set();
        } else if (!(current[part] instanceof Set)) {
          current[part] = new Set([current[part]]);
        }

        if (value !== undefined) {
          current[part].add(value);
        }
      } else {
        // Traverse or create nested object
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {};
        }
        current = current[part];
      }
    }
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
