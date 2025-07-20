import SC2ModReader from '../../src/SC2ModReader.js';

let reader = new SC2ModReader({
  base: "/Applications/StarCraft II/assets/data/",
  directories: {
    mods:    './mods/',
    custom:  './custom/',
    exo:     './exo/',
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
    // "mods:Core.SC2Mod",
    // "mods:Liberty.SC2Mod",
    // "mods:Swarm.SC2Mod",
    // "mods:Void.SC2Mod",
    // "multi/VoidMulti5014.SC2Mod",

    // "custom:BroodWar.SC2Mod",
    // "custom:Dragons.SC2Mod",
    // "custom:Hybrids.SC2Mod",
    // "custom:Scion.SC2Mod",
    // "custom:Synoid.SC2Mod",
    // "custom:TalDarim.SC2Mod",
    // "custom:UED.SC2Mod",
    // "custom:Umojan.SC2Mod",
    // "custom:UPL.SC2Mod",

    // "exo:TiberiumWars.SC2Mod",
    // "exo:WarCraft.SC2Mod",
    // "exo:WarHammer.SC2Mod",
    // "exo:Warzone.SC2Mod"
  ]/*, wikiConfig*/)
  
  reader.write("output/Merged",modMerged)
  console.log("finished")