import SC2ModReader from '../../src/SC2ModReader.js';
import SC2Mod from '../../src/SC2Mod.js';

import fs from 'fs/promises';
import { groupObjectKeys } from '../../src/util/obj-util.js';
import { flattenToIni, sectionsToIniString } from '../../src/util/ini-util.js';
import { relations } from '../../src/util/schema.js';
import SC2Schema from '../../src/schema/SC2Schema.js';

let reader = new SC2ModReader({
  base: "/Applications/StarCraft II/",
  directories: {
    input:    './assets/data/',
    output:  './tools/wiki/data.v3/'
  }
})

SC2Mod.prototype.getCalculatedStrings = function (locale,calculate){
   if(calculate){
    this.calculateStrings(locale)
   }

  let removedKeys = [
    "ERROR",
    "LookAtType",
    "Alert",
    "CoversationState",
    "Param",
    "Shape",
    // "Skin",
    "SkinPack",
    "UserData",
    "UI",
    "Achievement",
    "AchievementTerm",
    "ActorCheat",
    "ActorDebug",
    "ArmyCustomizaAbil",
    "ArmyCategory",
    "ArmyUnit",
    "ArmyUpgrade",
    "Artifact",
    "Beacon",
    "Cheat",
    "Conversation",
    "CoreDebug",
    "Cutscenes",
    "GameCategory",
    "GameContentError",
    "GameDebug",
    "Map",
    "Mouse",
    "Objective",
    "Param",
    "Player",
    "Reward",
    "ScoreResult",
    "ScoreValue",
    // "Skin",
    "SoundDebug",
    "Terrain",
    "TriggerDebug",
    "UnitPoints",
    "AI",
    "Bundle",
    "Challenge",
    "ChallengeCategory",
    "CommanderDifficultyLevel",
    "ConsoleSkin",
    "ConversationState",
    "DecalPack",
    "LoadingBar",
    "LoadingScreen",
    "SimpleDisplay",
    "SkinPack",
    "SkinSet",
    "Switcher",
    "Tutorial",
    "WarChest",
    "Cliff",
    "TerrainTex",
    "Water",
    "Error",
    "HoloPanel",
    "Hotkey",
    "Key",
    "Location",
    "Missile",
    "Attribute",
    "Commander"
  ]

  let cs = {}
  for(let key in this.cache.String){
    if(key.startsWith("e_game") || 
      key.startsWith("e_hero") || 
      key.startsWith("Attribute") || 
      key.startsWith("AUTHENTICATION") || 
      key.startsWith("e_cmd") || 
      key.startsWith("gt_")){
        continue
    }
    else{ 
      let value = calculate ? this.cache.String[key].calculated : this.cache.String[key].data[locale]
      if(value !== undefined){
        const index = value.indexOf('///');
        if(index !== -1){
          value = value.slice(0, index)
        }
        cs[key] = value
      }
    }
  }

  for(let key in cs){  
    if(key.startsWith("e_unitAttribute")){
      let outputKey = key.replace("e_unitAttribute","UnitAttribute/")
      cs[outputKey] = cs[key]
      delete cs[key]
    }
  }

  let gcs = groupObjectKeys(cs)

  for(let key in gcs){
    if(removedKeys.includes(key)){
      delete gcs[key]
    }
  }

  return gcs
}

async function collectModData(scmod, modName,dependencies){
  let dir = modName
  // Ensure directory exists
  await fs.mkdir(`./wiki/data.v3/${dir}/`, { recursive: true });
  scmod.buildCatalogs();
  let output = {
    catalogs: scmod.data.catalogs,
    locales: scmod.getLocales()
  }

  scmod.makeCache()
  // let locales = ["enus","kokr","ruru","zhcn"] 
  for(let locale of output.locales){
    // (async function saveCalculatedStringsYAML(){
    //     let _calculated_strings = scmod.getCalculatedStrings(locale,true)
    //     let yamlData = yaml.dump(_calculated_strings, {
    //       indent: 1,
    //       flowLevel: -1,       // force inline collections
    //       lineWidth: -1,       // don't wrap long lines
    //       noRefs: true         // avoid anchors/aliases
    //     });
    //     // import yaml from '../../src/lib/yaml.js';
    //     yamlData = yamlData.replace(/'([A-Za-z0-9_]+)'/g, '$1'); // remove safe quotes
    //     await fs.writeFile(`./wiki/data.v3/${dir}/${locale}.yaml`, yamlData); // save to file
    //   // await reader.write(`output:core/${locale}.yaml`,scmod,{scope: ["strings"], locales: ["locale"]})
    // })
    let _calculated_strings = scmod.getCalculatedStrings(locale,false)

    const sections = flattenToIni(_calculated_strings);
    const iniOutput = sectionsToIniString(sections);
    await fs.writeFile(`./wiki/data.v3/${dir}/${locale}.ini`, iniOutput); // save to file


  }
  //modify file paths
  relations(scmod.data, SC2Schema.Mod ,"", (rel, value,parent,parentIndex , schema) => {
    if(rel.type === "File"){
      parent[parentIndex] = value.replace(/\\/g,"/").split("/").pop().replace(".dds","").replace(".m3","")
      return true;
    }
  });
  // scmod.setEntitiesRelations()
  // await reader.write(`output:core/data.json`,scmod,{scope: ["catalogs","locales"]})
  await fs.writeFile(`/Applications/StarCraft II/tools/wiki/data.v3/${dir}/data.json`, JSON.stringify(output)); // save to file
}

let options = {  
  scope: {
    binary: false,assets: false,styles: false,triggers: false,banklist: false,regions: false,objects: false,preload: false,terrain: false,texturereduction: false,layouts: false,scripts: false,editorcategories: false,cutscenes: false,media: false,
    components: true,info: true,includes: true,
    catalogs: [ "Abil","Behavior","Unit","Race","Button",  "Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern","Sound" ],
    strings: ["gamestrings","gamehotkeys"],
    locales: ["enUS","frFR","deDE","esES","esMX","ruRU","koKR","zhCN","zhTW","plPL","itIT","ptBR"]
  }
}

let forceUpdate = true

let coreMod = !forceUpdate && await reader.read(`output:Core/data.json`,options)
if(!coreMod) {
  coreMod = await reader.read(`input:mods/Core.sc2mod`,options)
  await collectModData(coreMod,"Core")
}

let baseModOptions = {dependencies: [coreMod], ...options}
let baseMod = !forceUpdate && await reader.read(`output:Base/data.json`,baseModOptions)
if(!baseMod) {
  baseMod = await reader.read(`input:bundles/Base.sc2mod`,baseModOptions)
  await collectModData(baseMod,"Base")
}

let voidModOptions = {dependencies: [baseMod], ...options}
let voidMod = !forceUpdate && await reader.read(`output:Void/data.json`,voidModOptions)
if(!voidMod) {
  voidMod = await reader.read(`input:bundles/VoidMulti5014.SC2Mod`,voidModOptions)
  await collectModData(voidMod,"Void")
}
let multiMod = await reader.read(`output:Multi/data.json`,voidModOptions)
if(!multiMod) {
  multiMod = await reader.merge([
    `input:mods/Core.sc2mod`,
    `input:bundles/Base.sc2mod`,
    `input:bundles/VoidMulti5014.SC2Mod`
  ],options)
  await collectModData(multiMod,"Multi")
}




let customModOptions = {dependencies: [multiMod], ...options}
async function collectCustomModData(modName){
  let customMod = await reader.read(`input:custom/${modName}.sc2mod`, customModOptions)
  await collectModData(customMod,modName)
}

await collectCustomModData("BroodWar")
await collectCustomModData("Dragons")
await collectCustomModData("Hybrids")
await collectCustomModData("Scion")
await collectCustomModData("Synoid")
await collectCustomModData("TalDarim")
await collectCustomModData("UED")
await collectCustomModData("Umojan")
await collectCustomModData("UPL")
await collectCustomModData("TiberiumWars")
await collectCustomModData("WarHammer")
await collectCustomModData("WarCraft")
await collectCustomModData("Warzone")
console.log("Finished")

