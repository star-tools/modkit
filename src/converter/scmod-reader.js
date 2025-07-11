
import SC2JSON from '../converter/scjson.js';


function groupTextValues(input) {
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

function groupFiles(files) {
  const grouped = {};

  // Helper: build nested object path for directories
  function nestDir(obj, parts) {
    if (parts.length === 0) return obj;
    const [head, ...rest] = parts;
    if (!obj[head]) obj[head] = {};
    return nestDir(obj[head], rest);
  }

  for (const [filepath, content] of Object.entries(files)) {
    const parts = filepath.split('/');
    const filename = parts.pop();
    const dirParts = parts; // full nested directory path

    const dotIndex = filename.lastIndexOf('.');
    const hasExt = dotIndex !== -1 && dotIndex !== 0;
    const ext = hasExt ? filename.slice(dotIndex + 1).toLowerCase() : null;

    if (!hasExt) {
      // Put files with no extension at top level (no grouping by ext)
      // Place in nested dir structure as well, or just flat? Here we put flat:
      grouped[filename] = content;
    } else {
      if (!grouped[ext]) grouped[ext] = {};
      // Build nested folder structure inside ext group
      const dirObj = nestDir(grouped[ext], dirParts);
      dirObj[filename] = content;
    }
  }

  return grouped;
}



export default class SCComponentReader{

    constructor (options = {}){
        this.parser = new SC2JSON(options.debugger);
        this.config = {
            debug: false,
            scopes: {
                "components": true,
                "assets": true,
                "documentinfo": true,
                "styles": true,
                "text": true,
                "triggers": true,
                "layouts": true,
                "files": true,
                "banklist": true,
                "mapdata": true,
                "data": true,
            }
        }
        if(options){
            Object.assign(this.config,options)
        }
    }



    static DATA_FILES =  [
        "abil",
        "accumulator",
        "achievement",
        "achievementterm",
        "actor",
        "actorsupport",
        "alert",
        "armycategory",
        "armyunit",
        "armyupgrade",
        "artifact",
        "artifactslot",
        "attachmethod",
        "bankcondition",
        "beam",
        "behavior",
        "boost",
        "bundle",
        "button",
        "camera",
        "campaign",
        "character",
        "cliff",
        "cliffmesh",
        "colorstyle",
        "commander",
        "config",
        "consoleskin",
        "conversation",
        "conversationstate",
        "cursor",
        "datacollection",
        "datacollectionpattern",
        "decalpack",
        "dsp",
        "effect",
        "emoticon",
        "emoticonpack",
        "error",
        "footprint",
        "fow",
        "game",
        "gameui",
        "herd",
        "herdnode",
        "hero",
        "heroabil",
        "herostat",
        "item",
        "itemclass",
        "itemcontainer",
        "kinetic",
        "lensflareset",
        "light",
        "location",
        "loot",
        "map",
        "model",
        "mount",
        "mover",
        "objective",
        "physicsmaterial",
        "ping",
        "playerresponse",
        "portraitpack",
        "preload",
        "premiummap",
        "racebannerpack",
        "race",
        "requirement",
        "requirementnode",
        "reverb",
        "reward",
        "scoreresult",
        "scorevalue",
        "shape",
        "skin",
        "skinpack",
        "sound",
        "soundexclusivity",
        "soundmixsnapshot",
        "soundtrack",
        "spray",
        "spraypack",
        "stimpack",
        "taccooldown",
        "tactical",
        "talent",
        "talentprofile",
        "targetfind",
        "targetsort",
        "terrain",
        "terrainobject",
        "terraintex",
        "texture",
        "texturesheet",
        "tile",
        "trophy",
        "turret",
        "unit",
        "upgrade",
        "user",
        "validator",
        "voiceover",
        "voicepack",
        "warchest",
        "warchestseason",
        "water",
        "weapon"
    ]
    async readXMLFile(localeFile) {
        try {
            return this.readFile(localeFile).then((data)=> this.parser.toJSON(data))
        } catch (e) {
            console.error('readXMLFile failed:', e);
            return null;
        }
    }
    async writeTextFile(filepath, data){
        // await this.writeFile(filepath,data)
    }
    async readTextFile(localeFile) {
        const ext = localeFile.split('.').pop().toLowerCase();
        let rawtext = await this.readFile(localeFile)
        return rawtext;
    }
    async readLinesFile(localeFile) {
        const ext = localeFile.split('.').pop().toLowerCase();
        let rawtext = await this.readFile(localeFile)


        if (!rawtext) {
            return null
        }
        let data = {}

        rawtext
            .replace("﻿","")  //Zero Width No-Break Space
            .replace(/\r/g, "")
            .split("\n")
            .forEach(el => {
                let key = el.substring(0, el.indexOf("="))
                let value = el.substring(el.indexOf("=") + 1)
                data[key] = value
            })
        delete data[""]
        return data;
    }
    async read(){
        let {files} = await this.getFiles();
        let assets = {}
        for(let filename of files){
            let data;

            let reader;
            if(filename === "PreloadAssetDB.txt"){
                reader = "text"
            }
            else{
                let ext = filename.split('.').pop().toLowerCase();
                switch(ext){
                    case "txt":
                        reader = "lines"
                        break;
                    case "documentinfo":
                    case "triggers":
                    case "xml":
                    case "sc2style":
                    case "sc2layout":
                    case "sc2components":
                    case "sc2cutscene":
                    case "stormcutscene":
                        reader = "xml"
                        break;
                    default:
                        console.log('unknown extension ' + ext)
                    case "galaxy":
                    case "version":
                    case "documentheader":
                    case "dds":
                    case "png":
                    case "tga":
                    case "jpg":
                    case "ogv":
                    case "m3":
                    case "mp3":
                    case "wav":
                    case "m3a":
                    case "fx2":
                    case "m3h":
                    case "otf":
                    case "ttf":
                        reader = "binary"
                        break;
                }
            }

            switch(reader){
                case "text":
                    data = await this.readTextFile(filename)
                    break
                case "lines":
                    data = await this.readLinesFile(filename).then(groupTextValues)
                    break
                case "binary":
                    data = await this.readFile(filename)
                    break
                case "xml":
                    data = await this.readXMLFile( filename)
                    break
            }
            assets[filename] = data;
        }
        return groupFiles(assets)
    }
}