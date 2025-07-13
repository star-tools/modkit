



import SC2JSON from '../converter/scjson.js';
import {parseEnv,parseLines,parseIni, serializeIni, deep} from '../lib/util.js';
import {SCSchema} from "../schema/all.js"
import { EGameCatalog } from '../schema/catalog-enums.js';

export const TEXT_FILES = ["gamehotkeys", "gamestrings", "objectstrings", "triggerstrings", "conversationstrings"]

export const DATA_FILES = EGameCatalog.enum

export async function readModData(reader, modName, options = {}){

    let scope = Object.assign({
        catalogs: true,
        strings: true,
        locales: true,
        components: true,
        assets: true,
        info: true,
        styles: true,
        triggers: true,
        banklist: true,
        regions: true,
        objects: true,
        preload: true,
        terrain: true,
        texturereduction: true,
        layouts: true,
        scripts: true,
        editorcategories: true,
    },options.scope || {})
    
    const converter = new SC2JSON({debugger: options.debugger})


  await reader.init(modName);

  let files = await reader.list();
  files = files.map(f => f.toLowerCase())

  async function xml(file){
    if(!files.includes(file.toLowerCase()))return null
    const raw = await reader.get(file)
    if(!raw)return null
    return converter.toJSON(raw);
  }
  async function env(file){
    if(!files.includes(file.toLowerCase()))return null
    const raw = await reader.get(file)
    if(!raw)return null
    return parseEnv( raw)
  }
  async function ini(file){
    if(!files.includes(file.toLowerCase()))return null
    const raw = await reader.get(file)
    if(!raw)return null
    return parseIni( raw)
  }
  async function lines(file){
    if(!files.includes(file.toLowerCase()))return null
    const raw = await reader.get(file)
    if(!raw)return null
    return parseLines( raw)
  }
  async function text(file){
    if(!files.includes(file.toLowerCase()))return null
    const raw = await reader.get(file)
    if(!raw)return null
    return raw
  }

  async function bin(file){
    if(!files.includes(file.toLowerCase()))return null
    return await reader.link(file)
  }

  let scopeCatalogsLC = scope.catalogs?.length && scope.catalogs.map(c => c.toLowerCase())
  let dataFiltered = scope.catalogs?.length ? DATA_FILES.filter(ns => scopeCatalogsLC.includes(ns.toLowerCase())) : DATA_FILES
  let baseCatalogs = dataFiltered.map(f => "gamedata/" + f.toLowerCase() + "data.xml")

    // 1. Base tasks with direct awaits
    const asyncData = {
      components: scope.components && xml("ComponentList.SC2Components"),
      assets: scope.assets && env("Base.SC2Data/GameData/Assets.txt"),
      info: scope.info && xml("DocumentInfo"),
      styles: scope.styles && xml("Base.SC2Data/UI/FontStyles.SC2Style"),
      triggers: scope.triggers && xml("Triggers"),
      banklist: scope.banklist && xml("BankList.xml"),
      regions: scope.regions && xml("Regions"),
      objects: scope.objects && xml("Objects"),
      preload: scope.preload && xml(files.includes("Preload.xml") ? "Preload.xml" : "Base.SC2Data/Preload.xml"),
      terrain: scope.terrain && xml("t3Terrain.xml"),
      includes: scope.catalogs && xml("Base.SC2Data/GameData.xml"),
      texturereduction: scope.texturereduction && lines("Base.SC2Data/texturereduction/texturereductionvalues.txt"),
      preloadassetdb: scope.preload && ini("Base.SC2Data/preloadassetdb.txt"),
      standardinfo: scope.info && xml("Base.SC2Data/standardinfo.xml"),
      descindex: scope.layouts && xml("Base.SC2Data/UI/Layout/DescIndex.SC2Layout"),
      librarylist: scope.triggers && xml("Base.SC2Data/triggerlibs/librarylist.xml"),
      editorcategories: scope.editorcategories && xml("Base.SC2Data/EditorData/EditorCategories.xml")
    };
    for(let i in asyncData){
      if(asyncData[i] === false)delete asyncData[i]
    }

    const result = await Object.fromEntries(
      await Promise.all(Object.entries(asyncData).map(async ([k, v]) => [k, await v]))
    )
    if(result.assets) delete result.assets['']

    // 2. Helper to build {filename: content} from filtered files
    const mapToObject = async (files, handler,keepArray) => {
      const entries = await Promise.all(
        files.map(async (file) => [file, await handler(file)])
      );
      if(keepArray){
        return entries.map(([namespace,catalog]) => ({
            ...catalog,
            namespace: namespace.replace('base.sc2data/','').replace(".xml",'')
        }))
      }
      return Object.fromEntries(entries);
    };


    if(scope.strings && scope.locales){
        let textFilesFiltered ;
        if(scope.strings === true){
          textFilesFiltered = TEXT_FILES
        }
        else{
          textFilesFiltered = []
          if(scope.strings.includes("Hotkeys"))textFilesFiltered.push("gamehotkeys")
          if(scope.strings.includes("Game"))textFilesFiltered.push("gamestrings")
          if(scope.strings.includes("Objects"))textFilesFiltered.push("objectstrings")
          if(scope.strings.includes("Trigger"))textFilesFiltered.push("triggerstrings")
          if(scope.strings.includes("Conversation"))textFilesFiltered.push("conversationstrings")
          if(scope.strings.includes("EditorCategory"))textFilesFiltered.push("editor/editorcategorystrings")
        }

        let componentsLocales = result.components?.DataComponent?.filter(c => c.Type.toLowerCase() === "text").map(c => c.Locale) || ["dede","enus","eses","esmx","frfr","itit","kokr","plpl","ptbr","ruru","zhcn","zhtw"]        
        let locales = componentsLocales.map(c => c.toLowerCase())
        if(scope.locales?.length){
          let scopeLocalesLC = scope.locales.map(c => c.toLowerCase())
          locales = locales.filter(l => scopeLocalesLC.includes(l))
        }
        let regexp = new RegExp(`(${locales.join("|")}).sc2data/localizeddata/`,"i")
        let strings = await mapToObject(  files.filter((f) => regexp.test(f)).filter((f) => f.endsWith(".txt")).filter((f) => textFilesFiltered.includes(f.replace(regexp,'').replace(".txt",''))),  env);
        for(let f in strings){
            delete strings[f]['']
            let namespace = f.replace('.sc2data/localizeddata','').replace(".txt",'')
            let locale = namespace.split("/")[0]
            let catalog = namespace.split("/")[1]
            let resultString = strings[catalog] || {}
                for(let string in strings[f]){
                let resultObject = resultString[string] || {}
                if(!resultString[string])resultString[string] = resultObject
                resultObject[locale] = strings[f][string]
                }
            strings[catalog] = resultString
            delete strings[f]
        }
        result.strings = {}
        if(strings.gamehotkeys)result.strings.Hotkeys = strings.gamehotkeys
        if(strings.gamestrings)result.strings.Game = strings.gamestrings
        if(strings.objectstrings)result.strings.Object = strings.objectstrings
        if(strings.triggerstrings)result.strings.Trigger = strings.triggerstrings
        if(strings.conversationstrings)result.strings.Conversation = strings.conversationstrings

    }
    if(scope.catalogs){
        let dataIncludes = result.includes?.Catalog?.map(c => c.path.toLowerCase()) || []
        let allCatalogs = [...baseCatalogs,...dataIncludes].map(f => "base.sc2data/" + f)
        result.catalogs = await mapToObject( allCatalogs.filter(f => files.includes(f)),  xml,true);
    }
    if(scope.layouts){
        let allLayouts = result.descindex?.Include.map(i => i.path) || []
        const layoutsTemp = await mapToObject(  allLayouts.map(f => "Base.SC2Data/" + f),  xml);
        const layouts = {}
        for(let f in layoutsTemp){
            let namespace = f.toLowerCase().replace("base.sc2data/",'').replace(".sc2layout",'')
            layouts[namespace] = layoutsTemp[f]
        }
        result.layouts = layouts
    }
    if(scope.triggers){
        result.sc2lib = await mapToObject(  files.filter((f) => /\.(sc2lib)$/i.test(f)),  xml);
    }
    if(scope.scripts){
        result.galaxy = await mapToObject(  files.filter((f) => /\.(galaxy)$/i.test(f)),  text);
    }
    if(scope.cutscenes){
        result.cutscenes = await mapToObject(  files.filter((f) => /\.(sc2cutscene|stormcutscene)$/i.test(f)),  xml);
    }
    if(scope.binary){
        result.binary = {
            version: await mapToObject(  files.filter((f) => /\.(version)$/i.test(f)),  bin),
            header: await mapToObject(  files.filter((f) => /^DocumentHeader$/i.test(f)),  bin)
        }
    }
    if(scope.media){
      result.media = {
        model: Object.fromEntries(files.filter((file) => /\.(m3)$/i.test(file)).map(f => [f,bin(f)])),
        modela: Object.fromEntries(files.filter((file) => /\.(m3a)$/i.test(file)).map(f => [f,bin(f)])),
        modelh: Object.fromEntries(files.filter((file) => /\.(m3h)$/i.test(file)).map(f => [f,bin(f)])),
        audio: Object.fromEntries(files.filter((file) => /\.(ogg|mp3|wav)$/i.test(file)).map(f => [f,bin(f)])),
        image: Object.fromEntries(files.filter((file) => /\.(dds|tga|jpg|png)$/i.test(file)).map(f => [f,bin(f)])),
        video: Object.fromEntries(files.filter((file) => /\.(ogv)$/i.test(file)).map(f => [f,bin(f)])),
        fonts: Object.fromEntries(files.filter((file) => /\.(otf|ttf)$/i.test(file)).map(f => [f,bin(f)])),
        facial: Object.fromEntries(files.filter((file) => /\.(fx2)$/i.test(file)).map(f => [f,bin(f)])),
      }
    }

    // 5. Filter nulls and empty arrays/objects
    return Object.fromEntries(
      Object.entries(result).filter(
        ([_, v]) =>
          v != null &&
          !(Array.isArray(v) && v.length === 0) &&
          !(typeof v === "object" && Object.keys(v).length === 0)
      )
    );
    
    
}

export async function writeModData(reader, modName, obj, cdebugger) {
    const converter = new SC2JSON({debugger: cdebugger})

  await reader.init(modName);

    function xml(content,schema){
      return converter.toXML(content,schema);
    }
    function env(content){
      return Object.entries(content).map((key,value) => `${key}=${value}`).join("\n")
    }
    function ini(content){
      return serializeIni(content) //todo
    }
    function lines(content){
      return content.join("\n")
    }
    function text(content){
      return content
    }
    function bin(content){
      return content
    }

    function fromDataArray(data,fn,schema,pathtemplate){
      if(!data)return null
      return Object.fromEntries(
        Object.entries(data).map(
          ([path, data]) => [pathtemplate?.replace("*",path) || path, fn(data,schema,path)]
        )
      );
    }

    function reverseLocales(strings){
      let result = {}
      for(let category in strings){
        for(let entity in strings[category]){
          for(let locale in strings[category][entity]){
            let filename = `${locale}.sc2data/localizeddata/${category}.txt`
            if(!result[filename])result[filename] = {}
            result[filename][entity] = obj.strings[category][entity][locale]
          }
        }
      }
      return result
    }

    let filesData = {
      "ComponentList.SC2Components": xml(obj.components,SCSchema.Components),
      "Base.SC2Data/GameData/Assets.txt": env(obj.assets),
      "DocumentInfo": xml(obj.info,SCSchema.DocInfo),
      "Base.SC2Data/UI/FontStyles.SC2Style": xml(obj.styles,SCSchema.StyleFile),
      "Triggers": xml(obj.triggers,SCSchema.TriggerData),
      "BankList.xml": xml(obj.banklist),
      "Regions": xml(obj.regions),
      "Objects": xml(obj.objects),
      "Preload.xml": xml(obj.preload),
      "t3Terrain.xml": xml(obj.terrain),
      "Base.SC2Data/GameData.xml": xml(obj.includes,SCSchema.Includes),
      "Base.SC2Data/texturereduction/texturereductionvalues.txt": lines(obj.texturereduction),
      "Base.SC2Data/preloadassetdb.txt": ini(obj.preloadassetdb),
      "Base.SC2Data/standardinfo.xml": xml(obj.standardinfo,SCSchema.DocInfo),
      "Base.SC2Data/UI/Layout/DescIndex.SC2Layout": xml(obj.descindex,SCSchema.Desc),
      "Base.SC2Data/triggerlibs/librarylist.xml": xml(obj.librarylist,SCSchema.TriggerData),
      "Base.SC2Data/EditorData/EditorCategories.xml": xml(obj.editorcategories,SCSchema.TriggerData),
      "DocumentHeader": obj.binary.header,
      ...fromDataArray(obj.sc2lib, xml,SCSchema.TriggerData),
      ...fromDataArray(obj.layouts, xml,SCSchema.Desc),
      ...fromDataArray(obj.catalogs, xml,SCSchema.Catalog,`Base.SC2Data/*.xml`),
      ...fromDataArray(obj.galaxy, text),
      ...fromDataArray(reverseLocales(obj.strings), env),
      ...fromDataArray(obj.cutscenes, xml)
    }

    let binary = {
      ...fromDataArray(obj.binary.version, bin),
      ...fromDataArray(obj.assets.model, bin),
      ...fromDataArray(obj.assets.modela, bin),
      ...fromDataArray(obj.assets.modelh, bin),
      ...fromDataArray(obj.assets.audio, bin),
      ...fromDataArray(obj.assets.image, bin),
      ...fromDataArray(obj.assets.video, bin),
    }

    for(let file in filesData){
      if(filesData[file] === undefined || filesData[file] === null){
        delete filesData[file] 
      }
    }

    for(let file in filesData){
      await reader.set(file,filesData[file])
    }

    for(let file in binary){
      await reader.set(file,filesData[file],{file: true})
    }

}

export async function modsMerge(reader,mods,options){
  let result = {};
  for(let mod of mods){
    let modData = await readModData(reader,mod,options);
    deep(result,modData)
  }
  return result
}

export function addDocInfo(mod,text){
  for(let locale in mod.locales){
      mod.strings.Game["DocInfo/Website"][locale] = text.Website
      mod.strings.Game["DocInfo/Name"][locale]  = text.Name
      if(text.DescLong){
          mod.strings.Game["DocInfo/DescLong"][locale]  = `${text.DescLong}${text.Signature || ''}`
      }
      if(text.DescShort){
          mod.strings.Game["DocInfo/DescShort"][locale]  = text.DescShort
      }
  }
}

//apply patches in arrays . resolve "index" and "removed" attributes
export function applyPatchesDeep(data) {
  if (Array.isArray(data)) {
    let result = [];

    for (const item of data) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        // Primitive value or nested array – process recursively
        result.push(applyPatchesDeep(item));
      } else if ('index' in item) {
        const index = item.index;
        // Ensure enough space in the array
        while (result.length < index) result.push(null);

        const keys = Object.keys(item);
        const patch = { ...item };
        delete patch.index;

        if ('removed' in item) {
          result.splice(index, item.removed);
        } else if (keys.length === 1 && 'value' in item) {
          // Just {index, value} – insert value only
          result[index] = applyPatchesDeep(item.value)
        } else {
          // Multiple fields – insert object without index
          result[index] = deep(result[index], patch);

          result[index] = applyPatchesDeep(result[index])
        }
      } else {
        // Normal object – recurse
        result.push(applyPatchesDeep(item));
      }
    }

    return result;
  } else if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key in data) {
      result[key] = applyPatchesDeep(data[key]);
    }
    return result;
  }

  return data; // Primitive
}





