
import { EUnitAttribute, EUnitVital ,EGameCatalog} from '../schema/catalog-enums.js';
import SC2JSON from '../converter/scjson.js';
import {SCSchema} from "../schema/all.js"
import Eval from '../lib/expr-eval.js';

export const cns = EGameCatalog.enum.reduce((acc, name) => {acc[name] = "EClassIdC" + name; return acc;}, {});

//make class - namespace associations out of GameCatalog Enum
export const C_NAMESPACES = {}
for(let ns in cns) for(let cn of SCSchema.enums[cns[ns]].enum) C_NAMESPACES[cn] = ns

const mathParser = new Eval.Parser();

export class SCMod {
  constructor(options){
    Object.assign(this,options)
  }

  static fromJSON(data){
    return new SCMod(data)
  }

  _calculate_parents(entity) {
    let data = entity.data, id = data.id, tag = data.class, pid = data.parent
    let parent = this.cache[id ? C_NAMESPACES[tag] : "defaults"][pid || id || tag]
    if(parent){
      entity.parents = [...parent.parents, parent]
      return entity.parents
    }
    else if(pid){
      console.warn(`parent ${pid} not found`)
    }
    entity.parents = []
    return entity.parents
  }

  _make_cache(){
    this.cache = {defaults: {}}
    let cache = this.cache

    if(this.dependencies){
      for(let dependency of  this.dependencies){
        deep(cache,dependency.cache)
      }
    }
    
    for(let catalog of this.catalogs){
      if(catalog.Data){
        for(let data of catalog.Data){
          let id = data.id, tag = data.class
          let entity = {
            data,
            mod: this,
            namespace: C_NAMESPACES[tag]
          }
          let namespace = id ? C_NAMESPACES[tag] : "defaults"
          if(!cache[namespace]){ cache[namespace] = {} }
          this._calculate_parents(entity)
          cache[namespace][id || tag] = entity
        }
      }
    }

    this.cache.String = {}
    for(let cid in this.strings){
      let catalog = this.strings[cid]
      for(let key in catalog){
        this.cache.String[key] = {
          data: catalog[key]
        }
      }
    }
  }

//recoursive resolving of tokens. 
  _calculate_value_tokens(val,entity){
    return val.replace(/##(\w+)##/g,(_,token) =>  {
      let lookup = entity || obj
      while(lookup){
        if(lookup.data[token]){
          return this._calculate_value_tokens(lookup.data[token],entity)
        }
        let tookenDefinition = lookup.data.token?.find(t => t.id === token)
        if(tookenDefinition){
          return this._calculate_value_tokens(tookenDefinition.value,entity)
        }
        lookup = lookup.parents?.[lookup.parents.length - 1]
      }
      return _
    })
  }

  //recoursive resolving of all tokens in object
  _calculate_object_tokens(obj,entity){
    deepReplaceMatch(obj, val => val && val.constructor === String && val.includes("##"), null, ({val, obj, prop, id, trace}) => {
      obj[prop] = this._calculate_value_tokens(val,entity)
    })
  }

  _calculate_value(entity,field){
    let resolved
    let parents = entity.parents
    for(let parent of [...parents,entity]) {
      let pvalue = parent.data[field]
      if(pvalue && pvalue.constructor !== Array && pvalue.constructor !== Object){
        pvalue = {value: pvalue}
      }
      if(pvalue && !resolved){
        resolved = pvalue.constructor === Array? [] : {}
      }
      if(pvalue){
        deep(resolved,pvalue)
      }
    }
    if(!resolved){
      console.warn("no value found " + field)
      return ' ';
    }


    let patched = applyPatchesDeep(resolved)
    this._calculate_object_tokens(patched)

    
    if(Object.keys(patched === 1) && 'value' in patched)patched = patched.value
    return patched
  }

  calculateStrings (locale){
    if(!this.cache)this._make_cache()
    let cs = this.cache.String
    for(let cid in this.strings){
      let catalog = this.strings[cid]
      for(let key in catalog){
        let uselocale = locale
        if(catalog[key][locale] === undefined) {
          console.log(`missing string localisation ${key} in locale ${locale}`)
          let keys = Object.keys(catalog[key])
          uselocale = "enus" in keys ? catalog[key].enus : keys[0]
        }

        cs[key].calculated = catalog[key][uselocale].replace(/\/\/\/.*/,"").trim()
      }
    }

    for(let key in cs){
      if(cs[key].calculated.includes('<') && /<[ncsd/]/.test(cs[key])){
        cs[key].calculated = this._calculate_string(cs[key].calculated,[key])
      }
    }
  }

//Replace expressions from string <d ref="Behavior,ZerglingArmorShredTarget,Duration" precision="2"/> to calculated values
  _calculate_string (expresion,trace = []){
    if(!expresion) return ""
    return expresion
      .replace(/<c val="([\w#]+)">/g,(_,value)=> {
          let color
          switch(value){
              case "#ColorAttackInfo":
                  color = "#ffff8a"
                  break;
              default:
                  color = '#' + value
          }
          return `<span style="color: ${color}">`
      })
      .replace(/<s val="(\w+)">/g,`<span class="style-$1">`)
      .replace(/<\/n>/g,"<br/>")
      .replace(/<n\/>/g,"<br/>")
      .replace(/<\/c>/g,"</span>")
      .replace(/<\/s>/g,"</span>")
      .replace(/<d\s+(?:stringref)="(\w+),([\w@]+),(\w+)"\s*\/>/g, (_,namespace,entityid,field)=>{
          let value = this.cache.String[[namespace,field,entityid].join("/")].calculated
          return `<b>${value}</b>`
      })
      .replace(/<d\s+(?:time|ref)\s*=\s*"(.+?)(?=")"((?:\s+\w+\s*=\s*"\s*([\d\w]+)?\s*")*)\s*\/>/gi, (_,ref,opts) => {
          let precision = /(?:\s+precision\s*=\s*"\s*(\d+)?\s*")/.exec(opts)?.[1]
          let value = this._calculate_expression_value(ref,trace)
          value = precision ?  value.toFixed(precision) : Math.round(value)
          return `<b>${value}</b>`
      })
  }

//calculates expression values `Behavior,ZerglingArmorShredTarget,Duration`
  _calculate_expression_value (expressionReference,trace){
    let ref = expressionReference.replace(/\[d\s+(?:time|ref)\s*=\s*'(.+?)(?=')'((?:\s+\w+\s*=\s*'\s*([\d\w]+)?\s*')*)\s*\/?\]/gi, (_,ref,opts) => {
        let precision = /(?:\s+precision\s*=\s*"\s*(\d+)?\s*")/.exec(opts)?.[1]
        let value = this._calculate_expression_value(ref,trace)
        return precision ?  value.toFixed(precision) : Math.round(value)
    })

    ref = ref.replace(/<n\/>/g,"")

    ref = ref.replace(/\$(.+?)\$/g,(_,cc)=>{
        let options = cc.split(':')
        switch(options[0]){
            case 'AbilChargeCount':
                let [abilityid,index] = options[1].split(",")
                let ability = this.cache.Abil?.[abilityid]
                if(!ability){
                    console.warn(`Entity not found:  abil.${abilityid} (${trace.join(".")})`)
                    return '0'
                }

                let refIndex = "Train" + (index+ 1)
                let refInfo = ability.data.InfoArray[refIndex]
                if(!refInfo){
                    console.warn(`Wrong Ability InfoArray index:  abil.${ability}.${refIndex} (${trace.join(".")})`)
                }
                return ` ${ability.data.Charge?.CountStart || 0} `

            case 'UpgradeEffectArrayValue':
                let upgradeid = options[1]
                let effectArrayValue = options[2]

                let upgrade = this.cache.Upgrade?.[upgradeid]
                if(!upgrade){
                  console.warn("wrong upgrade reference " + upgradeid)
                  return ' 0 '
                }
                let val = this._calculate_value(upgrade,"EffectArray")
                let refValue = val.find(eff => eff.Reference === effectArrayValue)?.Value
                return refValue ? ' ' + refValue + ' ' : ' 0 '
        }
        return '0'
    })

    ref = ref.replace(/((\w+),([\w@]+),(\w+[\.\w\[\]]*))/g,(_,expr)=>{
        let refValue = this._calculate_reference_value(expr,trace)
        return refValue ? ' ' + refValue + ' ' : ' 0 '
    })

    let result
    if(ref === 'TimeOfDay'){
        result = 'TimeOfDay'
    }
    else{
      if(isNumeric(ref)){
        result = +ref
      }
      else{
        try{
          const expr = mathParser.parse(ref);
          result = expr.evaluate()
        }
        catch(e){
          console.log(`wrong Expression: ${expressionReference}   (${trace.join(".")})`)
          result = 0
        }
      }

    }
    return result
  }

  //retrieve data reference value
  _calculate_reference_value(expr,trace){
    let [namespace,entityid,field] = expr.split(",")
    let entity = this.cache[namespace]?.[entityid]

    if(!entity){
      console.warn('Entity not found:  ' + namespace + '.' + entityid + " (" + trace.join(".") + ")")
      return ''
    }

    try{
      let crumbs = field.replace(/\[/g,'.').replace(/]/g,'.').split(/[.\[\]]/)
      for(let i = crumbs.length - 1; i>=0; i--){
        if(crumbs[i] === '') {
          crumbs.splice(i,1)
        }
      }

      let val = this._calculate_value(entity,crumbs[0])
      crumbs.shift()
      for(let crumb of crumbs){
        if(crumb === '0' && val.constructor !== Object && val.constructor !== Array){

        }
        else if(isNumeric(crumb) && val.constructor === Object && val[crumb] === undefined){
          //todo possible to check enum type using schema
          let consts = {
            Vital: EUnitVital.enum,
            AttributeBonus: EUnitAttribute.enum
          }
          for(let constCat in consts){
            if(val[consts[constCat][crumb]]){
              val = val[consts[constCat][crumb]]
              break;
            }
          }
        }
        else{
          val = val[crumb]
        }
        if(val === undefined){
          console.warn('Value is undefined:  '  + expr + " (" + trace.join(".") + ")")
          return ''
        }
      }
      val = val.value || val
      return +val
    }
    catch(e){
      console.warn('Wrong Expression: '  + e + " (" + trace.join(".") + ")")
      return ''
    }
  }


  //associate actors with each uni
  resolveUnitsActors(){
    if(!this.cache)this._make_cache()
    for(let actorid in this.cache.Actor) {
      let actor = this.cache.Actor[actorid]
      let data = data.data
      if(data.default) continue
      if(![ "CActorUnit", "CActorMissile"].includes(data.class)) continue
      let entityOn = this._calculate_value(actor,"On")
      // let eventsResolved = [...parents.map(p => p.On),data.On].filter(Boolean).flat()
      let creationEvents = entityOn
        .filter(e => e.Send === 'Create')
        .map(e => e.Terms.split('.'))
        .filter(e => e[0] === 'UnitBirth')
        .map(e => e[1])
      if(!creationEvents.length)continue;
      this._calculate_object_tokens(creationEvents,actor)
      for(let unitid of creationEvents){
        let unit = this.cache.Unit[unitid]
        if(unit){
          if(unit.actor){
            console.warn("multiple actor insame scope: " + unitid)
          }
          unit.actor = actor
        }
      }
        // if(!entity.UnitIcon && ! entity.Wireframe?.Image?.[0]){
        //     continue;
        // } 
    }
  }

  resolveUnitUpgrades (){
      let affectingUpgrades = this.cache.Upgrade
          .map(u => u.$$resolved)
          .filter(u => u.AffectedUnitArray?.includes(this.id))
          .map(u => ({
              ...u,
              Link: u.id,
              id: null,
              EffectArray: u.EffectArray?.filter(e => e.Reference)
                  // ?.filter(e => e.Reference?.split(',')[1] === unit.id)
                  .map(e => ({
                      Operation: e.Operation,
                      Value: e.Value,
                      Catalog: e.Reference.split(',')[0],
                      Entity: e.Reference.split(',')[1],
                      Property: e.Reference.split(',')[2]
                  }))
                  .filter(e => !e.Property.includes("Icon"))
          }))

      if(affectingUpgrades){
          affectingUpgrades
      }

          // .map(entry => ({...entry, ...mod._quickInfo(mod.cache.upgrade[entry.Link])}))
          // .filter(u => u.Icon)

          //data collections
      return {affectingUpgrades}
  }

    resolveButtons (){
        let modified = false
        let unitData = this.$$resolved
        if(unitData.AbilArray){
            //let test = this.$mod.cache.button[this.$mod.cache.abil[this.$$resolved.AbilArray[3].Link].$$resolved.InfoArray.Build1.Button.DefaultButtonFace]
            for(let abilArrayItem of unitData.AbilArray){
                let abilData = this.$mod.cache.abil[abilArrayItem.Link]?.$$resolved
                if(abilData?.InfoArray){
                    for(let index in abilData.InfoArray){
                        let info = abilData.InfoArray[index]
                        let buttonData = info.Button?.Flags?.CreateDefaultButton && info.Button.DefaultButtonFace && this.$mod.cache.button[info.Button.DefaultButtonFace]?.$$resolved

                            if(buttonData){//UseDefaultButton

                            let cardId = buttonData.DefaultButtonLayout?.CardId || abilData.DefaultButtonCardId || null
                            let row = buttonData.DefaultButtonLayout?.Row || 0
                            let column = buttonData.DefaultButtonLayout?.Column || 0

                            // if(!cardId){
                            //     continue;
                            // }

                            if(!this.CardLayouts){
                                this.CardLayouts = []
                            }
                            let cardLayout = cardId ? this.CardLayouts.find(layout => layout.CardId === cardId) : this.CardLayouts.find(layout => +layout.index === 0)
                            if(!cardLayout){
                                if(cardId){
                                    cardLayout = {cardId}
                                }
                                else{
                                    cardLayout = {index: "0"}
                                }
                                this.CardLayouts.push(cardLayout)
                            }

                            if(!cardLayout.LayoutButtons){
                                cardLayout.LayoutButtons = []
                            }

                            cardLayout.LayoutButtons.push({
                                "Face": buttonData.id,
                                "Type": "AbilCmd",
                                "AbilCmd": `${abilData.id},${index}`,
                                "Row": row,
                                "Column": column
                            })

                            modified = true;
                        }
                    }
                }
            }
        }

        if(modified){
            delete this.__resolved
            delete this.__data
        }

    }

    getRequirements (detailed){

        let mod = this.$mod
        if(!mod.catalogs.abilcmd){
            //make list of available ability cmmands
            mod.makeAbilCmds()
        }

        let abilCmds = mod.catalogs.abilcmd.filter(entry => {
            let abil = mod.cache.abil[entry.abil].$$resolved;
            let unit = abil.InfoArray[entry.cmd]?.Unit
            if(!unit)return false;
            if(unit.constructor !== Array)    unit = [unit]
            return unit.includes(this.id)
        })


        let abilCmdsIds = abilCmds.map(abilcmd => abilcmd.id)

        let requirements = abilCmds.map(entry => mod.cache.abil[entry.abil].$$resolved.InfoArray[entry.cmd].Button?.Requirements).filter(Boolean)
            .map(req => req.$$resolved)
            .map(req => mod.cache.requirement[req]?.$$resolved).filter(Boolean)
            .map(req => req.NodeArray.Use?.Link || req.NodeArray.Show?.Link).filter(Boolean)
            .map(reqNode => mod.cache.requirementnode[reqNode].$$resolved).filter(Boolean)

        let reqUnitsAliases = requirements.filter(req => req.class === 'CRequirementCountUnit').map(req => req.Count?.Link).filter(Boolean)
        let reqUpgradeAliases = requirements.filter(req => req.class === 'CRequirementCountUpgrade').map(req => req.Count?.Link).filter(Boolean)

        let requiredUnits = mod.catalogs.unit.filter(entry => reqUnitsAliases.includes(entry.$$resolved.TechAliasArray) || reqUnitsAliases.includes(entry.id) ).map(unit => unit.id)
        let requiredUpgrades = mod.catalogs.upgrade.filter(entry => reqUpgradeAliases.includes(entry.$$resolved.TechAliasArray) || reqUpgradeAliases.includes(entry.id) ).map(unit => unit.id)

        let producingUnits = mod.catalogs.unit.filter(entry => entry.$$resolved.CardLayouts?.find(card => {
            if(card.LayoutButtons){
                for(let button of card.LayoutButtons) {
                    if (button.AbilCmd && abilCmdsIds.includes(button.AbilCmd)) {
                        return true
                    }
                }
            }
            return false
        })).map(unit => unit.id)

        return {abilcmds: abilCmdsIds,units: requiredUnits,upgrades: requiredUpgrades,producers: producingUnits}
    }


  setEntitiesRelations (){
      if(!mod.cache)mod._make_cache();

      for(let cache in mod.cache){
          for(let id in mod.cache[cache]){
              let entity = mod.cache[cache][id]

              let refs =  relations(entity.data,getSchema(entity.data.class),C_NAMESPACES[entity.data.class]+ "." + entity.data.id)
              
              for(let ref of refs){
                  let target = mod.cache[ref.type]?.[ref.value]
                  if(target){
                      if(!target.relations)target.relations = []
                      target.relations.push(ref)
                  }else{
                      console.log(`reference ${ref.target} not found`)
                  }
              }
              
              entity.references = refs.map(ref=> ({origin: ref.trace, target: ref.type + "." + ref.value}))

          }
      }
  }

}

export function deep(a,b,c = 'merge'){
    if(!a){return b}
    if(!b){return a}
    for(let i in b){
        let value = b[i]
        let target = a[i]

        if(value === undefined || value === null)continue;

        if(value.constructor === Array){
            value = deep([],value)
        }
        else if(value.constructor === Object){
            value = deep({},value)
        }


        if(!target){
            a[i] = value
        }
        else{
            if(value.constructor === String || value.constructor !== target.constructor){
                target = value
            }
            else if(target && target.constructor === Array && c === 'replace') {
                target = value
            }
            else if(target && target.constructor === Array && c === 'unite') {
                deep(target,value,c)
            }
            else if(target && target.constructor === Array && c === 'merge') {
                target = [...target,...value]
            }
            else if(target && target.constructor === Object){
                deep(target,value,c)
            }
            else {
                target = value
            }
            a[i] = target
        }
    }
    return a
}

export function deepReplaceMatch(obj, testVal, testProp, cb, id, _path = [], _pathids = []) {
    const keys = Object.keys(obj)
    for (let i = 0, len = keys.length; i < len; i++) {
        let prop = keys[i], val = obj[prop]
        let path = [..._path, obj]
        let crumbs = [..._pathids, prop]
        if ((!testVal || testVal(val)) && (!testProp || testProp(prop))){
            let result = cb({val, value: val,property: prop, object: obj, prop, obj, id, path,crumbs})
            if(result !== undefined) {
                obj[prop] = result;
                val = result;
            }
        }
        if (val && typeof val === 'object'){
            deepReplaceMatch(val, testVal, testProp, cb, prop, path,crumbs)
        }
    }
}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function parseLines(rawtext){
    if (!rawtext) {
        return null
    }
    return rawtext
        .replace("﻿","")  //Zero Width No-Break Space
        .replace(/\r/g, "")
        .split("\n")
}

export function parseIni(iniText) {
  const result = {};
  let currentSection = null;

  const lines = iniText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')) continue;

    const sectionMatch = trimmed.match(/^\[(.+?)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      result[currentSection] = [];
    } else if (currentSection) {
      result[currentSection].push(trimmed);
    }
  }

  return result;
}

export function serializeIni(data) {
  let output = '';

  for (const section in data) {
    output += `[${section}]\n`;
    const lines = data[section];
    for (const line of lines) {
      output += `${line}\n`;
    }
    output += `\n`; // optional: add a blank line between sections
  }

  return output.trimEnd(); // remove trailing newlines
}

export function parseEnv(rawtext){
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
        return data
}

export const TEXT_FILES = ["gamehotkeys", "gamestrings", "objectstrings", "triggerstrings", "conversationstrings"]

export const DATA_FILES = EGameCatalog.enum

export async function readModData(reader, modName, options = {}){

    let scope = Object.assign({
        catalogs: true,
        strings: true,
        locales: true,
        components: true,
        binary: true,
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
        for(let catalog of result.catalogs){
          catalog.mod = modName
        }
    }
    if(scope.layouts){
        let allLayouts = result.descindex?.Include?.map(i => i.path) || []
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
  let debug = options.debugger

  debug?.start("read")
  let merged = {};
  for(let mod of mods){
    let modData = await readModData(reader,mod,options);
    deep(merged,modData)
  }
  debug?.finish("read")


  debug?.start("merge")
  if(merged.catalogs){

    let outputCatalogs = {}
    let structCatalog = []
    let constCatalog = []
    let entities = 0
    for(let catalog of merged.catalogs){
      if(catalog.Data)
        for(let entity of catalog.Data){
          let namespace = C_NAMESPACES[entity.class]
          if(!outputCatalogs[namespace])outputCatalogs[namespace] = []
          outputCatalogs[namespace].push(entity)
          entities++
        }
      if(catalog.Struct)
        for(let entity of catalog.Struct){
          structCatalog.push(entity)
        }
      if(catalog.const)
        for(let entity of catalog.const){
          constCatalog.push(entity)
        }
    }

    merged.catalogs = []
      if(constCatalog.length){
        merged.catalogs.push({ path: "GameData/ConstData.xml", const: constCatalog})
      }
      if(structCatalog.length){
        merged.catalogs.push({ path: "GameData/StructData.xml", Struct: structCatalog})
      }

      merged.catalogs.push(...Object.entries(outputCatalogs).map(([name,data]) => ({
        path: "GameData/" + name + "Data.xml",
        Data: data
      })))
  }
  debug?.finish("merge")
  return merged
}

export function addDocInfo(mod,text,locale){
  // for(let locale in mod.locales){
      mod.strings.Game["DocInfo/Website"][locale] = text.Website
      mod.strings.Game["DocInfo/Name"][locale]  = text.Name
      if(text.DescLong){
          mod.strings.Game["DocInfo/DescLong"][locale]  = `${text.DescLong}${text.Signature || ''}`
      }
      if(text.DescShort){
          mod.strings.Game["DocInfo/DescShort"][locale]  = text.DescShort
      }
  // }
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


function relations(value, schema, trace = "") {
    if(!schema)return []
    let result = []
    if(schema.constructor === Object){
        for (let attribute in value) {
            if(["index",'class', "removed" ,'id','default'].includes(attribute))continue
            let subschema = (attribute === "parent") ? schema : schema[attribute];
    
            schema[attribute] && result.push(...relations(value[attribute], subschema, trace + "." + attribute))
        }
    }
    else if(schema.constructor === Array){
        for(let index in value){
            result.push(...relations(value[index], schema[0], trace + "." + index))
        }
    }
    else{
        schema.relations && result.push(...schema.relations(value, trace))
    }
    return result
}

//calculate all values of the entity
// function calculateValues(entity){
//   let resolved = {}
//   let parents = parentsMap.get(entity)
//   for(let item of parents) deep(resolved,item)
//   deep(resolved,entity)
//   resolved.default = entity.default
//   if(!resolved.default)delete resolved.default
//   resolved.comment = entity.comment
//   if(!resolved.comment)delete resolved.comment
//   delete resolved.parent
//   // delete resolved.parents
//   delete resolved.actor
//   let resolvedPatched = applyPatchesDeep(resolved)
//   this._calculate_object_tokens(resolvedPatched)
//   return resolvedPatched
// }
