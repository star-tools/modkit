import { SCSchema } from '../schema/schema.js';
import {
  convertXMLtoJSON,
  convertJSONtoXML,
  parseXML,
  isInteger
} from '../lib/util.js';

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
      const resolved = this.getSchema(jsonObject.tag);
      schema = resolved.schema;
    }
    if (schema) this._applySchema(jsonObject, schema);
    this.debugger?.finish('schema');

    return jsonObject;
  }

  /**
   * Converts structured JSON (with schema) to XML string.
   */
  toXML(jsonObject) {
    const { schema } = this.getSchema(jsonObject.type || jsonObject.class, SCSchema);
    const xmlLikeJSON = this.revertSchemaToXMLJSON(jsonObject, schema);
    return convertJSONtoXML(xmlLikeJSON);
  }

  getSchema(tag, schema = SCSchema) {
    if (schema[tag]) return { schema: schema[tag], field: tag };
    if (schema['%' + tag]) return { schema: schema['%' + tag], field: tag };

    

    for (let key in schema) {
      if (key[0] === '*' && schema[key][0]?.[tag]) {
        const subSchema = schema[key][0][tag];
        return {
          schema: Array.isArray(schema[key]) ? [subSchema] : subSchema,
          field: key.substring(1)
        };
      }
    }

    console.log('No schema found for tag:', tag);
    return { schema: null, field: null };
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
        const value = attributes[key];
        if (key === 'index') continue;
        if (key === 'removed') obj.removed = +value;
        else value !== undefined && this._writeValue(obj, key, schema[key]?.parse?.(value, obj));
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
    const { field, schema: subSchema } = this.getSchema(child.tag, schema);
    const fieldName = field || child.tag || '_';
    const isArray = !subSchema || Array.isArray(subSchema);
    const schemaClass = isArray ? subSchema?.[0] : subSchema;

    let index = child.attributes?.index;
    const namedIndex = index && !isInteger(index);
    const enumIndex = subSchema?.[1];
    const isIndexedArray = !!(enumIndex || namedIndex || obj[fieldName]?.constructor === Object);

    let value;
    if (!isIndexedArray && typeof schemaClass === 'object') {
      this._applySchema(child, schemaClass);
      value = child;
    } else {
      if (typeof schemaClass !== 'object') {
        value = schemaClass?.parse(child.attributes?.value);
      } else {
        this._applySchema(child, schemaClass);
        value = child;
      }

      if (isIndexedArray) {
        const removed = child.attributes?.removed ? +child.attributes.removed : 0;
        if (!index) {
          console.log('Missing index for indexed array:', child);
          index = '_';
        }
        if (!enumIndex) console.log('Missing enum for indexed array');
        const enumName = enumIndex ? this._getEnumName(index, enumIndex) : index;
        if (removed) value = { value, removed };
        obj[fieldName] = obj[fieldName] || {};
        obj[fieldName][enumName] = value;
        return;
      } else {
        value = schemaClass?.parse(child.attributes?.value);
      }
    }
    this._writeValue(obj, fieldName, value, isArray);
  }

  _getEnumName(index, enumClass) {
    if (isInteger(index)) {
      const i = +index;
      if (enumClass.enum[i]) return enumClass.enum[i];
      console.log('Enum index OOB:', index);
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
            if((fieldSchema2[1] || item.constructor === Object) && fieldSchema2.constructor === Array){
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
