import fs from 'fs/promises';
import { performance } from 'perf_hooks';
import { JSONStringifyWithInlineArrays } from '../lib/util.js';
import { SC2JSONDebugger } from './debugger.js';

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