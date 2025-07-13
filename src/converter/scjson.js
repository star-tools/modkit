import { SCSchema ,getSchemaField} from '../schema/schema.js';

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
 * Determines whether a value is an integer.
 * @param {string|number} value
 * @returns {boolean}
 */
export function isInteger(value) {
  return Number.isInteger(Number(value));
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

/**
 * SC2JSON is a schema-driven XML-to-JSON and JSON-to-XML converter
 * for SC2 (StarCraft II) data structures.
 */
export default class SC2JSON {
  constructor(options) {
    if (options?.debugger) {
      this.debugger = options.debugger;
    }
  }

  debugger = null;

  /**
   * Converts XML text or Document to structured JSON.
   */
  toJSON(xmlText, schema) {
    this.debugger?.start('xml');
    const xmlDocument = parseXML(xmlText);
    this.debugger?.finish('xml');

    this.debugger?.start('jsonObject');
    const jsonObject = convertXMLtoJSON(xmlDocument);
    this.debugger?.finish('jsonObject');

    this.debugger?.start('schema');
    if (!schema) {
      const resolved = getSchemaField(jsonObject.tag);
      schema = resolved.schema;
    }
    if (schema) this._applySchema(jsonObject, schema);
    this.debugger?.finish('schema');

    return jsonObject;
  }

  /**
   * Converts structured JSON (with schema) to XML string.
   */
  toXML(jsonObject,schema) {
    if(!jsonObject){
      return null
    }

    if(!schema){
      const { schema: s} = getSchemaField(jsonObject.type || jsonObject.class, SCSchema);
      schema = s
    }
    const xmlLikeJSON = this.revertSchemaToXMLJSON(jsonObject, schema);
    return convertJSONtoXML(xmlLikeJSON);
  }

  _writeValue(obj, field, value, isArray) {
    if (value == null) {
      delete obj[field];
      return;
    }
    if (isArray) {
      obj[field] = obj[field] || [];
      obj[field].push(value);
    } else {
      obj[field] = value;
    }
  }

  _attachLeadingComments(arr) {
    let i = 0;
    let commentBlock = '';
    while (i < arr.length) {
      const item = arr[i];
      if (typeof item === 'string' && item.startsWith('<!--')) {
        if (commentBlock) commentBlock += ';;';
        commentBlock += item.slice(4, -3);
        arr.splice(i, 1);
        continue;
      }
      if (commentBlock) {
        item.comment = (item.comment || '') + commentBlock;
        commentBlock = '';
      }
      i++;
    }
    return arr;
  }

  _applySchema(obj, schema) {
    this.debugger?.push(obj);

    const { children, attributes, tag, directives, comment, value } = obj;
    delete obj.children;
    delete obj.attributes;
    delete obj.tag;
    delete obj.directives;
    delete obj.comment;
    delete obj.value;

    for (const key in schema) {
      const mod = key[0];
      const field = key.slice(1);

      if(key === "@") {
        continue;
      }

      switch (mod) {
        case '@': tag && this._writeValue(obj, field, schema[key].parse(tag, obj)); break;
        case '&': value && this._writeValue(obj, field, schema[key].parse(value, obj)); break;
        case '#': comment && this._writeValue(obj, field, schema[key].parse(comment, obj)); break;
        case '%':
          if (directives?.length) {
            for (const dir of directives) {
              if (dir.directive === field) {
                delete dir.directive;
                this._applySchemaForChild(obj, { tag: field, attributes: dir }, schema);
              }
            }
          }
          break;
      }
    }

    if (attributes) {
      for (const key in attributes) {
        let value = attributes[key];
        if (key === 'index') {obj.index = isInteger(value) ? +value : value }
        else if (key === 'removed') {obj.removed = +value;}
        else {
          let fieldSchema =  schema[key]?.value || schema[key]
          if(fieldSchema){
            value = fieldSchema.parse(value, obj) 
          }
          else{
            //no schema... token?
          }
          value !== undefined && this._writeValue(obj, key, value);
        }
      }
    }

    if (children?.length) {
      this._attachLeadingComments(children);
      for (const child of children) {
        if (typeof child === 'string') {
          console.warn('Unexpected string child node:', child);
          continue;
        }
        this._applySchemaForChild(obj, child, schema);
      }
    }

    this.debugger?.pop();
  }

  _applySchemaForChild(obj, child, schema) {
    const { field, schema: subSchema } = getSchemaField(child.tag, schema);

    if(!subSchema && schema){
      this.debugger?.missingSchema(obj, child.tag);
    }

    const fieldName = field || child.tag || '_';
    let isArray = !subSchema || Array.isArray(subSchema);
    const schemaClass = isArray ? subSchema?.[0] : subSchema;

    let index = child.attributes?.index;
    const namedIndex = index !== undefined && !isInteger(index);
    const enumIndex = subSchema?.[1];
    const isIndexedArray = !!(enumIndex || namedIndex)

    if(!isIndexedArray && obj[fieldName]?.constructor === Object){
      console.warn(`${this.debugger?.trace.join(".") + "." + fieldName} possible an array`)
      obj[fieldName] = [obj[fieldName]]
      isArray = true
    }

    let value;
    if (!isIndexedArray && typeof schemaClass === 'object') {
      this._applySchema(child, schemaClass);
      value = child;
    } else {
      if (typeof schemaClass !== 'object') {
        if(child.attributes?.value){
          value = schemaClass?.parse(child.attributes?.value);
        }
      } else {
        this._applySchema(child, schemaClass);
        value = child;
      }

      if (isIndexedArray) {
        const removed = child.attributes?.removed ? +child.attributes.removed : 0;
        if (!index) {
          this.debugger?.missingEnum(child);
          index = '_';
        }
        if (!enumIndex) {
          // console.log('Missing enum for indexed array');
        }
        const enumName = enumIndex ? this._getEnumName(index, enumIndex) : index;
        if (removed) value = { value, removed };
        obj[fieldName] = obj[fieldName] || {};
        obj[fieldName][enumName] = value;
        return;
      } else {
        if(child.attributes?.index !== undefined){
          let result = {}
          if(child.attributes.removed !== undefined)result.removed = child.attributes.removed
          if(child.attributes.index !== undefined)result.index = +child.attributes.index
          if(child.attributes.value !==undefined)result.value = schemaClass?.parse(child.attributes?.value);
        }
        else if(child.attributes?.value !== undefined){
          value = schemaClass?.parse(child.attributes?.value);
        }
        else{
          console.log("wrong schema?" + this.debugger?.trace.join(".") + "." + fieldName + " " + JSON.stringify(child))
        }
      }
    }
    this._writeValue(obj, fieldName, value, isArray);
  }

  _getEnumName(index, enumClass) {
    if (isInteger(index)) {
      const i = +index;
      if (enumClass.enum[i]) return enumClass.enum[i];
      // console.log('Enum index OOB:', index);
    } else if (!enumClass.enum.includes(index)) {
      this.debugger?.unknownEnumIndex(enumClass.name, index);
    }
    return index;
  }

  /**
   * Reverts parsed object back to the XML-like JSON before schema was applied.
   */
  revertSchemaToXMLJSON(obj, schema) {
    const result = {};
    if (!schema || typeof obj !== 'object') return result;

    for (const key in schema) {
      if(key === "@") {
        result.tag = schema[key]
        continue;
      }
      const mod = key[0];
      const field = key.slice(1);


      switch (mod) {
        case '@': if (field in obj) result.tag = obj[field]; break;
        case '&': if (field in obj) result.value = obj[field]; break;
        case '#': if (field in obj) result.comment = obj[field]; break;
        case '%': {
          const tokenValue = obj[field];
          if (!tokenValue) break;
          const items = Array.isArray(tokenValue) ? tokenValue : [tokenValue];
          result.directives = items.map(item => ({ directive: field, ...item }));
          break;
        }
      }
    }

    const attributes = {};
    const children = [];
    let hasAttributes = false

    for (const key in obj) {
      if ('@&#%'.includes(key[0])) continue;
      const value = obj[key];
      const fieldSchema = schema[key] || schema['*' + key] || schema['%' + key];
      if (!fieldSchema) continue;

      const isArray = Array.isArray(value);
      const enumIndex = fieldSchema[1];

      if (enumIndex) {
        for (const [index, val] of Object.entries(value)) {
          children.push({ tag: key, attributes: { index, value: val.value ?? val } });
        }
      } else {
        const items = isArray ? value : [value];
        for (const item of items) {
          if (typeof item === 'object' && item !== null) {
            let resultKey = key;
            let fieldSchema2 = fieldSchema;
            if (schema['*' + key]) {
              fieldSchema2 = fieldSchema[0][item.class];
              resultKey = item.class;
            }
            if((fieldSchema2[1]/* || item.constructor === Object*/) && fieldSchema2.constructor === Array){
              //indexed array
              for(let index in item){
                const child = this.revertSchemaToXMLJSON(item[index],  fieldSchema2[0]);
                if(!child.attributes)child.attributes = []
                child.attributes.index = index
                child.tag = resultKey;
                children.push(child);
              }
            }
            else{
              const child = this.revertSchemaToXMLJSON(item, Array.isArray(fieldSchema2) ? fieldSchema2[0] : fieldSchema2);
              child.tag = resultKey;
              children.push(child);
            }
          } else {
            //todo need check for top level catalog. or schema check for fields to put in attributes
            if (isArray || (schema['@class'] && !['id', 'parent', 'default'].includes(key))) {
              children.push({ tag: key, attributes: { value: item } });
            } else {
              hasAttributes = true
              attributes[key] = item;
            }
          }
        }
      }
    }

    if (hasAttributes) result.attributes = attributes;
    if (children.length) result.children = children;

    return result;
  }
}


//Compact XML
export function cleanXML(xmlString, options = { removeLineBreaks: true }) {
  // Step 1: Remove spaces between tags
  let out = xmlString.replace(/>\s+</g, '><');

  if (options.removeLineBreaks) {
    out = out.replace(/(\>)\s*\n\s*(\<)/g, '$1$2');
  }

  // Step 2: Clean tag attributes (remove extra spaces & trim values)
  out = out.replace(/<([\w:-]+)\s+([^>]+?)\s*(\/?)>/g, (match, tagName, attrs, selfClose) => {
    // Clean attribute list
    const cleanedAttrs = attrs
      .trim()
      .replace(/\s*=\s*/g, '=') // Remove spaces around '='
      .replace(/(\w+)=["']\s*([^"']*?)\s*["']/g, (m, name, value) => {
        return `${name}="${value}"`; // Trim spaces in attribute values
      })
      .replace(/\s+/g, ' '); // Collapse multiple spaces between attributes

    return `<${tagName} ${cleanedAttrs}${selfClose ? ' /' : ''}>`;
  });

  return out.trim();
}