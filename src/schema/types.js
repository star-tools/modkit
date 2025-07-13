
import {SCSchema} from "./schema.js"

// Example usage:
// console.log(Bit.validate("1"));        // true
// console.log(Bit.toNumber("0"));        // 0
// console.log(Real32.validate(1.5));     // true
// console.log(Int8.validate(127));       // true
// console.log(Int8.validate("128"));     // false
// console.log(UInt64.validate("18446744073709551615")); // true
// console.log(Int64.validate(-9223372036854775808n));   // true

// ====== Base Data Type Class ======

/**
 * Abstract base class for all data types.
 * Provides default validate and parse methods.
 */
export class CDataType {
  constructor(name) {
    this.name = name;
  }
  static isValue = true
  /**
   * Validate a given value against the data type.
   * Default implementation always returns true.
   * Override in subclasses.
   * @param {*} val - value to validate
   * @returns {boolean}
   */
  static validate(val) {
    return true;
  }

  /**
   * Parse a string value to the internal representation.
   * Default implementation returns the string itself.
   * Override to convert to number, etc.
   * @param {string} str
   * @returns {*}
   */
  static parse(str , json) {
    if (!this.validate(str , json)) {
      console.warn('Invalid data: ' + str);
      return null;
    }
    return str;
  }
}

// ====== Integer Types ======

/**
 * Integer base class with optional min/max range checks.
 */
export class Int extends CDataType {
  /**
   * Validate an integer value or numeric string against min/max.
   * @param {number|string} val
   * @returns {boolean}
   */
  static validate(val) {
    let min = this.min;
    let max = this.max;

    if (typeof val === 'string') {
      val = Number(val);
      if (Number.isNaN(val)) return false;
    }
    if (typeof val !== 'number' || !Number.isInteger(val)) return false;

    if (min !== undefined && val < min) return false;
    if (max !== undefined && val > max) return false;

    return true;
  }

  /**
   * Parse a string to number if valid, else return input.
   * @param {string} str
   * @returns {number|string}
   */
  static parse(str) {
    return isValidNumber(str) ? +str : str;
  }
}


// ====== Helper to check valid numeric strings ======

/**
 * Checks if a value is a valid number or numeric string.
 * @param {*} value
 * @returns {boolean}
 */
function isValidNumber(value) {
  if (typeof value === 'number') return isFinite(value);

  if (typeof value === 'string') {
    // Matches integer and decimal numbers, with optional sign
    return /^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(value);
  }

  return false;
}

// ====== Floating Point Types ======

/**
 * Real (floating point) base class with min/max validation.
 */
export class Real extends CDataType {
  static validate(val) {
    let min = this.min;
    let max = this.max;

    if (typeof val === 'string') {
      val = Number(val);
      if (Number.isNaN(val)) return false;
    }
    if (typeof val !== 'number' || !isFinite(val)) return false;

    if (min !== undefined && val < min) return false;
    if (max !== undefined && val > max) return false;

    return true;
  }

  static parse(str) {
    return isValidNumber(str) ? +str : str;
  }
}

/** 32-bit float */
export class Real32 extends Real {}

// ====== String Types ======

/**
 * Base class for string types with optional regex and maxlength validation.
 */
export class CString extends CDataType {
  static regexp = null;
  static maxlength = null;

  /**
   * Validate string value against regexp and maxlength.
   * @param {string} str
   * @returns {boolean}
   */
  static validate(str) {
    if (typeof str !== 'string') return false;

    if (this.maxlength !== null && str.length > this.maxlength) return false;

    if (this.regexp !== null && !this.regexp.test(str)) return false;

    return true;
  }
}


function getTextRelations(value,trace = []){
    let result = []
    value
      .replace(/<d\s+(?:stringref)="(\w+),([\w@]+),(\w+)"\s*\/>/g, (_,namespace,entity,field)=>{
            result.push({type: namespace,value: entity ,trace})
            return ''
      })
      .replace(/<d\s+(?:time|ref)\s*=\s*"(.+?)(?=")"((?:\s+\w+\s*=\s*"\s*([\d\w]+)?\s*")*)\s*\/>/gi, (_,ref,opts) => {
          result.push(...getNestedTextReferenceRelations(ref,trace))
          return ''
      })
      .replace(/<n\/>/g,"<br/>")
      return result
}
function getNestedTextReferenceRelations (value,trace){
    let result = []
      let ref = value.replace(/\[d\s+(?:time|ref)\s*=\s*'(.+?)(?=')'((?:\s+\w+\s*=\s*'\s*([\d\w]+)?\s*')*)\s*\/?\]/gi, (_,ref,opts) => {
          result.push(...this.getNestedTextReferenceRelations(ref,trace))
          return ' '
      })
      ref = ref.replace(/\$(.+?)\$/g,(_,cc)=>{
          let options = cc.split(':')
          switch(options[0]){
              case 'AbilChargeCount':
                  let ability = options[1]
                  result.push({type: "Abil",value: ability ,trace})
                  return ' '
              case 'UpgradeEffectArrayValue':
                  let upgrade = options[1]
                  let effectArrayValue = options[2]
                  {
                    let [namespace,entity] = effectArrayValue.split(",")
                    result.push({type: namespace,value: entity ,trace})
                  }
                  result.push({type: "Upgrade",value: upgrade ,trace})
                  return ' '
          }
          return ''
      })

      ref = ref.replace(/((\w+),([\w@]+),(\w+[\.\w\[\]]*))/g,(_,expr, namespace,entity,fields)=>{
          result.push({type: namespace,value: entity ,trace})
          return ' '
      })
      return result
}


export class CText extends CString {
  static relations(value,trace){
    return getTextRelations(value,trace)
  }
  static validate(str) {
    return true;
  }
}





/** Non-whitespace word */
export class CWord extends CString {
  static regexp = /^\S+$/;
}

/** Link string (no whitespace) */
export class Link extends CString {
  static regexp = /^[^\s]+$/;
}

// ====== Enum Type ======

/**
 * Enum class validates string against allowed enum values.
 */
export class CEnum extends CDataType {
  static enum = [];

  constructor() {
    super('Enum');
  }

  /**
   * Validate if value is in enum list.
   * If enum list is empty, allow all values.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    if (!this.enum.length) return true;
    if(val === "Unknown") return true; //is it correct?
    if(!this.enum.includes(val)){
      console.log(`value ${val} is missing in Enum ` + this.name)
    return false
    }

    return true
  }
}

// ====== Path Type ======

/**
 * Path string validator, expects dot-separated identifiers.
 */
export class CPath extends CDataType {
  constructor(name) {
    super(name);
  }

  static validate(val) {
    return (
      typeof val === 'string' &&
      /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$/.test(val)
    );
  }
}

// ====== List Types ======

/**
 * Base class for list types.
 * Validates lists of subtypes separated by separator regex.
 */
export class CList extends CDataType {
  static separator = /[\s,]+/; // default separator: spaces or commas
  static subType = null;

  /**
   * Validate a list string by splitting and validating each element with subType.
   * @param {string} val
   * @returns {boolean}
   */
  static validate(val) {
    const subType = this.subType;
    const pattern = this.separator;

    if (!subType || typeof subType.validate !== 'function') {
      throw new Error('Missing static subType with validate()');
    }

    const normalized = val.trim().replace(/\s+/g, ' ');
    const values = normalized.split(pattern).filter(Boolean);

    return values.every((v) => subType.validate(v));
  }
}


// ====== Misc Types ======

/** CUnknown Enum placeholder */
export class EUnknown extends CEnum {
  static validate(val) {
    console.log("unknown Enum. value " + val)
    return true
  }
}

/** Generic unknown data type */
export class CUnknown extends CDataType {}




export class CTokenValue extends CDataType{
    static validate(tag, json){
      return true;
      // return SCSchema.types[json.type].validate(tag)
    }
}

export class VData extends CDataType{
    static validate(tag){
        return SCSchema.classes[tag]
    }
}

export class VStruct extends CDataType{
    static validate(tag){
        console.log("struct schema?")
        return !!SCSchema.struct[tag]
    }
}


export class CParent extends CDataType{
}



/** Unsigned integer base class (min=0) */
export class UInt extends Int {
  static min = 0;
}

/** Month integer (0-12) */
export class Month extends Int {
  static min = 0;
  static max = 12;
}

/** Day integer (0-31) */
export class Day extends Int {
  static min = 0;
  static max = 31;
}

/** Year integer (0-9999) */
export class Year extends Int {
  static min = 0;
  static max = 9999;
}

/** 8-bit signed integer (-128 to 127) */
export class Int8 extends Int {
  static min = -(2 ** 7);
  static max = 2 ** 7 - 1;
}

/** 16-bit signed integer */
export class Int16 extends Int {
  static min = -(2 ** 15);
  static max = 2 ** 15 - 1;
}

/** 32-bit signed integer */
export class Int32 extends Int {
  static min = -(2 ** 31);
  static max = 2 ** 31 - 1;
}

/** Bit (boolean represented as 0 or 1) */
export class Bit extends Int {
  static min = 0;
  static max = 1;
}

/** 8-bit unsigned integer */
export class UInt8 extends Int {
  static min = 0;
  static max = 2 ** 8 - 1;
}

/** 16-bit unsigned integer */
export class UInt16 extends Int {
  static min = 0;
  static max = 2 ** 16 - 1;
}

/** 32-bit unsigned integer */
export class UInt32 extends Int {
  static min = 0;
  static max = 2 ** 32 - 1;
}

export class CString4 extends CString {  static maxlength = 4;}
export class CString32 extends CString {  static maxlength = 32;}
export class CString50 extends CString {  static maxlength = 50;}
export class CString80 extends CString {  static maxlength = 80;}
export class CReals extends CList {  static subType = Real;}
export class CInts extends CList {  static subType = Int;}
export class CWords extends CList {  static subType = CWord;}

export const TCooldownLink = CString
export const TChargeLink = CString
export const TMarkerLink = CString
export const TPowerLink = CString
export const TProductHyperlinkId = CString
export const THyperlinkId = CString
export const TCatalogFieldPath = CString // Attributes[1]
export const TGalaxyFunction = CString
export const TCargoSize = Int
export const TCargoCapacity = Int
export const TMarkerCount = Int
export const TPreemptLevel = Int
export const TAbilCmdIndex = Int
export const TCliffLevel = Int
export const TBattleProductId = Int
export const TPowerLevel = Int
export const TConversationItemId = CString
export const TTechAlias = CString
export const TDifficultyLevel = Int
export const TAIBuild = Int
export const TPlayerId = Int
export const TMountCategory = CString
export const TBattleLicenseName = CString
export const TAttackTargetPriority = Int
export const TUnitRadius = Real
export const TUserFieldId = CString
export const TUserInstanceId = CString
export const TAttachPropIndex = Int
export const TCommanderLevel = Int
export const TConversationStateOpId = CString
export const TConversationStateIndexId = CString
export const TConversationStateVariation = CString
export const TConversationTag = CString
export const TConversationStateInfoId = CString
export const TUpgradeEffectValue = CString
export const TFootprintOffsets = CString //RealArrays
export const TFootprintBorders = CUnknown
export const THandicap = Int
export const TTriggerLibId = CString
export const TCmdResult = CString 
export const TDifficulty = Int
export const TSoundWeight = Int
export const TSoundBalance = Int
export const TVoiceOverSkinId = CString
export const TVoiceOverGroupId = CString
export const TLocaleId = CWord
export const SGameContentCreationData = CString //EmoticonPack,LegacyOfTheVoid
export const CDescPath = Link //LotV_UnitStatus/HeroUnitEnergyStatusFrameTemplate layout/frame
export const CAbilSetId =  CString
export const CTargetFilters = CString
export const CFangleArc = Real
export const CGameTime = Real
export const CCmdResult = CString
export const CfRange = CReals
export const CFangle = Real
export const CGamePoint = CReals
export const CIdentifier = CString // <File value="Assets/Sounds/GDI/##prefix##^TemplateParam1^.ogg"/>
export const CColor = CString
export const CActorKey = CString
export const CScaleVector = CReals
export const C3Vector = CReals
export const CActorCreateKey = CString
export const CActorLabelKey = CString
export const CQuad = CReals
export const CRange = CReals
export const CVariatorActorReal32 = CReals
export const C2Vector = CReals
export const CActorAngle = Real
export const CAnimNameKey = CString
export const CAnimProps = CString
export const CFacing = Real
export const CVariatorActorAngle = CReals
export const CColorHDR = CColor
export const CVariatorActorFangle = Real
export const CFangleRate = Real
export const CActorTableKeys1x3 = CWords
export const CGameRate = Real
export const C2iVector = CInts
export const CColorRGB = CColor
export const CUserReference = CUnknown   //PlayerCommanders;ZergDehaka
export const CAttachKeys = CString
export const CRect = CReals
export const CiRange = CInts
export const CEffectOffset = CReals
export const CiQuad = CInts
export const CGameSpeed = Real
export const CVariatorGameFangle = Real
export const CVariatorGameFixed = CUnknown // Real?
export const CTimeOfDay = CUnknown
export const CStyleName = CString
export const CTextureProps = CWords
export const CfQuad = CReals
export const CPitchRange = Real
export const CVolumeRange = CReals
export const CVolume = Real
export const C2fVector = CReals
export const CTextureSlot = CUnknown
export const CGameAcceleration = Real
export const C4Vector = CReals
export const CLabelExpression = CUnknown
export const CIdSetPlayers = CUnknown
export const CIdSetTeams = CUnknown
export const CSubNameKey = CString
export const CAttachMethods = CUnknown
export const CActorClassFilters = CUnknown
export const CActorDeathMembers = CString//'filters'
export const CGamePoInt3D = CReals
export const CTextureExpression = CUnknown
export const CMissileAcceleration = Real
export const CMissileSpeed = Real
export const CPhaseOutro = CReals
export const C3fVector = CReals
export const CThrowBand = CReals
export const CYawPitchRoll = CUnknown
export const CFangleRateMissile = Real
export const CFangleAccelMissile = Real
export const CPitch = CReals
export const CFourCC = CWord
export const CCardId = CWord 



let regexps  = {
    bool: /^true|false$/,
    bit: /^[01]$/,
    int: /^-?(0|[1-9]\d*)$/,
    real: /^(-?(0|[1-9]\d*)(\.\d+)?)|\.\d+$/,
    ints: /^(-?(0|[1-9]\d*)(,-?(0|[1-9]\d*))*|NULL)$/,
    reals: /^((-?(0|[1-9]\d*)(\.\d+)?)(\,-?(0|[1-9]\d*)(\.\d+)?)*|NULL)$/,
    filters: /^(-|\w+(,\w+){0,});(-|\w+(,\w+){0,})$/,
    categories: /^(\w+\:[\w -#]+)(,\w+\:[\w -#]+)*$/,
    file: /^.*$/,
    link: /^[A-Za-z_\-@#0-9-]+(\/+[A-Za-z_\-@#0-9-]+)*\/?$/,
    linkstrict: /^[A-Za-z_\-@#0-9-]+(\/+[A-Za-z_\-@#0-9-]+)+\/?$/,
    links: /^[A-Za-z_\-@#0-9-]+(\/+[A-Za-z_\-@#0-9-]+)*\/?(,[A-Za-z_@#0-9-]+(\/+[A-Za-z_@#0-9-]+)*\/?)*$/,
    text: /^[A-Za-z_\-@#0-9-]+((\/+[A-Za-z_\-@#0-9-]+)\/?)*(\/+.+)+\/?$/,
    word: /^[\w@_\-%#]+$/,
    wordstrict: /^[\w@_\-%#]+$/,
    abilcmd: /^([\w@_#]+([.,][\w]+)?|255)$/,
    abilcmdstrict: /^([\w@_#]+[.,][\w]+|255)$/,
    words: /^[\w@_\-%#]+(,[\w@_\-%#]+)*$/,
    ops: /^[\w@_\-%#]+(\s[\w@_\-%#]+)*$/,
    reference: /^.*$/,
    referencestrict: /^\w+,\w+,[\w\[\].]+$/,
    subject: /^.*$/,
    driver: /^.*$/,
    send: /^.*$/,
    terms: /^.*$/,
    filestrict: /^[Za-z_#'0-9\-]+[\\/a-z_#'0-9\-. ]+\.(dds|fxa|m3|tga|m3a|ogv|wav|mp3|SC2Map|SC2Layout|SC2Cutscene|SC2Campaign|SC2Mod)$/i,
}


const entityType = {
    TurretEnable: "Turret",
    TurretTarget: "Turret",
    Behavior: "Behavior",
    BehaviorLevel: "Behavior",
    AbilTrain: "Abil",
    Abil: "Abil",
    AbilTransport: "Abil",
    WeaponStart: "Weapon",
    WeaponStop: "Weapon",
    Upgrade: "Upgrade",
    Confirmation: "Unit",
    UnitConstruction: "Unit",
    UnitDeath: "Unit",
    UnitBirth: "Unit",
    UnitRevive: "Unit",
    Effect: "Effect",
    Model: "Model",
    Actor: "Actor",
}

const conditionEntityType = {
    ValidatePlayer: "Validator",
    // ModelSwap: "Model",
    AbilTrainProduced: "Unit",
    ValidateCreationEffect: "Validator",
    ValidateUnit: "Validator",
    ValidateEffect: "Validator",
    // "!ValidateUnit": "Validator",
    AbilTransport: "Unit",
    MorphFrom: "Unit",
    MorphTo: "Unit",
}

function eventConditionEntityType(eventname){
    return conditionEntityType[eventname.replace(/^\!/,"")]
}

function eventEntityType(eventname){
    return entityType[eventname]
}



export class TEditorCategories extends CString  {
  static relations(value,trace){
    let result = []
    let pairs = value.split(",").map(el => el.split(":"))
    for(let [property,propvalue] of pairs){
      switch(property){
        case "Race":
          result.push({type: "Race", value: propvalue, trace})
      }
    }
    return result;
  }
}

export class CCatalogReference extends CString  {
  static relations(value,trace){
    let result = []
    let [type, link, entityProperty] = value.split(",")
    result.push({type, value: link, trace})
    return result;
  }
}

export class CRefKey extends CString  {
  static relations(value,trace){
    let result = []
    
    if(/[a-zA-Z]/.test(value[0])){
      result.push({type: "Actor", value, trace})
    }
    else if(value.startsWith(':')){
        let [type,link] = value.substring(2).split(".")
        if(link){
          result.push({type, link, trace})
        }
    }
    return result;
  }
}

export class CDataSoupKey extends CString  {
  static relations(value,trace){
    let result = []
    if(/[a-zA-Z]/.test(value[0])){
      result.push({type: "Effect", value, trace})
    }
    return result;
  }
}



export class CActorTerms extends CString  {
  static relations(value,trace){
    let result = []
    let [...conditions] = value.split(";").map(term => term.trim())
    for(let index =0; index < conditions.length; index++){
      let condition = conditions[index]
      if(condition.includes(".")){
        let [entityType, entityName, argumentName] = condition.split(".")
        let type = eventEntityType(entityType)
        if(type){
          result.push({type, value: entityName, trace})
        }
      }
      else{
          let [entityType, entityName] = condition.split(" ").map(term => term.trim())
          let type = eventConditionEntityType(entityType)
          if(type && !result.find(i => i.type === type && i.value === entityName)){
              result.push({type, value: entityName, trace})
          }
      }
    }
    return result
  }
}

export class CActorMsgPayloadPtr extends CString  {
  static relations(value,trace){
    let args = value.split(" ")
    let result = []
    if(args.length <= 1) return result
    switch (args[0]) {
      case "AttachSetBearingsFrom":  {
        //AttachSetBearingsFrom {Weapon 0} {} {LurkerMPSOpAoEVariancer SOpShadow SOpForwardCasterPoint SOp2DRotation LurkerMPSOpShadowSpine SOpRotVariancerUp15}
        let _val = value
        _val = _val.substring(_val.indexOf('}')+1)
        _val = _val.substring(_val.indexOf('}')+1)
        let parts = _val.replace(/([\{\} }])/g,'\n$1\n').split('\n')
        for(let link of parts){
            if(regexps.wordstrict.test(link)) {
                result.push({type: "Actor", value: link, trace})
            }
        }
        break;
      }
      case "HostSiteOpsSet":
      {
        //HostSiteOpsSet ::HostImpact SOpAttachCenter 1 1
        //HostSiteOpsSet ::Host {SOpAttachCenter SOp2DRotation NovaGriffinBombingRunBombRandomRotation}
        let _val = value
        _val = _val.substring(_val.indexOf(' '))
        _val = _val.substring(_val.indexOf(' '))
        let parts = _val.replace(/([\{\} }])/g,'\n$1\n').split('\n')
        for(let link of parts){
            if(regexps.wordstrict.test(link)) {
                result.push({type: "Actor", value: link, trace})
            }
        }
        break;
      }
      case "PortraitCustomize":
      case "ModelSwap": {
        let link = args[1]
        result.push({type: "Model", value: link, trace})
        break;
      }
      case "RefSetFromMsg": {
        // Send="RefSetFromMsg ::actor.SiegeTankSieged ::Sender"/>
        let _val = value.split(" ")
        if(_val[1][0] !== ":"){console.log("RefSetFromMsg! starts with character")}
        let [namespace,link] = _val[1].substring(2).split(".")
        result.push({type: namespace, value: link, trace})
        break;
      }
      case "ModelMaterialRemove":
      case "ModelMaterialApply":
      case "CreateCopy":
      case "Create": {
        let link = args[1]
        result.push({type: "Actor", value: link, trace})
        break;
      }
      case "TimerSet":
      case "QueryRegion":
      case "QueryRadius": {
        let link = args[2]
        result.push({type: "Actor", value: link, trace})
        break;
      }
    }
    return result
  }
}

export class CActorSiteOps extends CString  {
  static relations(value,trace){
    let result = []
    let actors = value.split(" ")
    for(let value of actors){
        result.push({type: "Actor", value, trace})
    }
    return result
  }
}

export class CLink extends CDataType  {
  static catalog = '';
  constructor() {
    super("Link");
  }
  static relations(value,trace){
    return [{type: this.catalog, value,trace}]
  }
  validate(val) {
    return !!this.mod.catalogs[this.constructor.catalog]?.[val]
  }
}

export class CUnitLink extends CLink { static catalog = "Unit"}
export class CValidatorLink extends CLink { static catalog = "Validator"}
export class CAlertLink extends CLink { static catalog = "Alert"}
export class CEffectLink extends CLink { static catalog = "Effect"}
export class CButtonLink extends CLink { static catalog = "Button"}
export class CAbilLink extends CLink { static catalog = "Abil"}
export class CMoverLink extends CLink { static catalog = "Mover"}
export class CTargetSortLink extends CLink { static catalog = "TargetSort"}
export class CCursorLink extends CLink { static catalog = "Cursor"}
export class CItemContainerLink extends CLink { static catalog = "ItemContainer"}
export class CItemClassLink extends CLink { static catalog = "ItemClass"}
export class CUpgradeLink extends CLink { static catalog = "Upgrade"}
export class CAccumulatorLink extends CLink { static catalog = "Accumulator"}
export class CScoreValueLink extends CLink { static catalog = "ScoreValue"}
export class CRewardLink extends CLink { static catalog = "Reward"}
export class CRaceLink extends CLink { static catalog = "Race"}
export class CAchievementTermLink extends CLink { static catalog = "AchievementTerm"}
export class CAchievementLink extends CLink { static catalog = "Achievement"}
export class CPreloadLink extends CLink { static catalog = "Preload"}
export class CCameraLink extends CLink { static catalog = "Camera"}
export class CModelLink extends CLink { static catalog = "Model"}
export class CWeaponLink extends CLink { static catalog = "Weapon"}
export class CSoundLink extends CLink { static catalog = "Sound"}
export class CBeamLink extends CLink { static catalog = "Beam"}
export class CTerrainLink extends CLink { static catalog = "Terrain"}
export class CFootprintLink extends CLink { static catalog = "Footprint"}
export class CActorLink extends CLink { static catalog = "Actor"}
export class CHerdNodeLink extends CLink { static catalog = "HerdNode"}
export class CArmyUnitLink extends CLink { static catalog = "ArmyUnit"}
export class CArmyUpgradeLink extends CLink { static catalog = "ArmyUpgrade"}
export class CSkinLink extends CLink { static catalog = "Skin"}
export class CTalentLink extends CLink { static catalog = "Talent"}
export class CItemLink extends CLink { static catalog = "Item"}
export class CPlayerResponseLink extends CLink { static catalog = "PlayerResponse"}
export class CBankConditionLink extends CLink { static catalog = "BankCondition"}
export class CBoostLink extends CLink { static catalog = "Boost"}
export class CCliffMeshLink extends CLink { static catalog = "CliffMesh"}
export class CCampaignLink extends CLink { static catalog = "Campaign"}
export class CConsoleSkinLink extends CLink { static catalog = "ConsoleSkin"}
export class CDataCollectionLink extends CLink { static catalog = "DataCollection"}
export class CCommanderLink extends CLink { static catalog = "Commander"}
export class CConversationStateLink extends CLink { static catalog = "ConversationState"}
export class CCharacterLink extends CLink { static catalog = "Character"}
export class CDataCollectionPatternLink extends CLink { static catalog = "DataCollectionPattern"}
export class CKineticLink extends CLink { static catalog = "Kinetic"}
export class CEmoticonLink extends CLink { static catalog = "Emoticon"}
export class CBundleLink extends CLink { static catalog = "Bundle"}
export class CScoreResultLink extends CLink { static catalog = "ScoreResult"}
export class CSoundtrackLink extends CLink { static catalog = "Soundtrack"}
export class CDSPLink extends CLink { static catalog = "DSP"}
export class CHeroStatLink extends CLink { static catalog = "HeroStat"}
export class CMountLink extends CLink { static catalog = "Mount"}
export class CTalentProfileLink extends CLink { static catalog = "TalentProfile"}
export class CMapLink extends CLink { static catalog = "Map"}
export class CBehaviorLink extends CLink { static catalog = "Behavior"}
export class CArmyCategoryLink extends CLink { static catalog = "ArmyCategory"}
export class CLocationLink extends CLink { static catalog = "Location"}
export class CObjectiveLink extends CLink { static catalog = "Objective"}
export class CLightLink extends CLink { static catalog = "Light"}
export class CPhysicsMaterialLink extends CLink { static catalog = "PhysicsMaterial"}
export class CConversationLink extends CLink { static catalog = "Conversation"}
export class CRequirementLink extends CLink { static catalog = "Requirement"}
export class CRequirementNodeLink extends CLink { static catalog = "RequirementNode"}
export class CHeroLink extends CLink { static catalog = "Hero"}
export class CDecalPackLink extends CLink { static catalog = "DecalPack"}
export class CTextureLink extends CLink { static catalog = "Texture"}
export class CSprayLink extends CLink { static catalog = "Spray"}
export class CPortraitPackLink extends CLink { static catalog = "PortraitPack"}
export class CTrophyLink extends CLink { static catalog = "Trophy"}
export class CVoicePackLink extends CLink { static catalog = "VoicePack"}
export class CRaceBannerPackLink extends CLink { static catalog = "RaceBannerPack"}
export class CStimPackLink extends CLink { static catalog = "StimPack"}
export class CSoundExclusivityLink extends CLink { static catalog = "SoundExclusivity"}
export class CSoundMixSnapshotLink extends CLink { static catalog = "SoundMixSnapshot"}
export class CTargetFindLink extends CLink { static catalog = "TargetFind"}
export class CTacticalLink extends CLink { static catalog = "Tactical"}
export class CReverbLink extends CLink { static catalog = "Reverb"}
export class CTerrainTexLink extends CLink { static catalog = "TerrainTex"}
export class CTileLink extends CLink { static catalog = "Tile"}
export class CCliffLink extends CLink { static catalog = "Cliff"}
export class CTurretLink extends CLink { static catalog = "Turret"}
export class CLootLink extends CLink { static catalog = "Loot"}
export class CUserLink extends CLink { static catalog = "User"}
export class CShapeLink extends CLink { static catalog = "Shape"}
export class CTextureSheetLink extends CLink { static catalog = "TextureSheet"}
export class CHeroAbilLink extends CLink { static catalog = "HeroAbil"}
export class CStringLink extends CLink { static catalog = "String"}
export class CHotkeyLink extends CLink { static catalog = "Hotkey"}
export class CAssetLink extends CLink { static catalog = "Asset"}
export class CBankLink extends CLink { static catalog = "Bank"}


export class CFile extends CDataType {
  constructor() {
    super("File");
  }
  static relations(value,trace){
    return [{type: "File", value,trace}]
  }
  static validate(val) {
    return true;
    // if (typeof val !== 'string') return false;
    // if (! /^[^<>:"/\\|?*\s]+$/.test(val)) return false;
    // if (this.constructor.extensions?.length > 0) {
    //   const ext = val.split('.').pop().toLowerCase();
    //   return this.extensions.includes(ext);
    // }
    // return true;
  }
}

export class CFileImage extends CFile { static catalog = "Image" ; static extensions = ["dds","png","tga","jpg"]}
export class CFileMovie extends CFile { static catalog = "Movie" ; static extensions = ["ogv"]}
export class CFileMap extends CFile { static catalog = "Map" ; static extensions = ["sc2map"]}
export class CFileModel extends CFile { static catalog = "Model" ; static extensions = ["m3"]}
export class CFileCutscene extends CFile { static catalog = "Cutscene" ; static extensions = ["sc2cutscene","stormcutscene"]}
export class CFileFontStyle extends CFile { static catalog = "FontStyle" ; static extensions = ["sc2style"]}
export class CFileLayout extends CFile { static catalog = "Layout" ; static extensions = ["sc2layout"]}
export class CFileSound extends CFile { static catalog = "Sound" ; static extensions = ["ogg","mp3","wav"]}
export class CFileAnims extends CFile { static catalog = "Anims" ; static extensions = ["m3a"]}
export class CFileFacial extends CFile { static catalog = "Facial" ; static extensions = ["fx2"]}
export class CFileSyncModelData extends CFile { static catalog = "SyncModelData" ; static extensions = ["m3h"]}
export class CFileXML extends CFile { static catalog = "XML" ; static extensions = ["xml"]}
export class CFileFont extends CFile { static catalog = "Font" ; static extensions = ["ttf","c"]}






export class CPhysicsMaterialLinks extends CList {
     static separator = " "
     static subType = CPhysicsMaterialLink
}

export class CAbilCommand extends CDataType  {
  constructor() {
    super("Link");
  } 
  static relations(value,trace){
    let [link, cmd] = value.split(",")
    return [{type: "AbilCmd", value: link,trace}]
    // return [{type: "AbilCmd", value: value,trace}]
  }
  validate(val) {
    let [ability,command] = val.split(",")
    return !!this.mod.catalogs.Abil?.[ability]?.InfoArray[command];//todo different abilitiyes has different infoarray/ cmdbuttonarray 
  }
}

export class CDataEntryPath extends CDataType  {
  constructor() {
    super("Link");
  }
  validate(val) {
    let [catalog,entry] = val.split(",")
    return !!this.mod.catalogs[catalog]?.[val]
  }
}

   export const V = {
    Struct: VStruct,
    Data: VData
   }

   export const C = {
    DataEntryPath: CDataEntryPath,
        Parent: CParent,
        TokenValue: CTokenValue,
        Month,
        Day,
        Year,
        Int,
        Real,
        Real32,
        Link,
        Bit,
        Int8,
        Int16,
        Int32,
        UInt,
        UInt8,
        UInt16,
        UInt32,
        Unknown: CUnknown,
        Word: CWord,
        Enum: CEnum,
        String: CString,
        String4: CString4,
        String32: CString32,
        String50: CString50,
        String80: CString80,
        CReals: CReals,
        CInts: CInts,
        CWords: CWords,
        GameContentCreationData: SGameContentCreationData,
        ScaleVector: CScaleVector,
        Vector3: C3Vector,
        Vector2: C2Vector,
        Vector2i: C2iVector,
        Vector2f: C2fVector,
        Vector4: C4Vector,
        Vector3f: C3fVector,
        DescPath: CDescPath,
        AbilSetId: CAbilSetId,
        TargetFilters: CTargetFilters,
        FangleArc: CFangleArc,
        GameTime: CGameTime,
        CmdResult: CCmdResult,
        fRange: CfRange,
        Fangle: CFangle,
        GamePoint: CGamePoint,
        Identifier: CIdentifier,
        Color: CColor,
        ActorKey: CActorKey,
        ActorTerms: CActorTerms,
        ActorCreateKey: CActorCreateKey,
        ActorLabelKey: CActorLabelKey,
        Quad: CQuad,
        Range: CRange,
        VariatorActorReal32: CVariatorActorReal32,
        RefKey: CRefKey,
        ActorAngle: CActorAngle,
        AnimNameKey: CAnimNameKey,
        AnimProps: CAnimProps,
        Facing: CFacing,
        VariatorActorAngle: CVariatorActorAngle,
        ColorHDR: CColorHDR,
        VariatorActorFangle: CVariatorActorFangle,
        FangleRate: CFangleRate,
        ActorTableKeys1x3: CActorTableKeys1x3,
        GameRate: CGameRate,
        ColorRGB: CColorRGB,
        UserReference: CUserReference,
        AttachKeys: CAttachKeys,
        Rect: CRect,
        iRange: CiRange,
        EffectOffset: CEffectOffset,
        iQuad: CiQuad,
        GameSpeed: CGameSpeed,
        VariatorGameFangle: CVariatorGameFangle,
        VariatorGameFixed: CVariatorGameFixed,
        TimeOfDay: CTimeOfDay,
        StyleName: CStyleName,
        TextureProps: CTextureProps,
        fQuad: CfQuad,
        PitchRange: CPitchRange,
        VolumeRange: CVolumeRange,
        Volume: CVolume,
        TextureSlot: CTextureSlot,
        GameAcceleration: CGameAcceleration,
        ActorMsgPayloadPtr: CActorMsgPayloadPtr,
        ActorSiteOps: CActorSiteOps,
        LabelExpression: CLabelExpression,
        IdSetPlayers: CIdSetPlayers,
        IdSetTeams: CIdSetTeams,
        SubNameKey: CSubNameKey,
        AttachMethods: CAttachMethods,
        ActorClassFilters: CActorClassFilters,
        ActorDeathMembers: CActorDeathMembers,
        GamePoInt3D: CGamePoInt3D,
        CatalogReference: CCatalogReference,
        TextureExpression: CTextureExpression,
        MissileAcceleration: CMissileAcceleration,
        MissileSpeed: CMissileSpeed,
        PhaseOutro: CPhaseOutro,
        ThrowBand: CThrowBand,
        YawPitchRoll: CYawPitchRoll,
        FangleRateMissile: CFangleRateMissile,
        FangleAccelMissile: CFangleAccelMissile,
        Pitch: CPitch,
        FourCC: CFourCC,
        CardId: CCardId,
        PhysicsMaterialLinks: CPhysicsMaterialLinks
    }
    export const  T= {
        CooldownLink: TCooldownLink,
        ChargeLink: TChargeLink,
        MarkerLink: TMarkerLink,
        PowerLink: TPowerLink,
        ProductHyperlinkId: TProductHyperlinkId,
        HyperlinkId: THyperlinkId,
        CatalogFieldPath: TCatalogFieldPath,
        EditorCategories: TEditorCategories,
        GalaxyFunction: TGalaxyFunction,
        CargoSize: TCargoSize,
        CargoCapacity: TCargoCapacity,
        MarkerCount: TMarkerCount,
        PreemptLevel: TPreemptLevel,
        AbilCmdIndex: TAbilCmdIndex,
        CliffLevel: TCliffLevel,
        BattleProductId: TBattleProductId,
        PowerLevel: TPowerLevel,
        ConversationItemId: TConversationItemId,
        TechAlias: TTechAlias,
        DifficultyLevel: TDifficultyLevel,
        AIBuild: TAIBuild,
        PlayerId: TPlayerId,
        MountCategory: TMountCategory,
        BattleLicenseName: TBattleLicenseName,
        AttackTargetPriority: TAttackTargetPriority,
        UnitRadius: TUnitRadius,
        UserFieldId: TUserFieldId,
        UserInstanceId: TUserInstanceId,
        AttachPropIndex: TAttachPropIndex,
        CommanderLevel: TCommanderLevel,
        ConversationStateOpId: TConversationStateOpId,
        ConversationStateIndexId: TConversationStateIndexId,
        ConversationStateVariation: TConversationStateVariation,
        ConversationTag: TConversationTag,
        ConversationStateInfoId: TConversationStateInfoId,
        UpgradeEffectValue: TUpgradeEffectValue,
        FootprintOffsets: TFootprintOffsets,
        FootprintBorders: TFootprintBorders,
        Handicap: THandicap,
        TriggerLibId: TTriggerLibId,
        CmdResult: TCmdResult,
        Difficulty: TDifficulty,
        SoundWeight: TSoundWeight,
        SoundBalance: TSoundBalance,
        VoiceOverSkinId: TVoiceOverSkinId,
        VoiceOverGroupId: TVoiceOverGroupId,
        LocaleId: TLocaleId,
    }
    export const Links= {
        AbilCommand: CAbilCommand,
        Unit: CUnitLink,
        Validator: CValidatorLink,
        Alert: CAlertLink,
        Effect: CEffectLink,
        Button: CButtonLink,
        Abil: CAbilLink,
        Mover: CMoverLink,
        TargetSort: CTargetSortLink,
        Cursor: CCursorLink,
        ItemContainer: CItemContainerLink,
        ItemClass: CItemClassLink,
        Upgrade: CUpgradeLink,
        Accumulator: CAccumulatorLink,
        ScoreValue: CScoreValueLink,
        Reward: CRewardLink,
        Race: CRaceLink,
        AchievementTerm: CAchievementTermLink,
        Achievement: CAchievementLink,
        Preload: CPreloadLink,
        Camera: CCameraLink,
        Model: CModelLink,
        Weapon: CWeaponLink,
        Sound: CSoundLink,
        Beam: CBeamLink,
        Terrain: CTerrainLink,
        Footprint: CFootprintLink,
        Actor: CActorLink,
        HerdNode: CHerdNodeLink,
        ArmyUnit: CArmyUnitLink,
        ArmyUpgrade: CArmyUpgradeLink,
        Skin: CSkinLink,
        Talent: CTalentLink,
        Item: CItemLink,
        PlayerResponse: CPlayerResponseLink,
        BankCondition: CBankConditionLink,
        Boost: CBoostLink,
        CliffMesh: CCliffMeshLink,
        Campaign: CCampaignLink,
        ConsoleSkin: CConsoleSkinLink,
        DataCollection: CDataCollectionLink,
        Commander: CCommanderLink,
        ConversationState: CConversationStateLink,
        Character: CCharacterLink,
        DataCollectionPattern: CDataCollectionPatternLink,
        Kinetic: CKineticLink,
        Emoticon: CEmoticonLink,
        Bundle: CBundleLink,
        ScoreResult: CScoreResultLink,
        Soundtrack: CSoundtrackLink,
        DSP: CDSPLink,
        HeroStat: CHeroStatLink,
        Mount: CMountLink,
        TalentProfile: CTalentProfileLink,
        Map: CMapLink,
        Behavior: CBehaviorLink,
        ArmyCategory: CArmyCategoryLink,
        Location: CLocationLink,
        Objective: CObjectiveLink,
        Light: CLightLink,
        PhysicsMaterial: CPhysicsMaterialLink,
        Conversation: CConversationLink,
        Requirement: CRequirementLink,
        RequirementNode: CRequirementNodeLink,
        Hero: CHeroLink,
        DecalPack: CDecalPackLink,
        Texture: CTextureLink,
        Spray: CSprayLink,
        PortraitPack: CPortraitPackLink,
        Trophy: CTrophyLink,
        VoicePack: CVoicePackLink,
        RaceBannerPack: CRaceBannerPackLink,
        StimPack: CStimPackLink,
        SoundExclusivity: CSoundExclusivityLink,
        SoundMixSnapshot: CSoundMixSnapshotLink,
        TargetFind: CTargetFindLink,
        Tactical: CTacticalLink,
        Reverb: CReverbLink,
        TerrainTex: CTerrainTexLink,
        Tile: CTileLink,
        Cliff: CCliffLink,
        Turret: CTurretLink,
        Loot: CLootLink,
        User: CUserLink,
        Shape: CShapeLink,
        TextureSheet: CTextureSheetLink,
        HeroAbil: CHeroAbilLink,
        String: CStringLink,
        Hotkey: CHotkeyLink,
        Bank: CBankLink
    }
    export const Assets= {
      Asset: CFile,
      Image: CFileImage,
      Movie: CFileMovie,
      Map: CFileMap,
      Model: CFileModel,
      Cutscene: CFileCutscene,
      Font: CFileFont,
      FontStyle: CFileFontStyle,
      Layout: CFileLayout,
      Sound: CFileSound,
      Anims: CFileAnims,
      Facial: CFileFacial,
      SyncModelData: CFileSyncModelData,
      XML: CFileXML,
    }

  
  
  
  
  
  
  
  



SCSchema.types = {
  CString,
  CString4,
  CString32,
  CString50,
  CString80,
  CReals,
  CInts,
  CWords,
  Int,
  Real,
  Real32,
  Link,
  Bit,
  Int8,
  Int16,
  Int32,
  UInt,
  UInt8,
  UInt16,
  UInt32,

  CTexturePath: CFileImage,
  CImagePath: CFileImage,
  CUnitLink,
  CValidatorLink,
  CAlertLink,
  CEffectLink,
  CButtonLink,
  CAbilLink,
  CMoverLink,
  CTargetSortLink,
  CCursorLink,
  CItemContainerLink,
  CItemClassLink,
  CUpgradeLink,
  CAccumulatorLink,
  CScoreValueLink,
  CRewardLink,
  CRaceLink,
  CAchievementTermLink,
  CAchievementLink,
  CPreloadLink,
  CCameraLink,
  CModelLink,
  CWeaponLink,
  CSoundLink,
  CBeamLink,
  CTerrainLink,
  CFootprintLink,
  CActorLink,
  CHerdNodeLink,
  CArmyUnitLink,
  CArmyUpgradeLink,
  CSkinLink,
  CTalentLink,
  CItemLink,
  CPlayerResponseLink,
  CBankConditionLink,
  CBoostLink,
  CCliffMeshLink,
  CCampaignLink,
  CConsoleSkinLink,
  CDataCollectionLink,
  CCommanderLink,
  CConversationStateLink,
  CCharacterLink,
  CDataCollectionPatternLink,
  CKineticLink,
  CEmoticonLink,
  CBundleLink,
  CScoreResultLink,
  CSoundtrackLink,
  CDSPLink,
  CHeroStatLink,
  CMountLink,
  CRequirementLink,
  CTalentProfileLink,
  CMapLink,
  CBehaviorLink,
  CArmyCategoryLink,
  CLocationLink,
  CObjectiveLink,
  CLightLink,
  CPhysicsMaterialLink,
  CConversationLink,
  CRequirementNodeLink,
  CHeroLink,
  CDecalPackLink,
  CTextureLink,
  CSprayLink,
  CPortraitPackLink,
  CTrophyLink,
  CVoicePackLink,
  CRaceBannerPackLink,
  CStimPackLink,
  CSoundExclusivityLink,
  CSoundMixSnapshotLink,
  CTargetFindLink,
  CTacticalLink,
  CReverbLink,
  CTerrainTexLink,
  CTileLink,
  CCliffLink,
  CTurretLink,
  CLootLink,
  CUserLink,
  CShapeLink,
  CTextureSheetLink,
  CHeroAbilLink,
  CStringLink,
  CHotkeyLink,
  CBankLink,

    C3fVector,
    CfQuad,
    C2Vector,
    CFangleArc,
    CFangle,
    CColor,
    CScaleVector,
    C3Vector,
    CColorRGB,
    CColorHDR,
    C2iVector,
    CAbilSetId,
    TEditorCategories,
    TGalaxyFunction,
    CTargetFilters,
    CGameTime,
    CCmdResult,
    CfRange,
    TAbilCmdIndex,
    CAbilCommand,
    CDataSoupKey,
    CGamePoint,
    TCargoSize,
    TCargoCapacity,
    CIdentifier,
    TCooldownLink,
    TChargeLink,
    TMarkerCount,
    TMarkerLink,
    TPreemptLevel,
    CActorKey,
    CActorTerms,
    CActorCreateKey,
    CActorLabelKey,
    CQuad,
    CRange,
    CVariatorActorReal32,
    CRefKey,
    CActorAngle,
    CAnimNameKey,
    CAnimProps,
    CFacing,
    TCliffLevel,
    CVariatorActorAngle,
    CVariatorActorFangle,
    CFangleRate,
    CActorTableKeys1x3,
    CGameRate,
    CDescPath,
    CUserReference,
    THyperlinkId,
    TBattleProductId,
    CAttachKeys,
    TPowerLevel,
    TPowerLink,
    SGameContentCreationData,
    CRect,
    TConversationItemId,
    CiRange,
    CEffectOffset,
    TTechAlias,
    TDifficultyLevel,
    TAIBuild,
    CiQuad,
    CGameSpeed,
    CFourCC,
    TPlayerId,
    TMountCategory,
    CVariatorGameFangle,
    CVariatorGameFixed,
    CTimeOfDay,
    CStyleName,
    CTextureProps,
    TUserInstanceId,
    TProductHyperlinkId,
    TBattleLicenseName,
    CPitchRange,
    CVolumeRange,
    CVolume,
    TCatalogFieldPath,
    TAttackTargetPriority,
    C2fVector,
    CTextureSlot,
    CGameAcceleration,
    TUnitRadius,
    TUserFieldId,
    C4Vector,
    CActorMsgPayloadPtr,
    CActorSiteOps,
    CLabelExpression,
    CIdSetPlayers,
    CIdSetTeams,
    CSubNameKey,
    CAttachMethods,
    CPhysicsMaterialLinks,
    CActorClassFilters,
    CActorDeathMembers,
    TAttachPropIndex,
    TCommanderLevel,
    TConversationStateOpId,
    TConversationStateIndexId,
    TConversationStateVariation,
    CGamePoInt3D,
    TConversationTag,
    TConversationStateInfoId,
    CDataEntryPath,
    CCatalogReference,
    TUpgradeEffectValue,
    TFootprintOffsets,
    TFootprintBorders,
    THandicap,
    TTriggerLibId,
    TCmdResult,
    TDifficulty,
    CTextureExpression,
    CMissileAcceleration,
    CMissileSpeed,
    CPhaseOutro,
    CThrowBand,
    CYawPitchRoll,
    CFangleRateMissile,
    CFangleAccelMissile,
    TSoundWeight,
    TLocaleId,
    CPitch,
    TSoundBalance,
    CCardId,
    TVoiceOverSkinId,
    TVoiceOverGroupId,
}