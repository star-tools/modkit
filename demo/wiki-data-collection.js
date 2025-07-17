

import SC2JSONDebugger from '../src/debuggers/debugger.js';
import NodeReader from '../src/readers/node-reader.js';
import {SCMod,readModData} from '../src/scmod.js';
import fs from 'fs/promises';
import yaml from '../src/lib/js-yaml.js';

export function groupObjectKeys(input) {
    const result = {};

    for (const [path, value] of Object.entries(input)) {
        const parts = path.split('/');
        let current = result;

        for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If it's the last part, set the value
        if (i === parts.length - 1) {
            current[part] = value;
        } else {
            // If the key doesn't exist or isn't an object, create/replace it
            if (typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
            }
            current = current[part];
        }
        }
    }

    return result;
}

SCMod.prototype.calculateStringsEx = function (locale){

  for(let catalog in this.strings){
    for(let key in this.strings[catalog]){  
      if(key.startsWith("e_unitAttribute")){
        outputKey = key.replace("e_unitAttribute","UnitAttribute/")
        this.strings[catalog][outputKey] = this.strings[catalog][key]
        delete this.strings[catalog][key]
      }
    }
  }
  this.calculateStrings(locale)

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
      cs[key] = this.cache.String[key].calculated
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

const reader = new NodeReader("./assets/data/");
const cdebugger = new SC2JSONDebugger( {file: './debug.json'});
let modMultiJSONRaw = await fs.readFile(`./wiki/data.v2/multi/data.json`,{encoding: 'utf-8'})
let modMulti = SCMod.fromJSON({catalogs: [{Data: JSON.parse(modMultiJSONRaw)}] })

async function collectCustomFactionModData(modName,deps){
  let options = await readModData(reader, modName +".sc2mod", {
    debugger: cdebugger,
    scope: {
      catalogs: ["Abil","Behavior","Unit","Button","Actor","Weapon","Effect","Requirement","RequirementNode","Upgrade","Turret","Validator","DataCollection","DataCollectionPattern"],//,"Sound"],
      strings: ["Game","Hotkeys"],
      // locales: ["enUS","ruRU","koKR","zhCN"]
    }
  })
  let mod = new SCMod({
    ...options,
    dependencies: deps 
  })

  let dir = modName.split("/").pop()
  // Ensure directory exists
  await fs.mkdir(`./wiki/data.v2/${dir}/`, { recursive: true });

  mod._make_cache()
  
  let locales = mod.components?.DataComponent?.filter(c => c.Type.toLowerCase() === "text").map(c => c.Locale).map(c => c.toLowerCase())

    // let locales = ["dede","enus","eses","esmx","frfr","itit","kokr","plpl","ptbr","ruru","zhcn","zhtw"] 
  // let locales = ["enus","kokr","ruru","zhcn"] 
  for(let locale of locales){
    let _calculated_strings = mod.calculateStringsEx(locale)
    
    let yamlData = yaml.dump(_calculated_strings, {
      indent: 1,
      flowLevel: -1,       // force inline collections
      lineWidth: -1,       // don't wrap long lines
      noRefs: true         // avoid anchors/aliases
    });
    yamlData = yamlData.replace(/'([A-Za-z0-9_]+)'/g, '$1'); // remove safe quotes
    await fs.writeFile(`./wiki/data.v2/${dir}/${locale}.yaml`, yamlData); // save to file
  }

    //save data only
  let data = mod.catalogs.map(c => c.Data).flat().filter(Boolean)
  await fs.writeFile(`./wiki/data.v2/${dir}/data.json`, JSON.stringify(data)); // save to file
}

await collectCustomFactionModData("bundles/Base")
await collectCustomFactionModData("bundles/VoidMulti5014")
// await collectCustomFactionModData("custom/BroodWar", [modMulti])
// await collectCustomFactionModData("custom/Dragons", [modMulti])
// await collectCustomFactionModData("custom/Hybrids", [modMulti])
// await collectCustomFactionModData("custom/Scion", [modMulti])
// await collectCustomFactionModData("custom/Synoid", [modMulti])
// await collectCustomFactionModData("custom/TalDarim", [modMulti])
// await collectCustomFactionModData("custom/UED", [modMulti])
// await collectCustomFactionModData("custom/Umojan", [modMulti])
// await collectCustomFactionModData("custom/UPL", [modMulti])


