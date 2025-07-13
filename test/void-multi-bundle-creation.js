
const reader = new NodeReader("./assets/data/");
const cdebugger = new SC2JSONDebugger( {file: './debug.json'});
import {modsMerge, writeModData} from '../src/readers/mod-reader.js';

let merged = await modsMerge(reader,[
    "mods/Core.sc2mod",
    "mods/Liberty.sc2mod",
    "mods/Swarm.sc2mod",
    "mods/Void.sc2mod",
    "multi/VoidMulti5014.sc2mod"
  ], {
    debugger: cdebugger,
    scope: {
      catalogs: ["Abil","Behavior","Unit","Button","Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern"],//,"Sound"],
      strings: ["Game","Hotkeys"],
      locales: ["enUS","ruRU","koKR","zhCN"]
    }
  })

  // write full mod data
  await writeModData(reader,"output/Merged.sc2mod", merged, cdebugger)