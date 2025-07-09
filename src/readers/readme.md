🧩 SCModReader – StarCraft II Mod Reader Toolkit
SCModReader is a modular JavaScript framework for reading and parsing StarCraft II mod data in various environments, including:

🖥 Node.js (local filesystem)

🌐 Web (via fetch + flat index)

📦 ZIP archives (via JSZip)

🐙 GitHub repositories (via Octokit)

It parses data like .SC2Components, .SC2Layout, .SC2Style, and others into structured JSON, allowing easy introspection of StarCraft mod content.

📁 Directory Structure

🛠️ Usage
1. Node.js Reader (scmod-reader-fs.js)
Read files from a local directory:

import { FSComponentReader } from './src/readers/scmod-reader-fs.js';
const reader = new FSComponentReader();
await reader.load('/path/to/SC2Mod/');
const data = await reader.read();

2. Web Reader (scmod-reader.js via WebSCComponentReader)
Read files from a URL + index.json:

import { WebSCComponentReader } from './src/readers/scmod-reader.js';
const reader = new WebSCComponentReader();
await reader.load('https://example.com/mods/myMod/');
const data = await reader.read();

📄 Required index.json format:
{
  "files": [
    "data/mod.json",
    "data/units/keiron.json"
  ],
  "folders": [
    "data",
    "data/units"
  ]
}

3. ZIP Reader (scmod-reader-jszip.js)
Read mod files from a ZIP archive:

import { ZipComponentReader } from './src/readers/scmod-reader-jszip.js';
import JSZip from 'jszip';
const zip = await JSZip.loadAsync(file); // from File or Buffer
const reader = new ZipComponentReader(zip);
const data = await reader.read();

4. GitHub Repo Reader (scmod-reader-octokit.js)
Fetch mod files from a GitHub repository:
import { OctokitComponentReader } from './src/readers/scmod-reader-octokit.js';
const reader = new OctokitComponentReader({
  owner: 'username',
  repo: 'mod-repo',
  branch: 'main'
});
await reader.load('/');
const data = await reader.read();

🧠 Features
🧩 Parses .SC2Components, .SC2Layout, .SC2Style, .SC2Cutscene, .SC2Triggers, and .xml

📚 Groups parsed files by extension and directory

🔍 Supports .txt, .galaxy, .version, .documentinfo, and more

🧼 Normalizes text formats and extracts key-value translations

🔄 Unified output structure across environments