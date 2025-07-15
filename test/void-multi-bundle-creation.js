import SC2Reader from '../src/SC2Reader.js';

// let base = "/Applications/StarCraft II/Mods/assets/data/"
SC2Reader.readers.default.base = "/Applications/StarCraft II/Mods/assets/data/"
// let Node = SC2Reader.configs.Node
// SC2Reader.addReaders(
//   {default: true,       reader: Node, base: base},
//   {prefix: 'mods:'    , reader: Node, base: base + 'mods'},
//   {prefix: 'custom:'  , reader: Node, base: base + 'custom'},
//   {prefix: 'exo:'     , reader: Node, base: base + 'exo'},
// )

let modMerged = await SC2Reader.merge([
    "mods/Core",
    "mods/Liberty",
    // "mods:Swarm",
    // "mods:Void",
    // "multi/VoidMulti5014",

    // "custom:BroodWar",
    // "custom:Dragons",
    // "custom:Hybrids",
    // "custom:Scion",
    // "custom:Synoid",
    // "custom:TalDarim",
    // "custom:UED",
    // "custom:Umojan",
    // "custom:UPL",

    // "exo:TiberiumWars",
    // "exo:WarCraft",
    // "exo:WarHammer",
    // "exo:Warzone"
  ], {
    scope: {
      // catalogs: ["Abil","Behavior","Unit","Button","Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern"],//,"Sound"],
      // strings: ["Game","Hotkeys"],
      // locales: ["enUS","ruRU","koKR","zhCN"]
    }
  })
  modMerged.write("output/Merged")
  console.log("finished")