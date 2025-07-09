import {SCSchema} from "./schema.js"
import E from "./catalog-enums.js"
import {Bit,EUnknown } from "./types.js"

export const CUnknownFlags =  [Bit,EUnknown]
//flags
export const CMarkerFlags = [Bit,E.MarkerMatch]
export const CAbilCmdFlags = CUnknownFlags
export const CActorTransferFlags = CUnknownFlags
export const CActorHostedPropTransferFlags = CUnknownFlags
export const CNotifyAreaFlags = CUnknownFlags
export const CResponseFlags = CUnknownFlags
export const CDamageFlags = CUnknownFlags
export const CCmdFlags = CUnknownFlags
export const CAbilSharedFlagCountFlagArray =  CUnknownFlags
export const CAbilEffectFlagCountFlagArray = CUnknownFlags
export const CabilEffectStageCountFlagArray = CUnknownFlags
export const CAbilBuildFlagCountFlagArray = CUnknownFlags
export const CAbilHarvestFlagCountFlagArray = CUnknownFlags
export const CResourceTypeCountFlagArray = CUnknownFlags
export const CAbilHarvestStageCountFlagArray = CUnknownFlags
export const CcliffLevelCompareCountFlagArray = CUnknownFlags
export const CactorDoodadFlagCountFlagArray = CUnknownFlags
export const CeditorFlagCountFlagArray = CUnknownFlags
export const CunitStatusCountFlagArray = CUnknownFlags
export const CunitStatusGroupCountFlagArray = CUnknownFlags
export const CplayerRelationshipCountFlagArray = CUnknownFlags
export const CartifactTypeCountFlagArray = CUnknownFlags
export const CBehaviorCategoryFlags = [Bit,E.BehaviorCategory]
export const CequipmentDisplayFlagCountFlagArray = CUnknownFlags
export const CbundleFlagCountFlagArray = CUnknownFlags
export const CconversationStateFlagCountFlagArray = CUnknownFlags
export const CeffectRevealFlagCountFlagArray = CUnknownFlags
export const CunitAttributeCountFlagArray = [Bit,E.UnitAttribute]
export const CselectionTransferFlagCountFlagArray = CUnknownFlags
export const CfootprintFlagCountFlagArray = CUnknownFlags
export const CplayerLeaveFlagCountFlagArray = CUnknownFlags
export const CheroFlagCountFlagArray = CUnknownFlags
export const CmountFlagCountFlagArray = CUnknownFlags
export const CpingFlagCountFlagArray = CUnknownFlags
export const CdamageResponseCategoryCountFlagArray = CUnknownFlags
export const CdeathTypeCountFlagArray = CUnknownFlags
export const CdamageKindCountFlagArray = CUnknownFlags
export const CresponseUnitBirthTypeCountFlagArray = CUnknownFlags
export const CrequirementCountFlagArray = CUnknownFlags
export const CrewardFlagCountFlagArray = CUnknownFlags
export const CscoreResultFlagCountFlagArray = CUnknownFlags
export const CscoreValueFlagCountFlagArray = CUnknownFlags
export const CtalentProfileFlagCountFlagArray = CUnknownFlags
export const CtargetFindFlagCountFlagArray = CUnknownFlags
export const CunitFlagCountFlagArray = [Bit,E.UnitFlag]
export const CunitUserFlagCountFlagArray = CUnknownFlags
export const CplaneCountFlagArray = [Bit,E.Plane]
export const CuserFieldFlagCountFlagArray = CUnknownFlags
export const CpathingTypeCountFlagArray = CUnknownFlags
export const CbehaviorModifyCountFlagArray = CUnknownFlags
export const CbehaviorStateCountFlagArray = CUnknownFlags
export const CunitVitalCountFlagArray = [Bit,E.UnitVital]
export const CClassIdCAbilCountFlagArray = [Bit,E.ClassIdCAbil]
export const CclassIdCBehaviorCountFlagArray = [Bit,E.ClassIdCBehavior]
export const CattackTypeResponseCountFlagArray = CUnknownFlags
export const CdamageTypeResponseCountFlagArray = CUnknownFlags
export const CconversationProductionLevelFlagCountFlagArray = CUnknownFlags
export const CeffectModifyTurretFlagCountFlagArray = CUnknownFlags
export const CheroAbilFlagCountFlagArray = CUnknownFlags


export default {
    Unknown: CUnknownFlags,
    Marker: CMarkerFlags,
    AbilCmd: CAbilCmdFlags,
    ActorTransfer: CActorTransferFlags,
    ActorHostedPropTransfer: CActorHostedPropTransferFlags,
    NotifyArea: CNotifyAreaFlags,
    Response: CResponseFlags,
    Damage: CDamageFlags,
    Cmd: CCmdFlags,
    BehaviorCategory: CBehaviorCategoryFlags,
    AbilShared: CAbilSharedFlagCountFlagArray,
    AbilEffect: CAbilEffectFlagCountFlagArray,
    AbilEffectStage: CabilEffectStageCountFlagArray,
    AbilBuild: CAbilBuildFlagCountFlagArray,
    AbilHarvest: CAbilHarvestFlagCountFlagArray,
    ResourceType: CResourceTypeCountFlagArray,
    AbilHarvestStage: CAbilHarvestStageCountFlagArray,
    CliffLevelCompare: CcliffLevelCompareCountFlagArray,
    ActorDoodad: CactorDoodadFlagCountFlagArray,
    Editor: CeditorFlagCountFlagArray,
    UnitStatus: CunitStatusCountFlagArray,
    UnitStatusGroup: CunitStatusGroupCountFlagArray,
    PlayerRelationship: CplayerRelationshipCountFlagArray,
    ArtifactType: CartifactTypeCountFlagArray,
    EquipmentDisplay: CequipmentDisplayFlagCountFlagArray,
    Bundle: CbundleFlagCountFlagArray,
    ConversationState: CconversationStateFlagCountFlagArray,
    EffectReveal: CeffectRevealFlagCountFlagArray,
    UnitAttribute: CunitAttributeCountFlagArray,
    SelectionTransfer: CselectionTransferFlagCountFlagArray,
    Footprint: CfootprintFlagCountFlagArray,
    PlayerLeave: CplayerLeaveFlagCountFlagArray,
    Hero: CheroFlagCountFlagArray,
    Mount: CmountFlagCountFlagArray,
    Ping: CpingFlagCountFlagArray,
    DamageResponseCategory: CdamageResponseCategoryCountFlagArray,
    DeathType: CdeathTypeCountFlagArray,
    DamageKind: CdamageKindCountFlagArray,
    ResponseUnitBirthType: CresponseUnitBirthTypeCountFlagArray,
    Requirement: CrequirementCountFlagArray,
    Reward: CrewardFlagCountFlagArray,
    ScoreResult: CscoreResultFlagCountFlagArray,
    ScoreValue: CscoreValueFlagCountFlagArray,
    TalentProfile: CtalentProfileFlagCountFlagArray,
    TargetFind: CtargetFindFlagCountFlagArray,
    Unit: CunitFlagCountFlagArray,
    UnitUser: CunitUserFlagCountFlagArray,
    Plane: CplaneCountFlagArray,
    UserField: CuserFieldFlagCountFlagArray,
    PathingType: CpathingTypeCountFlagArray,
    BehaviorModify: CbehaviorModifyCountFlagArray,
    BehaviorState: CbehaviorStateCountFlagArray,
    UnitVital: CunitVitalCountFlagArray,
    ClassIdCAbil: CClassIdCAbilCountFlagArray,
    ClassIdCBehavior: CclassIdCBehaviorCountFlagArray,
    AttackTypeResponse: CattackTypeResponseCountFlagArray,
    DamageTypeResponse: CdamageTypeResponseCountFlagArray,
    ConversationProductionLevel: CconversationProductionLevelFlagCountFlagArray,
    EffectModifyTurret: CeffectModifyTurretFlagCountFlagArray,
    HeroAbil: CheroAbilFlagCountFlagArray
}


Object.assign(SCSchema.types,{
    CAbilSharedFlagCountFlagArray,
    CAbilEffectFlagCountFlagArray,
    CabilEffectStageCountFlagArray,
    CAbilBuildFlagCountFlagArray,
    CAbilHarvestFlagCountFlagArray,
    CResourceTypeCountFlagArray,
    CAbilHarvestStageCountFlagArray,
    CClassIdCAbilCountFlagArray,
    CMarkerFlags,
    CAbilCmdFlags,
    CActorTransferFlags,
    CActorHostedPropTransferFlags,
    CplayerLeaveFlagCountFlagArray,
    CconversationStateFlagCountFlagArray,
    CNotifyAreaFlags,
    CResponseFlags,
    CeffectRevealFlagCountFlagArray,
    CunitAttributeCountFlagArray,
    CDamageFlags,
    CCmdFlags,
    CselectionTransferFlagCountFlagArray,
    CfootprintFlagCountFlagArray,
    CheroFlagCountFlagArray,
    CmountFlagCountFlagArray,
    CpingFlagCountFlagArray,
    CdamageResponseCategoryCountFlagArray,
    CdeathTypeCountFlagArray,
    CdamageKindCountFlagArray,
    CresponseUnitBirthTypeCountFlagArray,
    CrequirementCountFlagArray,
    CrewardFlagCountFlagArray,
    CscoreResultFlagCountFlagArray,
    CscoreValueFlagCountFlagArray,
    CtalentProfileFlagCountFlagArray,
    CtargetFindFlagCountFlagArray,
    CunitFlagCountFlagArray,
    CunitUserFlagCountFlagArray,
    CplaneCountFlagArray,
    CuserFieldFlagCountFlagArray,
    CpathingTypeCountFlagArray,
    CbehaviorModifyCountFlagArray,
    CbehaviorStateCountFlagArray,
    CunitVitalCountFlagArray,
    CclassIdCBehaviorCountFlagArray,
    CattackTypeResponseCountFlagArray,
    CdamageTypeResponseCountFlagArray,
    CconversationProductionLevelFlagCountFlagArray,
    CeffectModifyTurretFlagCountFlagArray,
    CheroAbilFlagCountFlagArray,
    CactorDoodadFlagCountFlagArray,
    CeditorFlagCountFlagArray,
    CcliffLevelCompareCountFlagArray,
    CunitStatusCountFlagArray,
    CunitStatusGroupCountFlagArray,
    CartifactTypeCountFlagArray,
    CplayerRelationshipCountFlagArray,
    CBehaviorCategoryFlags,
    CequipmentDisplayFlagCountFlagArray,
    CbundleFlagCountFlagArray
})