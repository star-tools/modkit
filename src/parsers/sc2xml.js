import { isInteger } from '../util/js-util.js';
import { parseXML } from '../util/xml-util.js';
import { getSchemaField} from '../util/schema.js';

/**
 * SC2XML: StarCraft II XML <-> JSON Converter
 * ==============================================
 * 
 * A schema-driven converter for StarCraft II XML data.
 * 
 * Features:
 * ----------
 * - Parses SC2 XML into structured, schema-aware JSON.
 * - Converts JSON back to XML with optional schema guidance.
 * - Supports:
 *    - Attributes
 *    - Nested child elements
 *    - Text nodes, comments, and processing instructions
 *    - Schema fields (typed parsing, arrays, enums, indexed fields)
 *    - Debug logging for missing schema/enums
 * 
 * Input XML Example:
 * ------------------
 * <Catalog>
 *   <CUnit id="Marine">
 *     <LifeMax value="45"/>
 *     <Speed value="2.25"/>
 *     <Attributes index="Light" value="1"/>
 *     <GlossaryStrongArray value="Marauder"/>
 *     <WeaponArray Link="GuassRifle"/>
 *   </CUnit>
 * </Catalog>
 * 
 * Parsed JSON Output (simplified):
 * ---------------------------------
 * {
 *   class: "Catalog",
 *   CUnit: [
 *     {
 *       id: "Marine",
 *       LifeMax: 45,
 *       Speed: 2.25,
 *       Attributes: { Light: 1 },
 *       GlossaryStrongArray: "Marauder",
 *       WeaponArray: [
 *         { Link: "GuassRifle" }
 *       ]
 *     }
 *   ]
 * }
 * 
 * Usage Example:
 * ---------------
 * import SC2XML from './SC2XML.js';
 * 
 * const json = SC2XML.parse(xmlText);
 * const xmlBack = SC2XML.stringify(json);
 * 
 * Schema Application:
 * -------------------
 * - Automatically applied based on root element.
 * - Supports class detection, enums, and indexed fields.
 * - Logs missing schema fields or enum values if `log` object is provided.
 * 
 * Debugging & Logging:
 * --------------------
 * - `log` parameter records missing fields, enums, and structural issues.
 * 
 * Methods:
 * ---------
 * - `parse(xmlText, schema = null, log = null)` → JSON
 * - `stringify(jsonObject, schema = null)` → XML string
 * 
 * Advanced Utilities:
 * --------------------
 * - `applySchema(obj, schema, trace, log)` : Applies schema recursively.
 * - `_revertSchema(obj, schema)` : Converts JSON back to XML-like structure.
 * - `_attachLeadingComments(arr)` : Collects leading XML comments.
 * - `_log_missing_enum`, `_log_missing_schema` : Trace missing data.
 * 
 * Example Workflow:
 * -----------------
 * 
 * // Parse XML to JSON
 * const json = SC2XML.parse(xmlSource, schema, log);
 * 
 * // Modify JSON, then convert back to XML
 * const xmlOut = SC2XML.stringify(json);
 * 
 */
export default class SC2XML {
  /**
   * Converts XML string or Document into JSON according to schema.
   * @param {string|Document} xmlText XML source text or DOM Document
   * @param {Object} [schema] Optional schema to apply
   * @returns {Object} JSON representation of XML with schema applied
   */
  static parse(xmlText, schema = null, log = null) {
    const xmlDocument = parseXML(xmlText);
    const jsonObject = this._parse_base(xmlDocument);
    // if (!schema) {
    //   // schema = getSchema(jsonObject.tag);
    // }
    if (schema) {
      this.applySchema(jsonObject, schema , [], log);
    }
    return jsonObject;
  }

  /**
   * Recursively converts an XML DOM node into a JSON object.
   * 
   * @param {Node} node - The XML DOM node to convert.
   * @returns {Object|null} JSON representation of the XML node or null if unsupported.
   */
  static _parse_base(node) {
    if (!node) return null;

    // If root is a document node, recurse into its documentElement
    if (node.nodeType === 9 /* DOCUMENT_NODE */) {
      return this._parse_base(node.documentElement);
    }

    if (node.nodeType === 1 /* ELEMENT_NODE */) {
      const result = { tag: node.tagName };

      // Extract attributes if present
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

      // Process child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        let value;
        let targetArray = children;

        switch (child.nodeType) {
          case 1: // ELEMENT_NODE
            value = this._parse_base(child);
            break;
          case 3: { // TEXT_NODE
            const text = child.nodeValue.trim();
            if (text) value = text;
            break;
          }
          case 7: { // PROCESSING_INSTRUCTION_NODE
            // Store processing instructions as objects
            const directive = { directive: child.target };
            // Parse attributes from PI data (e.g. key="value")
            const attrs = [...child.data.matchAll(/(\w+)="([^"]*)"/g)];
            for (const [, key, val] of attrs) directive[key] = val;
            value = directive;
            targetArray = directives;
            break;
          }
          case 8: // COMMENT_NODE
            value = `<!--${child.nodeValue}-->`;
            break;
        }

        if (value !== undefined) {
          targetArray.push(value);
        }
      }

      // Collapse single text child into 'value'
      if (children.length === 1 && typeof children[0] === 'string') {
        result.value = children[0];
      } else if (children.length > 0) {
        result.children = children;
      }

      if (directives.length > 0) {
        result.directives = directives;
      }


      this._attachLeadingComments(children);

      return result;
    }

    // Ignore other node types
    return null;
  }

  /**
   * Converts JSON (with optional schema) back to XML string.
   * @param {Object} jsonObject JSON object to convert
   * @param {Object} [schema] Optional schema for reverting transformation
   * @returns {string|null} XML string or null if input invalid
   */
  static stringify(jsonObject, schema) {
    if (!jsonObject) return null;

    if (!schema) {
      console.error("no schema!")
      // schema = getSchema(jsonObject.type || jsonObject.class, SCSchema);
    }
    const xmlLikeJSON = this._revertSchema(jsonObject, schema);
    return this._stringify_base(xmlLikeJSON);
  }

  /**
   * Converts the JSON representation back into an XML string.
   * 
   * @param {Object} node - JSON node to convert, in the format produced by convertXMLtoJSON.
   * @param {string} [indent=''] - Current indentation for pretty-printing.
   * @returns {string} XML string.
   */
  static _stringify_base(node, indent = '') {
    if (!node || typeof node !== 'object') return '';

    const INDENT = '  ';
    const nextIndent = indent + INDENT;
    const tag = node.tag;
    let xml = '';

    // Open tag with attributes
    xml += `${indent}<${tag}`;

    if (node.attributes) {
      for (const [key, val] of Object.entries(node.attributes)) {
        xml += ` ${key}="${val}"`;
      }
    }

    const hasContent = node.value !== undefined || node.children || node.directives;

    // Self-close tag if no content
    if (!hasContent) {
      return xml + ` />\n`;
    }

    xml += '>';

    // If pure text content, add and close tag
    if (typeof node.value === 'string') {
      xml += node.value;
      xml += `</${tag}>\n`;
      return xml;
    }

    xml += '\n';

    // Add processing instructions (directives)
    if (node.directives) {
      for (const directive of node.directives) {
        const { directive: target, ...attrs } = directive;
        const data = Object.entries(attrs)
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ');
        xml += `${nextIndent}<?${target} ${data}?>\n`;
      }
    }

    // Add children nodes (strings or objects)
    if (node.children) {
      for (const child of node.children) {
        if (typeof child === 'string') {
          xml += `${nextIndent}${child}\n`;
        } else if (typeof child === 'object') {
          xml += this._stringify_base(child, nextIndent);
        } else if (typeof child === 'number') {
          xml += `${nextIndent}${child}\n`;
        }
      }
    }

    xml += `${indent}</${tag}>\n`;
    return xml;
  }

  /**
   * Helper: Writes a value or appends it if array type.
   * @private
   */
  static _writeValue(obj, field, value, isArray) {
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

  /**
   * Attach leading XML comments to the next element as a comment string.
   * @private
   */
  static _attachLeadingComments(arr) {
    let i = 0;
    let comments = []
    while (i < arr.length) {
      const item = arr[i];
      if (typeof item === 'string' && item.startsWith('<!--')) {
        comments.push(item.slice(4, -3))
        arr.splice(i, 1);
        continue;
      }
      if (comments.length) {
        item.comments = comments
        comments = []
      }
      i++;
    }
    return arr;
  }

  /**
   * Apply schema to a parsed JSON object recursively.
   * @private
   */
  static applySchema(obj, schema, trace = [], log, tokensData) {
    trace.push(obj.tag);

    const { children, attributes, tag, directives, comment, value } = obj;
    // Clean temporary XML keys
    delete obj.children;
    delete obj.attributes;
    delete obj.tag;
    delete obj.directives;
    delete obj.comment;
    delete obj.value;

    // if (directives?.length) {
    //   for (const directive of directives) {
    //     if(!this._temp.directives)this._temp.directives = []
    //     this._temp.directives.push([...trace,directive.id].join("."))
    //   }
    // }
    
    for (const key in schema) {
      if (key === "@") continue; // skip special key

      const mod = key[0];
      const field = key.slice(1);

      switch (mod) {
        case '@':
          tag && this._writeValue(obj, field, schema[key].parse(tag, obj));
          break;
        case '&':
          value && this._writeValue(obj, field, schema[key].parse(value, obj));
          break;
        case '#':
          comment && this._writeValue(obj, field, schema[key].parse(comment, obj));
          break;
        case '%':
          if (directives?.length) {
            for (const dir of directives) {
              if (dir.directive === field) {
                delete dir.directive;
                this.applySchemaForChild(obj, { tag: field, attributes: dir }, schema,trace, log);
              }
            }
          }
          break;
      }
    }

    if (attributes) {
      for (const key in attributes) {
        let value = attributes[key];
        if (key === 'comment') {
          //skip comments
          continue;
        }
        else if (key === 'index') {
          obj.index = isInteger(value) ? +value : value;
        } else if (key === 'removed') {
          obj.removed = +value;
        } else {
          let fieldSchema = schema[key]?.value || schema[key] || tokensData?.[key]
          //todo . need to improve token-aware parsing
          if(!fieldSchema){
              fieldSchema = String;
              // console.log("missing token " + key)
          }
          if(!fieldSchema){
            this._log_missing_schema(obj, key, trace, log, {children, attributes, tag})
          }
          else if(fieldSchema === Number){
            value = +value;
          }
          else if(fieldSchema !== String){
            value = fieldSchema.parse(value, obj);
          }
          if (value !== undefined) this._writeValue(obj, key, value);
        }
      }
    }

    if (children?.length) {
      for (const child of children) {
        if (typeof child === 'string') {
          console.warn('Unexpected string child node:', child);
          continue;
        }
        this.applySchemaForChild(obj, child, schema, trace, log);
      }
    }

    trace.pop();
  }

  /**
   * Record a missing enum mapping by tag trace
   * @param {Array<Object>} trace Array of objects with `.tagName`
   * @param {string|number} value Missing enum value
   */
  static _log_missing_enum(value,trace,log) {
    if(!trace || !log) return;
    const tag = trace.map(i => i.tagName).join('.');
    if(!log.missingEnum){
      log.missingEnum= {}
    }
    const target = log.missingEnum;
    if (!target[tag]) {
      target[tag] = new Set();
      console.log('Missing index for indexed array:', trace.join("."));
    }
    target[tag].add(value);
  }

  /**
   * Record a missing schema field and its encountered value
   * @param {Array<Object>} trace Trace of tagName objects to current context
   * @param {Object} entry Parsed object entry
   * @param {string} field Missing field name
   */
  static _log_missing_schema(entry, field, trace, log, original) {
    if(!trace || !log) return;
    const tag = [...trace.map(i => i), field].join('.');
    const value = original.attributes?.[field]

    const parts = tag.split('.');
    if(!log.missingSchema){
      log.missingSchema = {}
    }
    let current = log.missingSchema;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // If last part — ensure it's a Set
      if (i === parts.length - 1) {
        if (!current[part]) {
          current[part] = []
          
          // if(original.attributes[field]){}
          let id = original.attributes?.id
          console.log('No schema found for tag: ', tag + (id? (" (" + original.attributes.id  + ")"): ""));
        }

        if (value !== undefined) {
          current[part].push(value);
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
   * Apply schema rules for a child node.
   * @private
   */
  static applySchemaForChild(obj, child, schema, trace, log) {
    const { field, schema: subSchema } = getSchemaField(child.tag, schema);

    if (!subSchema && schema) {
      this._log_missing_schema(obj, child.tag, trace, log, child);
    }

    const fieldName = field || child.tag || '_';
    let isArray = !subSchema || Array.isArray(subSchema);
    const schemaClass = isArray ? subSchema?.[0] : subSchema;

    const index = child.attributes?.index;
    const namedIndex = index !== undefined && !isInteger(index);
    const enumIndex = subSchema?.[1];
    const isIndexedArray = !!(enumIndex || namedIndex);

    if (!isIndexedArray && obj[fieldName]?.constructor === Object) {
      console.warn(`${trace.join(".") + "." + fieldName} possible an array`);
      obj[fieldName] = [obj[fieldName]];
      isArray = true;
    }

    let value;

    if (!isIndexedArray && typeof schemaClass === 'object') {
      this.applySchema(child, schemaClass, trace, log);
      value = child;
    } else {
      if (typeof schemaClass !== 'object') {
        if (child.attributes?.value) {
          value = schemaClass?.parse(child.attributes?.value);
        }
      } else {
        this.applySchema(child, schemaClass, trace, log);
        value = child;
      }

      if (isIndexedArray) {
        const removed = child.attributes?.removed ? +child.attributes.removed : 0;
        let idx = index;
        if (!idx) {
          this._log_missing_enum(child, trace, log);
          idx = '_';
        }
        const enumName = enumIndex ? this._getEnumName(idx, enumIndex,trace,log) : idx;
        if (removed) value = { value, removed };
        obj[fieldName] = obj[fieldName] || {};
        obj[fieldName][enumName] = value;
        return;
      } else {
        if (child.attributes?.index !== undefined) {
          let result = {};
          if (child.attributes.removed !== undefined) result.removed = child.attributes.removed;
          if (child.attributes.index !== undefined) result.index = +child.attributes.index;
          if (child.attributes.value !== undefined) result.value = schemaClass?.parse(child.attributes?.value);
        } else if (child.attributes?.value !== undefined) {
          value = schemaClass?.parse(child.attributes?.value);
        } else {
          console.log("Unexpected schema structure: " + trace.join(".") + "." + fieldName )// + " " + JSON.stringify(child));
        }
      }
    }

    this._writeValue(obj, fieldName, value, isArray);
  }

  /**
   * Record an unknown enum value by its enum name
   * @param {string} enumName Name of the enum
   * @param {string|number} value Unknown value encountered
   */
  static _log_unknown_enum_index(enumName, value, trace, log) {
    if(!log) return;
    if(!log.unknownEnumIndex){
      log.unknownEnumIndex = {}
    }
    const target = log.unknownEnumIndex;
    if (!target[enumName]) {
      target[enumName] = new Set();
    }
    target[enumName].add(value);
  }

  /**
   * Helper to resolve enum names for indexed arrays.
   * @private
   */
  static _getEnumName(index, enumClass,trace,log) {
    if (isInteger(index)) {
      const i = +index;
      if (enumClass.enum[i]) return enumClass.enum[i];
    } else if (!enumClass.enum.includes(index)) {
      this._log_unknown_enum_index(enumClass.name, index,trace,log);
    }
    return index;
  }

  /**
   * Reverts a parsed object back to XML-like JSON (before schema applied).
   * @param {Object} obj Parsed object
   * @param {Object} schema Schema to guide reversion
   * @returns {Object} XML-like JSON
   */
  static _revertSchema(obj, schema) {
    const result = {};
    if (!schema || typeof obj !== 'object') return result;

    for (const key in schema) {
      if (key === "@") {
        result.tag = schema[key];
        continue;
      }
      const mod = key[0];
      const field = key.slice(1);

      switch (mod) {
        case '@':
          if (field in obj) result.tag = obj[field];
          break;
        case '&':
          if (field in obj) result.value = obj[field];
          break;
        case '#':
          if (field in obj) result.comment = obj[field];
          break;
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
    let hasAttributes = false;

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
            if (fieldSchema2[1] && Array.isArray(fieldSchema2)) {
              // Indexed array
              for (let index in item) {
                const child = this._revertSchema(item[index], fieldSchema2[0]);
                if (!child.attributes) child.attributes = [];
                child.attributes.index = index;
                child.tag = resultKey;
                children.push(child);
              }
            } else {
              const child = this._revertSchema(item, Array.isArray(fieldSchema2) ? fieldSchema2[0] : fieldSchema2);
              child.tag = resultKey;
              children.push(child);
            }
          } else {
            if (isArray || (schema['@class'] && !['id', 'parent', 'default'].includes(key))) {
              children.push({ tag: key, attributes: { value: item } });
            } else {
              hasAttributes = true;
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
