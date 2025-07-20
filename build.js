

import { build } from 'esbuild';
import { builtinModules }  from 'module'
// import pkg from './package.json' assert { type: 'json' };
//no warnings way
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, 'package.json');

const pkg = JSON.parse(await readFile(jsonPath, 'utf-8'));



build({
  entryPoints: ['./src/index.js'], // your main file
  outfile: './dist/sc2modtoolkit.min.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm', // or 'iife' for browser global
  target: ['es2022'], // or 'node16' if Node-only
  external: [
    // Node.js built-in modules
    ...builtinModules,
    // Your dependencies from package.json
    ...Object.keys(pkg.dependencies || {}),
    ]
}).then(() => {
  console.log('Build complete!');
}).catch(() => process.exit(1));
