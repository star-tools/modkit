# SC2ModKit

CLI and JavaScript toolkit for reading, merging, and writing StarCraft 2 `.SC2Mod` archives.

## Installation

```bash
npm install -g sc2modkit

sc2modkit info ./MyMod.SC2Mod
sc2modkit merge ./MergedMod.SC2Mod ./Mod1.SC2Mod ./Mod2.SC2Mod
sc2modkit extract ./MyMod.SC2Mod ./outputDir

```

# SC2ModKit - Core Classes

### SC2Mod

`SC2Mod` represents a StarCraft II mod data container and processor.

It manages mod catalogs, dependencies, localized strings, and recursive entity resolution. This is the central class for manipulating `.SC2Mod` data programmatically.

#### Features:

* Loads StarCraft II mod data into structured catalogs.
* Resolves inter-entity relations (e.g., actors for units).
* Calculates localized strings per locale.
* Computes resolved values, requirements, and dependencies.
* Supports merging multiple mods together.
* Can serialize to/from JSON for persistence.

#### Usage Example:

```js
import {SC2Mod} from 'sc2modkit';

// Create new SC2Mod instance with initial data
const mod = new SC2Mod({
    catalogs: [...],
    strings: {...},
    dependencies: [...]
});

// Setup relations and process data
mod.setEntitiesRelations();
mod.calculateStrings('enus');
mod.resolveUnitsActors();

// Access and process entity data
const entity = mod.cache.Unit['SomeUnitId'];
const resolvedValues = mod.calculateAllValues(entity);
const requirements = entity.getRequirements();

// Merge another mod
mod.merge(otherMod);

// Load from JSON
const modFromJson = SC2Mod.fromJSON(jsonData);
```

---

### SC2ModReader

`SC2ModReader` is an advanced I/O system for reading, merging, and writing StarCraft II mods. It extends `VFS` and handles different storage backends.

#### Features:

* Unified API for reading and writing `.SC2Mod` data.
* Supports multiple environments:

  * Node.js FS
  * MPQ archives
  * Zip archives
  * Git Repositories
  * Fetch
  * Browser IndexedDB
  * Node LevelDB
  * Browser File System API

* Automatically parses all supported SC2 mod file formats:

  * XML - Catalogs, Layouts, Cutscenes, Components, DocInfo, MapInfo, etc
  * INI - Preload DB
  * ENV - Assets.txt, Localized Strings
  * Script files - Galaxy Files
  * Texture Reduction Files
  
* Customizable readers per protocol or environment.

#### Usage Example:

```js
import { SC2ModReader } from 'sc2modkit';

const reader = new SC2ModReader({
  base: './mods/',
  readers: [{ default: true, reader: "Node" }],
  directories: { mods: './mods/', custom: './custom/' }
});

// Load a single mod
const mod = await reader.read('MyMod.SC2Mod');

// Write back to disk
await reader.write('MyMod.SC2Mod', mod);

// Merge multiple mods together
const mergedMod = await reader.merge(['Core.SC2Mod', 'Gameplay.SC2Mod']);
```

---

### Summary

| Class          | Purpose                                      |
| -------------- | -------------------------------------------- |
| `SC2Mod`       | Mod data container and processor             |
| `SC2ModReader` | Reads, writes, and merges `.SC2Mod` packages |


# Readers Library

This library provides multiple `Reader` implementations for loading mod/game data from various sources such as IndexedDB, LevelDB, Web File System, GitHub, URLs, and ZIP archives. Each reader extends a common base `Reader` class, offering consistent async methods to **list**, **get**, **set**, **delete**, and **clear** files.

---

## Available Readers

### 4. GitReader

Reads files from a GitHub repository via the GitHub REST API.

- Supports GitHub Personal Access Token for authentication.
- Uses the old `getContent` method for repositories with fewer than 1000 files (recommended).
- Falls back to the newer Git Tree API for larger repos.
- Methods:  
  - `init(modpath)` — parse repo owner, name, and path.  
  - `list()` — lists files in the repo path.  
  - `get(filename)` — fetches file content.  
  - `getFiles(dirPath, recursive)` — legacy method for listing files/folders recursively.

**How to get a GitHub token:**  
1. Log in to GitHub.  
2. Go to **Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**.  
3. Generate new token with scopes: `repo` (or `public_repo` for public repos).  
4. Copy token securely (it won't be shown again).  

---

### 6. ZipReader

Reads and writes files inside a ZIP archive using JSZip.

- Load ZIP file or create empty archive.
- List files in archive optionally filtered by directory prefix.
- Read file contents as text.
- Write/update files inside ZIP.
- Export updated ZIP as Blob.
- Methods:  
  - `init()` — loads or creates ZIP archive.  
  - `list(dirPath?)` — lists files in ZIP starting with dirPath.  
  - `get(path)` — reads file content as text.  
  - `set(filename, content)` — writes or updates a file.  
  - `blob()` — exports ZIP archive as Blob.

---

### 7. MPQReader

 - MpqReader class for reading MPQ archives. Supports Node and Browser Environments. Read Only
  - `init()` — loads MPQ archive.  
  - `list(dirPath?)` — lists files in MPQ starting with dirPath.  
  - `get(path)` — reads file content as text.  
 


### 5. URLReader

Fetches files from a remote URL base path.

- Requires an `index.json` file hosted at the base URL listing files and folders, e.g.:

  ```json  
  {  
    "files": ["data/mod.json", "data/units/unit1.json"],  
    "folders": ["data", "data/units"]  
  }  
  ```

- Methods:  
  - `init(modpath)` — sets the base URL and index filename.  
  - `list(dirPath?)` — lists files and folders filtered by directory.  
  - `get(relativeFile)` — fetches a file as text.  
  - `set(relativeFile, content)` — sends a POST request to upload content (if supported).

---

### 1. IDBReader (IndexedDB)

An async reader for the browser's IndexedDB API.

- Stores data in a specified IndexedDB database and object store.
- Supports key namespacing with optional `modName` prefix.
- Methods:  
  - `init(modName?)` — initializes DB connection.  
  - `list(prefix?)` — lists stored keys matching prefix.  
  - `get(filename)` — reads file content.  
  - `set(filename, value)` — writes file content.  
  - `delete(filename)` — deletes a file.  
  - `clear()` — clears all or mod-prefixed keys.

---

### 2. LevelDBReader

A Node.js LevelDB reader (uses [level](https://github.com/Level/level)).

- Similar API to IDBReader for local persistent storage.
- Methods:  
  - `init(modName?)`  
  - `list(prefix?)`  
  - `get(filename)`  
  - `set(filename, value)`  
  - `delete(filename)`  
  - `clear()`  
  - `close()` — closes the DB connection.

---

### 3. WebReader

Reads from browser's File System Access API directory handle.

- Works with a directory handle selected via directory picker or passed in constructor.
- Recursively lists files and folders.
- Reads and writes files directly.
- Methods:  
  - `init()` — prompts for directory if not provided.  
  - `list(prefix?)` — recursively lists files.  
  - `get(filePath, format?)` — reads file as text, buffer, or base64.  
  - `set(filePath, content)` — writes file.  
  - `link(filePath)` — returns logical path.  
  - Optionally add `close()` if needed.

---



### Usage Example

```js
import { IDBReader } from './readers/idb-reader.js';
import LevelDBReader from './readers/leveldb-reader.js';
import WebReader from './readers/web-reader.js';
import { GitReader } from './readers/git-reader.js';
import URLReader from './readers/url-reader.js';
import ZipReader from './readers/zip-reader.js';


Initialize and use any reader with:
await reader.init(modNameOrPath);
const files = await reader.list();
const content = await reader.get('filename');
await reader.set('filename', 'content');
```

### Notes

All readers extend a base Reader class which defines core methods and options.

Authentication tokens (e.g., GitHub Personal Access Token) should be kept secure and passed in options.

For URLReader, hosting an up-to-date index.json file listing files and folders is required.

WebReader requires browser support for the File System Access API.

LevelDBReader requires a Node.js environment.

ZipReader supports reading and modifying ZIP archives entirely in-memory.






# Parsers Library

SC2ModKit provides a set of parsers to handle various StarCraft II file formats. These parsers convert between text-based mod data formats and structured JSON for easier manipulation.

## Available Parsers


### XML Parser (`SC2XML`)

**Purpose:**
Schema-driven XML to JSON converter for SC2 mod files.

**Features:**

* Parses SC2 XML to structured JSON.
* Converts JSON back to XML.
* Supports attributes, nested elements, comments, and processing instructions.
* Handles schema for typed fields, arrays, and enums.
* Debug logging for missing schema entries.

**Example Input (XML):**

```xml
<CUnit id="Marine">
  <LifeMax value="45"/>
  <Speed value="2.25"/>
  <Attributes index="Light" value="1"/>
  <Attributes index="Armored" value="1"/>
  <GlossaryStrongArray value="Marauder"/>
  <WeaponArray Link="GuassRifle"/>`
</CUnit>
```

**Parsed Output (JSON):**

```js
{
  class: "CUnit",
  id: "Marine",
  LifeMax: 45,
  Speed: 2.25,
  Attributes: {Light: 1 ,Armored: 1 },
  GlossaryStrongArray: ["Marauder"],
  WeaponArray: [{Link: "GuassRifle}]
}
```

---

### INI Parser (`SC2INI`)

**Purpose:**
Parses and stringifies SC2 INI-like configuration files.

**Features:**

* Supports nested sections split by `id=`.
* Aggregates repeated keys into arrays.
* Splits comma-separated values into arrays.
* Ignores empty lines and comments.
* Converts back to INI string preserving structure.

**Example Input:**

```
[Abil]
id=GhostHoldFire
asset=Assets\\Textures\\WayPointLine.dds
asset=Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3
Actor=CommandUIHarnessAttackProtoss,CommandUIHarnessAttackTerran,CommandUIHarnessAttackZerg
```

**Parsed Output (JSON):**

```js
{
  Abil: [
    {
      id: "GhostHoldFire",
      asset: [
        "Assets\\Textures\\WayPointLine.dds",
        "Assets\\UI\\Cursors\\WayPointAttack_Void\\WayPointAttack_Void.m3"
      ],
      Actor: [
        "CommandUIHarnessAttackProtoss",
        "CommandUIHarnessAttackTerran",
        "CommandUIHarnessAttackZerg"
      ]
    }
  ]
}
```

---

### ENV Parser (`SC2ENV`)

**Purpose:**
Parses and stringifies StarCraft II `.env`-style localization files.

**Features:**

* Supports `KEY=VALUE` pairs.
* Handles comments starting with `;` or `//`.
* Preserves or ignores comments (configurable).
* Handles BOM and Windows line endings.

**Example Input:**

```
; UI Buttons
UI/Button=Assets\\Textures\\Button.dds
```

**Parsed Output:**

* With `keepComments: true`:

```js
[
  { type: 'comment', value: 'UI Buttons' },
  { type: 'pair', key: 'UI/Button', value: 'Assets\\Textures\\Button.dds' }
]
```

* With `keepComments: false`:

```js
{
  "UI/Button": "Assets\\Textures\\Button.dds"
}
```

---


### Script Parser

**Purpose:**
Simple utility to convert text to an array of lines and back.

**Features:**

* Handles LF and CRLF line endings.
* Removes BOM if present.
* No comment or structural parsing.

---

### Texture Map Parser (`SC2TextureMap`)

**Purpose:**
Parses `TextureReductionValues.txt` and similar SC2 texture mapping files.

**Format:**

```
<texture_file>:<number1>:<number2>:<number3>:<number4>:<number5>:
```

**Example Input:**

```
_base_diffuse.dds:7:8:8:10:6:
_details.dds:5:5:5:5:5:
```

**Parsed Output:**

```js
[
  { file: "_base_diffuse.dds", value: [7, 8, 8, 10, 6] },
  { file: "_details.dds", value: [5, 5, 5, 5, 5] }
]
```

---

### Summary

These parsers allow seamless manipulation of StarCraft II mod data formats, enabling:

* Reading `.env`, `.ini`, `.txt`, and `.xml` files.
* Converting to JSON for editing.
* Writing back to text files while preserving format.

For advanced modding workflows, these parsers can be combined with `SC2Mod` and `SC2ModReader` to load, merge, and export `.SC2Mod` archives.
