import { EUnitAttribute, EUnitVital } from './types/enums.js';
import Eval from './lib/expr-eval.js';
import { objectsDeepMerge, applyArrayPatches, objectDeepTransform } from './lib/obj-util.js';
import { isNumeric } from './lib/js-util.js';
import SC2DataClasses from './schema/SC2DataClasses.js';
import { C_NAMESPACES } from './types/shared.js';

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
    const parent = this.cache[id ? C_NAMESPACES[tag] : 'defaults']?.[pid || id || tag];

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
  _make_cache() {
    this.cache = { defaults: {} };
    const cache = this.cache;

    if (this.dependencies) {
      for (const dependency of this.dependencies) {
        objectsDeepMerge(cache, dependency.cache);
      }
    }

    for (const catalog of this.catalogs) {
      if (catalog.Data) {
        for (const data of catalog.Data) {
          const id = data.id;
          const tag = data.class;
          const entity = {
            data,
            mod: this,
            namespace: C_NAMESPACES[tag],
          };
          const namespace = id ? C_NAMESPACES[tag] : 'defaults';
          if (!cache[namespace]) cache[namespace] = {};
          this._calculate_parents(entity);
          cache[namespace][id || tag] = entity;
        }
      }
    }

    this.cache.String = {};
    for (const cid in this.strings) {
      const catalog = this.strings[cid];
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
    return val.replace(/##(\w+)##/g, (_, token) => {
      let lookup = entity;
      while (lookup) {
        if (lookup.data[token]) {
          return this._calculate_value_tokens(lookup.data[token], entity);
        }
        const tokenDef = lookup.data.token?.find(t => t.id === token);
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
      ({ val, obj, prop }) => {
        obj[prop] = this._calculate_value_tokens(val, entity);
      }
    );
  }

  /**
   * Calculates a value for a given entity and field, merging parent values.
   * @param {object} entity 
   * @param {string} field 
   */
  _calculate_value(entity, field) {
    let resolved;
    const parents = entity.parents;

    for (const parent of [...parents, entity]) {
      let pvalue = parent.data[field];
      if (pvalue && !(Array.isArray(pvalue) || typeof pvalue === 'object')) {
        pvalue = { value: pvalue };
      }
      if (pvalue && !resolved) {
        resolved = Array.isArray(pvalue) ? [] : {};
      }
      if (pvalue) {
        objectsDeepMerge(resolved, pvalue);
      }
    }

    if (!resolved) {
      console.warn('No value found for field:', field);
      return ' ';
    }

    const patched = applyArrayPatches(resolved);
    this._calculate_object_tokens(patched);

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
    if (!this.cache) this._make_cache();

    const cs = this.cache.String;
    for (const cid in this.strings) {
      const catalog = this.strings[cid];
      for (const key in catalog) {
        let useLocale = locale;
        if (catalog[key][locale] === undefined) {
          console.log(`Missing string localization ${key} in locale ${locale}`);
          const keys = Object.keys(catalog[key]);
          useLocale = keys.includes('enus') ? 'enus' : keys[0];
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
    if (!this.cache) this._make_cache();
    for (const actorId in this.cache.Actor) {
      const actor = this.cache.Actor[actorId];
      const data = actor.data;
      if (data.default) continue;
      if (!['CActorUnit', 'CActorMissile'].includes(data.class)) continue;

      const entityOn = this._calculate_value(actor, 'On');
      const creationEvents = entityOn
        .filter(e => e.Send === 'Create')
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
          unit.actor = actor;
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

  /**
   * Sets up relations between entities based on schema references.
   */
  setEntitiesRelations() {
    if (!this.cache) this._make_cache();

    for (const namespace in this.cache) {
      for (const id in this.cache[namespace]) {
        const entity = this.cache[namespace][id];
        const refs = relations(entity.data, SC2DataClasses[entity.data.class.substring(1)], C_NAMESPACES[entity.data.class] + '.' + entity.data.id);

        for (const ref of refs) {
          const target = this.cache[ref.type]?.[ref.value];
          if (target) {
            if (!target.relations) target.relations = [];
            target.relations.push(ref);
          } else {
            console.log(`Reference ${ref.target} not found`);
          }
        }

        entity.references = refs.map(ref => ({
          origin: ref.trace,
          target: `${ref.type}.${ref.value}`,
        }));
      }
    }
  }

  /**
   * Merge multiple catalogs into organized data structures.
   */
  mergeCatalogs() {
    if (!this.catalogs) return;

    const outputCatalogs = {};
    const structCatalog = [];
    const constCatalog = [];
    let entities = 0;

    for (const catalog of this.catalogs) {
      if (catalog.Data) {
        for (const entity of catalog.Data) {
          const namespace = C_NAMESPACES[entity.class];
          if (!outputCatalogs[namespace]) outputCatalogs[namespace] = [];
          outputCatalogs[namespace].push(entity);
          entities++;
        }
      }
      if (catalog.Struct) {
        structCatalog.push(...catalog.Struct);
      }
      if (catalog.const) {
        constCatalog.push(...catalog.const);
      }
    }

    this.catalogs = [];

    if (constCatalog.length) {
      this.catalogs.push({ path: 'GameData/ConstData', const: constCatalog });
    }
    if (structCatalog.length) {
      this.catalogs.push({ path: 'GameData/StructData', Struct: structCatalog });
    }
    this.catalogs.push(
      ...Object.entries(outputCatalogs).map(([name, data]) => ({
        path: 'GameData/' + name + 'Data',
        Data: data,
      }))
    );
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

  /**
   * Calculates all merged values for an entity, including parents.
   * @param {object} entity 
   * @returns {object} Calculated values
   */
  calculateAllValues(entity) {
    const result = {};
    for (const parent of entity.parents) objectsDeepMerge(result, parent.data);
    objectsDeepMerge(result, entity.data);

    if (entity.data.default) result.default = entity.data.default;
    else delete result.default;

    if (entity.data.comment !== undefined) result.comment = entity.data.comment;
    else delete result.comment;

    delete result.parent;

    const resultPatched = applyArrayPatches(result);
    this._calculate_object_tokens(resultPatched);

    entity.calculated = resultPatched;
    return resultPatched;
  }

  /**
   * Merges another mod into this one.
   * @param {SC2Mod} mod 
   */
  merge(mod) {
    objectsDeepMerge(this, mod);
  }

  /**
   * Creates SC2Mod instance from JSON data.
   * @param {object} data 
   * @returns {SC2Mod}
   */
  static fromJSON(data) {
    return new SC2Mod(data);
  }
}