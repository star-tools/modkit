
import {C,T} from "../types/types.js"
import A from "../types/files.js"
import L from "../types/links.js"
import F from "../types/flags.js"
import E from "../types/enums.js"

// -------------------------------
// Structures
// -------------------------------

export const SStruct = {
}

export const SProductReleaseDate = {
    ...SStruct,
    Month: C.Month,
    Day: C.Day,
    Year: C.Year,
    value: C.String
}
export const SAbilOrderDisplay = {
    ...SStruct,
    DisplayType: E.AbilOrderDisplayType,
    Color: C.Color,
    Model: A.Model,
    Scale: C.Real32,
    LineTexture: A.Image,
}
export const SEffectBehavior = {
    ...SStruct,
    Behavior: L.Behavior,
    Count: C.UInt32,
    Flags: F.Unknown,
    Duration: C.GameTime,
}
export const SCooldown = {
    ...SStruct,
    Link: T.CooldownLink,
    Location: E.CooldownLocation,
    TimeStart: C.GameTime,
    Operation: E.CooldownOperation,
    TimeUse: C.GameTime,
}
export const SCharge = {
    ...SStruct,
    CountMax: C.Real,
    CountStart: C.Real,
    CountUse: C.Real,
    HideCount: C.Bit,
    Link: T.ChargeLink,
    Location: E.ChargeLocation,
    TimeDelay: C.GameTime,
    TimeStart: C.GameTime,
    TimeUse: C.GameTime,
    Flags: F.Unknown,
}
export const SCost = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital:  [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
}
export const SCostFactor = {
    ...SStruct,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Resource: [C.Real,E.ResourceType],
    Charge: C.Real,
    Cooldown: C.Real,
}
export const STargetSorts = {
    ...SStruct,
    SortArray: [L.TargetSort],
    RequestCount: C.UInt32,
    RequestPercentage: C.Real,
}
export const SMarker = {
    ...SStruct,
    Count: T.MarkerCount,
    Duration: C.GameTime,
    MatchFlags: F.Marker,
    MismatchFlags: F.Marker,
    Link: T.MarkerLink,
}
export const SAbilTargetCursorInfo = {
    ...SStruct,
    Invalid: L.Cursor,
    Normal: L.Cursor,
    Allied: L.Cursor,
    Enemy: L.Cursor,
}
export const SAbilCmdButton = {
    ...SStruct,
    AutoQueueId: C.Identifier,
    DefaultButtonFace: L.Button,
    Flags: F.AbilCmd,
    State: E.AbilCmdState,
    Requirements: L.Requirement,
    PreemptLevel: T.PreemptLevel,
}
export const SAbilArmMagazineInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Count: C.UInt32,
    CountStart: C.UInt32,
    Distance: C.Real,
    Flags: F.Unknown,
    Manage: E.AbilArmMagazineManage,
    Unit: L.Unit,
}
export const SAbilBuildInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Unit: L.Unit,
    Delay: C.GameTime,
    Time: C.GameTime,
    Alert: L.Alert,
    ValidatorArray: [L.Validator],
    AddOnParentCmdPriority: C.Int32,
    PeonKillFinish: C.Bit,
}
export const SAbilInventoryInfo = {
    ...SStruct,
    Alignment: E.AbilInventoryAlignment,
    Container: L.ItemContainer,
    Item: L.Unit,
    EmptyFace: L.Button,
    Classes: [L.ItemClass],
    Requirements: L.Requirement,
}
export const SAbilLearnInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Abil: L.Abil,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
}
export const SAbilMergeInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Unit: L.Unit,
    Time: C.GameTime,
}
export const SAbilMorphSection = {
    ...SStruct,
    DurationArray: [C.GameTime],
    UseBuildTimeArray: F.Unknown,
    EffectArray: [L.Effect],
}
export const SAbilMorphInfo = {
    ...SStruct,
    Score: C.Bit,
    Unit: L.Unit,
    CollideRange: C.Real,
    SectionArray: [SAbilMorphSection],
    RallyResetPhase: E.AbilMorphPhase,
    RallyResetSection: E.AbilMorphSection,
    RandomDelayMin: C.GameTime,
    RandomDelayMax: C.GameTime,
}
export const SAbilPawnInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    ClassRequired: L.ItemClass,
    ClassesExcluded: [L.ItemClass],
    RefundFraction: [C.Real],
    TargetFilters: C.TargetFilters,
    ValidatorArray: [L.Validator],
}
export const SAbilRallyInfo = {
    ...SStruct,
    AllowSetOnGround: C.Bit,
    AllowSetFilters: C.TargetFilters,
    AllowSetValidators: [L.Validator],
    SetOnGround: C.Bit,
    SetFilters: C.TargetFilters,
    SetValidators: [L.Validator],
    UseFilters: C.TargetFilters,
    UseValidators: [L.Validator],
}
export const SAbilResearchInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Upgrade: L.Upgrade,
}
export const SAbilReviveCmdButton = {
    ...SStruct,
    AutoQueueId: C.Identifier,
    DefaultButtonFace: L.Button,
    Flags: F.AbilCmd,
    State: E.AbilCmdState,
    Requirements: L.Requirement,
    PreemptLevel: T.PreemptLevel,
    ReviverIndex: C.UInt32,
    ValidatorArray: [L.Validator],
}
export const SAbilReviveInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Time: C.GameTime,
    Alert: L.Alert,
}
export const SAbilReviveInfoMax = {
    ...SStruct,
    ResourceFactor: [C.Real],
    TimeFactor: C.Real,
    Resource: [C.Int32,E.ResourceType],
    Time: C.GameTime,
}
export const SAbilSpecializeInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Effect: L.Effect,
    Flags: F.Unknown,
}
export const SAbilTrainInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Unit: [L.Unit],
    Effect: L.Effect,
    Location: E.AbilTrainLocation,
    Rotation: E.AbilTrainRotation,
    Flags: F.Unknown,
}
export const SAbilWarpTrainInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Button: SAbilCmdButton,
    Time: C.GameTime,
    Alert: L.Alert,
    Unit: L.Unit,
}
export const SEffectWhichUnit = {
    ...SStruct,
    Effect: L.Effect,
    Value: E.EffectUnit,
    History: E.EffectHistory,
}
export const SEffectWhichLocation = {
    ...SStruct,
    Effect: L.Effect,
    Value: E.EffectLocation,
    History: E.EffectHistory,
}
export const SEffectWhichBehavior = {
    ...SStruct,
    Effect: L.Effect,
    Value: E.EffectUnit,
    History: E.EffectHistory,
    Behavior: L.Behavior,
}
export const SAccumulatorSwitchCase = {
    ...SStruct,
    Validator: L.Validator,
    Accumulator: L.Accumulator,
    FallThrough: C.Bit,
}
export const SAccumulatedFixed = {
    ...SStruct,
    value: C.Real,
    AccumulatorArray: [L.Accumulator],
}
export const SAccumulatedUInt32 = {
    ...SStruct,
    AccumulatorArray: [L.Accumulator],
    value: C.UInt32
}
export const SAccumulatedGameRate = {
    ...SStruct,
    AccumulatorArray: [L.Accumulator],
    value: C.Real
}
export const SAccumulatedGameTime = {
    ...SStruct,
    AccumulatorArray: [L.Accumulator],
    value: C.Real
}
export const SEffectWhichPlayer = {
    ...SStruct,
    Effect: L.Effect,
    Value: E.EffectPlayer,
}
export const SAchievementTag = {
    ...SStruct,
    Value: C.FourCC,
    Check: E.AchievementTagCheck,
}
export const SActorRequest = {
    ...SStruct,
    Subject: C.RefKey,
    Scope: E.ActorRequestScope,
    Actor: E.ActorRequestActor,
    Effect: L.Effect,
    FailOnNoHost: C.Bit,
    ReachAcrossEffectTrees: C.Bit,
}
export const SActorVisibilityShape = {
    ...SStruct,
    Shape: L.Shape,
}
export const SActorEvent = {
    ...SStruct,
    Terms: C.ActorTerms,
    Target: C.RefKey,
    Send: C.ActorMsgPayloadPtr,
}
export const SActorSiteOpsData = {
    ...SStruct,
    Ops: C.ActorSiteOps,
    HoldPosition: C.Bit,
    HoldRotation: C.Bit,
}
export const SActorModelAspect = {
    ...SStruct,
    Person: E.ActorModelAspectPerson,
    ObservingPoV: E.ActorModelAspectObservingPoV,
    RegardsAs: E.ActorModelAspectRegardsAs,
    During: E.ActorModelAspectDuring,
    LabelExpression: C.LabelExpression,
    ObservedPlayerType: E.ActorModelAspectObservedPlayerType,
    ObservedPlayerHasPlayerId: C.IdSetPlayers,
    ObservedPlayerHasTeamId: C.IdSetTeams,
    ModelOwnerType: E.ActorModelAspectModelOwnerType,
    ModelOwnerHasPlayerId: C.IdSetPlayers,
    ModelOwnerHasTeamId: C.IdSetTeams,
    ModelOwnerLabelExpression: C.LabelExpression,
    Test: E.ActorModelAspectTest,
    Model: L.Model,
    Name: C.SubNameKey,
}
export const SActorModelAspectSet = {
    ...SStruct,
    TriggerModel: L.Model,
    Aspects: [SActorModelAspect],
}
export const SAttachQuery = {
    ...SStruct,
    Methods: C.AttachMethods,
    Fallback: E.AttachKeyword,
}
export const SActorHostedAttach = {
    ...SStruct,
    Name: C.ActorLabelKey,
    AttachQuery: SAttachQuery,
    HostSiteOps: SActorSiteOpsData,
}
export const SEventDataFootprint = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Actor: C.ActorCreateKey,
    Model: L.Model,
}
export const SEventDataSound = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Actor: C.ActorCreateKey,
    Sound: L.Sound,
}
export const SActorPhysicsImpactData = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Group: C.ActorLabelKey,
    ActorModel: C.ActorCreateKey,
    ModelLink: L.Model,
    ActorSound: C.ActorCreateKey,
    SoundLink: L.Sound,
    AutoVolumeRange: E.ActorPhysicsImpactRangeType,
    AutoVolumeRangeMin: C.Real32,
    AutoVolumeRangeMax: C.Real32,
    SiteOps: SActorSiteOpsData,
    OccuranceThrottlingDistance: C.VariatorActorReal32,
    OccuranceThrottlingDistanceTimeout: C.Real32,
    OccuranceThrottlingPeriod: C.VariatorActorReal32,
}
export const SActorRangeAbil = {
    ...SStruct,
    Link: L.Abil,
    Index: T.AbilCmdIndex,
}
export const SActorQuadDecoration = {
    ...SStruct,
    Actor: C.ActorCreateKey,
    SpawnInterval: C.Real32,
    TravelSpeed: C.Real32,
    TravelFunction: E.ActorQuadDecorationFunction,
    TravelFunctionParam: C.Real32,
    Flags: F.Unknown,
}
export const SActorSoundLayer = {
    ...SStruct,
    Sound: L.Sound,
    Chance: [C.UInt8],
    Pitch: [C.PitchRange],
    PitchSource: E.ActorSoundValueSource,
    PlayDelay: [C.iRange],
    PlayDelaySource: E.ActorSoundValueSource,
    Volume: [C.VolumeRange],
    VolumeSource: E.ActorSoundValueSource,
}
export const SActorAVPair = {
    ...SStruct,
    Model: L.Model,
    Scale: C.ScaleVector,
    AnimProps: C.AnimProps,
    Sound: L.Sound,
}
export const SActorActionTerrainSquib = {
    ...SStruct,
    Model: L.Model,
    Scale: C.ScaleVector,
    AnimProps: C.AnimProps,
    Sound: L.Sound,
    TerrainPhysicsMaterial: C.PhysicsMaterialLinks,
    DistanceMaxFromTerrainToCreate: C.Real32,
}
export const SActorAVCluster = {
    ...SStruct,
    Model: L.Model,
    Scale: C.ScaleVector,
    AnimProps: C.AnimProps,
    Sound: L.Sound,
    ModelReaction: L.Model,
    AnimPropsReaction: C.AnimProps,
    ScaleReaction: C.ScaleVector,
}
export const SActorPhysicsData = {
    ...SStruct,
    Name: C.ActorLabelKey,
    MatchKeys: C.ActorTableKeys1x3,
    AttackModelVariation: C.Int32,
    AttackAnimProps: C.AnimProps,
    Physics: C.ActorCreateKey,
    Flags: F.Unknown,
}
export const SActorQuerySubject = {
    ...SStruct,
    Filters: C.ActorClassFilters,
    Terms: C.ActorTerms,
}
export const SActorQueryResponse = {
    ...SStruct,
    Target: C.RefKey,
    Send: C.ActorMsgPayloadPtr,
    Scope: E.ActorResponseScope,
}
export const SActorSendBasics = {
    ...SStruct,
    Target: C.RefKey,
    Send: C.ActorMsgPayloadPtr,
}
export const SActorQuerySubjectResponse = {
    ...SStruct,
    Filters: C.ActorClassFilters,
    IntersectType: E.ActorIntersectType,
    Terms: C.ActorTerms,
    OnResponse: [SActorSendBasics],
}
export const SActorDeathBodySquib = {
    ...SStruct,
    Name: C.ActorLabelKey,
    ActorModel: C.ActorCreateKey,
    Model: L.Model,
    ModelSiteOps: SActorSiteOpsData,
    ModelAttachQuery: SAttachQuery,
    ActorSound: C.ActorCreateKey,
    Sound: L.Sound,
    SoundSiteOps: SActorSiteOpsData,
    SoundAttachQuery: SAttachQuery,
    RequiredSquibType: E.SquibType,
    IsFallback: C.Bit,
}
export const SActorCloakState = {
    ...SStruct,
    Enter: C.AnimProps,
    Loop: C.AnimProps,
}
export const SActorCloakTransition = {
    ...SStruct,
    StateArray: [SActorCloakState],
}
export const SActorCreepHeightClass = {
    ...SStruct,
    Name: C.ActorLabelKey,
    StartOffset: C.Real32,
    SolidHeight: C.Real32,
    FadeHeight: C.Real32,
}
export const SActorCreepRate = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Rate: C.Real32,
}
export const SActorDeathData = {
    ...SStruct,
    ActorModel: C.ActorCreateKey,
    ActorModelLow: C.ActorCreateKey,
    AnimProps: C.AnimProps,
    ModelLink: L.Model,
    SoundLink: L.Sound,
    VoiceLink: L.Sound,
    BodySquibs: [SActorDeathBodySquib],
}
export const SActorDeathDataCustom = {
    ...SStruct,
    ActorModel: C.ActorCreateKey,
    ActorModelLow: C.ActorCreateKey,
    AnimProps: C.AnimProps,
    ModelLink: L.Model,
    SoundLink: L.Sound,
    VoiceLink: L.Sound,
    BodySquibs: [SActorDeathBodySquib],
    Name: C.ActorLabelKey,
    PhysicsMatchKeysOrdered: C.ActorTableKeys1x3,
    InheritsFrom: C.ActorLabelKey,
    IsAbstract: C.Bit,
}
export const SLookAtTypeInfo = {
    ...SStruct,
    Group: C.ActorKey,
    Weight: C.Real,
    Time: C.UInt32,
    Rate: C.ActorAngle,
}
export const SLookAtType = {
    ...SStruct,
    Id: C.String80,
    Name: L.String,
    Start: [SLookAtTypeInfo],
    Stop: [SLookAtTypeInfo],
}
export const SSplatEmitterMaterialInfo = {
    ...SStruct,
    MaterialId: C.UInt8,
    ReplacementLayers: F.Unknown,
}
export const SSplatEmitterInitInfo = {
    ...SStruct,
    TextureResolution: C.Vector2i,
    ProjectorModel: L.Model,
    MaskBlobPath: A.Image,
    ScaleDeltaTime: C.Vector2,
    ScaleUpdateTime: C.Real,
    MaxBlobScale: C.Vector2,
    Tint: C.Color,
    MaterialInfo: [SSplatEmitterMaterialInfo],
    TerrainUVTiling: C.Vector4,
    MinHeightValue: C.Real32,
}
export const SActorOverrideBlendTime = {
    ...SStruct,
    AnimProps: C.AnimProps,
    BlendIn: C.Real32,
    BlendOut: C.Real32,
}
export const SActorOverrideTransitionBlendTime = {
    ...SStruct,
    Type: E.ActorAnimTransitionType,
    From: C.AnimProps,
    FromMatch: E.ActorAnimPropMatchType,
    To: C.AnimProps,
    ToMatch: E.ActorAnimPropMatchType,
    Blend: C.Real32,
}
export const SActorOverrideModel = {
    ...SStruct,
    Model: [L.Model],
    Blend: [SActorOverrideBlendTime],
    Transition: [SActorOverrideTransitionBlendTime],
}
export const SActorProgressStage = {
    ...SStruct,
    AnimProps: C.AnimProps,
    BlendTime: C.Real32,
    Sound: L.Sound,
}
export const SActorHostedDelta = {
    ...SStruct,
    Subject: C.RefKey,
    LocalOffset: C.Vector3,
    AttachQuerySource: SAttachQuery,
    AttachQueryTarget: SAttachQuery,
}
export const SSerpentAggregate = {
    ...SStruct,
    Type: E.SerpentType,
    BaseElementLengthMax: C.Real32,
    SegmentRotationRate: C.ActorAngle,
    SwimmingUndulationElementLength: C.Real32,
    SwimmingUndulationStartOffset: C.Real32,
    SwimmingUndulationAmplitudePerUnit: C.Real32,
    SwimmingUndulationWavelength: C.Real32,
    SwimmingUndulationIdlePhaseVelocity: C.Real32,
    TurnSmoothingActivationAngleMin: C.ActorAngle,
    TurnSmoothingActivationAngleMax: C.ActorAngle,
    TurnSmoothingRadiusMax: C.Real32,
    UncoilingWhileIdleRotationRateMin: C.ActorAngle,
    UncoilingWhileIdleRotationRateMax: C.ActorAngle,
    Flags: F.Unknown,
}
export const SSerpentSegment = {
    ...SStruct,
    Radius: C.Real32,
}
export const SActorStateInfo = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Terms: C.ActorTerms,
}
export const SActorBaseline = {
    ...SStruct,
    AnimProps: C.AnimProps,
    BlendIn: C.Real32,
    BlendOut: C.Real32,
}
export const SActorDeathDataCustomGroup = {
    ...SStruct,
    Name: C.ActorLabelKey,
    Members: C.ActorDeathMembers,
    Supersedes: C.ActorTableKeys1x3,
    SyncPassChance: C.Real,
}
export const SActorUnitImpactSoundExtras = {
    ...SStruct,
    TriggerModel: L.Model,
    SoundActor: C.ActorCreateKey,
    Sound: L.Sound,
}
export const SDamagePastRemainingHealth = {
    ...SStruct,
    Value: C.Real,
    TestType: E.ActorOverkillTestType,
}
export const SDamageOverInterval = {
    ...SStruct,
    Value: C.Real,
    Interval: C.Real,
    TestType: E.ActorOverkillTestType,
}
export const STerrainSquibVisual = {
    ...SStruct,
    TerrainPhysicsMaterial: L.PhysicsMaterial,
    ActorModel: C.ActorCreateKey,
    ActorModelLow: C.ActorCreateKey,
    ModelLink: L.Model,
    Flags: F.Unknown,
}
export const STerrainSquib = {
    ...SStruct,
    GroupName: C.ActorLabelKey,
    AttachQuery: SAttachQuery,
    MovementDistance: C.VariatorActorReal32,
    IdlePeriod: C.VariatorActorReal32,
    RangeUp: C.Real32,
    RangeUpFade: C.Real32,
    RangeDown: C.Real32,
    RangeDownFade: C.Real32,
    Visuals: [STerrainSquibVisual],
}
export const SUnitAbilSound = {
    ...SStruct,
    AbilCmd: C.AbilCommand,
    Sound: L.Sound,
    GroupSound: L.Sound,
}
export const SErrorOverride = {
    ...SStruct,
    Error: E.CmdResult,
    Text: L.String,
    Sound: L.Sound,
    GroupSound: L.Sound,
}
export const SLayerIcon = {
    ...SStruct,
    Image: [A.Image],
}
export const SLayerIconVariation = {
    ...SStruct,
    Image: [A.Image],
    Number: C.Int32,
}
export const SLayerIconShield = {
    ...SStruct,
    Image: [A.Image],
}
export const SLayerIconShieldVariation = {
    ...SStruct,
    Image: [A.Image],
    Number: C.UInt32,
}
export const SVitalColor = {
    ...SStruct,
    ColorArray: [C.Color],
}
export const SIconVariation = {
    ...SStruct,
    Number: C.UInt32,
    Image: A.Image,
}
export const SStatusColor = {
    ...SStruct,
    BackgroundColor: C.Color,
    EmptyColor: C.Color,
    ColorArray: [C.Color],
}
export const SStatusChargeData = {
    ...SStruct,
    Text: L.String,
    AbilCmd: C.AbilCommand,
}
export const SStatusHarvesterData = {
    ...SStruct,
    Text: L.String,
    SearchFilters: C.TargetFilters,
    SearchRadius: C.Real,
}
export const STextTagParameters = {
    ...SStruct,
    Text: L.String,
    TextShadow: C.Bit,
    Offset: C.Vector2i,
    Attachment: E.AttachmentID,
    FontSize: C.UInt32,
    TextColor: C.Color,
    EdgeColor: C.Color,
    BackgroundColor: C.Color,
    BackgroundImage: A.Image,
    BackgroundImageTiled: C.Bit,
}
export const SUnitKillRank = {
    ...SStruct,
    MinKills: C.UInt32,
    Text: L.String,
}
export const SBankPath = {
    ...SStruct,
    File: L.Bank,
    Section: C.String,
    Key: C.String,
}
export const SArtifactRank = {
    ...SStruct,
    RequiredRewardArray: [L.Reward],
    ProductId: T.BattleProductId,
}
export const SAttachKey = {
    ...SStruct,
    Keyword: E.AttachKeyword,
    Index: T.AttachPropIndex,
}
export const SDeathResponse = {
    ...SStruct,
    Chance: C.Real,
    Cost: SCost,
    Effect: L.Effect,
    Relationship: F.PlayerRelationship,
    Type: F.DeathType,
}
export const SAttributeChange = {
    ...SStruct,
    Attribute: L.Behavior,
    Points: C.Int32,
}
export const SDamageKind = {
    ...SStruct,
    KindArray: [C.Real],
}
export const SScoreValueUpdate = {
    ...SStruct,
    Validator: L.Validator,
    Value: L.ScoreValue,
}
export const SUnitResourceRatio = {
    ...SStruct,
    Amount: [C.Real,E.ResourceType],
}
export const SUnitWeaponData = {
    ...SStruct,
    Link: L.Weapon,
    Turret: L.Turret,
}
export const SModification = {
    ...SStruct,
    ModifyFlags: F.BehaviorModify,
    StateFlags: F.BehaviorState,
    AttackTargetPriority: T.AttackTargetPriority,
    RadiusMultiplier: C.Real,
    Height: C.Real,
    HeightTime: [C.GameTime],
    SightBonus: C.Real,
    SightMaximum: C.Real,
    SightMinimum: C.Real,
    QueueCount: C.Int32,
    QueueSize: C.Int32,
    TimeScale: C.Real,
    HealDealtMultiplier: C.Real,
    HealTakenMultiplier: C.Real,
    HealDealtAdditiveMultiplier: C.Real,
    HealTakenAdditiveMultiplier: C.Real,
    MoveSpeedBaseMaximumBonus: C.GameSpeed,
    MoveSpeedMaximum: C.GameSpeed,
    MoveSpeedMinimum: C.GameSpeed,
    MoveSpeedBonus: C.GameSpeed,
    MoveSpeedMultiplier: C.Real,
    UnifiedMoveSpeedFactor: C.Real,
    AdditiveMoveSpeedFactor: SAccumulatedFixed,
    AccelerationBonus: C.GameAcceleration,
    AccelerationMultiplier: C.Real,
    DecelerationBonus: C.GameAcceleration,
    DecelerationMultiplier: C.Real,
    SnareMultiplier: C.Real,
    AttackSpeedMultiplier: C.Real,
    UnifiedAttackSpeedFactor: C.Real,
    AdditiveAttackSpeedFactor: SAccumulatedFixed,
    WeaponRange: C.Real,
    MeleeWeaponRange: C.Real,
    RangedWeaponRange: C.Real,
    WeaponMinRange: C.Real,
    DamageDealtScaled: [C.Real,E.DamageKind],
    DamageDealtFraction: [SAccumulatedFixed,E.DamageKind],
    DamageDealtUnscaled: [SAccumulatedFixed,E.DamageKind],
    DamageDealtMaximum: [C.Real,E.DamageKind],
    DamageDealtMinimum: [C.Real,E.DamageKind],
    DamageDealtAttributeScaled: [C.Real,E.UnitAttribute],
    DamageDealtAttributeMultiplier: [C.Real,E.UnitAttribute],
    DamageDealtAttributeUnscaled: [C.Real,E.UnitAttribute],
    DamageTakenScaled: [C.Real,E.DamageKind],
    DamageTakenFraction: [C.Real,E.DamageKind],
    DamageTakenUnscaled: [C.Real,E.DamageKind],
    DamageTakenMaximum: [C.Real,E.DamageKind],
    DamageTakenMinimum: [C.Real,E.DamageKind],
    DamageTotalMultiplier: [C.Real,E.DamageKind],
    UnifiedDamageDealtFraction: [C.Real,E.DamageKind],
    UnifiedDamageTakenFraction: [C.Real,E.DamageKind],
    LifeArmorBonus: SAccumulatedFixed,
    LifeArmorMultiplier: C.Real,
    ShieldArmorBonus: C.Real,
    ShieldArmorMultiplier: C.Real,
    EnergyArmorBonus: C.Real,
    EnergyArmorMultiplier: C.Real,
    ShieldDamageRatioBonus: C.Real,
    ShieldDamageRatioMultiplier: C.Real,
    EnergyDamageRatioBonus: SAccumulatedFixed,
    EnergyDamageRatioMultiplier: C.Real,
    ResourceHarvestAmountBonus: [C.UInt32,E.ResourceType],
    ResourceHarvestAmountMultiplier: [C.Real,E.ResourceType],
    ResourceHarvestTimeBonus: [C.GameTime,E.ResourceType],
    ResourceHarvestTimeMultiplier: [C.Real,E.ResourceType],
    VitalMaxIncreaseAffectsCurrentArray: F.UnitVital,
    VitalMaxDecreaseAffectsCurrentArray: F.UnitVital,
    VitalMaxArray: [C.Real,E.UnitVital],
    VitalMaxFractionArray: [C.Real,E.UnitVital],
    VitalMaxAdditiveMultiplierArray: [C.Real,E.UnitVital],
    VitalRegenArray: [SAccumulatedGameRate,E.UnitVital],
    VitalRegenMultiplier: [C.Real,E.UnitVital],
    VitalDamageGainArray: [SDamageKind,E.UnitVital],
    VitalDamageGainScoreArray: [SScoreValueUpdate,E.UnitVital],
    VitalDamageLeechArray: [SDamageKind,E.UnitVital],
    VitalDamageLeechScoreArray: [SScoreValueUpdate,E.UnitVital],
    ResourceDamageLeech: [SUnitResourceRatio,E.DamageKind],
    AbilCategoriesEnable: F.Unknown,
    AbilCategoriesDisable: F.Unknown,
    AbilClassEnableArray: F.ClassIdCAbil,
    AbilClassDisableArray: F.ClassIdCAbil,
    AbilTechAliasEnableArray: [T.TechAlias],
    AbilTechAliasDisableArray: [T.TechAlias],
    AbilLinkEnableArray: [L.Abil],
    AbilLinkDisableArray: [L.Abil],
    BehaviorCategoriesEnable: F.BehaviorCategory,
    BehaviorCategoriesDisable: F.BehaviorCategory,
    BehaviorCategoryDurationFactor: [C.Real,E.BehaviorCategory],
    BehaviorClassEnableArray: F.ClassIdCBehavior,
    BehaviorClassDisableArray: F.ClassIdCBehavior,
    BehaviorLinkEnableArray: [L.Behavior],
    BehaviorLinkDisableArray: [L.Behavior],
    WeaponArray: [SUnitWeaponData],
    WeaponScanBonus: C.Real,
    WeaponScanLimit: C.Real,
    WeaponEnableArray: [L.Weapon],
    WeaponDisableArray: [L.Weapon],
    TurretEnableArray: [L.Turret],
    TurretDisableArray: [L.Turret],
    SoundArray: [L.Sound,E.SoundCategory],
    Detect: C.Real,
    DetectArc: C.FangleArc,
    DetectBonus: C.Real,
    DetectFilters: C.TargetFilters,
    Radar: C.Real,
    RadarArc: C.FangleArc,
    RadarFilters: C.TargetFilters,
    Food: C.Real,
    AttributeChangeArray: [SAttributeChange],
    RateMultiplierArray: [C.Real],
    DeathResponse: SDeathResponse,
    PlaneDelta: [C.Int8,E.Plane],
    ScoreKillBonus: C.Int32,
    ScoreLostBonus: C.Int32,
    SubgroupPriority: C.Int16,
    UnitNameOverride: L.String,
    XPMultiplier: C.Real,
    XPScaledBonus: C.Real,
    XPUnscaledBonus: C.Real,
    KillXPBonus: C.Int32,
    CriticalAttackChanceMultiplier: C.Real,
    CriticalAttackChanceScaledBonus: C.Real,
    CriticalAttackChanceUnscaledBonus: C.Real,
}
export const SVeterancyLevel = {
    ...SStruct,
    InfoIcon: A.Image,
    MinVeterancyXP: C.UInt32,
    Modification: SModification,
    LevelGainEffect: L.Effect,
    LevelLossEffect: L.Effect,
    RankNameSchema: L.String,
}
export const SBehaviorFraction = {
    ...SStruct,
    Fraction: SAccumulatedFixed,
    TargetFilters: C.TargetFilters,
}
export const SEffectWhichTimeScale = {
    ...SStruct,
    Effect: L.Effect,
    Value: E.EffectTimeScale,
}
export const SBehaviorDuration = {
    ...SStruct,
    Duration: SAccumulatedGameTime,
    ValidatorArray: [L.Validator],
}
export const SDamageResponse = {
    ...SStruct,
    ClampMaximum: C.Real,
    ClampMinimum: C.Real,
    Exhausted: L.Effect,
    Evade: C.Bit,
    Fatal: C.Bit,
    Handled: L.Effect,
    Ignore: [C.Real],
    Kind: F.DamageKind,
    Location: E.DamageLocation,
    Maximum: C.Real,
    Minimum: C.Real,
    ModifyAmount: SAccumulatedFixed,
    ModifyFraction: C.Real,
    ModifyLimit: C.Real,
    ModifyLimitVitalMaxFractionArray: [C.Real,E.UnitVital],
    ModifyMinimumDamage: C.Bit,
    TargetFilters: C.TargetFilters,
    RequireEffectArray: [L.Effect],
    ExcludeEffectArray: [L.Effect],
    RequireEffectInChainArray: [L.Effect],
    ExcludeEffectInChainArray: [L.Effect],
    ValidatorArray: [L.Validator],
    DamageValue: E.DamageResponseDamageValue,
    ModifyScoreArray: [SScoreValueUpdate],
    Priority: C.Int8,
    ProvideCategories: F.DamageResponseCategory,
    PreventCategories: F.DamageResponseCategory,
    BlockChance: SAccumulatedFixed,
    DeflectChance: SAccumulatedFixed,
    MissingChance: SAccumulatedFixed,
    Chance: SAccumulatedFixed,
    Cost: SCost,
    AttackType: F.AttackTypeResponse,
    DamageType: F.DamageTypeResponse,
    HandledValue: E.DamageResponseHandledValue,
}
export const SVitalRegenVitalRemain = {
    ...SStruct,
    AmountMissing: C.Real,
    RegenModification: C.GameRate,
}
export const SAbilReplace = {
    ...SStruct,
    Origin: L.Abil,
    New: L.Abil,
}
export const SAbilAdd = {
    ...SStruct,
    Abil: L.Abil,
    OverrideCardId: C.Bit,
    CardId: C.FourCC,
}
export const SPowerStage = {
    ...SStruct,
    MaxStackCount: C.UInt32,
    MinPowerLevel: T.PowerLevel,
    Modification: SModification,
    LevelGainEffect: L.Effect,
    LevelLossEffect: L.Effect,
    AbilReplace: [SAbilReplace],
    AbilAdd: [SAbilAdd],
}
export const SSpawnInfo = {
    ...SStruct,
    Unit: L.Unit,
    Count: C.UInt32,
    MaxCount: C.UInt32,
    StartCount: C.UInt32,
    Requirements: L.Requirement,
    Delay: C.GameTime,
    Effect: L.Effect,
}
export const STooltipBlock = {
    ...SStruct,
    Validator: L.Validator,
    Text: L.String,
    Face: L.Button,
}
export const STooltipTimeAbilCmd = {
    ...SStruct,
    AbilCmd: C.AbilCommand,
}
export const SButtonCardLayout = {
    ...SStruct,
    Row: C.UInt8,
    Column: C.UInt8,
    CardId: C.FourCC,
}
export const SCameraParam = {
    ...SStruct,
    Modify: C.Bit,
    Value: C.Real32,
}
export const SCameraZoom = {
    ...SStruct,
    Param: [SCameraParam],
}
export const SCameraSmooth = {
    ...SStruct,
    SmoothTimeMin: C.Real32,
    SmoothTimeMax: C.Real32,
    DisplacementMin: C.Real32,
    VelocityMax: C.Real32,
}
export const SMovieConfig = {
    ...SStruct,
    Name: L.String,
    Path: A.Movie,
    Source: C.Identifier,
}
export const SCampaignData = {
    ...SStruct,
    Id: C.String,
    Name: L.String,
    Subtitle: L.String,
    Description: L.String,
    ImagePath: A.Image,
    LaunchMap: C.String,
    ProgressLaunchMap: C.String,
    TutorialMap: C.String,
    SaveName: C.String,
    CompletedSaveName: C.String,
    PublishArchiveName: C.String,
    ProgressAchievement: L.Achievement,
    Movie: SMovieConfig,
    CampaignBanks: [C.String],
    TransitionBanks: [C.String],
    ShowArchivesButton: C.Bit,
    ArchiveDisabledTooltip: L.String,
    PrerequisiteCampaignId: C.String,
    PrerequisitesNotMetTooltip: L.String,
    PromoProduct: T.BattleProductId,
    PromoPurchaseWarningTitle: L.String,
    PromoPurchaseWarningMessage: L.String,
    PromoText: L.String,
    PromoTextCN: L.String,
    CinematicsImagePath: A.Image,
    StorySoFarImagePath: A.Image,
    StorySoFarMovie: SMovieConfig,
    SubPanelImage: A.Image,
    SubPanelName: L.String,
    UnavailableMessageNotPurchased: L.String,
    UnavailableMessagePreReleaseOwned: L.String,
    UnavailableMessagePreReleaseNotOwned: L.String,
    CompletedCampaignImagePath: A.Image,
    FeaturedImagePath: A.Image,
    FeaturedDescription: L.String,
}
export const SCharacterVariation = {
    ...SStruct,
    Name: L.String,
    Model: L.Model,
    Actor: L.Actor,
    DefaultCategories: [C.String],
}
export const SUIColorEntry = {
    ...SStruct,
    Value: [C.Vector4],
}
export const SCommanderUnit = {
    ...SStruct,
    Unit: L.Unit,
    Upgrade: L.Unit,
}
export const SCommanderTalentTree = {
    ...SStruct,
    Talent: L.Talent,
    Unit: L.Unit,
    Level: T.CommanderLevel,
    Type: E.CommanderTalentType,
    IsHidden: C.Bit,
}
export const SCommanderMasteryTalent = {
    ...SStruct,
    Talent: L.Talent,
    ValuePerRank: C.Real32,
    MaxRank: C.UInt32,
    Type: E.CommanderMasteryTalentType,
    Bucket: C.UInt32,
    MinValuePrecision: C.UInt32,
    MaxValuePrecision: C.UInt32,
}
export const SCommanderAbil = {
    ...SStruct,
    Abil: L.Abil,
    Button: L.Button,
}
export const SCommanderDifficultyLevel = {
    ...SStruct,
    DifficultyLevel: T.DifficultyLevel,
    CommanderLevel: T.CommanderLevel,
    Name: L.String,
    Description: L.String,
    BonusModifier: C.UInt32,
    IsDefault: C.Bit,
    Icon: A.Image,
    AISkillLevel: T.DifficultyLevel,
    BeyondBrutalLevel: C.UInt8,
    RequirePartyToQueue: C.Bit,
    IsRetry: C.Bit,
}
export const SConsoleSkinModel = {
    ...SStruct,
    Model: C.String,
    Position: C.Vector3,
    Scale: C.Vector3,
}
export const SConversationUserValue = {
    ...SStruct,
    Type: L.User,
    Field: T.UserFieldId,
    Index: C.Int32,
    Instance: T.UserInstanceId,
}
export const SConversationCondition = {
    ...SStruct,
    FixedId: T.ConversationStateOpId,
    State: L.ConversationState,
    Index: T.ConversationStateIndexId,
    User: SConversationUserValue,
    Operation: E.ConversationConditionOp,
    Value: C.Int32,
}
export const SConversationProductionLevel = {
    ...SStruct,
    SubtitlePrefix: C.String,
    Flags: F.ConversationProductionLevel,
}
export const SConversationConditionSet = {
    ...SStruct,
    Conditions: [SConversationCondition],
    Text: L.String,
}
export const SConversationAction = {
    ...SStruct,
    FixedId: T.ConversationStateOpId,
    State: L.ConversationState,
    Index: T.ConversationStateIndexId,
    User: SConversationUserValue,
    Operation: E.ConversationActionOp,
    Value: C.Int32,
}
export const SConversationActionSet = {
    ...SStruct,
    Actions: [SConversationAction],
    Text: L.String,
}
export const SConversationFacialAnim = {
    ...SStruct,
    Id: T.ConversationItemId,
    Text: L.String,
    SpeechTag: C.String,
    SpeechAtts: C.String,
    AnimTag: C.String,
    AnimAtts: C.String,
}
export const SConversationLine = {
    ...SStruct,
    Id: T.ConversationItemId,
    Text: L.String,
    Comment: C.String,
    FacialAnim: T.ConversationItemId,
    FacialBlend: C.UInt32,
    FacialAsVoiceDir: C.Bit,
    Sound: L.Sound,
    SoundIndex: C.Int32,
    FixedDuration: C.UInt32,
    NoWait: C.Bit,
    OverlapPrevious: C.UInt32,
    AnimProps: C.AnimProps,
    AnimBlendIn: C.Int32,
    AnimBlendOut: C.Int32,
    LookAtType: C.String,
    LookAtAttach: C.AttachMethods,
    Objects: [T.ConversationStateIndexId],
    Variations: [T.ConversationStateVariation],
    CustomSpeaker: L.String,
    SpeakerCharacter: L.Character,
    SpeakerVariation: C.String,
    ListenerCharacter: L.Character,
    AltLine: C.Bit,
    AltLineMatchText: C.Bit,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
    Actions: [SConversationAction],
    CutsceneFile: C.String,
    CutscenePosition: C.GamePoInt3D,
    Tags: [T.ConversationTag],
}
export const SConversationRunActions = {
    ...SStruct,
    Id: T.ConversationItemId,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
    Actions: [SConversationAction],
}
export const SConversationWait = {
    ...SStruct,
    Id: T.ConversationItemId,
    Duration: C.UInt32,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
}
export const SConversationJump = {
    ...SStruct,
    Id: T.ConversationItemId,
    Location: T.ConversationItemId,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
}
export const SConversationChoice = {
    ...SStruct,
    Id: T.ConversationItemId,
    Text: L.String,
    Comment: C.String,
    RequiresPrevious: C.Bit,
    Permanent: C.Bit,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
    Actions: [SConversationAction],
    Children: [T.ConversationItemId],
}
export const SConversationGroup = {
    ...SStruct,
    Id: T.ConversationItemId,
    Name: L.String,
    Comment: C.String,
    ChoiceSelection: E.ConversationSelectionMethod,
    MaxChoices: C.UInt32,
    LineSelection: E.ConversationSelectionMethod,
    MaxLines: C.UInt32,
    PlayOnceOnly: C.Bit,
    NoWait: C.Bit,
    ChoiceCamera: T.ConversationStateIndexId,
    ConditionCheck: E.ConversationConditionCheck,
    Conditions: [SConversationCondition],
    Children: [T.ConversationItemId],
    CutsceneFile: C.String,
    CutscenePosition: C.GamePoInt3D,
    ApplyCutsceneToChildren: C.Bit,
    Tags: [T.ConversationTag],
}
export const SConversationComment = {
    ...SStruct,
    Id: T.ConversationItemId,
    Text: L.String,
}
export const SConversationStateInfoText = {
    ...SStruct,
    Id: T.ConversationStateInfoId,
    Text: L.String,
}
export const SConversationStateInfoValue = {
    ...SStruct,
    Id: T.ConversationStateInfoId,
    Value: C.Real,
}
export const SConversationStateInfoModel = {
    ...SStruct,
    Id: T.ConversationStateInfoId,
    Model: L.Model,
}
export const SConversationStateInfoUpgrade = {
    ...SStruct,
    Id: T.ConversationStateInfoId,
    Upgrade: L.Upgrade,
}
export const SConversationStateInfoAbilCmd = {
    ...SStruct,
    Id: T.ConversationStateInfoId,
    Abil: L.Abil,
    Cmd: T.AbilCmdIndex,
}
export const SConversationStateVariation = {
    ...SStruct,
    Value: T.ConversationStateVariation,
    DefaultCategories: [C.String80],
}
export const SConversationStateInfoIds = {
    ...SStruct,
    Id: [T.ConversationStateInfoId],
}
export const SConversationStateIndex = {
    ...SStruct,
    Id: T.ConversationStateIndexId,
    Name: L.String,
    EditorPrefix: L.String,
    EditorSuffix: L.String,
    Color: C.Color,
    ImagePath: A.Image,
    ImageEdge: E.TextTagEdge,
    ImageAttach: E.AttachmentID,
    MoviePath: A.Movie,
    InfoText: [SConversationStateInfoText],
    InfoValue: [SConversationStateInfoValue],
    InfoModel: [SConversationStateInfoModel],
    InfoUpgrade: [SConversationStateInfoUpgrade],
    InfoAbilCmd: [SConversationStateInfoAbilCmd],
    Variations: [SConversationStateVariation],
}
export const SDataCollectionRecord = {
    ...SStruct,
    Entry: C.DataEntryPath,
}
export const SUpgradeInfoWeapon = {
    ...SStruct,
    UpgradeWeapon: L.Weapon,
    UpgradeEffect: L.Effect,
    DamagePerDice: C.Real,
}
export const SDataFieldsPattern = {
    ...SStruct,
    Reference: C.String,//C.CatalogReference?
    NameOverride: L.String,
    UserData: C.Identifier,
}
export const SDataTokensPattern = {
    ...SStruct,
    Reference: C.String,//C.CatalogReference?
    NameOverride: L.String,
    UserData: C.Identifier,
}
export const STextureSheetEntry = {
    ...SStruct,
    TextureSheet: L.TextureSheet,
    Index: C.UInt32,
    Count: C.UInt32,
    DurationPerFrame: C.UInt32,
}
export const SEffectDamageArea = {
    ...SStruct,
    Arc: C.FangleArc,
    MaxCount: C.UInt32,
    Radius: C.Real,
    RectangleWidth: C.Real,
    RectangleHeight: C.Real,
    RadiusBonus: C.Real,
    FacingAdjustment: C.Fangle,
    Bonus: C.Real,
    Fraction: C.Real,
    Validator: L.Validator,
}
export const SEffectSearchRevealerParams = {
    ...SStruct,
    RevealFlags: F.EffectReveal,
    DetectFilters: C.TargetFilters,
    RadarFilters: C.TargetFilters,
    HeightMap: E.HeightMap,
    Duration: C.GameTime,
    ShapeExpansion: C.Real,
}
export const SEffectEnumArea = {
    ...SStruct,
    Arc: C.FangleArc,
    MaxCount: C.UInt32,
    Radius: C.Real,
    RectangleWidth: C.Real,
    RectangleHeight: C.Real,
    RadiusBonus: C.Real,
    FacingAdjustment: C.Fangle,
    Effect: L.Effect,
}
export const SEffectMover = {
    ...SStruct,
    Link: L.Mover,
    IfRangeLTE: C.Real,
}
export const SEffectMissileBounce = {
    ...SStruct,
    DistanceMultiplier: C.Real,
    ImpactEffect: L.Effect,
    Offset: C.EffectOffset,
}
export const SUpgradeEffect = {
    ...SStruct,
    Operation: E.UpgradeOperation,
    Reference: C.CatalogReference,
    Value: T.UpgradeEffectValue,
}
export const SEffectUpgrade = {
    ...SStruct,
    Upgrade: L.Upgrade,
    Count: C.Int8,
}
export const SEffectModifyPlayerCost = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Abil: L.Abil,
    Unit: SEffectWhichUnit,
}
export const SEffectModifyUnitCost = {
    ...SStruct,
    Abil: C.AbilCommand,
    Behavior: L.Behavior,
    Player: SEffectWhichPlayer,
    ChargeCountUse: C.Real,
    ChargeTimeUse: C.GameTime,
    CooldownOperation: E.CooldownOperation,
    CooldownTimeUse: C.GameTime,
    Fraction: SCostFactor,
}
export const SEffectModifyWeapon = {
    ...SStruct,
    Weapon: L.Weapon,
    CooldownOperation: E.CooldownOperation,
    CooldownAmount: C.GameTime,
    CooldownFraction: C.Real,
}
export const SEffectModifyVital = {
    ...SStruct,
    Change: SAccumulatedFixed,
    ChangeFraction: SAccumulatedFixed,
    ScoreArray: [SScoreValueUpdate],
}
export const SEffectModifyTurret = {
    ...SStruct,
    Action: E.EffectModifyTurret,
    Turret: L.Turret,
    Target: SEffectWhichLocation,
    Flags: F.EffectModifyTurret,
    AimCompleteEffect: L.Effect,
}
export const SEffectSwitchCase = {
    ...SStruct,
    Validator: L.Validator,
    Effect: L.Effect,
    FallThrough: C.Bit,
}
export const SEmoticonPackCampaign = {
    ...SStruct,
    Campaign: L.Campaign,
}
export const SFootprintBitSet = {
    ...SStruct,
    Character: C.String4,
    Positive: F.Unknown,
    Negative: F.Unknown,
}
export const SFootprintLayer = {
    ...SStruct,
    Area: C.iQuad,
    Sets: [SFootprintBitSet],
    Rows: [C.String50],
}
export const SFootprintShape = {
    ...SStruct,
    Mode: E.FootprintShapeMode,
    Radius: C.Real,
    Offsets: T.FootprintOffsets,
    Borders: T.FootprintBorders,
}
export const SDifficultyLevel = {
    ...SStruct,
    AttributeId: C.FourCC,
    Name: L.String,
    NameCampaign: L.String,
    NameMelee: L.String,
    MenuTooltip: L.String,
    Enabled: C.Bit,
    Flags: F.Unknown,
    ActionsPerMinute: C.Int32,
    DefaultRebuildUnit: C.UInt8,
    DefaultRebuildStructure: C.UInt8,
}
export const SAIBuild = {
    ...SStruct,
    AttributeId: C.FourCC,
    Name: L.String,
    MenuTooltip: L.String,
    Enabled: C.Bit,
    Race: L.Race,
    MinDiff: T.Difficulty ,
    MaxDiff: T.Difficulty ,
    BuildScriptNum: C.Int32,
}
export const SHandicap = {
    ...SStruct,
    MenuTooltip: L.String,
    Percent: T.Handicap
}
export const SMapSize = {
    ...SStruct,
    Name: L.String,
    MaxCells: C.UInt32,
}
export const SAspectMargin = {
    ...SStruct,
    AspectWidth: C.UInt32,
    AspectHeight: C.UInt32,
    Margin: C.iQuad,
}
export const STeamColor = {
    ...SStruct,
    HDRMultiplier: C.Real32,
    Name: L.String,
    Value: [C.Vector4],
    UserChoice: C.Bit,
    MinPlayerCount: C.Int32,
    AttributeId: C.FourCC,
}
export const SAIDescription = {
    ...SStruct,
    Id: C.FourCC,
    Name: L.String,
    File: C.Identifier,
    Suffix: C.String32,
}
export const STriggerLib = {
    ...SStruct,
    Id: T.TriggerLibId,
    IncludePath: C.String,
}
export const STargetFilterResult = {
    ...SStruct,
    Filter: C.TargetFilters,
    Result: T.CmdResult,
}
export const SBeaconInfo = {
    ...SStruct,
    Alert: L.Alert,
    Unit: L.Unit,
    Tooltip: L.String,
    Clear: F.Unknown,
}
export const SDamageTypeInfo = {
    ...SStruct,
    Category: E.DamageCategory,
    SupportedFilters: C.TargetFilters,
}
export const SAttackTypeInfo = {
    ...SStruct,
    ArmorFactor: [C.Real],
    SupportedFilters: C.TargetFilters,
    FailThroughToDamageType: C.Bit,
}
export const SResourceConvert = {
    ...SStruct,
    RatioArray: [C.Real],
}
export const SMeleePointThreshold = {
    ...SStruct,
    Value: C.UInt32,
    Factor: C.Real,
}
export const SChallenge = {
    ...SStruct,
    Id: C.String,
    Name: L.String,
    Description: L.String,
    Score: L.String,
    MapPath: A.Map,
    ThumbnailImagePath: A.Image,
    Achievement: [L.Achievement],
    IsAllowedInTrial: C.Bit,
}
export const SChallengeCategory = {
    ...SStruct,
    Name: L.String,
    Challenge: [SChallenge],
}
export const SSoundQuality = {
    ...SStruct,
    AutoDetectCPUCoreMaximum: C.UInt32,
    Channels: C.UInt32,
    Flags: F.Unknown,
    Name: L.String,
    Format: E.SoundFormat,
    Resampler: E.SoundResampler,
    SampleRate: C.UInt32,
    SpeakerMode: E.SpeakerMode,
    VariationMaximum: [C.UInt32],
}
export const SMinimapData = {
    ...SStruct,
    InnerBorderColor: C.Color,
    OuterBorderColor: C.Color,
    FrustumColor: C.Color,
    ResourceUnitColor: C.Color,
    ResourceUnitColorBlindColor: C.Color,
    BlipUnitColor: C.Color,
    UnitBorderColor: C.Color,
    SelectedUnitBorderColor: C.Color,
    BackGroundColor: C.Color,
    BorderSize: C.Real32,
    SelectedBorderSize: C.Real32,
    MinUnitDotSize: C.Real32,
    RadarAlpha: C.UInt8,
}
export const SSelectionData = {
    ...SStruct,
    SelectionWidth: C.Real32,
    SelectionFallOff: C.Real32,
    SelectionAlpha: C.Vector3,
    SelectionTiming: C.Vector3,
    SelectionSegmentCount: C.UInt32,
    SelectionSegmentPercentSolid: C.Real32,
    SelectionRotationSpeed: C.Real32,
    SelectionInnerOffsetRatio: C.Real32,
    SelectionInnerBoundaryRatio: C.Real32,
    SelectionInnerBoundaryFallOffRatio: C.Real32,
    PreselectionWidth: C.Real32,
    PreselectionFallOff: C.Real32,
    PreselectionAlpha: C.Vector3,
    PreselectionTiming: C.Vector3,
    PreselectionSegmentCount: C.UInt32,
    PreselectionSegmentPercentSolid: C.Real32,
    PreselectionRotationSpeed: C.Real32,
}
export const SVolumeFade = {
    ...SStruct,
    Time: C.UInt32,
    Volume: C.Volume,
}
export const SReverbRolloff = {
    ...SStruct,
    Distance: C.Real32,
    Direct: C.Real32,
    Room: C.Real32,
}
export const SVolumeThreshold = {
    ...SStruct,
    Count: C.UInt32,
    Volume: C.Volume,
}
export const SVolumeRolloff = {
    ...SStruct,
    Distance: C.Real32,
    Volume: C.Volume,
}
export const SSoundData = {
    ...SStruct,
    DupeFadeBlend: E.SoundBlend,
    DupeFadeIn: [SVolumeFade],
    DupeFadeOut: [SVolumeFade],
    FogFadeBlend: E.SoundBlend,
    FogFadeIn: [SVolumeFade],
    FogFadeOut: [SVolumeFade],
    MixerPriority: C.Int16,
    MixerPriorityNonLocal: C.Int16,
    Mute: C.Bit,
    MuteFadeBlend: E.SoundBlend,
    MuteFadeIn: [SVolumeFade],
    MuteFadeOut: [SVolumeFade],
    ReverbRolloffBlend: E.SoundBlend,
    ReverbRolloffPoints: [SReverbRolloff],
    Solo: C.Bit,
    ThresholdFadeTime: C.UInt32,
    ThresholdPoints: [SVolumeThreshold],
    Volume: C.Volume,
    VolumeBaseline: C.Volume,
    VolumeRolloffBlend: E.SoundBlend,
    VolumeRolloffFadeBlend: E.SoundBlend,
    VolumeRolloffFadeIn: [SVolumeFade],
    VolumeRolloffFadeOut: [SVolumeFade],
    VolumeRolloffPoints: [SVolumeRolloff],
    MaxFadeBlend: E.SoundBlend,
    MaxFadeOut: [SVolumeFade],
    AlertFadeTimeOut: C.UInt32,
    AlertFadeTimeIn: C.UInt32,
    AlertFadeVolume: C.VolumeRange,
    StartupDSPArray: [L.DSP],
    DSPArray: [L.DSP],
    Flags: F.Unknown,
    MuteControl: E.MuteControl,
    VolumeControl: E.VolumeControl,
    LocalVolumeAdjustment: C.VolumeRange,
    NonLocalVolumeAdjustment: C.VolumeRange,
    CategoryDuckingFadeTimeIn: C.UInt32,
    CategoryDuckingFadeTimeOut: C.UInt32,
    CategoryDucking: [C.Volume],
    CategoryDuckingNonLocal: [C.Volume],
    MinimumDuckingLevel: C.Volume,
    MaxMethod: E.SoundMaxMethod,
    MaxCountPerPlayer: C.UInt16,
    MaxCountGlobal: C.UInt16,
    MaxPrioritization: E.SoundMaxPrioritization,
}
export const SMixRoute = {
    ...SStruct,
    ParentCategory: E.SoundCategory,
}
export const SGlobalSoundData = {
    ...SStruct,
    SoundDistanceFactor: C.Real32,
    SoundDopplerFactor: C.Real32,
    SoundRolloffFactor: C.Real32,
    HeadphoneModeMinAngle: C.Real32,
    HeadphoneModeMaxAngle: C.Real32,
    HeadphoneModeFrequency: C.Real32,
}
export const SPointModel = {
    ...SStruct,
    Model: A.Model,
    Scale: C.Real32,
    NameSize: C.UInt32,
    HeightOffset: C.Real32,
    SelectionOffset: C.Vector3,
    SelectionRadius: C.Real32,
}
export const SCameraShakeRotation = {
    ...SStruct,
    Yaw: C.Real32,
    Pitch: C.Real32,
    Roll: C.Real32,
}
export const SCameraShakeFrequency = {
    ...SStruct,
    Id: C.String80,
    Name: L.String,
    Position: C.Vector3,
    Rotation: SCameraShakeRotation
}
export const SCameraShakeAmplitude = {
    ...SStruct,
    Id: C.String80,
    Name: L.String,
    Position: C.Vector3,
    Rotation: SCameraShakeRotation
}
export const SListenerRolloff = {
    ...SStruct,
    CameraValue: C.Real32,
    ListenerFactor: C.Real32,
}
export const SUnitSpeedText = {
    ...SStruct,
    MinSpeed: C.GameSpeed,
    Text: L.String,
}
export const SWeaponSpeedText = {
    ...SStruct,
    MinSpeed: C.GameTime,
    Text: L.String,
}
export const SObjectGroupData = {
    ...SStruct,
    MinLevel: C.UInt32,
    MinimapIcon: A.Image,
}
export const SLoadingScreenHelp = {
    ...SStruct,
    Text: L.String,
    Race: L.Race,
}
export const SLoadingBar = {
    ...SStruct,
    Name: L.String,
    FrameSuffix: C.String,
}
export const SGameModeInfo = {
    ...SStruct,
    Id: C.UInt32,
    CanOverrideText: C.Bit,
    IsTutorial: C.Bit,
    Name: L.String,
    Description: L.String,
}
export const SGameCategory = {
    ...SStruct,
    Usage: E.GameCategoryUsage,
    Info: SGameModeInfo,
    Modes: [SGameModeInfo],
}
export const SDefaultGameVariant = {
    ...SStruct,
    CategoryId: C.UInt32,
    ModeId: C.UInt32,
    MinPlayers: C.Int32,
    MaxPlayers: C.Int32,
    TeamCount: C.Int32,
    PlayersPerTeam: C.Int32,
    PlayersPerTandem: C.Int32,
    AIDifficulty: T.DifficultyLevel,
    Options: F.Unknown,
    AchievementTags: [C.FourCC],
}
export const STutorialConfig = {
    ...SStruct,
    Title: L.String,
    Description: L.String,
    Icon: A.Image,
    Movie: A.Movie,
}
export const SHotkeyInfo = {
    ...SStruct,
    Category: L.String,
    Name: L.String,
    Tooltip: L.String,
}
export const SResourceUI = {
    ...SStruct,
    Icon: A.Image,
    IconBackground: A.Image,
    Tooltip: L.String,
}
export const SHelpControlCategoryInfo = {
    ...SStruct,
    Name: L.String,
    Description: L.String,
}
export const SHelpControlInfo = {
    ...SStruct,
    Category: L.String,
    Name: L.String,
    Description: L.String,
    Basic: C.Bit,
}
export const SHelpGameMechanicInfo = {
    ...SStruct,
    Icon: A.Image,
    IconBackground: A.Image,
    Name: L.String,
    Description: L.String,
}
export const SAltSoundtrack = {
    ...SStruct,
    AltSoundtrackName: L.String,
    Suffix: C.String,
}
export const SCutsceneAssetPath = {
    ...SStruct,
    Path: A.Cutscene,
    Theme: E.GlueTheme,
}
export const SHerdLevel = {
    ...SStruct,
    Weight: C.Real32,
}
export const SHerdNode = {
    ...SStruct,
    Weight: C.Real32,
    Link: L.HerdNode,
}
export const SHeroAbilCategory = {
    ...SStruct,
    Name: L.String,
    Tooltip: L.String,
    Image: A.Image,
    RequiredLevel: C.UInt32,
    State: E.HeroAbilCategoryState,
    AbilArray: [L.HeroAbil],
    UserReference: C.UserReference,
}
export const SHeroAbil = {
    ...SStruct,
    Abil: L.Abil,
    Button: L.Button,
    Unit: L.Unit,
    Flags: F.HeroAbil,
}
export const SHeroHeroicAbility = {
    ...SStruct,
    Abil: L.Abil,
}
export const SHeroSpecificVO = {
    ...SStruct,
    Target: L.Unit,
    Sound: L.Sound,
}
export const SHeroTalentTree = {
    ...SStruct,
    Talent: L.Talent,
    Tier: C.UInt32,
    Column: C.UInt32,
    PrerequisiteTalentArray: [L.Talent],
}
export const SHeroTalentTier = {
    ...SStruct,
    Tier: C.UInt32,
    Level: C.UInt32,
}
export const SHeroSpecificIntroVO = {
    ...SStruct,
    Target: L.Unit,
    Question: L.Sound,
    Response: L.Sound,
}
export const SHeroLevelModification = {
    ...SStruct,
    Catalog: E.GameCatalog,
    Entry: C.Identifier,
    Field: C.Identifier,
    FieldIsInteger: C.Bit,
    Value: C.Real32,
    AffectedByAbilityPower: C.Bit,
    AffectedByOverdrive: C.Bit,
}
export const SHeroLevelScaling = {
    ...SStruct,
    Ability: L.Abil,
    Modifications: [SHeroLevelModification],
}
export const SHeroRatings = {
    ...SStruct,
    Damage: C.UInt8,
    Utility: C.UInt8,
    Survivability: C.UInt8,
    Complexity: C.UInt8,
}
export const SHeroAITalentBuild = {
    ...SStruct,
    BuildType: E.HeroAITalentBuildType,
    AIOnly: C.Bit,
    ChanceToPick: C.UInt8,
    MinDifficulty: T.Difficulty,
    MaxDifficulty: T.Difficulty,
    TalentsArray: [L.Talent],
}
export const SHeroSpecificUI = {
    ...SStruct,
    Location: C.Identifier,
    DescName: C.String,
}
export const SHeroStatModifier = {
    ...SStruct,
    Stat: L.HeroStat,
    Value: C.Int32,
    State: E.HeroStatState,
}
export const SItemContainerSlot = {
    ...SStruct,
    EmptyFace: L.Button,
    Classes: [L.ItemClass],
    Requirements: L.Requirement,
    Equip: C.Bit,
    Row: C.UInt8,
    Column: C.UInt8,
}
export const SFlareInfo = {
    ...SStruct,
    Model: L.Model,
    Template: C.Identifier,
}
export const STimeEvent = {
    ...SStruct,
    Time: C.TimeOfDay,
    Name: L.String,
}
export const SDirectionalLight = {
    ...SStruct,
    UseAmbientOcclusion: C.Bit,
    Color: C.Vector3,
    ColorMultiplier: C.Real32,
    SpecularColor: C.Vector3,
    SpecColorMultiplier: C.Real32,
    Direction: C.Vector3,
}
export const SVariationConfig = {
    ...SStruct,
    Command: E.VariationCommands,
    Sensitivity: C.UInt32,
    Region: E.TonemapRegionTypes,
}
export const SLightRegionInfo = {
    ...SStruct,
    UseDefault: C.Bit,
    AmbientColor: C.Vector3,
    AmbientEnvironmentMultiplier: C.Real32,
    DiffuseColor: [C.Vector3],
    DiffuseMultiplier: [C.Real32],
    SpecularColor: C.Vector3,
    SpecularMultiplier: C.Real32,
    FogColor: C.Vector3,
}
export const SLightInfo = {
    ...SStruct,
    Id: C.Identifier,
    TimeOfDay: C.TimeOfDay,
    AmbientColor: C.Vector3,
    AmbientEnvironmentMultiplier: C.Real32,
    OperatorHDR: C.Int8,
    TerrainUseBackLight: C.Bit,
    DirectionalLightShadows: C.Bit,
    CorrectGamma: C.Bit,
    Param: [C.Real32],
    DirectionalLight: [SDirectionalLight],
    TriggerTransition: C.UInt32,
    Colorize: C.Bit,
    UseSeparateDetailSSAO: C.Bit,
    Variations: [SVariationConfig],
    LightRegions: [SLightRegionInfo],
}
export const SMissionCategory = {
    ...SStruct,
    Name: L.String,
    Map: L.Map,
    Tooltip: L.String,
    CompletedTooltip: L.String,
    RewardImage: A.Image,
    RewardTooltip: L.String,
    State: E.MissionState,
}
export const SLootChoice = {
    ...SStruct,
    Chance: C.UInt8,
    Child: L.Loot,
}
export const SAnimFile = {
    ...SStruct,
    FilePath: A.Anims,
    Flags: F.Unknown,
}
export const SAnimAlias = {
    ...SStruct,
    Anim: C.AnimProps,
    Alias: C.AnimProps,
}
export const SAttachProps = {
    ...SStruct,
    Id: E.AttachmentID,
    Keys: [T.AttachPropIndex],
    SquibType: E.SquibType,
    WeightExplicit: C.Real32,
    WeightFactor: C.Real32,
    RadiusTarget: C.Real32,
    RadiusShield: C.Real32,
}
export const SModelDataEvent = {
    ...SStruct,
    Variation: C.Int32,
    Anim: C.AnimProps,
    Name: C.Identifier,
    Type: E.ModelEvent,
    Time: C.Real32,
    Attachment: E.AttachmentID,
    Payload: C.Identifier,
    ModelQuality: E.ModelQuality,
}
export const SPhysicsMaterialMapping = {
    ...SStruct,
    PhysicsMaterialInnate: E.PhysicsMaterial,
    PhysicsMaterialOverride: L.PhysicsMaterial,
}
export const STextureNameAdaption = {
    ...SStruct,
    TriggerOnSubstring: C.Identifier,
    Slot: C.TextureSlot,
    PropsAdd: C.TextureProps,
    PropsRemove: C.TextureProps,
    PropsSet: C.TextureProps,
    AppliesToInnate: C.Bit,
    AppliesToFile: C.Bit,
}
export const STextureDeclare = {
    ...SStruct,
    Prefix: C.Identifier,
    Slot: C.TextureSlot,
    Adaptions: [STextureNameAdaption],
}
export const STextureInfo = {
    ...SStruct,
    Slot: C.TextureSlot,
    Expression: C.TextureExpression,
    Probability: C.UInt32,
}
export const STextureExpressionSpec = {
    ...SStruct,
    Slot: C.TextureSlot,
    Expression: C.TextureExpression,
}
export const STextureMatchSpec = {
    ...SStruct,
    Slot: C.TextureSlot,
    Source: C.TextureSlot,
}
export const SModelVariation = {
    ...SStruct,
    Number: C.Int32,
    Probability: C.UInt32,
    Radius: C.Real32,
    RadiusLoose: C.Real32,
    PhysicsForceFactor: C.Real32,
    PhysicsDeathMotionFactor: C.VariatorActorReal32,
    TextureAppliedGroups: C.TextureProps,
    TextureExpressionsForEditor: [STextureExpressionSpec],
    TextureMatchesForEditor: [STextureMatchSpec],
}
export const SPathingData = {
    ...SStruct,
    Bits: F.Unknown,
}
export const SMotionOverlayPhase = {
    ...SStruct,
    Scale: C.VariatorGameFixed,
}
export const SMotionPhase = {
    ...SStruct,
    Driver: E.MotionDriverType,
    Acceleration: C.MissileAcceleration,
    AccelerationRange: C.MissileAcceleration,
    Speed: C.MissileSpeed,
    SpeedRange: C.MissileSpeed,
    MinSpeed: C.MissileSpeed,
    MaxSpeed: C.MissileSpeed,
    Gravity: C.Real,
    Clearance: C.Real,
    ClearanceLookahead: C.Real,
    ClearanceAcceleration: C.MissileAcceleration,
    ClearanceIgnoresTargetProximity: C.Bit,
    IgnoresTerrain: C.Bit,
    TurnType: E.MotionTurnType,
    ActorTracking: E.MotionActorTrackingType,
    ArrivalTestType: E.MotionArrivalTestType,
    BlendType: E.MotionBlendType,
    Outro: C.PhaseOutro,
    RotationLaunchActorType: E.MotionRotationLaunchActorType,
    RotationActorType: E.MotionRotationActorType,
    Timeout: C.Real,
    ThrowRotationType: E.MotionThrowRotationType,
    ThrowVector: C.Vector3f,
    ThrowBandYaw: C.ThrowBand,
    ThrowBandPitch: C.ThrowBand,
    ThrowForward: C.Vector3f,
    AdaptableParabolaIsUpright: C.Bit,
    AdaptableParabolaClearance: C.VariatorGameFixed,
    AdaptableParabolaDistances: [C.Real],
    AdaptableParabolaAccels: [C.MissileAcceleration],
    YawPitchRoll: C.YawPitchRoll,
    YawPitchRollRange: C.YawPitchRoll,
    YawPitchRollAccel: C.YawPitchRoll,
    YawPitchRollAccelRange: C.YawPitchRoll,
    PowerslideAngle: C.Fangle,
    PowerslideDecel: C.MissileAcceleration,
    FlightTime: C.VariatorGameFixed,
    OutroAltitude: C.PhaseOutro,
    Overlays: [SMotionOverlayPhase],
}
export const SMotionOverlay = {
    ...SStruct,
    Type: E.MotionOverlayType,
    Polarity: E.MotionOverlayPolarity,
    PolarityDriver: C.DataSoupKey,
    Axis: C.Vector3f,
    Wavelength: C.VariatorGameFixed,
    WavelengthChangeProbability: C.Real,
    RevolverSpeed: C.FangleRateMissile,
    RevolverSpeedRange: C.FangleRateMissile,
    RevolverMaxSpeed: C.FangleRateMissile,
    RevolverMaxSpeedRange: C.FangleRateMissile,
    RevolverAccel: C.FangleAccelMissile,
    RevolverAccelRange: C.FangleAccelMissile,
}
export const SStartingUnit = {
    ...SStruct,
    Count: C.UInt32,
    Flags: F.Unknown,
    Offset: [C.GamePoint],
    Range: C.Real,
    Unit: L.Unit,
}
export const SUpkeepTax = {
    ...SStruct,
    FoodLevel: C.UInt32,
    Tax: [C.Real],
}
export const SRequirementNode = {
    ...SStruct,
    Link: L.RequirementNode,
}
export const SRequirementCount = {
    ...SStruct,
    Link: T.TechAlias,
    State: E.RequirementState,
    Unlock: T.TechAlias,
}
export const SRewardCategory = {
    ...SStruct,
    File: C.String,
    Tag: C.FourCC,
}
export const SRewardSpecificUI = {
    ...SStruct,
    Location: C.Identifier,
    DescName: C.String,
}
export const SGameReplacement = {
    ...SStruct,
    Catalog: E.GameCatalog,
    From: C.Identifier,
    To: C.Identifier,
}
export const SSkinModelGroup = {
    ...SStruct,
    Name: C.Identifier,
    Models: [L.Model],
}
export const SSkinModelMacroRun = {
    ...SStruct,
    Models: C.Identifier,
    Macro: L.Actor,
}
export const SSkinPackEntry = {
    ...SStruct,
    Unit: L.Unit,
    Reward: L.Reward,
    UnitAlternate: L.Unit,
    RewardAlternate: L.Reward,
}
export const SSyncPointRange = {
    ...SStruct,
    BarAndBeat: C.Vector2i,
    TimeSignature: C.Vector2i,
    BeatsPerMinute: C.UInt16,
    SyncPointsPerBar: C.UInt16,
}
export const SSoundAsset = {
    ...SStruct,
    TemplateParam: C.String,
    File: A.Sound,
    LoopCount: C.Int32,
    LoopTime: C.iRange,
    Offset: C.iRange,
    Pitch: C.PitchRange,
    SyncPoints: [C.UInt32],
    SyncPointRanges: [SSyncPointRange],
    Volume: C.VolumeRange,
    Weight: T.SoundWeight,
    FacialAnim: C.Identifier,
    FacialGroup: C.Identifier,
    PortraitAnim: C.Identifier,
    FacialFile: A.Facial,
    PortraitModel: L.Model,
    PortraitActor: L.Actor,
    Speaker: L.String,
    Subtitle: L.String,
}
export const SSoundAssetTemplate = {
    ...SStruct,
    File: C.Identifier,
    FacialAnim: C.Identifier,
    FacialGroup: C.Identifier,
    FacialFile: C.Identifier,
    PortraitAnim: C.Identifier,
}
export const SSoundLocaleFlags = {
    ...SStruct,
    Locale: T.LocaleId,
    Flags: F.Unknown,
}
export const SPitchShift = {
    ...SStruct,
    Time: C.UInt32,
    Pitch: C.Pitch,
}
export const SReverbBalance = {
    ...SStruct,
    Direct: T.SoundBalance,
    Room: T.SoundBalance,
}
export const SSoundtrackMasterLayer = {
    ...SStruct,
    Sound: L.Sound,
}
export const SSoundtrackSection = {
    ...SStruct,
    Chance: C.Real32,
    Sound: L.Sound,
    Start: C.UInt32,
}
export const SSoundtrackSlaveLayer = {
    ...SStruct,
    Sections: [SSoundtrackSection],
}
export const SSoundtrackCue = {
    ...SStruct,
    MasterLayer: SSoundtrackMasterLayer,
    SlaveLayers: [SSoundtrackSlaveLayer],
    Weight: T.SoundWeight,
}
export const STacAbilData = {
    ...SStruct,
    AbilLink: L.Abil,
    Cooldown: [C.Real],
}
export const STalentRank = {
    ...SStruct,
    Face: L.Button,
    Item: L.Unit,
    Upgrade: L.Upgrade,
    BehaviorArray: [L.Behavior],
    AbilityPower: C.Real,
    CooldownReduction: C.Real,
    AttackDamage: C.Real,
    AttackSpeed: C.Real,
    Life: C.Real,
    Energy: C.Real,
    Shields: C.Real,
    LifeRegenRate: C.GameRate,
    EnergyRegenRate: C.GameRate,
    ShieldRegenRate: C.GameRate,
    MovementSpeed: C.Real,
    LifeLeech: C.Real,
    SiegeDamage: C.Real,
    LifeRegenRateFraction: C.Real,
    CrowdControlReduction: C.Real,
    DeathTimerReduction: C.Real,
    AmplifiedHealing: C.Real,
    MountSpeed: C.Real,
}
export const STalentModification = {
    ...SStruct,
    Type: E.TalentModification,
    Catalog: E.GameCatalog,
    Entry: C.Identifier,
    Field: C.Identifier,
    FieldIsInteger: C.Bit,
    Value: C.Real32,
    StringReplacement: C.String,
}
export const STalentAbilityModification = {
    ...SStruct,
    ModifyAbil: L.Abil,
    OriginalAbilButton: L.Button,
    ModifiedAbilButton: L.Button,
    Modifications: [STalentModification],
    TooltipAddendum: L.String,
}
export const STargetFindEnumArea = {
    ...SStruct,
    Arc: C.FangleArc,
    MaxCount: C.UInt32,
    Radius: C.Real,
    RadiusBonus: C.Real,
    Validator: L.Validator,
}
export const SDSPArray = {
    ...SStruct,
    LinkArray: [L.DSP],
}
export const SCreepSettings = {
    ...SStruct,
    CreepOpaqueAlphaThreshold: C.Real32,
    CreepTranslucentMinThreshold: C.Real32,
    CreepTranslucentMaxThreshold: C.Real32,
    CreepNoiseSpeed: C.Real32,
    CreepNoiseTiling: C.Real32,
    CreepHeightMapStrength: C.Real32,
    CreepNoiseStrength: C.Real32,
    CreepBaseTextureTileValue: C.Vector2,
    CreepBaseNormalMapTileValue: C.Vector2,
    CreepEdgeNormalMapTileValue: C.Vector2,
    CreepEdgeNormalMapMinRampThreshold: C.Real32,
    CreepTranslucentPassTint: C.Vector3,
    CreepTranslucentPassEmissiveFactor: C.Vector3,
    CreepDiffuseColorTint: C.Vector3,
    CreepTextureRotation: C.Real32,
    CreepGroundNormalBlend: C.Real32,
}
export const SFoliageSimulationConfig = {
    ...SStruct,
    SamplingDistance: [C.Real32],
    AcceptWorldForces: F.Unknown,
}
export const STerrainDoodad = {
    ...SStruct,
    Model: L.Model,
    RandomRotation: C.Bit,
    Probability: C.Real32,
    PlacementRadius: C.Real32,
}
export const SFidget = {
    ...SStruct,
    ChanceArray: [C.UInt8,E.Chance],
    DelayMax: C.GameTime,
    DelayMin: C.GameTime,
    DistanceMax: C.Real,
    DistanceMin: C.Real,
    TurnAngle: C.Fangle,
    TurningRate: C.FangleRate,
}
export const SUnitArmorFormula = {
    ...SStruct,
    NegativeArmorMultiplier: C.Real,
    NegativeDamageBase: C.Real,
    NegativeDamageUnscaled: C.Real,
    PositiveArmorMultiplier: C.Real,
    PositiveDamageRatio: C.Real,
}
export const SStockCharge = {
    ...SStruct,
    CountMax: C.Real,
    TimeDelay: C.GameTime,
    TimeUse: C.GameTime,
}
export const SUnitAbilData = {
    ...SStruct,
    Link: L.Abil,
}
export const SUnitBehaviorData = {
    ...SStruct,
    Link: L.Behavior,
}
export const SCardLayoutButton = {
    ...SStruct,
    Face: L.Button,
    Type: E.CardButtonType,
    AbilCmd: C.AbilCommand,
    Behavior: L.Behavior,
    Requirements: L.Requirement,
    SubmenuAbilState: L.Abil,
    SubmenuCardId: C.CardId,
    SubmenuFullSubCmdValidation: C.Bit,
    SubmenuIsSticky: C.Bit,
    ShowInGlossary: C.Bit,
    Row: C.UInt8,
    Column: C.UInt8,
}
export const SCardLayout = {
    ...SStruct,
    CardId: C.CardId,
    LayoutButtons: [SCardLayoutButton],
    RowText: [L.String],
}
export const SAddedOnData = {
    ...SStruct,
    UnitLink: L.Unit,
    BehaviorLink: L.Behavior,
    ParentBehaviorLink: L.Behavior,
}
export const SUnitEquipment = {
    ...SStruct,
    Effect: L.Effect,
    Icon: A.Image,
    Name: L.String,
    Tooltip: L.String,
    Weapon: L.Weapon,
}
export const SUnitReviveInfo = {
    ...SStruct,
    Resource: [C.Int32,E.ResourceType],
    Display: F.Unknown,
    Vital: [C.Real,E.UnitVital],
    VitalFraction: [C.Real,E.UnitVital],
    Charge: SCharge,
    Cooldown: SCooldown,
    Time: C.GameTime,
}
export const SAttributePointsInfo = {
    ...SStruct,
    Attribute: L.Behavior,
    Points: C.Int32,
    PointsPerLevel: C.Real,
}
export const SUpgradeEffectTemplate = {
    ...SStruct,
    Operation: E.UpgradeOperation,
    Reference: C.String,//C.CatalogReference?
    Value: C.String,
}
export const SValidatorCondition = {
    ...SStruct,
    Test: L.Validator,
    Return: L.Validator,
}
export const SValidatorFunction = {
    ...SStruct,
    Test: L.Validator,
    Return: L.Validator,
    Success: L.Validator,
    Failure: L.Validator,
    Ignored: L.Validator,
    Break: C.Bit,
}
export const SValidatorEnumArea = {
    ...SStruct,
    Arc: C.FangleArc,
    Compare: E.ValueCompare,
    Count: C.UInt32,
    Radius: C.Real,
    RadiusBonus: C.Real,
    Validator: L.Validator,
}
export const SVoiceOverSkin = {
    ...SStruct,
    Id: T.VoiceOverSkinId,
    State: E.VoiceOverSkinState,
}
export const SVoiceOverGroup = {
    ...SStruct,
    Id: T.VoiceOverGroupId,
    SoundParent: L.Sound,
}
export const SVoiceOverLine = {
    ...SStruct,
    Group: T.VoiceOverGroupId,
    SoundIndex: C.Int32,
    SoundType: E.VoiceOverSoundType,
    SoundText: C.String,
    Comment: C.String,
    FacialAnim: C.String,
    FacialBlend: C.UInt32,
    FacialAsVoiceDir: C.Bit,
    Skins: [SVoiceOverSkin],
}
export const SVoicePackExampleLine = {
    ...SStruct,
    Description: L.String,
    Sound: L.Sound,
}
export const SUserInstanceField = {
    ...SStruct,
    Id: T.UserFieldId,
    Index: C.UInt32,
}
export const SUserInstanceAbilCmd = {
    ...SStruct,
    Field: SUserInstanceField,
    Abil: L.Abil,
    Cmd: T.AbilCmdIndex,
}
export const SUserInstanceActor = {
    ...SStruct,
    Field: SUserInstanceField,
    Actor: L.Actor,
}
export const SUserInstanceColor = {
    ...SStruct,
    Field: SUserInstanceField,
    Color: C.Color,
}
export const SUserInstanceCompare = {
    ...SStruct,
    Field: SUserInstanceField,
    Compare: E.ValueCompare,
}
export const SUserInstanceFixed = {
    ...SStruct,
    Field: SUserInstanceField,
    Fixed: C.Real,
}
export const SUserInstanceGameLink = {
    ...SStruct,
    Field: SUserInstanceField,
    GameLink: C.String,
}
export const SUserInstanceImage = {
    ...SStruct,
    Field: SUserInstanceField,
    Image: A.Image,
    Edge: E.TextTagEdge,
    Attach: E.AttachmentID,
}
export const SUserInstanceInt = {
    ...SStruct,
    Field: SUserInstanceField,
    Int: C.Int32,
}
export const SUserInstanceModel = {
    ...SStruct,
    Field: SUserInstanceField,
    Model: L.Model,
}
export const SUserInstanceMovie = {
    ...SStruct,
    Field: SUserInstanceField,
    Movie: A.Movie,
}
export const SUserInstanceSound = {
    ...SStruct,
    Field: SUserInstanceField,
    Sound: L.Sound,
}
export const SUserInstanceString = {
    ...SStruct,
    Field: SUserInstanceField,
    String: C.String,
}
export const SUserInstanceText = {
    ...SStruct,
    Field: SUserInstanceField,
    Text: L.String,
}
export const SUserInstanceUnit = {
    ...SStruct,
    Field: SUserInstanceField,
    Unit: L.Unit,
}
export const SUserInstanceUpgrade = {
    ...SStruct,
    Field: SUserInstanceField,
    Upgrade: L.Upgrade,
}
export const SUserInstanceUser = {
    ...SStruct,
    Field: SUserInstanceField,
    Type: L.User,
    Instance: T.UserInstanceId,
}
export const SUserField = {
    ...SStruct,
    Id: T.UserFieldId,
    Type: E.UserType,
    GameLinkType: E.GameCatalog,
    UserType: L.User,
    Count: C.UInt32,
    Flags: F.UserField,
    EditorColumn: C.UInt32,
    EditorText: E.EditorTextType,
}
export const SUserInstance = {
    ...SStruct,
    Id: T.UserInstanceId,
    AbilCmd: [SUserInstanceAbilCmd],
    Actor: [SUserInstanceActor],
    Color: [SUserInstanceColor],
    Compare: [SUserInstanceCompare],
    Fixed: [SUserInstanceFixed],
    GameLink: [SUserInstanceGameLink],
    Image: [SUserInstanceImage],
    Int: [SUserInstanceInt],
    Model: [SUserInstanceModel],
    Movie: [SUserInstanceMovie],
    Sound: [SUserInstanceSound],
    String: [SUserInstanceString],
    Text: [SUserInstanceText],
    Unit: [SUserInstanceUnit],
    Upgrade: [SUserInstanceUpgrade],
    User: [SUserInstanceUser],
}
export const SWaterStateDesc = {
    ...SStruct,
    Name: C.String32,
    Height: C.Real32,
    Color: C.Vector4,
    ColorFallOff: C.Real32,
    CausticsFallOff: C.Real32,
    Specularity: C.Real32,
    SpecularScaler: C.Real32,
    UvRate: C.Vector4,
    UvRotate: C.Real32,
    MeshRoughness: C.Real32,
    TextureRoughness: C.Real32,
    ReflectionDistortion: C.Real32,
    RefractionDistortion: C.Real32,
    ShadowDistortion: C.Real32,
    MinReflection: C.Real32,
    ReflectivityPower: C.Real32,
}
export const SWaterDoodad = {
    ...SStruct,
    Model: L.Model,
    Density: C.Real32,
    MinSize: C.Real32,
    MaxSize: C.Real32,
    Lifetime: C.UInt32,
}

export const DataStructs = {
    SAbilOrderDisplay,
    SEffectBehavior,
    SCost,
    SCooldown,
    SCharge,
    SCostFactor,
    STargetSorts,
    SMarker,
    SAbilTargetCursorInfo,
    SAbilArmMagazineInfo,
    SAbilCmdButton,
    SAbilBuildInfo,
    SAbilInventoryInfo,
    SAbilLearnInfo,
    SAbilMergeInfo,
    SAbilMorphInfo,
    SAbilMorphSection,
    SAbilPawnInfo,
    SAbilRallyInfo,
    SAbilResearchInfo,
    SAbilReviveCmdButton,
    SAbilReviveInfo,
    SAbilReviveInfoMax,
    SAbilSpecializeInfo,
    SAbilTrainInfo,
    SAbilWarpTrainInfo,
    SEffectWhichUnit,
    SEffectWhichLocation,
    SEffectWhichBehavior,
    SAccumulatorSwitchCase,
    SAccumulatedFixed,
    SAccumulatedUInt32,
    SAccumulatedGameRate,
    SAccumulatedGameTime,
    SEffectWhichPlayer,
    SAchievementTag,
    SActorRequest,
    SActorVisibilityShape,
    SActorEvent,
    SActorSiteOpsData,
    SActorModelAspectSet,
    SActorModelAspect,
    SActorHostedAttach,
    SAttachQuery,
    SEventDataFootprint,
    SEventDataSound,
    SActorPhysicsImpactData,
    SActorRangeAbil,
    SActorQuadDecoration,
    SActorSoundLayer,
    SActorAVPair,
    SActorActionTerrainSquib,
    SActorAVCluster,
    SActorPhysicsData,
    SActorQuerySubject,
    SActorQueryResponse,
    SActorQuerySubjectResponse,
    SActorSendBasics,
    SActorDeathBodySquib,
    SActorCloakTransition,
    SActorCloakState,
    SActorCreepHeightClass,
    SActorCreepRate,
    SActorDeathData,
    SActorDeathDataCustom,
    SLookAtTypeInfo,
    SLookAtType,
    SSplatEmitterMaterialInfo,
    SSplatEmitterInitInfo,
    SActorOverrideBlendTime,
    SActorOverrideTransitionBlendTime,
    SActorOverrideModel,
    SActorProgressStage,
    SActorHostedDelta,
    SSerpentAggregate,
    SSerpentSegment,
    SActorStateInfo,
    SActorBaseline,
    SActorDeathDataCustomGroup,
    SActorUnitImpactSoundExtras,
    SDamagePastRemainingHealth,
    SDamageOverInterval,
    STerrainSquib,
    STerrainSquibVisual,
    SUnitAbilSound,
    SErrorOverride,
    SLayerIcon,
    SLayerIconVariation,
    SLayerIconShield,
    SLayerIconShieldVariation,
    SVitalColor,
    SIconVariation,
    SStatusColor,
    SStatusChargeData,
    SStatusHarvesterData,
    STextTagParameters,
    SUnitKillRank,
    SBankPath,
    SArtifactRank,
    SProductReleaseDate,
    SAttachKey,
    SModification,
    SDeathResponse,
    SAttributeChange,
    SDamageKind,
    SScoreValueUpdate,
    SUnitResourceRatio,
    SUnitWeaponData,
    SVeterancyLevel,
    SBehaviorFraction,
    SEffectWhichTimeScale,
    SBehaviorDuration,
    SDamageResponse,
    SVitalRegenVitalRemain,
    SPowerStage,
    SAbilReplace,
    SAbilAdd,
    SSpawnInfo,
    STooltipBlock,
    STooltipTimeAbilCmd,
    SButtonCardLayout,
    SCameraZoom,
    SCameraParam,
    SCameraSmooth,
    SCampaignData,
    SMovieConfig,
    SCharacterVariation,
    SUIColorEntry,
    SCommanderUnit,
    SCommanderTalentTree,
    SCommanderMasteryTalent,
    SCommanderAbil,
    SCommanderDifficultyLevel,
    SConsoleSkinModel,
    SConversationProductionLevel,
    SConversationConditionSet,
    SConversationCondition,
    SConversationUserValue,
    SConversationActionSet,
    SConversationAction,
    SConversationFacialAnim,
    SConversationLine,
    SConversationRunActions,
    SConversationWait,
    SConversationJump,
    SConversationChoice,
    SConversationGroup,
    SConversationComment,
    SConversationStateIndex,
    SConversationStateInfoText,
    SConversationStateInfoValue,
    SConversationStateInfoModel,
    SConversationStateInfoUpgrade,
    SConversationStateInfoAbilCmd,
    SConversationStateVariation,
    SConversationStateInfoIds,
    SDataCollectionRecord,
    SUpgradeInfoWeapon,
    SDataFieldsPattern,
    SDataTokensPattern,
    STextureSheetEntry,
    SEffectDamageArea,
    SEffectSearchRevealerParams,
    SEffectEnumArea,
    SEffectMover,
    SEffectMissileBounce,
    SUpgradeEffect,
    SEffectUpgrade,
    SEffectModifyPlayerCost,
    SEffectModifyUnitCost,
    SEffectModifyWeapon,
    SEffectModifyVital,
    SEffectModifyTurret,
    SEffectSwitchCase,
    SEmoticonPackCampaign,
    SFootprintLayer,
    SFootprintShape,
    SFootprintBitSet,
    SDifficultyLevel,
    SAIBuild,
    SHandicap,
    SMapSize,
    SAspectMargin,
    STeamColor,
    SAIDescription,
    STriggerLib,
    STargetFilterResult,
    SBeaconInfo,
    SDamageTypeInfo,
    SAttackTypeInfo,
    SResourceConvert,
    SMeleePointThreshold,
    SChallengeCategory,
    SChallenge,
    SSoundQuality,
    SMinimapData,
    SSelectionData,
    SVolumeFade,
    SReverbRolloff,
    SVolumeThreshold,
    SVolumeRolloff,
    SSoundData,
    SMixRoute,
    SGlobalSoundData,
    SPointModel,
    SCameraShakeAmplitude,
    SCameraShakeFrequency,
    SCameraShakeRotation,
    SListenerRolloff,
    SUnitSpeedText,
    SWeaponSpeedText,
    SObjectGroupData,
    SLoadingScreenHelp,
    SLoadingBar,
    SGameCategory,
    SGameModeInfo,
    SDefaultGameVariant,
    STutorialConfig,
    SHotkeyInfo,
    SResourceUI,
    SHelpControlCategoryInfo,
    SHelpControlInfo,
    SHelpGameMechanicInfo,
    SAltSoundtrack,
    SCutsceneAssetPath,
    SHerdLevel,
    SHerdNode,
    SHeroAbilCategory,
    SHeroAbil,
    SHeroHeroicAbility,
    SHeroSpecificVO,
    SHeroTalentTree,
    SHeroTalentTier,
    SHeroSpecificIntroVO,
    SHeroLevelScaling,
    SHeroLevelModification,
    SHeroRatings,
    SHeroAITalentBuild,
    SHeroSpecificUI,
    SHeroStatModifier,
    SItemContainerSlot,
    SFlareInfo,
    STimeEvent,
    SLightInfo,
    SDirectionalLight,
    SVariationConfig,
    SLightRegionInfo,
    SMissionCategory,
    SLootChoice,
    SAnimFile,
    SAnimAlias,
    SAttachProps,
    SModelDataEvent,
    SPhysicsMaterialMapping,
    STextureDeclare,
    STextureNameAdaption,
    STextureInfo,
    STextureExpressionSpec,
    STextureMatchSpec,
    SModelVariation,
    SPathingData,
    SMotionPhase,
    SMotionOverlayPhase,
    SMotionOverlay,
    SStartingUnit,
    SUpkeepTax,
    SRequirementNode,
    SRequirementCount,
    SRewardCategory,
    SRewardSpecificUI,
    SGameReplacement,
    SSkinModelGroup,
    SSkinModelMacroRun,
    SSkinPackEntry,
    SSoundAsset,
    SSyncPointRange,
    SSoundAssetTemplate,
    SSoundLocaleFlags,
    SPitchShift,
    SReverbBalance,
    SSoundtrackCue,
    SSoundtrackMasterLayer,
    SSoundtrackSlaveLayer,
    SSoundtrackSection,
    STacAbilData,
    STalentRank,
    STalentAbilityModification,
    STalentModification,
    STargetFindEnumArea,
    SDSPArray,
    SCreepSettings,
    SFoliageSimulationConfig,
    STerrainDoodad,
    SFidget,
    SUnitArmorFormula,
    SStockCharge,
    SUnitAbilData,
    SUnitBehaviorData,
    SCardLayout,
    SCardLayoutButton,
    SAddedOnData,
    SUnitEquipment,
    SUnitReviveInfo,
    SAttributePointsInfo,
    SUpgradeEffectTemplate,
    SValidatorCondition,
    SValidatorFunction,
    SValidatorEnumArea,
    SVoiceOverSkin,
    SVoiceOverGroup,
    SVoiceOverLine,
    SVoicePackExampleLine,
    SUserField,
    SUserInstance,
    SUserInstanceField,
    SUserInstanceAbilCmd,
    SUserInstanceActor,
    SUserInstanceColor,
    SUserInstanceCompare,
    SUserInstanceFixed,
    SUserInstanceGameLink,
    SUserInstanceImage,
    SUserInstanceInt,
    SUserInstanceModel,
    SUserInstanceMovie,
    SUserInstanceSound,
    SUserInstanceString,
    SUserInstanceText,
    SUserInstanceUnit,
    SUserInstanceUpgrade,
    SUserInstanceUser,
    SWaterStateDesc,
    SWaterDoodad,
    SUserInstanceField,
    SUserInstanceAbilCmd,
    SUserInstanceActor,
    SUserInstanceColor,
    SUserInstanceCompare,
    SUserInstanceFixed,
    SUserInstanceGameLink,
    SUserInstanceImage,
    SUserInstanceInt,
    SUserInstanceModel,
    SUserInstanceMovie,
    SUserInstanceSound,
    SUserInstanceString,
    SUserInstanceText,
    SUserInstanceUnit,
    SUserInstanceUpgrade,
    SUserInstanceUser,
    SUserField,
    SUserInstance,
    SWaterStateDesc,
    SWaterDoodad,
}

const Data = Object.fromEntries(
    Object.entries(DataStructs).map(([key, value]) => [key.slice(1), value])
);

export default Data