# SC2JSON

`SC2JSON` is a schema-driven XML-to-JSON and JSON-to-XML converter designed specifically for StarCraft II (SC2) data formats. It allows structured parsing and transformation of SC2 XML content into normalized JSON and back, using a flexible schema definition (`SCSchema`).

---

## Features

- Converts SC2 XML into structured JSON
- Applies transformation rules based on a schema
- Supports element nodes, attributes, comments, and processing instructions (directives)
- Handles indexed arrays and complex nested schemas
- Converts JSON back into XML
- Supports debugging hooks

---

## Installation

SC2JSON is a module-based ES6 class. To use it:

```js
import { SC2JSON } from './SC2JSON.js';
import { SCSchema } from '../schema/schema.js';
```

---

## Usage

### Convert XML to JSON

```js
const parser = new SC2JSON();
const json = parser.toJSON(xmlString);
```

### Convert JSON back to XML

```js
const xml = parser.toXML(json);
```

---

## Methods

### `toJSON(xmlString, schema?)`

Converts an XML string or `Document` into structured JSON. If a `schema` is not provided, it will attempt to infer one from `SCSchema`.

- `xmlString` - The input XML as string or Document
- `schema` *(optional)* - Schema definition for conversion
- Returns: JSON object

---

### `toXML(jsonObject)`

Converts structured JSON (as produced by `toJSON`) back to XML string using `SCSchema`.

---

### `revertSchemaToXMLJSON(obj, schema)`

Reverts a schema-transformed JSON object to raw XML-compatible JSON (internal use for `.toXML()`).

---

## Schema Directives

The schema supports these special field prefixes:

- `@field` — maps to the XML element's tag name
- `&field` — maps to the inner text content
- `#field` — maps to comment content
- `%field` — maps to `<?field ... ?>` processing instructions
- `*field` — wildcard child tag handler

---

## Debugger Support

If `options.debugger` is passed to the constructor, lifecycle steps (`xml`, `jsonObject`, `schema`, etc.) will trigger:

```js
const parser = new SC2JSON({
  debugger: {
    start(label) { console.time(label) },
    finish(label) { console.timeEnd(label) },
    push(obj) { ... },
    pop() { ... },
    unknownEnumIndex(name, value) { ... }
  }
});
```
