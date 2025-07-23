import { EUnitAttribute, EUnitVital } from './types/enums.js';
import Eval from './lib/eval.js';
import { objectsDeepMerge, applyArrayPatches, objectDeepTransform, cloneValue } from './util/obj-util.js';
import { isNumeric } from './util/js-util.js';
import SC2DataClasses from './schema/SC2DataClasses.js';
import { C_NAMESPACES, GAME_LOCALES } from './types/shared.js';
import { CatalogEntities } from './schema/SC2Catalog.js';
import { relations } from './util/schema.js';

/**
 * SC2Mod represents a StarCraft 2 mod data container and processor.
 * 
 * It loads and manages mod catalogs, dependencies, string localizations,
 * and supports recursive data resolution, token calculations, and relations.
 * 
 * Typical usage:
 * ```js
 * import SC2Mod from './sc2mod.js';
 * 
 * // Create a new SC2Mod instance with initial data or options
 * const mod = new SC2Mod({ catalogs: [...], strings: {...}, dependencies: [...] });
 * 
 * // resolve relations
 * mod.setEntitiesRelations();
 * 
 * // Calculate localized strings for a given locale
 * mod.calculateStrings('enus');
 * 
 * // Resolve actor associations for units
 * mod.resolveUnitsActors();
 * 
 * // Calculate all resolved values for an entity
 * const entity = mod.cache.Unit['SomeUnitId'];
 * const resolvedValues = mod.calculateAllValues(entity);
 * 
 * // Access requirements for an entity
 * const requirements = entity.getRequirements();
 * 
 * // Merge another mod's data into this one
 * mod.merge(anotherMod);
 * 
 * // Create SC2Mod instance from JSON data
 * const modFromJson = SC2Mod.fromJSON(jsonData);
 * ```
 * 
 * @class
 */



export default class SC2Mod {
  constructor(options = {}) {
    Object.assign(this, options);
  }

  /**
   * Calculates parent entities of the given entity and caches them.
   * @param {object} entity
   * @returns {Array} Array of parent entities
   */
  _calculate_parents(entity) {
    const { data } = entity;
    const id = data.id;
    const tag = data.class;
    const pid = data.parent;
    const parent = this.cache[id ? C_NAMESPACES[tag] : 'Classes']?.[pid || id || tag];

    if (parent) {
      entity.parents = [...parent.parents, parent];
      return entity.parents;
    } else if (pid) {
      console.warn(`Parent ${pid} not found`);
    }
    entity.parents = [];
    return entity.parents;
  }

  /**
   * Builds the cache of entities from catalogs and dependencies.
   */
  makeCache() {
    this.cache = { Classes: {} };
    const cache = this.cache;

    if (this.dependencies) {
      for (const dependency of this.dependencies) {
      if(!dependency.cache)dependency.makeCache()
        for (const cacheName in dependency.cache) {
          if(!this.cache[cacheName])this.cache[cacheName] = {}
          for (const cacheKey in dependency.cache[cacheName]) {
            this.cache[cacheName][cacheKey] = dependency.cache[cacheName][cacheKey] 
          }
        }
      }
    }

    //works with catalogs
    if(this.data.catalogs){
      for (const catalog of this.data.catalogs) {
        if (catalog.data) {
          for (const data of catalog.data) {
            const id = data.id;
            const tag = data.class;
            let namespace;
            if(tag[0]==="C") namespace =   id ? C_NAMESPACES[tag] : 'Classes';
            if(tag[0]==="S") namespace =   "Structures"
            if(tag==="const") namespace =  "Const"
            const entity = {
              data,
              mod: this,
              namespace
            }
            if(id){
              entity.id = id
            }

            if (!cache[namespace]) cache[namespace] = {};
            this._calculate_parents(entity);
            cache[namespace][id || tag] = entity;
          }
        }
      }
    }

    this.cache.String = {};
    for (const cid in this.data.strings) {
      const catalog = this.data.strings[cid];
      for (const key in catalog) {
        this.cache.String[key] = { data: catalog[key] };
      }
    }
  }

  /**
   * Recursively resolve tokens in string values.
   * @param {string} val 
   * @param {object} entity
   * @returns {string}
   */
  _calculate_value_tokens(val, entity) {
    if(!val)return null
    return val.replace(/##(\w+)##/g, (_, token) => {
      let lookup = entity;
      while (lookup) {
        if (lookup.calculated[token]) {
          return this._calculate_value_tokens(lookup.calculated[token], entity);
        }
        const tokenDef = lookup.calculated.token?.find(t => t.id === token);
        if (tokenDef) {
          return this._calculate_value_tokens(tokenDef.value, entity);
        }
        lookup = lookup.parents?.[lookup.parents.length - 1];
      }
      return _;
    });
  }

  /**
   * Recursively resolves all tokens in an object.
   * @param {object} obj 
   * @param {object} entity 
   */
  _calculate_object_tokens(obj, entity) {
    objectDeepTransform(
      obj,
      val => typeof val === 'string' && val.includes('##'),
      null,
      (key, value, obj) => {
        obj[key] = this._calculate_value_tokens(value, entity);
      }
    );
  }

  /**
   * Calculates a value for a given entity and field, merging parent values.
   * @param {object} entity 
   * @param {string} field 
   */
  _calculate_value(entity, field) {
    if(entity.calculated?.field !== undefined){
      return entity.calculated?.field
    }
    let resolved;
    const parents = entity.parents;

    //todo deafult values can have parents too... 
    let defaultClassValue = this.cache.Classes[entity.data.class]
    const defaultValue = defaultClassValue ? [defaultClassValue] : []
    for (const parent of [...defaultValue, ...parents, entity]) {
      let pvalue = parent.data[field];
      if (pvalue && !(Array.isArray(pvalue) || typeof pvalue === 'object')) {
        pvalue = { value: pvalue };
      }
      if (pvalue && !resolved) {
        resolved = Array.isArray(pvalue) ? [] : {};
      }
      if (pvalue) {
        if(Array.isArray(resolved)){
          resolved.push(...pvalue)
        }
        else{
          objectsDeepMerge(resolved, pvalue);
        }
      }
    }

    if (!resolved) {
      // console.warn('No value found for field:', field);
      return null;
    }

    const patched = applyArrayPatches(resolved);
    this._calculate_object_tokens(patched,entity);

    if (Object.keys(patched).length === 1 && 'value' in patched) {
      return patched.value;
    }
    
    return patched;
  }

  /**
   * Calculate localized strings for the mod.
   * @param {string} locale 
   */
  calculateStrings(locale) {
    if (!this.cache) this.makeCache();

    const cs = this.cache.String;
    for (const cid in this.data.strings) {
      const catalog = this.data.strings[cid];
      for (const key in catalog) {
        let useLocale = locale;
        if (catalog[key][locale] === undefined) {
          console.log(`Missing string localization ${key} in locale ${locale}`);
          const keys = Object.keys(catalog[key]);
          useLocale = keys.includes('enUS') ? 'enUS' : keys[0];
        }
        cs[key].calculated = catalog[key][useLocale].replace(/\/\/\/.*/, '').trim();
      }
    }

    for (const key in cs) {
      if (cs[key].calculated.includes('<') && /<[ncsd/]/.test(cs[key])) {
        if (!cs[key].calculated) {
          cs[key].calculated = {};
        }
        cs[key].calculated[locale] = this._calculate_string(cs[key].calculated, [key]);
      }
    }
  }

  /**
   * Replaces expressions in strings with calculated values.
   * @param {string} expression 
   * @param {Array<string>} trace 
   * @returns {string}
   */
  _calculate_string(expression, trace = []) {
    if (!expression) return '';

    return expression
      .replace(/<c val="([\w#]+)">/g, (_, value) => {
        let color = value === '#ColorAttackInfo' ? '#ffff8a' : '#' + value;
        return `<span style="color: ${color}">`;
      })
      .replace(/<s val="(\w+)">/g, `<span class="style-$1">`)
      .replace(/<\/n>/g, '<br/>')
      .replace(/<n\/>/g, '<br/>')
      .replace(/<\/c>/g, '</span>')
      .replace(/<\/s>/g, '</span>')
      .replace(/<d\s+(?:stringref)="(\w+),([\w@]+),(\w+)"\s*\/>/g, (_, ns, entityId, field) => {
        const val = this.cache.String[[ns, field, entityId].join('/')].calculated;
        return `<b>${val}</b>`;
      })
      .replace(/<d\s+(?:time|ref)\s*=\s*"(.+?)"((?:\s+\w+\s*=\s*"\s*([\d\w]+)?\s*")*)\s*\/>/gi, (_, ref, opts) => {
        const precision = /(?:\s+precision\s*=\s*"\s*(\d+)?\s*")/.exec(opts)?.[1];
        let value = this._calculate_expression_value(ref, trace);
        value = precision ? value.toFixed(+precision) : Math.round(value);
        return `<b>${value}</b>`;
      });
  }

  /**
   * Calculates a numeric value from an expression reference.
   * @param {string} expressionReference 
   * @param {Array<string>} trace 
   * @returns {number|string}
   */
  _calculate_expression_value(expressionReference, trace) {
    // Support nested [d time/ref='...'] expressions
    let ref = expressionReference.replace(
      /\[d\s+(?:time|ref)\s*=\s*'(.+?)'((?:\s+\w+\s*=\s*'\s*([\d\w]+)?\s*')*)\s*\/?\]/gi,
      (_, ref, opts) => {
        const precision = /(?:\s+precision\s*=\s*"\s*(\d+)?\s*")/.exec(opts)?.[1];
        const value = this._calculate_expression_value(ref, trace);
        return precision ? value.toFixed(+precision) : Math.round(value);
      }
    );

    ref = ref.replace(/<n\/>/g, '');

    ref = ref.replace(/\$(.+?)\$/g, (_, cc) => {
      const options = cc.split(':');
      switch (options[0]) {
        case 'AbilChargeCount': {
          const [abilityId, indexStr] = options[1].split(',');
          const ability = this.cache.Abil?.[abilityId];
          if (!ability) {
            console.warn(`Entity not found: abil.${abilityId} (${trace.join('.')})`);
            return '0';
          }
          const refIndex = 'Train' + (parseInt(indexStr) + 1);
          const refInfo = ability.data.InfoArray[refIndex];
          if (!refInfo) {
            console.warn(`Wrong Ability InfoArray index: abil.${ability}.${refIndex} (${trace.join('.')})`);
          }
          return ` ${ability.data.Charge?.CountStart || 0} `;
        }
        case 'UpgradeEffectArrayValue': {
          const upgradeId = options[1];
          const effectArrayValue = options[2];
          const upgrade = this.cache.Upgrade?.[upgradeId];
          if (!upgrade) {
            console.warn('Wrong upgrade reference ' + upgradeId);
            return ' 0 ';
          }
          const val = this._calculate_value(upgrade, 'EffectArray');
          const refValue = val.find(eff => eff.Reference === effectArrayValue)?.Value;
          return refValue ? ' ' + refValue + ' ' : ' 0 ';
        }
        default:
          return '0';
      }
    });

    ref = ref.replace(/((\w+),([\w@]+),(\w+[\.\w\[\]]*))/g, (_, expr) => {
      const refValue = this._calculate_reference_value(expr, trace);
      return refValue ? ' ' + refValue + ' ' : ' 0 ';
    });

    let result;
    if (ref === 'TimeOfDay') {
      result = 'TimeOfDay';
    } else if (isNumeric(ref)) {
      result = +ref;
    } else {
      try {
        const mathParser = new Eval.Parser();
        const expr = mathParser.parse(ref);
        result = expr.evaluate();
      } catch (e) {
        console.log(`Wrong Expression: ${expressionReference}   (${trace.join('.')})`);
        result = 0;
      }
    }
    return result;
  }

  /**
   * Retrieves a value by resolving a data reference expression.
   * @param {string} expr 
   * @param {Array<string>} trace 
   * @returns {number|string}
   */
  _calculate_reference_value(expr, trace) {
    const [namespace, entityId, field] = expr.split(',');
    const entity = this.cache[namespace]?.[entityId];
    if (!entity) {
      console.warn(`Entity not found: ${namespace}.${entityId} (${trace.join('.')})`);
      return '';
    }

    try {
      const crumbs = field.replace(/\[/g, '.').replace(/]/g, '.').split(/[.\[\]]/).filter(Boolean);
      let val = this._calculate_value(entity, crumbs[0]);
      crumbs.shift();

      for (const crumb of crumbs) {
        if (crumb === '0' && typeof val !== 'object') {
          // noop
        } else if (isNumeric(crumb) && typeof val === 'object' && val[crumb] === undefined) {
          const consts = {
            Vital: EUnitVital.enum,
            AttributeBonus: EUnitAttribute.enum,
          };
          for (const constCat in consts) {
            if (val[consts[constCat][crumb]]) {
              val = val[consts[constCat][crumb]];
              break;
            }
          }
        } else {
          val = val[crumb];
        }
        if (val === undefined) {
          console.warn(`Value is undefined: ${expr} (${trace.join('.')})`);
          return '';
        }
      }
      return val.value ?? val;
    } catch (e) {
      console.warn(`Wrong Expression: ${e} (${trace.join('.')})`);
      return '';
    }
  }

  /**
   * Links actors to their units by matching creation events.
   */
  resolveUnitsActors() {
    if (!this.cache) this.makeCache();
    for (const actorId in this.cache.Actor) {
      const actor = this.cache.Actor[actorId];
      const data = actor.data;
      if (data.default) continue;
      if (!['CActorUnit', 'CActorMissile'].includes(data.class)) continue;
        const entityOn = this._calculate_value(actor, 'On');
        if(!entityOn)continue;
        if(entityOn.includes(null)){
        console.log(entityOn)
        }
        const creationEvents = entityOn
          .filter(e => e.Send === 'Create' && e.Terms)
          .map(e => e.Terms.split('.'))
          .filter(e => e[0] === 'UnitBirth')
          .map(e => e[1]);

      if (!creationEvents.length) continue;

      this._calculate_object_tokens(creationEvents, actor);

      for (const unitId of creationEvents) {
        const unit = this.cache.Unit[unitId];
        if (unit) {
          if (unit.actor) {
            console.warn(`Multiple actors in same scope: ${unitId}`);
          }
          unit.actor = actor
        }
      }
    }
  }

  /**
   * Resolves upgrades affecting this unit.
   * @returns {{affectingUpgrades: object[]}} 
   */
  resolveUnitUpgrades() {
    const affectingUpgrades = this.cache.Upgrade
      .map(u => u.$$resolved)
      .filter(u => u.AffectedUnitArray?.includes(this.id))
      .map(u => ({
        ...u,
        Link: u.id,
        id: null,
        EffectArray: u.EffectArray?.filter(e => e.Reference).map(e => ({
          Operation: e.Operation,
          Value: e.Value,
          Catalog: e.Reference.split(',')[0],
          Entity: e.Reference.split(',')[1],
          Property: e.Reference.split(',')[2],
        })).filter(e => !e.Property.includes('Icon')),
      }));

    return { affectingUpgrades };
  }

  /**
   * Resolves buttons for the unit.
   */
  resolveButtons() {
    let modified = false;
    const unitData = this.$$resolved;

    if (unitData?.AbilArray) {
      for (const abilArrayItem of unitData.AbilArray) {
        const abilData = this.$mod.cache.abil[abilArrayItem.Link]?.$$resolved;
        if (abilData?.InfoArray) {
          for (const index in abilData.InfoArray) {
            const info = abilData.InfoArray[index];
            const buttonData = info.Button?.Flags?.CreateDefaultButton && info.Button.DefaultButtonFace && this.$mod.cache.button[info.Button.DefaultButtonFace]?.$$resolved;

            if (buttonData) {
              const cardId = buttonData.DefaultButtonLayout?.CardId || abilData.DefaultButtonCardId || null;
              const row = buttonData.DefaultButtonLayout?.Row || 0;
              const column = buttonData.DefaultButtonLayout?.Column || 0;

              if (!this.CardLayouts) {
                this.CardLayouts = [];
              }

              let cardLayout = cardId
                ? this.CardLayouts.find(layout => layout.CardId === cardId)
                : this.CardLayouts.find(layout => +layout.index === 0);

              if (!cardLayout) {
                cardLayout = cardId ? { CardId: cardId } : { index: '0' };
                this.CardLayouts.push(cardLayout);
              }

              if (!cardLayout.LayoutButtons) {
                cardLayout.LayoutButtons = [];
              }

              cardLayout.LayoutButtons.push({
                Face: buttonData.id,
                Type: 'AbilCmd',
                AbilCmd: `${abilData.id},${index}`,
                Row: row,
                Column: column,
              });

              modified = true;
            }
          }
        }
      }
    }

    if (modified) {
      delete this.__resolved;
      delete this.__data;
    }
  }

  /**
   * Get requirements (abilities, units, upgrades, producers) related to this unit.
   * @param {boolean} detailed - If true, returns detailed requirements (not used in this snippet).
   * @returns {object} Object with arrays of ability commands, units, upgrades, producers.
   */
  getRequirements(detailed) {
    const mod = this.$mod;
    if (!mod.catalogs.abilcmd) {
      // Build ability commands list if missing
      mod.makeAbilCmds();
    }

    const abilCmds = mod.catalogs.abilcmd.filter(entry => {
      let abil = mod.cache.abil[entry.abil]?.$$resolved;
      let unit = abil?.InfoArray[entry.cmd]?.Unit;
      if (!unit) return false;
      if (!Array.isArray(unit)) unit = [unit];
      return unit.includes(this.id);
    });

    const abilCmdsIds = abilCmds.map(abilcmd => abilcmd.id);

    const requirements = abilCmds
      .map(entry => mod.cache.abil[entry.abil].$$resolved.InfoArray[entry.cmd].Button?.Requirements)
      .filter(Boolean)
      .map(req => req.$$resolved)
      .map(req => mod.cache.requirement[req]?.$$resolved)
      .filter(Boolean)
      .map(req => req.NodeArray.Use?.Link || req.NodeArray.Show?.Link)
      .filter(Boolean)
      .map(reqNode => mod.cache.requirementnode[reqNode].$$resolved)
      .filter(Boolean);

    const reqUnitsAliases = requirements
      .filter(req => req.class === 'CRequirementCountUnit')
      .map(req => req.Count?.Link)
      .filter(Boolean);

    const reqUpgradeAliases = requirements
      .filter(req => req.class === 'CRequirementCountUpgrade')
      .map(req => req.Count?.Link)
      .filter(Boolean);

    const requiredUnits = mod.catalogs.unit
      .filter(entry => reqUnitsAliases.includes(entry.$$resolved.TechAliasArray) || reqUnitsAliases.includes(entry.id))
      .map(unit => unit.id);

    const requiredUpgrades = mod.catalogs.upgrade
      .filter(entry => reqUpgradeAliases.includes(entry.$$resolved.TechAliasArray) || reqUpgradeAliases.includes(entry.id))
      .map(upgrade => upgrade.id);

    const producingUnits = mod.catalogs.unit
      .filter(entry =>
        entry.$$resolved.CardLayouts?.some(card =>
          card.LayoutButtons?.some(button => button.AbilCmd && abilCmdsIds.includes(button.AbilCmd))
        )
      )
      .map(unit => unit.id);

    return {
      abilcmds: abilCmdsIds,
      units: requiredUnits,
      upgrades: requiredUpgrades,
      producers: producingUnits,
    };
  }

  _calculate_entity_relations(entity,callback, deepTrace){
    //use calculated values
    let refs = relations(entity.calculated, CatalogEntities[entity.data.class], C_NAMESPACES[entity.data.class] + '.' + entity.data.id, callback , null, null, deepTrace);
    //filter empty values
    refs = refs.filter( r => r.value)
    for (const ref of refs) {
      //skip template values
      if(!ref.value.includes("##")){
        const target = this.cache[ref.type]?.[ref.value];
        if (target) {
          if (!target.relations) target.relations = [];
          target.relations.push(ref);
        } else {
          if(ref.type === "File"){
            continue;
          }
          // else{
          //   //console.log(`Reference ${ref.value} not found`);
          // }
        }
      }
    }

    entity.references = refs.map(ref => ({
      type: ref.schema,
      origin: ref.trace,
      target: `${ref.type}.${ref.value}`,
    }));
    return entity.references
  }
  /**
   * Sets up relations between entities based on schema references.
   */
  calculateEntitiesRelations() {
    if (!this.cache) this.makeCache();
    let refs = []

    for (const namespace in this.cache) {
      for (const id in this.cache[namespace]) {
        refs.push(...this._calculate_entity_relations(this.cache[namespace][id]))
      }
    }
    return refs
  }
  calculateEntityRelations(entity) {
    if (!this.cache) this.makeCache();
    return this._calculate_entity_relations(entity)
  }

  /**
   * Merge multiple catalogs into organized data structures.
   */
  buildCatalogs() {
    if (!this.data.catalogs) return;

    const outputCatalogs = {};
    let entities = 0;

    for (const catalog of this.data.catalogs) {
      if (catalog.data) {
        if (catalog.namespace === 'Includes'){
          for (const entity of catalog.data) {
            const namespace = C_NAMESPACES[entity.class];
            if(!namespace){
              namespace = "Other"
            }
            if (!outputCatalogs[namespace]) outputCatalogs[namespace] = [];
            outputCatalogs[namespace].push(entity);
            entities++;
          }
        }
        if (catalog.namespace) {
            if (!outputCatalogs[catalog.namespace]) outputCatalogs[catalog.namespace] = [];
            outputCatalogs[catalog.namespace].push(...catalog.data);
            entities+= catalog.data.length
        }
      }
    }

    this.catalogs = outputCatalogs
    // this.catalogs.push(
    //   ...Object.entries(outputCatalogs).map(([name, data]) => ({
    //     path: 'GameData/' + name + 'Data',
    //     Data: data,
    //   }))
    // // );
    // console.log(entities + " entities")
  }

  /**
   * Adds documentation info strings to mod strings.
   * @param {SC2Mod} mod 
   * @param {object} text 
   * @param {string} locale 
   */
  addDocInfo(mod, text, locale) {
    mod.strings.Game['DocInfo/Website'][locale] = text.Website;
    mod.strings.Game['DocInfo/Name'][locale] = text.Name;
    if (text.DescLong) {
      mod.strings.Game['DocInfo/DescLong'][locale] = `${text.DescLong}${text.Signature || ''}`;
    }
    if (text.DescShort) {
      mod.strings.Game['DocInfo/DescShort'][locale] = text.DescShort;
    }
  }

  clearCalculatedValues(){
    for(let cacheid in this.cache){
      let cache = this.cache[cacheid]
      for(let entityid in cache){
        let entity = cache[entityid]
        delete entity.calculated
      }
    }
  }
  calculateAllValues(){
    if(!this.cache)this.makeCache()
    for(let cacheid in this.cache){
      let cache = this.cache[cacheid]
      for(let entityid in cache){
        let entity = cache[entityid]
        if(entity.parents.find(e => e.ignored)){
          entity.ignored = true
          continue
        }
        if(entity.ignored){
          continue
        }
        this._calculate_all_entityvalues(entity)
      }
    }
    for(let cacheid in this.cache){
      let cache = this.cache[cacheid]
      for(let entityid in cache){
        let entity = cache[entityid]
        if(entity.ignored){continue}
        this._calculate_object_tokens(entity.calculated,entity);
      }
    }
  
  }
  ignoreEntities(ignored){
    for(let cacheid in ignored){
      for(let entityid of ignored[cacheid]){
        this.cache[cacheid][entityid].ignored = true
      }
    }
  }
  /**
   * Calculates all merged values for an entity, including parents.
   * @param {object} entity 
   * @returns {object} Calculated values
   */
  _calculate_all_entityvalues(entity) {
    if(entity.calculated) {
      return entity.calculated
    }
    let parent = entity.parents?.[entity.parents.length - 1]
    const result = parent ? cloneValue(parent.calculated || this._calculate_all_entityvalues(parent)) : {}
    objectsDeepMerge(result, entity.data);

    if (entity.data.default) result.default = entity.data.default;
    else delete result.default;
    if (entity.data.comment !== undefined) result.comment = entity.data.comment;
    else delete result.comment;

    delete result.parent;
    const resultPatched = applyArrayPatches(result);
    entity.calculated = resultPatched;
    return resultPatched;
  }
  /**
   * Calculates all merged values for an entity, including parents.
   * @param {object} entity 
   * @returns {object} Calculated values
   */
  calculateAllEntityValues(entity) {
    let result = this._calculate_all_entityvalues(entity)
    this._calculate_object_tokens(result,entity);
    return result;
  }
  /**
   * Calculates value for an entity, including parents.
   * @param {object} entity 
   * @param {string} field 
   * @returns {object} Calculated values
   */
  calculateValue(entity,field) {
    let value = this._calculate_value(entity, field)
    if(!entity.calculated)entity.calculated = {}
    entity.calculated[field] = value
    return value;
  }

  /**
   * Merges another mod into this one.
   * @param {SC2Mod} mod 
   */
  merge(mod) {
    objectsDeepMerge(this.data, mod.data);
  }

  /**
   * Creates SC2Mod instance from JSON data.
   * @param {object} data 
   * @returns {SC2Mod}
   */
  static fromJSON(data) {
    return new SC2Mod(data);
  }

  getLocales(){
    return this.data.components?.DataComponent?.filter(c => c.Type.toLowerCase() === "text").map(c => c.Locale) || GAME_LOCALES
  }
  getTokens(){

    let tokensCache = {}
    if(options.dependencies?.length){
        for(let dependency of options.dependencies){
            for(let catalog of dependency.data.catalogs){
                for(let entity of catalog.data){
                    if(entity.token){
                        for(let token of entity.token){
                            let c = entity.class
                            let ns =   C_NAMESPACES[c] 
                            let id =  (entity.id ?  ns + "." + entity.id : c) + "." +  token.id;
                            tokensCache[id] = token.type ? SCTypes[token.type] : String
                        }
                    }
                }
            }
        }
    }
    return tokensCache;

  }

  isPlacableUnit(unit){

      let dFlagArray = this.calculateValue(unit,"FlagArray")
      let dGlossaryPriority = this.calculateValue(unit,"GlossaryPriority")
      let dEditorFlags = this.calculateValue(unit,"EditorFlags")
      let dRace = this.calculateValue(unit,"Race")

      if( !dFlagArray || 
          dFlagArray.Unselectable || dFlagArray.NoDraw || 
          //skip units without defined race
          //!dRace || dRace === 'Neut' 
          //skip units without required fields
          // !dGlossaryPriority 
           dEditorFlags?.NoPalettes// || dEditorFlags?.NoPlacement
      ){
          return false;
      }
      return true
  }




  getUnitAbilCmds (unit) {
      return this.calculateValue(unit,"CardLayouts")?.map(cl => cl.LayoutButtons).flat().filter(Boolean).filter(lb => lb.AbilCmd && lb.Face && lb.Type && lb.Type !== 'Undefined' && (!lb.Row || lb.Row < 3) && (!lb.Column || lb.Column < 5))
          .map(lb => ({AbilCmd: lb.AbilCmd, Button: lb.Face}))
  }
  _calculate_entity_relations_deep (entity,callback,targets = [], deepTrace = []) {
      if(targets.includes(entity))return;//refrence already added to the array
      targets.push(entity)
      // deepTrace = [...deepTrace,entity]
      let refs = this._calculate_entity_relations(entity ,callback, deepTrace)
      for(let ref of refs){
          let [namespace,target] = ref.target.split(".")
          let targetEntity = this.cache[namespace]?.[target]
          if(targetEntity){
              this._calculate_entity_relations_deep(targetEntity,callback, targets, [...deepTrace,[ref, entity]])
          }
      }
      return targets
  }
  calculateEntityRelationsDeep (entity,cb) {
      if (!this.cache) this.makeCache();
      return this._calculate_entity_relations_deep(entity, cb,[])
  }
  calculateUnitProduction (unit){
      if(!this.cache)this.makeCache();
      let abilCmds = this.getUnitAbilCmds(unit)
      let abilLinks = this.calculateValue(unit,"AbilArray")?.map(a => a.Link)
      let units =[], upgrades = []

      if(abilCmds?.length && abilLinks?.length){
          for(let {Button,AbilCmd} of abilCmds){
              let [abilId, cmd] = AbilCmd.split(",");
              //skip if unit do not have this ability  even if it has button and command (example - zerg burrow)
              if(!abilLinks.includes(abilId)) continue
              let abil = this.cache.Abil[abilId]
              let button = this.cache.Button[Button]
              if(!abil) {
                  console.log("ability not found: " + abilId)
                  continue;
              }
                  
              let dInfoArray = this.calculateValue(abil,"InfoArray");
              if(!dInfoArray)continue
              let unitinfo = dInfoArray?.[cmd]?.Unit;
              if(unitinfo){
                  if(unitinfo.constructor !== Array) unitinfo = [unitinfo]
                  for(let unitId of unitinfo) {
                      let pu = this.cache.Unit[unitId]
                      if(pu && !units.includes(pu)) {
                          units.push([pu,abil])
                          pu.abilityButton = button
                          // console.log(unit.id + " --> " + pu.id)
                      }
                  }
              }
              let upgradeId = dInfoArray?.[cmd]?.Upgrade;
              if(upgradeId){
                  let upgrade = this.cache.Upgrade[upgradeId]
                  if(!upgrade){
                      // console.log(`upgrade not found ` + upgradeId)
                  }
                  else if(!upgrades.includes(upgrade)){
                      units.push([upgrade,abil])
                      upgrade.abilityButton = button
                  }
              }
          }
      }
      

      let behLinks = this.calculateValue(unit,"BehaviorArray")?.map(a => a.Link)
      let wepLinks = this.calculateValue(unit,"WeaponArray")?.map(a => a.Link)

      if(behLinks?.length){
          for(let behaviorId of behLinks){
              let behavior = this.cache.Behavior[behaviorId]
              if(!behavior)continue;
              //search units in behaviors. example - larva from hatchery, broodlng from hatchery on death
              let refs = this.calculateEntityRelationsDeep(behavior,  (ref)=> {
                  let entity = this.cache.Unit[ref.value]
                      if(!entity){
                          // console.log(`Unit not found ` + ref.value)
                          return false
                      }
                  if(ref.type === 'Unit' ){
                      if(this.isPlacableUnit(entity)){
                          if(!units.find(u=> u[0] ===entity)){
                              // console.log(unit.id + " --> " + entity.id)
                              // let log = [...deepTrace.map(a =>  a[1].data.class + a[0].origin.substring(a[0].origin.indexOf("."))),entity.data.class + ref.trace.substring(ref.trace.indexOf("."))]
                              // console.log(log)
                              units.push([entity,behavior])
                          }
                          return false;
                      }
                      else{
                          if(!units.find(u=> u[0] ===entity))units.push([entity,behavior])
                          // console.log("unplacable " + entity.id)
                      }
                  }
                  return !['TEditorCategories'].includes(ref.schema) && !['Race'].includes(ref.type)
              })
          }
      }


      if(wepLinks?.length){
          let behUnits = [];
          for(let behaviorId of wepLinks){
              let behavior = this.cache.Weapon[behaviorId]
              if(!behavior)continue;
              //search units in behaviors. example - larva from hatchery, broodlng from hatchery on death
              let refs = this.calculateEntityRelationsDeep(behavior,  (ref)=> {
                  let entity = this.cache.Unit[ref.value]
                      if(!entity){
                          // console.log(`Unit not found ` + ref.value)
                          return false
                      }
                  if(ref.type === 'Unit' ){
                      if(this.isPlacableUnit(entity)){
                          if(!units.find(u=> u[0] ===entity)){
                              // console.log(unit.id + " --> " + entity.id)
                              // let log = [...deepTrace.map(a =>  a[1].data.class + a[0].origin.substring(a[0].origin.indexOf("."))),entity.data.class + ref.trace.substring(ref.trace.indexOf("."))]
                              // console.log(log)
                              units.push([entity,behavior])
                          }
                          return false;
                      }
                      else{
                          if(!units.find(u=> u[0] ===entity))units.push([entity,behavior])
                          console.log("unplacable " + entity.id)
                      }
                  }
                  return !['TEditorCategories'].includes(ref.schema) && !['Race'].includes(ref.type)
              })
          }
      }


      if(abilLinks?.length){
          for(let behaviorId of abilLinks){
              let behavior = this.cache.Abil[behaviorId]
              if(!behavior)continue;
              //search units in behaviors. example - larva from hatchery, broodlng from hatchery on death
              this.calculateEntityRelationsDeep(behavior,  (ref, value,parent,parentIndex , schema , trace, deepTrace)=> {

                  let entity = this.cache[ref.type]?.[ref.value]
                  if(!entity)return false;

                  if(['CRequirement','CUpgrade'].includes(entity.data.class)){
                      // entity.data
                      return false
                  }
                  
                  if(['CEffectRemoveBehavior','CEffectDestroyPersistent'].includes(entity.data.class)){
                      return false
                  }
                  if(['CEffectCreateUnit'].includes(entity.data.class)){
                      if(entity.calculated.CreateFlags?.Precursor){
                          return false
                      }
                  }
                  if(['CEffectIssueOrder'].includes(entity.data.class)){
                      if(!abilLinks.includes(entity.data.Abil)){
                          return false
                      }
                  }
                  if(ref.trace.includes('AbilLinkDisableArray') || 
                    ref.trace.includes('DisableValidatorArray') || 
                    ref.trace.includes('RemoveValidatorArray')){
                      return false
                  }
                  
                  if(['Validator'].includes(ref.trace.split(".")[0])){
                      return false
                  }
                  if(ref.type === 'Unit' ){
                      if(this.isPlacableUnit(entity)){
                          if(!units.find(u=> u[0] ===entity)){
                              // console.log(unit.id + " --> " + entity.id)
                              // let log = [...deepTrace.map(a =>  a[1].data.class + a[0].origin.substring(a[0].origin.indexOf("."))),entity.data.class + ref.trace.substring(ref.trace.indexOf("."))]
                              // console.log(log)
                              units.push([entity,behavior])
                          }
                          return false;
                      }
                      else{
                          if(!units.find(u=> u[0] ===entity))units.push([entity,behavior])
                          // console.log("unplacable " + entity.id)
                      }
                  }
                  return !['TEditorCategories'].includes(ref.schema) && !['Race'].includes(ref.type)
              })
          }
      }


      unit.producedUnits = units
      unit.producedUpgrades = upgrades
      return {units,upgrades}
  }
  calculateProduction (){
      for(let unit in this.cache.Unit){
          this.calculateUnitProduction(this.cache.Unit[unit])
      }

      for(let unitId in this.cache.Unit){
          let unit = this.cache.Unit[unitId]
          for(let prodPair of unit.producedUnits){
              let [prod,prodAbility] = prodPair
              if(['CAbilMorph'].includes(prodAbility.data.class)){
                  //most likely morph
              }
              if(['CAbilBuild','CAbilTrain','CAbilWrapTrain'].includes(prodAbility.data.class)){
                  continue;
              }
              //usually unit replacement. any exceptions?
              else if(prod === unit){
                  unit.producedUnits.splice(unit.producedUnits.indexOf(prodPair),1)
              }
              else if(['CBehaviorJump'].includes(prodAbility.data.class)){
                  unit.producedUnits.splice(unit.producedUnits.indexOf(prodPair),1)
              }

              let prodPair2 = prod.producedUnits?.find(p => p[0] === unit)
              if(prodPair2){
                  unit.producedUnits.splice(unit.producedUnits.indexOf(prodPair),1)
                  if(!unit.morphs){
                      unit.morphs = []
                  }
                  unit.morphs.push(prodPair)
                  prod.producedUnits.splice(prod.producedUnits.indexOf(prodPair2),1)
                  if(!prod.morphs){
                      prod.morphs = []
                  }
                  prod.morphs.push(prodPair2)
              }
          }
      }
  }


}