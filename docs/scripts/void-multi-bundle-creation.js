import SC2ModReader from '../../src/SC2ModReader.js';

let reader = new SC2ModReader({
  base: "/Applications/StarCraft II/Mods/assets/data/",
  directories: {
    mods:    './mods/',
    custom:  './custom/',
    exo:     './exo/'
  }
})

//can be used to not load unused data
let wikiConfig = {
  scope: {
    catalogs: ["Abil","Behavior","Unit","Button","Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern","Sound"],
    strings: ["Game","Hotkeys"],
    locales: ["enUS","ruRU","koKR","zhCN"]
  }
}

let modMerged = await reader.merge([
    "mods:Core",
    "mods:Liberty",
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
  ]/*, wikiConfig*/)
  
  reader.write("output/Merged",modMerged)
  console.log("finished")