#!/usr/bin/env node
// ./cli.js info ./mods/MyMod.SC2Mod
// ./cli.js merge ./output/Merged.SC2Mod ./mods/Mod1.SC2Mod ./mods/Mod2.SC2Mod
// ./cli.js extract ./mods/MyMod.SC2Mod ./outputDir/

import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import SC2ModReader from '../types/SC2ModReader.js'; // adjust path if needed
import SC2Mod from './SC2Mod.js';

const program = new Command();

program
  .name('sc2modreader')
  .description('CLI tool for reading, inspecting, and merging SC2 mods')
  .version('1.0.0');

program
  .command('info')
  .description('Show info about a SC2 mod')
  .argument('<modPath>', 'Path to the .SC2Mod folder or archive')
  .action(async (modPath) => {
    const mod = await SC2ModReader.read(modPath);
    console.log(`Mod Name: ${mod.name}`);
    console.log(`Version: ${mod.version || 'N/A'}`);
    console.log(`Files: ${mod.listFiles().join('\n')}`);
  });

program
  .command('merge')
  .description('Merge multiple SC2 mods into one')
  .argument('<output>', 'Path to output merged mod')
  .argument('<mods...>', 'Paths to input mods to merge')
  .option('-n, --name <name>', 'Name of the merged mod', 'MergedMod')
  .action(async (output, mods, options) => {
    console.log('Merging mods:', mods);

    const mergedMod = new SC2Mod(options.name);

    for (const modPath of mods) {
      const mod = await SC2ModReader.read(modPath);
      mergedMod.merge(mod);
    }

    await SC2ModReader.write(mergedMod, output);
    console.log(`Merged mod written to ${output}`);
  });

program
  .command('extract')
  .description('Extract all files from a mod')
  .argument('<modPath>', 'Path to the mod')
  .argument('<outputDir>', 'Directory to extract to')
  .action(async (modPath, outputDir) => {
    const mod = await SC2ModReader.read(modPath);
    for (const [filePath, data] of Object.entries(mod.files)) {
      const fullPath = path.join(outputDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, data);
    }
    console.log(`Extracted ${Object.keys(mod.files).length} files to ${outputDir}`);
  });

program.parseAsync(process.argv);
