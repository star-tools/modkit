
import {applyPatchesDeep} from '../readers/mod-reader.js';
import {deep, isNumeric } from '../lib/util.js';
import Eval from '../lib/expr-eval.js';
import { EUnitAttribute, EUnitVital ,C_NAMESPACES} from '../schema/catalog-enums.js';

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
