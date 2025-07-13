
import SC2JSONDebuggerNode from '../src/converter/debugger-node.js';
import NodeReader from '../src/readers/node-reader.js';


const reader = new NodeReader("/Applications/StarCraft II/Mods/assets/data/");
const cdebugger = new SC2JSONDebuggerNode( {file: './debug.json'});
import {modsMerge, writeModData} from '../src/converter/scmod.js';

let merged = await modsMerge(reader,[
    "mods/Core.sc2mod",
    "mods/Liberty.sc2mod",
    "mods/Swarm.sc2mod",
    "mods/Void.sc2mod",
    "multi/VoidMulti5014.sc2mod",

    // "custom/BroodWar.SC2Mod",
    // "custom/Dragons.SC2Mod",
    // "custom/Hybrids.SC2Mod",
    // "custom/Scion.SC2Mod",
    // "custom/Synoid.SC2Mod",
    // "custom/TalDarim.SC2Mod",
    // "custom/UED.SC2Mod",
    // "custom/Umojan.SC2Mod",
    // "custom/UPL.SC2Mod",

    // "exo/TiberiumWars.SC2Mod",
    // "exo/WarCraft.SC2Mod",
    // "exo/WarHammer.SC2Mod",
    // "exo/Warzone.SC2Mod"

  ], {
    debugger: cdebugger,
    scope: {
      // catalogs: ["Abil","Behavior","Unit","Button","Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern"],//,"Sound"],
      // strings: ["Game","Hotkeys"],
      // locales: ["enUS","ruRU","koKR","zhCN"]
    }
  })

  console.log("finished")
  // write full mod data
  await writeModData(reader,"output/Merged.sc2mod", merged, cdebugger)