// util.js - Utility functions for XML/JSON handling (cross-platform)

let DOMParser;

// Determine environment and load DOMParser
if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
  // In the browser
  DOMParser = window.DOMParser;
} else {
  // In Node.js
  const xmldom = await import('xmldom');
  DOMParser = xmldom.DOMParser;
}

/**
 * Parses an XML string into a DOM Document.
 * @param {string} xmlString
 * @returns {Document}
 */
export function parseXML(xmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'text/xml');
}

/**
 * Escapes XML special characters in a string.
 * @param {string} str
 * @returns {string}
 */
export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function parseLines(rawtext){
    if (!rawtext) {
        return null
    }
    return rawtext
        .replace("﻿","")  //Zero Width No-Break Space
        .replace(/\r/g, "")
        .split("\n")
}

export function parseIni(iniText) {
  const result = {};
  let currentSection = null;

  const lines = iniText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')) continue;

    const sectionMatch = trimmed.match(/^\[(.+?)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      result[currentSection] = [];
    } else if (currentSection) {
      result[currentSection].push(trimmed);
    }
  }

  return result;
}

export function serializeIni(data) {
  let output = '';

  for (const section in data) {
    output += `[${section}]\n`;
    const lines = data[section];
    for (const line of lines) {
      output += `${line}\n`;
    }
    output += `\n`; // optional: add a blank line between sections
  }

  return output.trimEnd(); // remove trailing newlines
}

export function parseEnv(rawtext){
    if (!rawtext) {
        return null
    }
    let data = {}
    rawtext
        .replace("﻿","")  //Zero Width No-Break Space
        .replace(/\r/g, "")
        .split("\n")
        .forEach(el => {
            let key = el.substring(0, el.indexOf("="))
            let value = el.substring(el.indexOf("=") + 1)
            data[key] = value
        })
        return data
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

export function convertXMLtoJSON(node) {
  if (!node) return null;

  // If root is a document node, recurse into its documentElement
  if (node.nodeType === 9) return convertXMLtoJSON(node.documentElement);

  if (node.nodeType === 1) { // ELEMENT_NODE
    const result = { tag: node.tagName };

    // Parse attributes
    if (node.attributes?.length) {
      const attrs = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        attrs[attr.name] = attr.value;
      }
      result.attributes = attrs;
    }

    const children = [];
    const directives = [];

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      let value;
      let array = children

      switch (child.nodeType) {
        case 1: // ELEMENT_NODE
          value = convertXMLtoJSON(child);
          break;
        case 3: { // TEXT_NODE
          const text = child.nodeValue.trim();
          if (text) value = text
          break;
        }
        case 7: { // PROCESSING_INSTRUCTION_NODE
          const directive = { directive: child.target };
          const attrs = [...child.data.matchAll(/(\w+)="([^"]*)"/g)];
          for (const [, key, val] of attrs) directive[key] = val;
          value = directive;
          array = directives
          break;
        }
        case 8: // COMMENT_NODE
          value = "<!--" + child.nodeValue + "-->"
          break;
      }

      if (value !== undefined) array.push(value);
    }

    if (children.length === 1 && typeof children[0] === "string") {
      result.value = children[0]; // collapse pure text into `value`
    } else if (children.length > 0) {
      result.children = children;
    }
    if (directives.length > 0) {
      result.directives = directives;
    }

    return result;
  }

  return null; // other node types are ignored
}

//turns the JSON format produced by your convertXMLtoJSON function back into an XML string:
//supports
// Attributes
// Text content (collapsed into value)
// Children nodes
// Comments (in string format: <!--comment-->)
// Directives (<?token ...?> style)
export function convertJSONtoXML(node, indent = '') {
  if (!node || typeof node !== 'object') return '';

  const INDENT = '  ';
  const nextIndent = indent + INDENT;
  const tag = node.tag;
  let xml = '';

  // Open tag
  xml += `${indent}<${tag}`;

  // Add attributes
  if (node.attributes) {
    for (const [key, val] of Object.entries(node.attributes)) {
      xml += ` ${key}="${val}"`;
    }
  }

  // Self-close if no children/directives/value
  const hasContent = node.value !== undefined || node.children || node.directives;
  if (!hasContent) {
    return xml + ` />\n`;
  }

  xml += '>';

  // Add text value
  if (typeof node.value === 'string') {
    xml += node.value;
    xml += `</${tag}>\n`;
    return xml;
  }

  xml += '\n';

  // Add directives (processing instructions)
  if (node.directives) {
    for (const directive of node.directives) {
      const { directive: target, ...attrs } = directive;
      const data = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      xml += `${nextIndent}<?${target} ${data}?>\n`;
    }
  }

  // Add children
  if (node.children) {
    for (const child of node.children) {
      if (typeof child === 'string') {
        xml += `${nextIndent}${child}\n`;
      } else if (typeof child === 'object') {
        xml += convertJSONtoXML(child, nextIndent);
      } else if (typeof child === 'number') {
        xml += `${nextIndent}${child}\n`;
      }
    }
  }

  xml += `${indent}</${tag}>\n`;
  return xml;
}

export function deep(a,b,c = 'merge'){
    if(!a){return b}
    if(!b){return a}
    for(let i in b){
        let value = b[i]
        let target = a[i]

        if(value === undefined || value === null)continue;

        if(value.constructor === Array){
            value = deep([],value)
        }
        else if(value.constructor === Object){
            value = deep({},value)
        }


        if(!target){
            a[i] = value
        }
        else{
            if(value.constructor === String || value.constructor !== target.constructor){
                target = value
            }
            else if(target && target.constructor === Array && c === 'replace') {
                target = value
            }
            else if(target && target.constructor === Array && c === 'unite') {
                deep(target,value,c)
            }
            else if(target && target.constructor === Array && c === 'merge') {
                target = [...target,...value]
            }
            else if(target && target.constructor === Object){
                deep(target,value,c)
            }
            else {
                target = value
            }
            a[i] = target
        }
    }
    return a
}


export function deepReplaceMatch(obj, testVal, testProp, cb, id, _path = [], _pathids = []) {
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
            deepReplaceMatch(val, testVal, testProp, cb, prop, path,crumbs)
        }
    }
}

export function groupObjectKeys(input) {
    const result = {};

    for (const [path, value] of Object.entries(input)) {
        const parts = path.split('/');
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

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/**
 * Determines whether a value is an integer.
 * @param {string|number} value
 * @returns {boolean}
 */
export function isInteger(value) {
  return Number.isInteger(Number(value));
}
