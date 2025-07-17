import { FileTypes } from "./files.js";
import { Links } from "./links.js";
import { CDataType, CList, CUnknown, CEnum} from "./core.js";
import N from "./numbers.js";

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


/** Raw data  */
export class CRaw extends CDataType {}


export class CTokenValue extends CDataType{
    static validate(tag, json){
      return true;
      // return SCTypes[json.type].validate(tag)
    }
}

export class VData extends CDataType{
    static validate(tag){
        return !!GAME_CLASSES.includes(tag)
    }
}

export class VStruct extends CDataType{
    static validate(tag){
        return !!GAMEDATA_STRUCTURES.includes(tag)
    }
}

export class CParent extends CDataType{
}



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


/** Month integer (0-12) */
export class Month extends N.Int {
  static min = 0;
  static max = 12;
}

/** Day integer (0-31) */
export class Day extends N.Int {
  static min = 0;
  static max = 31;
}

/** Year integer (0-9999) */
export class Year extends N.Int {
  static min = 0;
  static max = 9999;
}

/** Non-whitespace word */
export class CWord extends CString {
  static regexp = /^\S+$/;
}

/** Link string (no whitespace) */
export class Link extends CString {
  static regexp = /^[^\s]+$/;
}

export class CString4 extends CString {  static maxlength = 4;}
export class CString32 extends CString {  static maxlength = 32;}
export class CString50 extends CString {  static maxlength = 50;}
export class CString80 extends CString {  static maxlength = 80;}

export class CReals extends CList {  static subType = N.Real;}
export class CInts extends CList {  static subType = N.Int;}
export class CWords extends CList {  static subType = CWord;}

export const TCooldownLink = CString
export const TChargeLink = CString
export const TMarkerLink = CString
export const TPowerLink = CString
export const TProductHyperlinkId = CString
export const THyperlinkId = CString
export const TCatalogFieldPath = CString // Attributes[1]
export const TGalaxyFunction = CString

export const TCargoSize = N.Int
export const TCargoCapacity = N.Int
export const TMarkerCount = N.Int
export const TPreemptLevel = N.Int
export const TAbilCmdIndex = N.Int
export const TCliffLevel = N.Int
export const TBattleProductId = N.Int
export const TPowerLevel = N.Int
export const TConversationItemId = CString
export const TTechAlias = CString
export const TDifficultyLevel = N.Int
export const TAIBuild = N.Int
export const TPlayerId = N.Int
export const TMountCategory = CString
export const TBattleLicenseName = CString
export const TAttackTargetPriority = N.Int
export const TUnitRadius = N.Real
export const TUserFieldId = CString
export const TUserInstanceId = CString
export const TAttachPropIndex = N.Int
export const TCommanderLevel = N.Int
export const TConversationStateOpId = CString
export const TConversationStateIndexId = CString
export const TConversationStateVariation = CString
export const TConversationTag = CString
export const TConversationStateInfoId = CString
export const TUpgradeEffectValue = CString
export const TFootprintOffsets = CString //RealArrays
export const TFootprintBorders = CUnknown
export const THandicap = N.Int
export const TTriggerLibId = CString
export const TCmdResult = CString 
export const TDifficulty = N.Int
export const TSoundWeight = N.Int
export const TSoundBalance = N.Int
export const TVoiceOverSkinId = CString
export const TVoiceOverGroupId = CString
export const TLocaleId = CWord
export const SGameContentCreationData = CString //EmoticonPack,LegacyOfTheVoid
export const CDescPath = Link //LotV_UnitStatus/HeroUnitEnergyStatusFrameTemplate layout/frame
export const CAbilSetId =  CString
export const CTargetFilters = CString
export const CFangleArc = N.Real
export const CGameTime = N.Real
export const CCmdResult = CString
export const CfRange = CReals
export const CFangle = N.Real
export const CGamePoint = CReals
export const CIdentifier = CString // <File value="Assets/Sounds/GDI/##prefix##^TemplateParam1^.ogg"/>
export const CColor = CString
export const CActorKey = CString
export const CScaleVector = CReals
export const C3Vector = CReals
export const CQuad = CReals
export const CRange = CReals
export const CVariatorActorReal32 = CReals
export const C2Vector = CReals
export const CEffectOffset = CReals
export const CRect = CReals
export const CfQuad = CReals
export const CVolumeRange = CReals
export const C2fVector = CReals
export const C4Vector = CReals
export const CVariatorActorAngle = CReals
export const CActorCreateKey = CString
export const CActorLabelKey = CString
export const CActorAngle = N.Real
export const CAnimNameKey = CString
export const CAnimProps = CString
export const CFacing = N.Real
export const CColorHDR = CColor
export const CVariatorActorFangle = N.Real
export const CFangleRate = N.Real
export const CActorTableKeys1x3 = CWords
export const CGameRate = N.Real
export const C2iVector = CInts
export const CColorRGB = CColor
export const CUserReference = CUnknown   //PlayerCommanders;ZergDehaka
export const CAttachKeys = CString
export const CiRange = CInts
export const CiQuad = CInts
export const CGameSpeed = N.Real
export const CVariatorGameFangle = N.Real
export const CVariatorGameFixed = CUnknown // N.Real?
export const CTimeOfDay = CUnknown
export const CStyleName = CString
export const CTextureProps = CWords
export const CPitchRange = N.Real
export const CVolume = N.Real
export const CTextureSlot = CUnknown
export const CGameAcceleration = N.Real
export const CLabelExpression = CUnknown
export const CIdSetPlayers = CUnknown
export const CIdSetTeams = CUnknown
export const CSubNameKey = CString
export const CAttachMethods = CUnknown
export const CActorClassFilters = CUnknown
export const CActorDeathMembers = CString//'filters'
export const CGamePoInt3D = CReals
export const CTextureExpression = CUnknown
export const CMissileAcceleration = N.Real
export const CMissileSpeed = N.Real
export const CPhaseOutro = CReals
export const C3fVector = CReals
export const CThrowBand = CReals
export const CYawPitchRoll = CUnknown
export const CFangleRateMissile = N.Real
export const CFangleAccelMissile = N.Real
export const CPitch = CReals
export const CFourCC = CString4
export const CCardId = CString4 

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

export class CDataEntryPath extends CDataType  {
  constructor() {
    super("Link");
  }
  validate(val) {
    let [catalog,entry] = val.split(",")
    return !!this.mod.catalogs[catalog]?.[val]
  }
}


// Special classes not following the simple pattern:

export class CPhysicsMaterialLinks extends CList {
  static separator = " ";
  static subType = Links.CPhysicsMaterialLink;
}


export class CAbilCommand extends CDataType {
  constructor() {
    super("Link");
  }

  static relations(value, trace) {
    let [link, cmd] = value.split(",");
    return [{ type: "Abil", value: link, trace }];
    // return [{type: "AbilCmd", value: value,trace}]
  }

  validate(val) {
    let [ability, command] = val.split(",");
    return !!this.mod.catalogs.Abil?.[ability]?.InfoArray[command]; 
    // TODO: different abilities have different InfoArray / CmdButtonArray
  }
}


export const CTypes = {
  //custom classes
  CPath,
  CUnknown,
  CEnum,
  CParent,
  CTokenValue,

  //game classes
  CString,
  CString4,
  CString32,
  CString50,
  CString80,
  CReals,
  CInts,
  CWords,


  CPhysicsMaterialLinks,
  CAbilCommand,

  CDataSoupKey,



  CDataEntryPath,
  CWord,
  CString,
  CString4,
  CString32,
  CString50,
  CString80,
  CReals,
  CInts,
  CWords,
  CScaleVector,
  CVector3: C3Vector,
  CVector2: C2Vector,
  CVector2i: C2iVector,
  CVector2f: C2fVector,
  CVector4: C4Vector,
  CVector3f: C3fVector,
  CDescPath,
  CAbilSetId,
  CTargetFilters,
  CFangleArc,
  CGameTime,
  CCmdResult,
  CfRange,
  CFangle,
  CGamePoint,
  CIdentifier,
  CColor,
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
  CVariatorActorAngle,
  CColorHDR,
  CVariatorActorFangle,
  CFangleRate,
  CActorTableKeys1x3,
  CGameRate,
  CColorRGB,
  CUserReference,
  CAttachKeys,
  CRect,
  CiRange,
  CEffectOffset,
  CiQuad,
  CGameSpeed,
  CVariatorGameFangle,
  CVariatorGameFixed,
  CTimeOfDay,
  CStyleName,
  CTextureProps,
  CfQuad,
  CPitchRange,
  CVolumeRange,
  CVolume,
  CTextureSlot,
  CGameAcceleration,
  CActorMsgPayloadPtr,
  CActorSiteOps,
  CLabelExpression,
  CIdSetPlayers,
  CIdSetTeams,
  CSubNameKey,
  CAttachMethods,
  CActorClassFilters,
  CActorDeathMembers,
  CGamePoInt3D,
  CCatalogReference,
  CTextureExpression,
  CMissileAcceleration,
  CMissileSpeed,
  CPhaseOutro,
  CThrowBand,
  CYawPitchRoll,
  CFangleRateMissile,
  CFangleAccelMissile,
  CPitch,
  CFourCC,
  CCardId,
}

export const TTypes = {
  TCooldownLink,
  TChargeLink,
  TMarkerLink,
  TPowerLink,
  TProductHyperlinkId,
  THyperlinkId,
  TCatalogFieldPath,
  TEditorCategories,
  TGalaxyFunction,
  TCargoSize,
  TCargoCapacity,
  TMarkerCount,
  TPreemptLevel,
  TAbilCmdIndex,
  TCliffLevel,
  TBattleProductId,
  TPowerLevel,
  TConversationItemId,
  TTechAlias,
  TDifficultyLevel,
  TAIBuild,
  TPlayerId,
  TMountCategory,
  TBattleLicenseName,
  TAttackTargetPriority,
  TUnitRadius,
  TUserFieldId,
  TUserInstanceId,
  TAttachPropIndex,
  TCommanderLevel,
  TConversationStateOpId,
  TConversationStateIndexId,
  TConversationStateVariation,
  TConversationTag,
  TConversationStateInfoId,
  TUpgradeEffectValue,
  TFootprintOffsets,
  TFootprintBorders,
  THandicap,
  TTriggerLibId,
  TCmdResult,
  TDifficulty,
  TSoundWeight,
  TSoundBalance,
  TVoiceOverSkinId,
  TVoiceOverGroupId,
  TLocaleId,
}


export const V = {
  Struct: VStruct,
  Data: VData
}

export const CTypesNamed = Object.fromEntries(
    Object.entries(CTypes).map(([key, value]) => [key.slice(1), value])
);
export const TTypesNamed = Object.fromEntries(
    Object.entries(TTypes).map(([key, value]) => [key.slice(1), value])
);

export const C = {
    Month,
    Day,
    Year,
    ...N,
    GameContentCreationData: SGameContentCreationData,
    ...CTypesNamed
}
export const  T = {
    ...TTypesNamed
}

export const SCTypes =  {
  SGameContentCreationData,
  ...N,
  ...FileTypes,
  ...Links,
  ...CTypes,
  ...TTypes
}
