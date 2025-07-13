import {V, C, T, Links as L,Assets as A,EUnknown} from "./types.js"
import {SCSchema} from "./schema.js"
import E from "./catalog-enums.js"
import F from "./catalog-flags.js"

// -------------------------------
// Structures
// -------------------------------


export const SToken = {
    id: C.Word,
    type: E.TypeId,
    value: C.TokenValue,
}
export const SConst = {
    id: C.Word,
    type: E.TypeId,
    value: C.TokenValue,
    path: C.Path,
}

export const SStructDefinition = {
    "@class": E.StructId
}
export const SStruct = {
}
export const SProductReleaseDate = {
    ...SStruct,
    Month: C.Month,
    Day: C.Day,
    Year: C.Year
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
    AbilCmd: L.AbilCommand,
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
    AbilCmd: L.AbilCommand,
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
    AbilCmd: L.AbilCommand,
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
    Abil: L.AbilCommand,
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
    AbilCmd: L.AbilCommand,
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



const SWaterStateDesc = {
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
const SWaterDoodad = {
    ...SStruct,
    Model: L.Model,
    Density: C.Real32,
    MinSize: C.Real32,
    MaxSize: C.Real32,
    Lifetime: C.UInt32,
}



export const SAbilOrderDisplayDefinition = {...SAbilOrderDisplay,...SStructDefinition}
export const SEffectBehaviorDefinition = {...SEffectBehavior,...SStructDefinition}
export const SCostDefinition = {...SCost,...SStructDefinition}
export const SCooldownDefinition = {...SCooldown,...SStructDefinition}
export const SChargeDefinition = {...SCharge,...SStructDefinition}
export const SCostFactorDefinition = {...SCostFactor,...SStructDefinition}
export const STargetSortsDefinition = {...STargetSorts,...SStructDefinition}
export const SMarkerDefinition = {...SMarker,...SStructDefinition}
export const SAbilTargetCursorInfoDefinition = {...SAbilTargetCursorInfo,...SStructDefinition}
export const SAbilArmMagazineInfoDefinition = {...SAbilArmMagazineInfo,...SStructDefinition}
export const SAbilCmdButtonDefinition = {...SAbilCmdButton,...SStructDefinition}
export const SAbilBuildInfoDefinition = {...SAbilBuildInfo,...SStructDefinition}
export const SAbilInventoryInfoDefinition = {...SAbilInventoryInfo,...SStructDefinition}
export const SAbilLearnInfoDefinition = {...SAbilLearnInfo,...SStructDefinition}
export const SAbilMergeInfoDefinition = {...SAbilMergeInfo,...SStructDefinition}
export const SAbilMorphInfoDefinition = {...SAbilMorphInfo,...SStructDefinition}
export const SAbilMorphSectionDefinition = {...SAbilMorphSection,...SStructDefinition}
export const SAbilPawnInfoDefinition = {...SAbilPawnInfo,...SStructDefinition}
export const SAbilRallyInfoDefinition = {...SAbilRallyInfo,...SStructDefinition}
export const SAbilResearchInfoDefinition = {...SAbilResearchInfo,...SStructDefinition}
export const SAbilReviveCmdButtonDefinition = {...SAbilReviveCmdButton,...SStructDefinition}
export const SAbilReviveInfoDefinition = {...SAbilReviveInfo,...SStructDefinition}
export const SAbilReviveInfoMaxDefinition = {...SAbilReviveInfoMax,...SStructDefinition}
export const SAbilSpecializeInfoDefinition = {...SAbilSpecializeInfo,...SStructDefinition}
export const SAbilTrainInfoDefinition = {...SAbilTrainInfo,...SStructDefinition}
export const SAbilWarpTrainInfoDefinition = {...SAbilWarpTrainInfo,...SStructDefinition}
export const SEffectWhichUnitDefinition = {...SEffectWhichUnit,...SStructDefinition}
export const SEffectWhichLocationDefinition = {...SEffectWhichLocation,...SStructDefinition}
export const SEffectWhichBehaviorDefinition = {...SEffectWhichBehavior,...SStructDefinition}
export const SAccumulatorSwitchCaseDefinition = {...SAccumulatorSwitchCase,...SStructDefinition}
export const SAccumulatedFixedDefinition = {...SAccumulatedFixed,...SStructDefinition}
export const SAccumulatedUInt32Definition = {...SAccumulatedUInt32,...SStructDefinition}
export const SAccumulatedGameRateDefinition = {...SAccumulatedGameRate,...SStructDefinition}
export const SAccumulatedGameTimeDefinition = {...SAccumulatedGameTime,...SStructDefinition}
export const SEffectWhichPlayerDefinition = {...SEffectWhichPlayer,...SStructDefinition}
export const SAchievementTagDefinition = {...SAchievementTag,...SStructDefinition}
export const SActorRequestDefinition = {...SActorRequest,...SStructDefinition}
export const SActorVisibilityShapeDefinition = {...SActorVisibilityShape,...SStructDefinition}
export const SActorEventDefinition = {...SActorEvent,...SStructDefinition}
export const SActorSiteOpsDataDefinition = {...SActorSiteOpsData,...SStructDefinition}
export const SActorModelAspectSetDefinition = {...SActorModelAspectSet,...SStructDefinition}
export const SActorModelAspectDefinition = {...SActorModelAspect,...SStructDefinition}
export const SActorHostedAttachDefinition = {...SActorHostedAttach,...SStructDefinition}
export const SAttachQueryDefinition = {...SAttachQuery,...SStructDefinition}
export const SEventDataFootprintDefinition = {...SEventDataFootprint,...SStructDefinition}
export const SEventDataSoundDefinition = {...SEventDataSound,...SStructDefinition}
export const SActorPhysicsImpactDataDefinition = {...SActorPhysicsImpactData,...SStructDefinition}
export const SActorRangeAbilDefinition = {...SActorRangeAbil,...SStructDefinition}
export const SActorQuadDecorationDefinition = {...SActorQuadDecoration,...SStructDefinition}
export const SActorSoundLayerDefinition = {...SActorSoundLayer,...SStructDefinition}
export const SActorAVPairDefinition = {...SActorAVPair,...SStructDefinition}
export const SActorActionTerrainSquibDefinition = {...SActorActionTerrainSquib,...SStructDefinition}
export const SActorAVClusterDefinition = {...SActorAVCluster,...SStructDefinition}
export const SActorPhysicsDataDefinition = {...SActorPhysicsData,...SStructDefinition}
export const SActorQuerySubjectDefinition = {...SActorQuerySubject,...SStructDefinition}
export const SActorQueryResponseDefinition = {...SActorQueryResponse,...SStructDefinition}
export const SActorQuerySubjectResponseDefinition = {...SActorQuerySubjectResponse,...SStructDefinition}
export const SActorSendBasicsDefinition = {...SActorSendBasics,...SStructDefinition}
export const SActorDeathBodySquibDefinition = {...SActorDeathBodySquib,...SStructDefinition}
export const SActorCloakTransitionDefinition = {...SActorCloakTransition,...SStructDefinition}
export const SActorCloakStateDefinition = {...SActorCloakState,...SStructDefinition}
export const SActorCreepHeightClassDefinition = {...SActorCreepHeightClass,...SStructDefinition}
export const SActorCreepRateDefinition = {...SActorCreepRate,...SStructDefinition}
export const SActorDeathDataDefinition = {...SActorDeathData,...SStructDefinition}
export const SActorDeathDataCustomDefinition = {...SActorDeathDataCustom,...SStructDefinition}
export const SLookAtTypeInfoDefinition = {...SLookAtTypeInfo,...SStructDefinition}
export const SLookAtTypeDefinition = {...SLookAtType,...SStructDefinition}
export const SSplatEmitterMaterialInfoDefinition = {...SSplatEmitterMaterialInfo,...SStructDefinition}
export const SSplatEmitterInitInfoDefinition = {...SSplatEmitterInitInfo,...SStructDefinition}
export const SActorOverrideBlendTimeDefinition = {...SActorOverrideBlendTime,...SStructDefinition}
export const SActorOverrideTransitionBlendTimeDefinition = {...SActorOverrideTransitionBlendTime,...SStructDefinition}
export const SActorOverrideModelDefinition = {...SActorOverrideModel,...SStructDefinition}
export const SActorProgressStageDefinition = {...SActorProgressStage,...SStructDefinition}
export const SActorHostedDeltaDefinition = {...SActorHostedDelta,...SStructDefinition}
export const SSerpentAggregateDefinition = {...SSerpentAggregate,...SStructDefinition}
export const SSerpentSegmentDefinition = {...SSerpentSegment,...SStructDefinition}
export const SActorStateInfoDefinition = {...SActorStateInfo,...SStructDefinition}
export const SActorBaselineDefinition = {...SActorBaseline,...SStructDefinition}
export const SActorDeathDataCustomGroupDefinition = {...SActorDeathDataCustomGroup,...SStructDefinition}
export const SActorUnitImpactSoundExtrasDefinition = {...SActorUnitImpactSoundExtras,...SStructDefinition}
export const SDamagePastRemainingHealthDefinition = {...SDamagePastRemainingHealth,...SStructDefinition}
export const SDamageOverIntervalDefinition = {...SDamageOverInterval,...SStructDefinition}
export const STerrainSquibDefinition = {...STerrainSquib,...SStructDefinition}
export const STerrainSquibVisualDefinition = {...STerrainSquibVisual,...SStructDefinition}
export const SUnitAbilSoundDefinition = {...SUnitAbilSound,...SStructDefinition}
export const SErrorOverrideDefinition = {...SErrorOverride,...SStructDefinition}
export const SLayerIconDefinition = {...SLayerIcon,...SStructDefinition}
export const SLayerIconVariationDefinition = {...SLayerIconVariation,...SStructDefinition}
export const SLayerIconShieldDefinition = {...SLayerIconShield,...SStructDefinition}
export const SLayerIconShieldVariationDefinition = {...SLayerIconShieldVariation,...SStructDefinition}
export const SVitalColorDefinition = {...SVitalColor,...SStructDefinition}
export const SIconVariationDefinition = {...SIconVariation,...SStructDefinition}
export const SStatusColorDefinition = {...SStatusColor,...SStructDefinition}
export const SStatusChargeDataDefinition = {...SStatusChargeData,...SStructDefinition}
export const SStatusHarvesterDataDefinition = {...SStatusHarvesterData,...SStructDefinition}
export const STextTagParametersDefinition = {...STextTagParameters,...SStructDefinition}
export const SUnitKillRankDefinition = {...SUnitKillRank,...SStructDefinition}
export const SBankPathDefinition = {...SBankPath,...SStructDefinition}
export const SArtifactRankDefinition = {...SArtifactRank,...SStructDefinition}
export const SProductReleaseDateDefinition = {...SProductReleaseDate,...SStructDefinition}
export const SAttachKeyDefinition = {...SAttachKey,...SStructDefinition}
export const SModificationDefinition = {...SModification,...SStructDefinition}
export const SDeathResponseDefinition = {...SDeathResponse,...SStructDefinition}
export const SAttributeChangeDefinition = {...SAttributeChange,...SStructDefinition}
export const SDamageKindDefinition = {...SDamageKind,...SStructDefinition}
export const SScoreValueUpdateDefinition = {...SScoreValueUpdate,...SStructDefinition}
export const SUnitResourceRatioDefinition = {...SUnitResourceRatio,...SStructDefinition}
export const SUnitWeaponDataDefinition = {...SUnitWeaponData,...SStructDefinition}
export const SVeterancyLevelDefinition = {...SVeterancyLevel,...SStructDefinition}
export const SBehaviorFractionDefinition = {...SBehaviorFraction,...SStructDefinition}
export const SEffectWhichTimeScaleDefinition = {...SEffectWhichTimeScale,...SStructDefinition}
export const SBehaviorDurationDefinition = {...SBehaviorDuration,...SStructDefinition}
export const SDamageResponseDefinition = {...SDamageResponse,...SStructDefinition}
export const SVitalRegenVitalRemainDefinition = {...SVitalRegenVitalRemain,...SStructDefinition}
export const SPowerStageDefinition = {...SPowerStage,...SStructDefinition}
export const SAbilReplaceDefinition = {...SAbilReplace,...SStructDefinition}
export const SAbilAddDefinition = {...SAbilAdd,...SStructDefinition}
export const SSpawnInfoDefinition = {...SSpawnInfo,...SStructDefinition}
export const STooltipBlockDefinition = {...STooltipBlock,...SStructDefinition}
export const STooltipTimeAbilCmdDefinition = {...STooltipTimeAbilCmd,...SStructDefinition}
export const SButtonCardLayoutDefinition = {...SButtonCardLayout,...SStructDefinition}
export const SCameraZoomDefinition = {...SCameraZoom,...SStructDefinition}
export const SCameraParamDefinition = {...SCameraParam,...SStructDefinition}
export const SCameraSmoothDefinition = {...SCameraSmooth,...SStructDefinition}
export const SCampaignDataDefinition = {...SCampaignData,...SStructDefinition}
export const SMovieConfigDefinition = {...SMovieConfig,...SStructDefinition}
export const SCharacterVariationDefinition = {...SCharacterVariation,...SStructDefinition}
export const SUIColorEntryDefinition = {...SUIColorEntry,...SStructDefinition}
export const SCommanderUnitDefinition = {...SCommanderUnit,...SStructDefinition}
export const SCommanderTalentTreeDefinition = {...SCommanderTalentTree,...SStructDefinition}
export const SCommanderMasteryTalentDefinition = {...SCommanderMasteryTalent,...SStructDefinition}
export const SCommanderAbilDefinition = {...SCommanderAbil,...SStructDefinition}
export const SCommanderDifficultyLevelDefinition = {...SCommanderDifficultyLevel,...SStructDefinition}
export const SConsoleSkinModelDefinition = {...SConsoleSkinModel,...SStructDefinition}
export const SConversationProductionLevelDefinition = {...SConversationProductionLevel,...SStructDefinition}
export const SConversationConditionSetDefinition = {...SConversationConditionSet,...SStructDefinition}
export const SConversationConditionDefinition = {...SConversationCondition,...SStructDefinition}
export const SConversationUserValueDefinition = {...SConversationUserValue,...SStructDefinition}
export const SConversationActionSetDefinition = {...SConversationActionSet,...SStructDefinition}
export const SConversationActionDefinition = {...SConversationAction,...SStructDefinition}
export const SConversationFacialAnimDefinition = {...SConversationFacialAnim,...SStructDefinition}
export const SConversationLineDefinition = {...SConversationLine,...SStructDefinition}
export const SConversationRunActionsDefinition = {...SConversationRunActions,...SStructDefinition}
export const SConversationWaitDefinition = {...SConversationWait,...SStructDefinition}
export const SConversationJumpDefinition = {...SConversationJump,...SStructDefinition}
export const SConversationChoiceDefinition = {...SConversationChoice,...SStructDefinition}
export const SConversationGroupDefinition = {...SConversationGroup,...SStructDefinition}
export const SConversationCommentDefinition = {...SConversationComment,...SStructDefinition}
export const SConversationStateIndexDefinition = {...SConversationStateIndex,...SStructDefinition}
export const SConversationStateInfoTextDefinition = {...SConversationStateInfoText,...SStructDefinition}
export const SConversationStateInfoValueDefinition = {...SConversationStateInfoValue,...SStructDefinition}
export const SConversationStateInfoModelDefinition = {...SConversationStateInfoModel,...SStructDefinition}
export const SConversationStateInfoUpgradeDefinition = {...SConversationStateInfoUpgrade,...SStructDefinition}
export const SConversationStateInfoAbilCmdDefinition = {...SConversationStateInfoAbilCmd,...SStructDefinition}
export const SConversationStateVariationDefinition = {...SConversationStateVariation,...SStructDefinition}
export const SConversationStateInfoIdsDefinition = {...SConversationStateInfoIds,...SStructDefinition}
export const SDataCollectionRecordDefinition = {...SDataCollectionRecord,...SStructDefinition}
export const SUpgradeInfoWeaponDefinition = {...SUpgradeInfoWeapon,...SStructDefinition}
export const SDataFieldsPatternDefinition = {...SDataFieldsPattern,...SStructDefinition}
export const SDataTokensPatternDefinition = {...SDataTokensPattern,...SStructDefinition}
export const STextureSheetEntryDefinition = {...STextureSheetEntry,...SStructDefinition}
export const SEffectDamageAreaDefinition = {...SEffectDamageArea,...SStructDefinition}
export const SEffectSearchRevealerParamsDefinition = {...SEffectSearchRevealerParams,...SStructDefinition}
export const SEffectEnumAreaDefinition = {...SEffectEnumArea,...SStructDefinition}
export const SEffectMoverDefinition = {...SEffectMover,...SStructDefinition}
export const SEffectMissileBounceDefinition = {...SEffectMissileBounce,...SStructDefinition}
export const SUpgradeEffectDefinition = {...SUpgradeEffect,...SStructDefinition}
export const SEffectUpgradeDefinition = {...SEffectUpgrade,...SStructDefinition}
export const SEffectModifyPlayerCostDefinition = {...SEffectModifyPlayerCost,...SStructDefinition}
export const SEffectModifyUnitCostDefinition = {...SEffectModifyUnitCost,...SStructDefinition}
export const SEffectModifyWeaponDefinition = {...SEffectModifyWeapon,...SStructDefinition}
export const SEffectModifyVitalDefinition = {...SEffectModifyVital,...SStructDefinition}
export const SEffectModifyTurretDefinition = {...SEffectModifyTurret,...SStructDefinition}
export const SEffectSwitchCaseDefinition = {...SEffectSwitchCase,...SStructDefinition}
export const SEmoticonPackCampaignDefinition = {...SEmoticonPackCampaign,...SStructDefinition}
export const SFootprintLayerDefinition = {...SFootprintLayer,...SStructDefinition}
export const SFootprintShapeDefinition = {...SFootprintShape,...SStructDefinition}
export const SFootprintBitSetDefinition = {...SFootprintBitSet,...SStructDefinition}
export const SDifficultyLevelDefinition = {...SDifficultyLevel,...SStructDefinition}
export const SAIBuildDefinition = {...SAIBuild,...SStructDefinition}
export const SHandicapDefinition = {...SHandicap,...SStructDefinition}
export const SMapSizeDefinition = {...SMapSize,...SStructDefinition}
export const SAspectMarginDefinition = {...SAspectMargin,...SStructDefinition}
export const STeamColorDefinition = {...STeamColor,...SStructDefinition}
export const SAIDescriptionDefinition = {...SAIDescription,...SStructDefinition}
export const STriggerLibDefinition = {...STriggerLib,...SStructDefinition}
export const STargetFilterResultDefinition = {...STargetFilterResult,...SStructDefinition}
export const SBeaconInfoDefinition = {...SBeaconInfo,...SStructDefinition}
export const SDamageTypeInfoDefinition = {...SDamageTypeInfo,...SStructDefinition}
export const SAttackTypeInfoDefinition = {...SAttackTypeInfo,...SStructDefinition}
export const SResourceConvertDefinition = {...SResourceConvert,...SStructDefinition}
export const SMeleePointThresholdDefinition = {...SMeleePointThreshold,...SStructDefinition}
export const SChallengeCategoryDefinition = {...SChallengeCategory,...SStructDefinition}
export const SChallengeDefinition = {...SChallenge,...SStructDefinition}
export const SSoundQualityDefinition = {...SSoundQuality,...SStructDefinition}
export const SMinimapDataDefinition = {...SMinimapData,...SStructDefinition}
export const SSelectionDataDefinition = {...SSelectionData,...SStructDefinition}
export const SVolumeFadeDefinition = {...SVolumeFade,...SStructDefinition}
export const SReverbRolloffDefinition = {...SReverbRolloff,...SStructDefinition}
export const SVolumeThresholdDefinition = {...SVolumeThreshold,...SStructDefinition}
export const SVolumeRolloffDefinition = {...SVolumeRolloff,...SStructDefinition}
export const SSoundDataDefinition = {...SSoundData,...SStructDefinition}
export const SMixRouteDefinition = {...SMixRoute,...SStructDefinition}
export const SGlobalSoundDataDefinition = {...SGlobalSoundData,...SStructDefinition}
export const SPointModelDefinition = {...SPointModel,...SStructDefinition}
export const SCameraShakeAmplitudeDefinition = {...SCameraShakeAmplitude,...SStructDefinition}
export const SCameraShakeFrequencyDefinition = {...SCameraShakeFrequency,...SStructDefinition}
export const SCameraShakeRotationDefinition = {...SCameraShakeRotation,...SStructDefinition}
export const SListenerRolloffDefinition = {...SListenerRolloff,...SStructDefinition}
export const SUnitSpeedTextDefinition = {...SUnitSpeedText,...SStructDefinition}
export const SWeaponSpeedTextDefinition = {...SWeaponSpeedText,...SStructDefinition}
export const SObjectGroupDataDefinition = {...SObjectGroupData,...SStructDefinition}
export const SLoadingScreenHelpDefinition = {...SLoadingScreenHelp,...SStructDefinition}
export const SLoadingBarDefinition = {...SLoadingBar,...SStructDefinition}
export const SGameCategoryDefinition = {...SGameCategory,...SStructDefinition}
export const SGameModeInfoDefinition = {...SGameModeInfo,...SStructDefinition}
export const SDefaultGameVariantDefinition = {...SDefaultGameVariant,...SStructDefinition}
export const STutorialConfigDefinition = {...STutorialConfig,...SStructDefinition}
export const SHotkeyInfoDefinition = {...SHotkeyInfo,...SStructDefinition}
export const SResourceUIDefinition = {...SResourceUI,...SStructDefinition}
export const SHelpControlCategoryInfoDefinition = {...SHelpControlCategoryInfo,...SStructDefinition}
export const SHelpControlInfoDefinition = {...SHelpControlInfo,...SStructDefinition}
export const SHelpGameMechanicInfoDefinition = {...SHelpGameMechanicInfo,...SStructDefinition}
export const SAltSoundtrackDefinition = {...SAltSoundtrack,...SStructDefinition}
export const SCutsceneAssetPathDefinition = {...SCutsceneAssetPath,...SStructDefinition}
export const SHerdLevelDefinition = {...SHerdLevel,...SStructDefinition}
export const SHerdNodeDefinition = {...SHerdNode,...SStructDefinition}
export const SHeroAbilCategoryDefinition = {...SHeroAbilCategory,...SStructDefinition}
export const SHeroAbilDefinition = {...SHeroAbil,...SStructDefinition}
export const SHeroHeroicAbilityDefinition = {...SHeroHeroicAbility,...SStructDefinition}
export const SHeroSpecificVODefinition = {...SHeroSpecificVO,...SStructDefinition}
export const SHeroTalentTreeDefinition = {...SHeroTalentTree,...SStructDefinition}
export const SHeroTalentTierDefinition = {...SHeroTalentTier,...SStructDefinition}
export const SHeroSpecificIntroVODefinition = {...SHeroSpecificIntroVO,...SStructDefinition}
export const SHeroLevelScalingDefinition = {...SHeroLevelScaling,...SStructDefinition}
export const SHeroLevelModificationDefinition = {...SHeroLevelModification,...SStructDefinition}
export const SHeroRatingsDefinition = {...SHeroRatings,...SStructDefinition}
export const SHeroAITalentBuildDefinition = {...SHeroAITalentBuild,...SStructDefinition}
export const SHeroSpecificUIDefinition = {...SHeroSpecificUI,...SStructDefinition}
export const SHeroStatModifierDefinition = {...SHeroStatModifier,...SStructDefinition}
export const SItemContainerSlotDefinition = {...SItemContainerSlot,...SStructDefinition}
export const SFlareInfoDefinition = {...SFlareInfo,...SStructDefinition}
export const STimeEventDefinition = {...STimeEvent,...SStructDefinition}
export const SLightInfoDefinition = {...SLightInfo,...SStructDefinition}
export const SDirectionalLightDefinition = {...SDirectionalLight,...SStructDefinition}
export const SVariationConfigDefinition = {...SVariationConfig,...SStructDefinition}
export const SLightRegionInfoDefinition = {...SLightRegionInfo,...SStructDefinition}
export const SMissionCategoryDefinition = {...SMissionCategory,...SStructDefinition}
export const SLootChoiceDefinition = {...SLootChoice,...SStructDefinition}
export const SAnimFileDefinition = {...SAnimFile,...SStructDefinition}
export const SAnimAliasDefinition = {...SAnimAlias,...SStructDefinition}
export const SAttachPropsDefinition = {...SAttachProps,...SStructDefinition}
export const SModelDataEventDefinition = {...SModelDataEvent,...SStructDefinition}
export const SPhysicsMaterialMappingDefinition = {...SPhysicsMaterialMapping,...SStructDefinition}
export const STextureDeclareDefinition = {...STextureDeclare,...SStructDefinition}
export const STextureNameAdaptionDefinition = {...STextureNameAdaption,...SStructDefinition}
export const STextureInfoDefinition = {...STextureInfo,...SStructDefinition}
export const STextureExpressionSpecDefinition = {...STextureExpressionSpec,...SStructDefinition}
export const STextureMatchSpecDefinition = {...STextureMatchSpec,...SStructDefinition}
export const SModelVariationDefinition = {...SModelVariation,...SStructDefinition}
export const SPathingDataDefinition = {...SPathingData,...SStructDefinition}
export const SMotionPhaseDefinition = {...SMotionPhase,...SStructDefinition}
export const SMotionOverlayPhaseDefinition = {...SMotionOverlayPhase,...SStructDefinition}
export const SMotionOverlayDefinition = {...SMotionOverlay,...SStructDefinition}
export const SStartingUnitDefinition = {...SStartingUnit,...SStructDefinition}
export const SUpkeepTaxDefinition = {...SUpkeepTax,...SStructDefinition}
export const SRequirementNodeDefinition = {...SRequirementNode,...SStructDefinition}
export const SRequirementCountDefinition = {...SRequirementCount,...SStructDefinition}
export const SRewardCategoryDefinition = {...SRewardCategory,...SStructDefinition}
export const SRewardSpecificUIDefinition = {...SRewardSpecificUI,...SStructDefinition}
export const SGameReplacementDefinition = {...SGameReplacement,...SStructDefinition}
export const SSkinModelGroupDefinition = {...SSkinModelGroup,...SStructDefinition}
export const SSkinModelMacroRunDefinition = {...SSkinModelMacroRun,...SStructDefinition}
export const SSkinPackEntryDefinition = {...SSkinPackEntry,...SStructDefinition}
export const SSoundAssetDefinition = {...SSoundAsset,...SStructDefinition}
export const SSyncPointRangeDefinition = {...SSyncPointRange,...SStructDefinition}
export const SSoundAssetTemplateDefinition = {...SSoundAssetTemplate,...SStructDefinition}
export const SSoundLocaleFlagsDefinition = {...SSoundLocaleFlags,...SStructDefinition}
export const SPitchShiftDefinition = {...SPitchShift,...SStructDefinition}
export const SReverbBalanceDefinition = {...SReverbBalance,...SStructDefinition}
export const SSoundtrackCueDefinition = {...SSoundtrackCue,...SStructDefinition}
export const SSoundtrackMasterLayerDefinition = {...SSoundtrackMasterLayer,...SStructDefinition}
export const SSoundtrackSlaveLayerDefinition = {...SSoundtrackSlaveLayer,...SStructDefinition}
export const SSoundtrackSectionDefinition = {...SSoundtrackSection,...SStructDefinition}
export const STacAbilDataDefinition = {...STacAbilData,...SStructDefinition}
export const STalentRankDefinition = {...STalentRank,...SStructDefinition}
export const STalentAbilityModificationDefinition = {...STalentAbilityModification,...SStructDefinition}
export const STalentModificationDefinition = {...STalentModification,...SStructDefinition}
export const STargetFindEnumAreaDefinition = {...STargetFindEnumArea,...SStructDefinition}
export const SDSPArrayDefinition = {...SDSPArray,...SStructDefinition}
export const SCreepSettingsDefinition = {...SCreepSettings,...SStructDefinition}
export const SFoliageSimulationConfigDefinition = {...SFoliageSimulationConfig,...SStructDefinition}
export const STerrainDoodadDefinition = {...STerrainDoodad,...SStructDefinition}
export const SFidgetDefinition = {...SFidget,...SStructDefinition}
export const SUnitArmorFormulaDefinition = {...SUnitArmorFormula,...SStructDefinition}
export const SStockChargeDefinition = {...SStockCharge,...SStructDefinition}
export const SUnitAbilDataDefinition = {...SUnitAbilData,...SStructDefinition}
export const SUnitBehaviorDataDefinition = {...SUnitBehaviorData,...SStructDefinition}
export const SCardLayoutDefinition = {...SCardLayout,...SStructDefinition}
export const SCardLayoutButtonDefinition = {...SCardLayoutButton,...SStructDefinition}
export const SAddedOnDataDefinition = {...SAddedOnData,...SStructDefinition}
export const SUnitEquipmentDefinition = {...SUnitEquipment,...SStructDefinition}
export const SUnitReviveInfoDefinition = {...SUnitReviveInfo,...SStructDefinition}
export const SAttributePointsInfoDefinition = {...SAttributePointsInfo,...SStructDefinition}
export const SUpgradeEffectTemplateDefinition = {...SUpgradeEffectTemplate,...SStructDefinition}
export const SValidatorConditionDefinition = {...SValidatorCondition,...SStructDefinition}
export const SValidatorFunctionDefinition = {...SValidatorFunction,...SStructDefinition}
export const SValidatorEnumAreaDefinition = {...SValidatorEnumArea,...SStructDefinition}
export const SVoiceOverSkinDefinition = {...SVoiceOverSkin,...SStructDefinition}
export const SVoiceOverGroupDefinition = {...SVoiceOverGroup,...SStructDefinition}
export const SVoiceOverLineDefinition = {...SVoiceOverLine,...SStructDefinition}
export const SVoicePackExampleLineDefinition = {...SVoicePackExampleLine,...SStructDefinition}
export const SUserFieldDefinition = {...SUserField,...SStructDefinition}
export const SUserInstanceDefinition = {...SUserInstance,...SStructDefinition}
export const SUserInstanceFieldDefinition = {...SUserInstanceField,...SStructDefinition}
export const SUserInstanceAbilCmdDefinition = {...SUserInstanceAbilCmd,...SStructDefinition}
export const SUserInstanceActorDefinition = {...SUserInstanceActor,...SStructDefinition}
export const SUserInstanceColorDefinition = {...SUserInstanceColor,...SStructDefinition}
export const SUserInstanceCompareDefinition = {...SUserInstanceCompare,...SStructDefinition}
export const SUserInstanceFixedDefinition = {...SUserInstanceFixed,...SStructDefinition}
export const SUserInstanceGameLinkDefinition = {...SUserInstanceGameLink,...SStructDefinition}
export const SUserInstanceImageDefinition = {...SUserInstanceImage,...SStructDefinition}
export const SUserInstanceIntDefinition = {...SUserInstanceInt,...SStructDefinition}
export const SUserInstanceModelDefinition = {...SUserInstanceModel,...SStructDefinition}
export const SUserInstanceMovieDefinition = {...SUserInstanceMovie,...SStructDefinition}
export const SUserInstanceSoundDefinition = {...SUserInstanceSound,...SStructDefinition}
export const SUserInstanceStringDefinition = {...SUserInstanceString,...SStructDefinition}
export const SUserInstanceTextDefinition = {...SUserInstanceText,...SStructDefinition}
export const SUserInstanceUnitDefinition = {...SUserInstanceUnit,...SStructDefinition}
export const SUserInstanceUpgradeDefinition = {...SUserInstanceUpgrade,...SStructDefinition}
export const SUserInstanceUserDefinition = {...SUserInstanceUser,...SStructDefinition}
export const SWaterStateDescDefinition = {...SWaterStateDesc,...SStructDefinition}
export const SWaterDoodadDefinition = {...SWaterDoodad,...SStructDefinition}

export const Structs = {
    AbilOrderDisplay: SAbilOrderDisplay,
    EffectBehavior: SEffectBehavior,
    Cost: SCost,
    Cooldown: SCooldown,
    Charge: SCharge,
    CostFactor: SCostFactor,
    TargetSorts: STargetSorts,
    Marker: SMarker,
    AbilTargetCursorInfo: SAbilTargetCursorInfo,
    AbilArmMagazineInfo: SAbilArmMagazineInfo,
    AbilCmdButton: SAbilCmdButton,
    AbilBuildInfo: SAbilBuildInfo,
    AbilInventoryInfo: SAbilInventoryInfo,
    AbilLearnInfo: SAbilLearnInfo,
    AbilMergeInfo: SAbilMergeInfo,
    AbilMorphInfo: SAbilMorphInfo,
    AbilMorphSection: SAbilMorphSection,
    AbilPawnInfo: SAbilPawnInfo,
    AbilRallyInfo: SAbilRallyInfo,
    AbilResearchInfo: SAbilResearchInfo,
    AbilReviveCmdButton: SAbilReviveCmdButton,
    AbilReviveInfo: SAbilReviveInfo,
    AbilReviveInfoMax: SAbilReviveInfoMax,
    AbilSpecializeInfo: SAbilSpecializeInfo,
    AbilTrainInfo: SAbilTrainInfo,
    AbilWarpTrainInfo: SAbilWarpTrainInfo,
    EffectWhichUnit: SEffectWhichUnit,
    EffectWhichLocation: SEffectWhichLocation,
    EffectWhichBehavior: SEffectWhichBehavior,
    AccumulatorSwitchCase: SAccumulatorSwitchCase,
    AccumulatedFixed: SAccumulatedFixed,
    AccumulatedUInt32: SAccumulatedUInt32,
    AccumulatedGameRate: SAccumulatedGameRate,
    AccumulatedGameTime: SAccumulatedGameTime,
    EffectWhichPlayer: SEffectWhichPlayer,
    AchievementTag: SAchievementTag,
    ActorRequest: SActorRequest,
    ActorVisibilityShape: SActorVisibilityShape,
    ActorEvent: SActorEvent,
    ActorSiteOpsData: SActorSiteOpsData,
    ActorModelAspectSet: SActorModelAspectSet,
    ActorModelAspect: SActorModelAspect,
    ActorHostedAttach: SActorHostedAttach,
    AttachQuery: SAttachQuery,
    EventDataFootprint: SEventDataFootprint,
    EventDataSound: SEventDataSound,
    ActorPhysicsImpactData: SActorPhysicsImpactData,
    ActorRangeAbil: SActorRangeAbil,
    ActorQuadDecoration: SActorQuadDecoration,
    ActorSoundLayer: SActorSoundLayer,
    ActorAVPair: SActorAVPair,
    ActorActionTerrainSquib: SActorActionTerrainSquib,
    ActorAVCluster: SActorAVCluster,
    ActorPhysicsData: SActorPhysicsData,
    ActorQuerySubject: SActorQuerySubject,
    ActorQueryResponse: SActorQueryResponse,
    ActorQuerySubjectResponse: SActorQuerySubjectResponse,
    ActorSendBasics: SActorSendBasics,
    ActorDeathBodySquib: SActorDeathBodySquib,
    ActorCloakTransition: SActorCloakTransition,
    ActorCloakState: SActorCloakState,
    ActorCreepHeightClass: SActorCreepHeightClass,
    ActorCreepRate: SActorCreepRate,
    ActorDeathData: SActorDeathData,
    ActorDeathDataCustom: SActorDeathDataCustom,
    LookAtTypeInfo: SLookAtTypeInfo,
    LookAtType: SLookAtType,
    SplatEmitterMaterialInfo: SSplatEmitterMaterialInfo,
    SplatEmitterInitInfo: SSplatEmitterInitInfo,
    ActorOverrideBlendTime: SActorOverrideBlendTime,
    ActorOverrideTransitionBlendTime: SActorOverrideTransitionBlendTime,
    ActorOverrideModel: SActorOverrideModel,
    ActorProgressStage: SActorProgressStage,
    ActorHostedDelta: SActorHostedDelta,
    SerpentAggregate: SSerpentAggregate,
    SerpentSegment: SSerpentSegment,
    ActorStateInfo: SActorStateInfo,
    ActorBaseline: SActorBaseline,
    ActorDeathDataCustomGroup: SActorDeathDataCustomGroup,
    ActorUnitImpactSoundExtras: SActorUnitImpactSoundExtras,
    DamagePastRemainingHealth: SDamagePastRemainingHealth,
    DamageOverInterval: SDamageOverInterval,
    TerrainSquib: STerrainSquib,
    TerrainSquibVisual: STerrainSquibVisual,
    UnitAbilSound: SUnitAbilSound,
    ErrorOverride: SErrorOverride,
    LayerIcon: SLayerIcon,
    LayerIconVariation: SLayerIconVariation,
    LayerIconShield: SLayerIconShield,
    LayerIconShieldVariation: SLayerIconShieldVariation,
    VitalColor: SVitalColor,
    IconVariation: SIconVariation,
    StatusColor: SStatusColor,
    StatusChargeData: SStatusChargeData,
    StatusHarvesterData: SStatusHarvesterData,
    TextTagParameters: STextTagParameters,
    UnitKillRank: SUnitKillRank,
    BankPath: SBankPath,
    ArtifactRank: SArtifactRank,
    ProductReleaseDate: SProductReleaseDate,
    AttachKey: SAttachKey,
    Modification: SModification,
    DeathResponse: SDeathResponse,
    AttributeChange: SAttributeChange,
    DamageKind: SDamageKind,
    ScoreValueUpdate: SScoreValueUpdate,
    UnitResourceRatio: SUnitResourceRatio,
    UnitWeaponData: SUnitWeaponData,
    VeterancyLevel: SVeterancyLevel,
    BehaviorFraction: SBehaviorFraction,
    EffectWhichTimeScale: SEffectWhichTimeScale,
    BehaviorDuration: SBehaviorDuration,
    DamageResponse: SDamageResponse,
    VitalRegenVitalRemain: SVitalRegenVitalRemain,
    PowerStage: SPowerStage,
    AbilReplace: SAbilReplace,
    AbilAdd: SAbilAdd,
    SpawnInfo: SSpawnInfo,
    TooltipBlock: STooltipBlock,
    TooltipTimeAbilCmd: STooltipTimeAbilCmd,
    ButtonCardLayout: SButtonCardLayout,
    CameraZoom: SCameraZoom,
    CameraParam: SCameraParam,
    CameraSmooth: SCameraSmooth,
    CampaignData: SCampaignData,
    MovieConfig: SMovieConfig,
    CharacterVariation: SCharacterVariation,
    UIColorEntry: SUIColorEntry,
    CommanderUnit: SCommanderUnit,
    CommanderTalentTree: SCommanderTalentTree,
    CommanderMasteryTalent: SCommanderMasteryTalent,
    CommanderAbil: SCommanderAbil,
    CommanderDifficultyLevel: SCommanderDifficultyLevel,
    ConsoleSkinModel: SConsoleSkinModel,
    ConversationProductionLevel: SConversationProductionLevel,
    ConversationConditionSet: SConversationConditionSet,
    ConversationCondition: SConversationCondition,
    ConversationUserValue: SConversationUserValue,
    ConversationActionSet: SConversationActionSet,
    ConversationAction: SConversationAction,
    ConversationFacialAnim: SConversationFacialAnim,
    ConversationLine: SConversationLine,
    ConversationRunActions: SConversationRunActions,
    ConversationWait: SConversationWait,
    ConversationJump: SConversationJump,
    ConversationChoice: SConversationChoice,
    ConversationGroup: SConversationGroup,
    ConversationComment: SConversationComment,
    ConversationStateIndex: SConversationStateIndex,
    ConversationStateInfoText: SConversationStateInfoText,
    ConversationStateInfoValue: SConversationStateInfoValue,
    ConversationStateInfoModel: SConversationStateInfoModel,
    ConversationStateInfoUpgrade: SConversationStateInfoUpgrade,
    ConversationStateInfoAbilCmd: SConversationStateInfoAbilCmd,
    ConversationStateVariation: SConversationStateVariation,
    ConversationStateInfoIds: SConversationStateInfoIds,
    DataCollectionRecord: SDataCollectionRecord,
    UpgradeInfoWeapon: SUpgradeInfoWeapon,
    DataFieldsPattern: SDataFieldsPattern,
    DataTokensPattern: SDataTokensPattern,
    TextureSheetEntry: STextureSheetEntry,
    EffectDamageArea: SEffectDamageArea,
    EffectSearchRevealerParams: SEffectSearchRevealerParams,
    EffectEnumArea: SEffectEnumArea,
    EffectMover: SEffectMover,
    EffectMissileBounce: SEffectMissileBounce,
    UpgradeEffect: SUpgradeEffect,
    EffectUpgrade: SEffectUpgrade,
    EffectModifyPlayerCost: SEffectModifyPlayerCost,
    EffectModifyUnitCost: SEffectModifyUnitCost,
    EffectModifyWeapon: SEffectModifyWeapon,
    EffectModifyVital: SEffectModifyVital,
    EffectModifyTurret: SEffectModifyTurret,
    EffectSwitchCase: SEffectSwitchCase,
    EmoticonPackCampaign: SEmoticonPackCampaign,
    FootprintLayer: SFootprintLayer,
    FootprintShape: SFootprintShape,
    FootprintBitSet: SFootprintBitSet,
    DifficultyLevel: SDifficultyLevel,
    AIBuild: SAIBuild,
    Handicap: SHandicap,
    MapSize: SMapSize,
    AspectMargin: SAspectMargin,
    TeamColor: STeamColor,
    AIDescription: SAIDescription,
    TriggerLib: STriggerLib,
    TargetFilterResult: STargetFilterResult,
    BeaconInfo: SBeaconInfo,
    DamageTypeInfo: SDamageTypeInfo,
    AttackTypeInfo: SAttackTypeInfo,
    ResourceConvert: SResourceConvert,
    MeleePointThreshold: SMeleePointThreshold,
    ChallengeCategory: SChallengeCategory,
    Challenge: SChallenge,
    SoundQuality: SSoundQuality,
    MinimapData: SMinimapData,
    SelectionData: SSelectionData,
    VolumeFade: SVolumeFade,
    ReverbRolloff: SReverbRolloff,
    VolumeThreshold: SVolumeThreshold,
    VolumeRolloff: SVolumeRolloff,
    SoundData: SSoundData,
    MixRoute: SMixRoute,
    GlobalSoundData: SGlobalSoundData,
    PointModel: SPointModel,
    CameraShakeAmplitude: SCameraShakeAmplitude,
    CameraShakeFrequency: SCameraShakeFrequency,
    CameraShakeRotation: SCameraShakeRotation,
    ListenerRolloff: SListenerRolloff,
    UnitSpeedText: SUnitSpeedText,
    WeaponSpeedText: SWeaponSpeedText,
    ObjectGroupData: SObjectGroupData,
    LoadingScreenHelp: SLoadingScreenHelp,
    LoadingBar: SLoadingBar,
    GameCategory: SGameCategory,
    GameModeInfo: SGameModeInfo,
    DefaultGameVariant: SDefaultGameVariant,
    TutorialConfig: STutorialConfig,
    HotkeyInfo: SHotkeyInfo,
    ResourceUI: SResourceUI,
    HelpControlCategoryInfo: SHelpControlCategoryInfo,
    HelpControlInfo: SHelpControlInfo,
    HelpGameMechanicInfo: SHelpGameMechanicInfo,
    AltSoundtrack: SAltSoundtrack,
    CutsceneAssetPath: SCutsceneAssetPath,
    HerdLevel: SHerdLevel,
    HerdNode: SHerdNode,
    HeroAbilCategory: SHeroAbilCategory,
    HeroAbil: SHeroAbil,
    HeroHeroicAbility: SHeroHeroicAbility,
    HeroSpecificVO: SHeroSpecificVO,
    HeroTalentTree: SHeroTalentTree,
    HeroTalentTier: SHeroTalentTier,
    HeroSpecificIntroVO: SHeroSpecificIntroVO,
    HeroLevelScaling: SHeroLevelScaling,
    HeroLevelModification: SHeroLevelModification,
    HeroRatings: SHeroRatings,
    HeroAITalentBuild: SHeroAITalentBuild,
    HeroSpecificUI: SHeroSpecificUI,
    HeroStatModifier: SHeroStatModifier,
    ItemContainerSlot: SItemContainerSlot,
    FlareInfo: SFlareInfo,
    TimeEvent: STimeEvent,
    LightInfo: SLightInfo,
    DirectionalLight: SDirectionalLight,
    VariationConfig: SVariationConfig,
    LightRegionInfo: SLightRegionInfo,
    MissionCategory: SMissionCategory,
    LootChoice: SLootChoice,
    AnimFile: SAnimFile,
    AnimAlias: SAnimAlias,
    AttachProps: SAttachProps,
    ModelDataEvent: SModelDataEvent,
    PhysicsMaterialMapping: SPhysicsMaterialMapping,
    TextureDeclare: STextureDeclare,
    TextureNameAdaption: STextureNameAdaption,
    TextureInfo: STextureInfo,
    TextureExpressionSpec: STextureExpressionSpec,
    TextureMatchSpec: STextureMatchSpec,
    ModelVariation: SModelVariation,
    PathingData: SPathingData,
    MotionPhase: SMotionPhase,
    MotionOverlayPhase: SMotionOverlayPhase,
    MotionOverlay: SMotionOverlay,
    StartingUnit: SStartingUnit,
    UpkeepTax: SUpkeepTax,
    RequirementNode: SRequirementNode,
    RequirementCount: SRequirementCount,
    RewardCategory: SRewardCategory,
    RewardSpecificUI: SRewardSpecificUI,
    GameReplacement: SGameReplacement,
    SkinModelGroup: SSkinModelGroup,
    SkinModelMacroRun: SSkinModelMacroRun,
    SkinPackEntry: SSkinPackEntry,
    SoundAsset: SSoundAsset,
    SyncPointRange: SSyncPointRange,
    SoundAssetTemplate: SSoundAssetTemplate,
    SoundLocaleFlags: SSoundLocaleFlags,
    PitchShift: SPitchShift,
    ReverbBalance: SReverbBalance,
    SoundtrackCue: SSoundtrackCue,
    SoundtrackMasterLayer: SSoundtrackMasterLayer,
    SoundtrackSlaveLayer: SSoundtrackSlaveLayer,
    SoundtrackSection: SSoundtrackSection,
    TacAbilData: STacAbilData,
    TalentRank: STalentRank,
    TalentAbilityModification: STalentAbilityModification,
    TalentModification: STalentModification,
    TargetFindEnumArea: STargetFindEnumArea,
    DSPArray: SDSPArray,
    CreepSettings: SCreepSettings,
    FoliageSimulationConfig: SFoliageSimulationConfig,
    TerrainDoodad: STerrainDoodad,
    Fidget: SFidget,
    UnitArmorFormula: SUnitArmorFormula,
    StockCharge: SStockCharge,
    UnitAbilData: SUnitAbilData,
    UnitBehaviorData: SUnitBehaviorData,
    CardLayout: SCardLayout,
    CardLayoutButton: SCardLayoutButton,
    AddedOnData: SAddedOnData,
    UnitEquipment: SUnitEquipment,
    UnitReviveInfo: SUnitReviveInfo,
    AttributePointsInfo: SAttributePointsInfo,
    UpgradeEffectTemplate: SUpgradeEffectTemplate,
    ValidatorCondition: SValidatorCondition,
    ValidatorFunction: SValidatorFunction,
    ValidatorEnumArea: SValidatorEnumArea,
    VoiceOverSkin: SVoiceOverSkin,
    VoiceOverGroup: SVoiceOverGroup,
    VoiceOverLine: SVoiceOverLine,
    VoicePackExampleLine: SVoicePackExampleLine,
    UserField: SUserField,
    UserInstance: SUserInstance,
    UserInstanceField: SUserInstanceField,
    UserInstanceAbilCmd: SUserInstanceAbilCmd,
    UserInstanceActor: SUserInstanceActor,
    UserInstanceColor: SUserInstanceColor,
    UserInstanceCompare: SUserInstanceCompare,
    UserInstanceFixed: SUserInstanceFixed,
    UserInstanceGameLink: SUserInstanceGameLink,
    UserInstanceImage: SUserInstanceImage,
    UserInstanceInt: SUserInstanceInt,
    UserInstanceModel: SUserInstanceModel,
    UserInstanceMovie: SUserInstanceMovie,
    UserInstanceSound: SUserInstanceSound,
    UserInstanceString: SUserInstanceString,
    UserInstanceText: SUserInstanceText,
    UserInstanceUnit: SUserInstanceUnit,
    UserInstanceUpgrade: SUserInstanceUpgrade,
    UserInstanceUser: SUserInstanceUser,
    WaterStateDesc: SWaterStateDesc,
    WaterDoodad: SWaterDoodad,
    UserInstanceField: SUserInstanceField,
    UserInstanceAbilCmd: SUserInstanceAbilCmd,
    UserInstanceActor: SUserInstanceActor,
    UserInstanceColor: SUserInstanceColor,
    UserInstanceCompare: SUserInstanceCompare,
    UserInstanceFixed: SUserInstanceFixed,
    UserInstanceGameLink: SUserInstanceGameLink,
    UserInstanceImage: SUserInstanceImage,
    UserInstanceInt: SUserInstanceInt,
    UserInstanceModel: SUserInstanceModel,
    UserInstanceMovie: SUserInstanceMovie,
    UserInstanceSound: SUserInstanceSound,
    UserInstanceString: SUserInstanceString,
    UserInstanceText: SUserInstanceText,
    UserInstanceUnit: SUserInstanceUnit,
    UserInstanceUpgrade: SUserInstanceUpgrade,
    UserInstanceUser: SUserInstanceUser,
    UserField: SUserField,
    UserInstance: SUserInstance,
    WaterStateDesc: SWaterStateDesc,
    WaterDoodad: SWaterDoodad,
}

export const S = {
    ...Structs,
    Const: SConst,
    Token: SToken,
}

// used by VStruct to determind object a structure
SCSchema.struct = {
    SConst, // todo not really a struct
    SToken, // todo not really a struct
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

SCSchema.structDefinitions = {
    SAbilOrderDisplay: SAbilOrderDisplayDefinition,
    SEffectBehavior: SEffectBehaviorDefinition,
    SCost: SCostDefinition,
    SCooldown: SCooldownDefinition,
    SCharge: SChargeDefinition,
    SCostFactor: SCostFactorDefinition,
    STargetSorts: STargetSortsDefinition,
    SMarker: SMarkerDefinition,
    SAbilTargetCursorInfo: SAbilTargetCursorInfoDefinition,
    SAbilArmMagazineInfo: SAbilArmMagazineInfoDefinition,
    SAbilCmdButton: SAbilCmdButtonDefinition,
    SAbilBuildInfo: SAbilBuildInfoDefinition,
    SAbilInventoryInfo: SAbilInventoryInfoDefinition,
    SAbilLearnInfo: SAbilLearnInfoDefinition,
    SAbilMergeInfo: SAbilMergeInfoDefinition,
    SAbilMorphInfo: SAbilMorphInfoDefinition,
    SAbilMorphSection: SAbilMorphSectionDefinition,
    SAbilPawnInfo: SAbilPawnInfoDefinition,
    SAbilRallyInfo: SAbilRallyInfoDefinition,
    SAbilResearchInfo: SAbilResearchInfoDefinition,
    SAbilReviveCmdButton: SAbilReviveCmdButtonDefinition,
    SAbilReviveInfo: SAbilReviveInfoDefinition,
    SAbilReviveInfoMax: SAbilReviveInfoMaxDefinition,
    SAbilSpecializeInfo: SAbilSpecializeInfoDefinition,
    SAbilTrainInfo: SAbilTrainInfoDefinition,
    SAbilWarpTrainInfo: SAbilWarpTrainInfoDefinition,
    SEffectWhichUnit: SEffectWhichUnitDefinition,
    SEffectWhichLocation: SEffectWhichLocationDefinition,
    SEffectWhichBehavior: SEffectWhichBehaviorDefinition,
    SAccumulatorSwitchCase: SAccumulatorSwitchCaseDefinition,
    SAccumulatedFixed: SAccumulatedFixedDefinition,
    SAccumulatedUInt32: SAccumulatedUInt32Definition,
    SAccumulatedGameRate: SAccumulatedGameRateDefinition,
    SAccumulatedGameTime: SAccumulatedGameTimeDefinition,
    SEffectWhichPlayer: SEffectWhichPlayerDefinition,
    SAchievementTag: SAchievementTagDefinition,
    SActorRequest: SActorRequestDefinition,
    SActorVisibilityShape: SActorVisibilityShapeDefinition,
    SActorEvent: SActorEventDefinition,
    SActorSiteOpsData: SActorSiteOpsDataDefinition,
    SActorModelAspectSet: SActorModelAspectSetDefinition,
    SActorModelAspect: SActorModelAspectDefinition,
    SActorHostedAttach: SActorHostedAttachDefinition,
    SAttachQuery: SAttachQueryDefinition,
    SEventDataFootprint: SEventDataFootprintDefinition,
    SEventDataSound: SEventDataSoundDefinition,
    SActorPhysicsImpactData: SActorPhysicsImpactDataDefinition,
    SActorRangeAbil: SActorRangeAbilDefinition,
    SActorQuadDecoration: SActorQuadDecorationDefinition,
    SActorSoundLayer: SActorSoundLayerDefinition,
    SActorAVPair: SActorAVPairDefinition,
    SActorActionTerrainSquib: SActorActionTerrainSquibDefinition,
    SActorAVCluster: SActorAVClusterDefinition,
    SActorPhysicsData: SActorPhysicsDataDefinition,
    SActorQuerySubject: SActorQuerySubjectDefinition,
    SActorQueryResponse: SActorQueryResponseDefinition,
    SActorQuerySubjectResponse: SActorQuerySubjectResponseDefinition,
    SActorSendBasics: SActorSendBasicsDefinition,
    SActorDeathBodySquib: SActorDeathBodySquibDefinition,
    SActorCloakTransition: SActorCloakTransitionDefinition,
    SActorCloakState: SActorCloakStateDefinition,
    SActorCreepHeightClass: SActorCreepHeightClassDefinition,
    SActorCreepRate: SActorCreepRateDefinition,
    SActorDeathData: SActorDeathDataDefinition,
    SActorDeathDataCustom: SActorDeathDataCustomDefinition,
    SLookAtTypeInfo: SLookAtTypeInfoDefinition,
    SLookAtType: SLookAtTypeDefinition,
    SSplatEmitterMaterialInfo: SSplatEmitterMaterialInfoDefinition,
    SSplatEmitterInitInfo: SSplatEmitterInitInfoDefinition,
    SActorOverrideBlendTime: SActorOverrideBlendTimeDefinition,
    SActorOverrideTransitionBlendTime: SActorOverrideTransitionBlendTimeDefinition,
    SActorOverrideModel: SActorOverrideModelDefinition,
    SActorProgressStage: SActorProgressStageDefinition,
    SActorHostedDelta: SActorHostedDeltaDefinition,
    SSerpentAggregate: SSerpentAggregateDefinition,
    SSerpentSegment: SSerpentSegmentDefinition,
    SActorStateInfo: SActorStateInfoDefinition,
    SActorBaseline: SActorBaselineDefinition,
    SActorDeathDataCustomGroup: SActorDeathDataCustomGroupDefinition,
    SActorUnitImpactSoundExtras: SActorUnitImpactSoundExtrasDefinition,
    SDamagePastRemainingHealth: SDamagePastRemainingHealthDefinition,
    SDamageOverInterval: SDamageOverIntervalDefinition,
    STerrainSquib: STerrainSquibDefinition,
    STerrainSquibVisual: STerrainSquibVisualDefinition,
    SUnitAbilSound: SUnitAbilSoundDefinition,
    SErrorOverride: SErrorOverrideDefinition,
    SLayerIcon: SLayerIconDefinition,
    SLayerIconVariation: SLayerIconVariationDefinition,
    SLayerIconShield: SLayerIconShieldDefinition,
    SLayerIconShieldVariation: SLayerIconShieldVariationDefinition,
    SVitalColor: SVitalColorDefinition,
    SIconVariation: SIconVariationDefinition,
    SStatusColor: SStatusColorDefinition,
    SStatusChargeData: SStatusChargeDataDefinition,
    SStatusHarvesterData: SStatusHarvesterDataDefinition,
    STextTagParameters: STextTagParametersDefinition,
    SUnitKillRank: SUnitKillRankDefinition,
    SBankPath: SBankPathDefinition,
    SArtifactRank: SArtifactRankDefinition,
    SProductReleaseDate: SProductReleaseDateDefinition,
    SAttachKey: SAttachKeyDefinition,
    SModification: SModificationDefinition,
    SDeathResponse: SDeathResponseDefinition,
    SAttributeChange: SAttributeChangeDefinition,
    SDamageKind: SDamageKindDefinition,
    SScoreValueUpdate: SScoreValueUpdateDefinition,
    SUnitResourceRatio: SUnitResourceRatioDefinition,
    SUnitWeaponData: SUnitWeaponDataDefinition,
    SVeterancyLevel: SVeterancyLevelDefinition,
    SBehaviorFraction: SBehaviorFractionDefinition,
    SEffectWhichTimeScale: SEffectWhichTimeScaleDefinition,
    SBehaviorDuration: SBehaviorDurationDefinition,
    SDamageResponse: SDamageResponseDefinition,
    SVitalRegenVitalRemain: SVitalRegenVitalRemainDefinition,
    SPowerStage: SPowerStageDefinition,
    SAbilReplace: SAbilReplaceDefinition,
    SAbilAdd: SAbilAddDefinition,
    SSpawnInfo: SSpawnInfoDefinition,
    STooltipBlock: STooltipBlockDefinition,
    STooltipTimeAbilCmd: STooltipTimeAbilCmdDefinition,
    SButtonCardLayout: SButtonCardLayoutDefinition,
    SCameraZoom: SCameraZoomDefinition,
    SCameraParam: SCameraParamDefinition,
    SCameraSmooth: SCameraSmoothDefinition,
    SCampaignData: SCampaignDataDefinition,
    SMovieConfig: SMovieConfigDefinition,
    SCharacterVariation: SCharacterVariationDefinition,
    SUIColorEntry: SUIColorEntryDefinition,
    SCommanderUnit: SCommanderUnitDefinition,
    SCommanderTalentTree: SCommanderTalentTreeDefinition,
    SCommanderMasteryTalent: SCommanderMasteryTalentDefinition,
    SCommanderAbil: SCommanderAbilDefinition,
    SCommanderDifficultyLevel: SCommanderDifficultyLevelDefinition,
    SConsoleSkinModel: SConsoleSkinModelDefinition,
    SConversationProductionLevel: SConversationProductionLevelDefinition,
    SConversationConditionSet: SConversationConditionSetDefinition,
    SConversationCondition: SConversationConditionDefinition,
    SConversationUserValue: SConversationUserValueDefinition,
    SConversationActionSet: SConversationActionSetDefinition,
    SConversationAction: SConversationActionDefinition,
    SConversationFacialAnim: SConversationFacialAnimDefinition,
    SConversationLine: SConversationLineDefinition,
    SConversationRunActions: SConversationRunActionsDefinition,
    SConversationWait: SConversationWaitDefinition,
    SConversationJump: SConversationJumpDefinition,
    SConversationChoice: SConversationChoiceDefinition,
    SConversationGroup: SConversationGroupDefinition,
    SConversationComment: SConversationCommentDefinition,
    SConversationStateIndex: SConversationStateIndexDefinition,
    SConversationStateInfoText: SConversationStateInfoTextDefinition,
    SConversationStateInfoValue: SConversationStateInfoValueDefinition,
    SConversationStateInfoModel: SConversationStateInfoModelDefinition,
    SConversationStateInfoUpgrade: SConversationStateInfoUpgradeDefinition,
    SConversationStateInfoAbilCmd: SConversationStateInfoAbilCmdDefinition,
    SConversationStateVariation: SConversationStateVariationDefinition,
    SConversationStateInfoIds: SConversationStateInfoIdsDefinition,
    SDataCollectionRecord: SDataCollectionRecordDefinition,
    SUpgradeInfoWeapon: SUpgradeInfoWeaponDefinition,
    SDataFieldsPattern: SDataFieldsPatternDefinition,
    SDataTokensPattern: SDataTokensPatternDefinition,
    STextureSheetEntry: STextureSheetEntryDefinition,
    SEffectDamageArea: SEffectDamageAreaDefinition,
    SEffectSearchRevealerParams: SEffectSearchRevealerParamsDefinition,
    SEffectEnumArea: SEffectEnumAreaDefinition,
    SEffectMover: SEffectMoverDefinition,
    SEffectMissileBounce: SEffectMissileBounceDefinition,
    SUpgradeEffect: SUpgradeEffectDefinition,
    SEffectUpgrade: SEffectUpgradeDefinition,
    SEffectModifyPlayerCost: SEffectModifyPlayerCostDefinition,
    SEffectModifyUnitCost: SEffectModifyUnitCostDefinition,
    SEffectModifyWeapon: SEffectModifyWeaponDefinition,
    SEffectModifyVital: SEffectModifyVitalDefinition,
    SEffectModifyTurret: SEffectModifyTurretDefinition,
    SEffectSwitchCase: SEffectSwitchCaseDefinition,
    SEmoticonPackCampaign: SEmoticonPackCampaignDefinition,
    SFootprintLayer: SFootprintLayerDefinition,
    SFootprintShape: SFootprintShapeDefinition,
    SFootprintBitSet: SFootprintBitSetDefinition,
    SDifficultyLevel: SDifficultyLevelDefinition,
    SAIBuild: SAIBuildDefinition,
    SHandicap: SHandicapDefinition,
    SMapSize: SMapSizeDefinition,
    SAspectMargin: SAspectMarginDefinition,
    STeamColor: STeamColorDefinition,
    SAIDescription: SAIDescriptionDefinition,
    STriggerLib: STriggerLibDefinition,
    STargetFilterResult: STargetFilterResultDefinition,
    SBeaconInfo: SBeaconInfoDefinition,
    SDamageTypeInfo: SDamageTypeInfoDefinition,
    SAttackTypeInfo: SAttackTypeInfoDefinition,
    SResourceConvert: SResourceConvertDefinition,
    SMeleePointThreshold: SMeleePointThresholdDefinition,
    SChallengeCategory: SChallengeCategoryDefinition,
    SChallenge: SChallengeDefinition,
    SSoundQuality: SSoundQualityDefinition,
    SMinimapData: SMinimapDataDefinition,
    SSelectionData: SSelectionDataDefinition,
    SVolumeFade: SVolumeFadeDefinition,
    SReverbRolloff: SReverbRolloffDefinition,
    SVolumeThreshold: SVolumeThresholdDefinition,
    SVolumeRolloff: SVolumeRolloffDefinition,
    SSoundData: SSoundDataDefinition,
    SMixRoute: SMixRouteDefinition,
    SGlobalSoundData: SGlobalSoundDataDefinition,
    SPointModel: SPointModelDefinition,
    SCameraShakeAmplitude: SCameraShakeAmplitudeDefinition,
    SCameraShakeFrequency: SCameraShakeFrequencyDefinition,
    SCameraShakeRotation: SCameraShakeRotationDefinition,
    SListenerRolloff: SListenerRolloffDefinition,
    SUnitSpeedText: SUnitSpeedTextDefinition,
    SWeaponSpeedText: SWeaponSpeedTextDefinition,
    SObjectGroupData: SObjectGroupDataDefinition,
    SLoadingScreenHelp: SLoadingScreenHelpDefinition,
    SLoadingBar: SLoadingBarDefinition,
    SGameCategory: SGameCategoryDefinition,
    SGameModeInfo: SGameModeInfoDefinition,
    SDefaultGameVariant: SDefaultGameVariantDefinition,
    STutorialConfig: STutorialConfigDefinition,
    SHotkeyInfo: SHotkeyInfoDefinition,
    SResourceUI: SResourceUIDefinition,
    SHelpControlCategoryInfo: SHelpControlCategoryInfoDefinition,
    SHelpControlInfo: SHelpControlInfoDefinition,
    SHelpGameMechanicInfo: SHelpGameMechanicInfoDefinition,
    SAltSoundtrack: SAltSoundtrackDefinition,
    SCutsceneAssetPath: SCutsceneAssetPathDefinition,
    SHerdLevel: SHerdLevelDefinition,
    SHerdNode: SHerdNodeDefinition,
    SHeroAbilCategory: SHeroAbilCategoryDefinition,
    SHeroAbil: SHeroAbilDefinition,
    SHeroHeroicAbility: SHeroHeroicAbilityDefinition,
    SHeroSpecificVO: SHeroSpecificVODefinition,
    SHeroTalentTree: SHeroTalentTreeDefinition,
    SHeroTalentTier: SHeroTalentTierDefinition,
    SHeroSpecificIntroVO: SHeroSpecificIntroVODefinition,
    SHeroLevelScaling: SHeroLevelScalingDefinition,
    SHeroLevelModification: SHeroLevelModificationDefinition,
    SHeroRatings: SHeroRatingsDefinition,
    SHeroAITalentBuild: SHeroAITalentBuildDefinition,
    SHeroSpecificUI: SHeroSpecificUIDefinition,
    SHeroStatModifier: SHeroStatModifierDefinition,
    SItemContainerSlot: SItemContainerSlotDefinition,
    SFlareInfo: SFlareInfoDefinition,
    STimeEvent: STimeEventDefinition,
    SLightInfo: SLightInfoDefinition,
    SDirectionalLight: SDirectionalLightDefinition,
    SVariationConfig: SVariationConfigDefinition,
    SLightRegionInfo: SLightRegionInfoDefinition,
    SMissionCategory: SMissionCategoryDefinition,
    SLootChoice: SLootChoiceDefinition,
    SAnimFile: SAnimFileDefinition,
    SAnimAlias: SAnimAliasDefinition,
    SAttachProps: SAttachPropsDefinition,
    SModelDataEvent: SModelDataEventDefinition,
    SPhysicsMaterialMapping: SPhysicsMaterialMappingDefinition,
    STextureDeclare: STextureDeclareDefinition,
    STextureNameAdaption: STextureNameAdaptionDefinition,
    STextureInfo: STextureInfoDefinition,
    STextureExpressionSpec: STextureExpressionSpecDefinition,
    STextureMatchSpec: STextureMatchSpecDefinition,
    SModelVariation: SModelVariationDefinition,
    SPathingData: SPathingDataDefinition,
    SMotionPhase: SMotionPhaseDefinition,
    SMotionOverlayPhase: SMotionOverlayPhaseDefinition,
    SMotionOverlay: SMotionOverlayDefinition,
    SStartingUnit: SStartingUnitDefinition,
    SUpkeepTax: SUpkeepTaxDefinition,
    SRequirementNode: SRequirementNodeDefinition,
    SRequirementCount: SRequirementCountDefinition,
    SRewardCategory: SRewardCategoryDefinition,
    SRewardSpecificUI: SRewardSpecificUIDefinition,
    SGameReplacement: SGameReplacementDefinition,
    SSkinModelGroup: SSkinModelGroupDefinition,
    SSkinModelMacroRun: SSkinModelMacroRunDefinition,
    SSkinPackEntry: SSkinPackEntryDefinition,
    SSoundAsset: SSoundAssetDefinition,
    SSyncPointRange: SSyncPointRangeDefinition,
    SSoundAssetTemplate: SSoundAssetTemplateDefinition,
    SSoundLocaleFlags: SSoundLocaleFlagsDefinition,
    SPitchShift: SPitchShiftDefinition,
    SReverbBalance: SReverbBalanceDefinition,
    SSoundtrackCue: SSoundtrackCueDefinition,
    SSoundtrackMasterLayer: SSoundtrackMasterLayerDefinition,
    SSoundtrackSlaveLayer: SSoundtrackSlaveLayerDefinition,
    SSoundtrackSection: SSoundtrackSectionDefinition,
    STacAbilData: STacAbilDataDefinition,
    STalentRank: STalentRankDefinition,
    STalentAbilityModification: STalentAbilityModificationDefinition,
    STalentModification: STalentModificationDefinition,
    STargetFindEnumArea: STargetFindEnumAreaDefinition,
    SDSPArray: SDSPArrayDefinition,
    SCreepSettings: SCreepSettingsDefinition,
    SFoliageSimulationConfig: SFoliageSimulationConfigDefinition,
    STerrainDoodad: STerrainDoodadDefinition,
    SFidget: SFidgetDefinition,
    SUnitArmorFormula: SUnitArmorFormulaDefinition,
    SStockCharge: SStockChargeDefinition,
    SUnitAbilData: SUnitAbilDataDefinition,
    SUnitBehaviorData: SUnitBehaviorDataDefinition,
    SCardLayout: SCardLayoutDefinition,
    SCardLayoutButton: SCardLayoutButtonDefinition,
    SAddedOnData: SAddedOnDataDefinition,
    SUnitEquipment: SUnitEquipmentDefinition,
    SUnitReviveInfo: SUnitReviveInfoDefinition,
    SAttributePointsInfo: SAttributePointsInfoDefinition,
    SUpgradeEffectTemplate: SUpgradeEffectTemplateDefinition,
    SValidatorCondition: SValidatorConditionDefinition,
    SValidatorFunction: SValidatorFunctionDefinition,
    SValidatorEnumArea: SValidatorEnumAreaDefinition,
    SVoiceOverSkin: SVoiceOverSkinDefinition,
    SVoiceOverGroup: SVoiceOverGroupDefinition,
    SVoiceOverLine: SVoiceOverLineDefinition,
    SVoicePackExampleLine: SVoicePackExampleLineDefinition,
    SUserField: SUserFieldDefinition,
    SUserInstance: SUserInstanceDefinition,
    SUserInstanceField: SUserInstanceFieldDefinition,
    SUserInstanceAbilCmd: SUserInstanceAbilCmdDefinition,
    SUserInstanceActor: SUserInstanceActorDefinition,
    SUserInstanceColor: SUserInstanceColorDefinition,
    SUserInstanceCompare: SUserInstanceCompareDefinition,
    SUserInstanceFixed: SUserInstanceFixedDefinition,
    SUserInstanceGameLink: SUserInstanceGameLinkDefinition,
    SUserInstanceImage: SUserInstanceImageDefinition,
    SUserInstanceInt: SUserInstanceIntDefinition,
    SUserInstanceModel: SUserInstanceModelDefinition,
    SUserInstanceMovie: SUserInstanceMovieDefinition,
    SUserInstanceSound: SUserInstanceSoundDefinition,
    SUserInstanceString: SUserInstanceStringDefinition,
    SUserInstanceText: SUserInstanceTextDefinition,
    SUserInstanceUnit: SUserInstanceUnitDefinition,
    SUserInstanceUpgrade: SUserInstanceUpgradeDefinition,
    SUserInstanceUser: SUserInstanceUserDefinition,
    SWaterStateDesc: SWaterStateDescDefinition,
    SWaterDoodad: SWaterDoodadDefinition,
    SUserInstanceField: SUserInstanceFieldDefinition,
    SUserInstanceAbilCmd: SUserInstanceAbilCmdDefinition,
    SUserInstanceActor: SUserInstanceActorDefinition,
    SUserInstanceColor: SUserInstanceColorDefinition,
    SUserInstanceCompare: SUserInstanceCompareDefinition,
    SUserInstanceFixed: SUserInstanceFixedDefinition,
    SUserInstanceGameLink: SUserInstanceGameLinkDefinition,
    SUserInstanceImage: SUserInstanceImageDefinition,
    SUserInstanceInt: SUserInstanceIntDefinition,
    SUserInstanceModel: SUserInstanceModelDefinition,
    SUserInstanceMovie: SUserInstanceMovieDefinition,
    SUserInstanceSound: SUserInstanceSoundDefinition,
    SUserInstanceString: SUserInstanceStringDefinition,
    SUserInstanceText: SUserInstanceTextDefinition,
    SUserInstanceUnit: SUserInstanceUnitDefinition,
    SUserInstanceUpgrade: SUserInstanceUpgradeDefinition,
    SUserInstanceUser: SUserInstanceUserDefinition,
    SUserField: SUserFieldDefinition,
    SUserInstance: SUserInstanceDefinition,
    SWaterStateDesc: SWaterStateDescDefinition,
    SWaterDoodad: SWaterDoodadDefinition,
}


























// -------------------------------
// Classes
// -------------------------------

const CData = {
    id: C.Parent,
    parent: C.Parent,
    default: C.Bit,
    "@class": E.ClassId,
    "%token": [S.Token],
    "#comment": C.Parent,
}
    
const CAbil = {
    ...CData,
    Name: L.String,
    TechPlayer: E.AbilTechPlayer,
    Alignment: E.AbilAlignment,
    OrderArray: [S.AbilOrderDisplay],
    AbilSetId: C.AbilSetId,
    EditorCategories: T.EditorCategories,
    InfoTooltipPriority: C.UInt32,
    TargetMessage: L.String,
    TechAliasArray: [T.TechAlias],
    SharedFlags: F.AbilShared,
    DebugTrace: C.Bit,
    AbilityCategories: F.Unknown,
    TacticalAIFunc: T.GalaxyFunction,
    StateBehavior: L.Behavior,
    DefaultButtonCardId: C.FourCC,
    DataCollection: L.DataCollection,
}
const CAbilProgress = {
    ...CAbil,
    Activity: L.String,
    Cancelable: C.Bit,
    VitalStartFactor: [C.Real,E.UnitVital],
}

const CAbilEffect = {
    ...CAbil,
    Levels: C.UInt32,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    Activity: L.String,
    PrepEffect: [L.Effect],
    Effect: [L.Effect],
    PreEffectBehavior: S.EffectBehavior,
    PostEffectBehavior: S.EffectBehavior,
    Flags: F.AbilEffect,
    Cost: [S.Cost],
    ExtraVitalCost: [S.AccumulatedFixed,E.UnitVital],
    CancelCost: [S.Cost],
    RefundArray: F.AbilEffectStage,
    RefundFraction: SCostFactor,
    InterruptArray: F.AbilEffectStage,
    InterruptCost: S.Cost,
    Placeholder: L.Unit,
    TargetFilters: [C.TargetFilters],
    TargetSorts: S.TargetSorts,
    Range: [C.Real],
    RangeSlop: C.Real,
    Arc: C.FangleArc,
    ArcSlop: C.FangleArc,
    TrackingArc: C.FangleArc,
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
    AutoCastAcquireLevel: E.AcquireLevel,
    AutoCastFilters: C.TargetFilters,
    AutoCastRange: C.Real,
    AutoCastValidatorArray: [L.Validator],
    CastMovementLimit: C.Real,
    Precast: [C.GameTime],
    PrepTime: [C.GameTime],
    CastIntroTime: [C.GameTime],
    CastOutroTime: [C.GameTime],
    FinishTime: [C.GameTime],
    Marker: S.Marker,
    UseMarkerArray: F.AbilEffectStage,
    ShowProgressArray: F.AbilEffectStage,
    CancelableArray: F.AbilEffectStage,
    PauseableArray: F.AbilEffectStage,
    PreemptableArray: F.AbilEffectStage,
    UninterruptibleArray: F.AbilEffectStage,
    ValidatedArray: F.AbilEffectStage,
    InheritAttackPriorityArray: F.AbilEffectStage,
    ErrorAlert: L.Alert,
    AlertArray: [L.Alert],
    CursorEffect: [L.Effect],
    CastOutroTimeEffect: [L.Effect],
    CalldownEffect: L.Effect,
    AINotifyEffect: L.Effect,
    ProducedUnitArray: [L.Unit],
    ProgressButtonArray: [L.Button],
    DefaultError: C.CmdResult,
    LevelButtonImage: [A.Image],
    LevelButtonName: [L.String],
    LevelButtonTooltip: [L.String],
    LevelButtonTooltipImage: [A.Image],
    EffectRange: [C.fRange],
    LearnButtonImage: [A.Image],
    LearnButtonName: [L.String],
    LearnButtonTooltip: [L.String],
    LearnButtonTooltipImage: [A.Image],
    IgnoreFilters: C.TargetFilters,
    AcquirePriority: C.UInt32,
    CursorRangeMode: E.CursorRangeMode,
    SetLastTarget: E.AbilLastTarget,
    TargetCursorInfo: S.AbilTargetCursorInfo,
    CancelEffect: [L.Effect],
    CancelDelay: [C.GameTime],
}

const CAbilQueueable = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
}

const CAbilRedirect = {
    ...CAbil,
    Abil: L.Abil,
    Index: T.AbilCmdIndex,
    Flags: F.Unknown,
}

const CAbilArmMagazine = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    Launch: E.AbilArmMagazineLaunch,
    Flags: F.Unknown,
    Leash: C.Real,
    InfoArray: [S.AbilArmMagazineInfo],
    Alert: L.Alert,
    EffectArray: [L.Effect],
    ReturnLifeFraction: C.Real,
    CalldownEffect: L.Effect,
    ExternalAngle: [C.Fangle],
    MaxCount: C.UInt32,
}

const CAbilAttack = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    AcquireFilters: C.TargetFilters,
    SmartFilters: C.TargetFilters,
    SmartPriority: C.UInt32,
    SupportedFilters: C.TargetFilters,
    MinAttackSpeedMultiplier: C.Real,
    MaxAttackSpeedMultiplier: C.Real,
    AcquirePriority: C.UInt32,
    Flags: F.Unknown,
    TargetCursorInfo: S.AbilTargetCursorInfo,
}

const CAbilAugment = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    AbilCmd: L.AbilCommand,
    TargetType: E.EffectLocationType,
    Cost: S.Cost,
    Effect: L.Effect,
    AutoCastFilters: C.TargetFilters,
    AutoCastValidatorArray: [L.Validator],
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
}

const CAbilAttackModifier = {
    ...CAbil,
    Levels: C.UInt32,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    TargetType: E.EffectLocationType,
    Cost: [S.Cost],
    AutoCastFilters: C.TargetFilters,
    AutoCastValidatorArray: [L.Validator],
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
    AttackModifierBehavior: L.Behavior,
}

const CAbilBattery = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    TargetFilters: C.TargetFilters,
    Range: C.Real,
    EnumFilters: C.TargetFilters,
    EnumRange: C.Real,
    Effect: L.Effect,
    SmartPriority: C.UInt32,
    AutoCastFilters: C.TargetFilters,
    AutoCastRange: C.Real,
    AutoCastValidatorArray: [L.Validator],
}

const CAbilBeacon = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    SmartPriority: C.UInt32,
}

const CAbilBehavior = {
    ...CAbil,
    Levels: C.UInt32,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    Cost: [S.Cost],
    OffCost: [S.Cost],
    ExpireCost: [S.Cost],
    BehaviorArray: [L.Behavior],
    CycleMode: E.AbilBehaviorCycleMode,
    ValidatorArray: [L.Validator],
    AutoCastValidatorArray: [L.Validator],
    AutoCastToggleOnValidatorArray: [L.Validator],
    AutoCastToggleOffValidatorArray: [L.Validator],
    LevelButtonOnImage: [A.Image],
    LevelButtonOnName: [L.String],
    LevelButtonOnTooltip: [L.String],
    LevelButtonOnTooltipImage: [A.Image],
    LevelButtonOffImage: [A.Image],
    LevelButtonOffName: [L.String],
    LevelButtonOffTooltip: [L.String],
    LevelButtonOffTooltipImage: [A.Image],
    LearnButtonImage: [A.Image],
    LearnButtonName: [L.String],
    LearnButtonTooltip: [L.String],
    LearnButtonTooltipImage: [A.Image],
}

const CAbilBuild = {
    ...CAbil,
    HaltCmdButton: S.AbilCmdButton,
    BuildMorphAbil: L.Abil,
    UnlinkMorphAbil: L.Abil,
    FlagArray: F.AbilBuild,
    Alert: L.Alert,
    ErrorAlert: L.Alert,
    InfoArray: [S.AbilBuildInfo],
    Type: E.AbilBuildType,
    Range: C.Real,
    RefundFraction: SCostFactor,
    FidgetDelayMin: C.GameTime,
    FidgetDelayMax: C.GameTime,
    ConstructionMover: L.Mover,
    EffectArray: [L.Effect],
    SmartPriority: C.UInt32,
}

const CAbilBuildable = {
    ...CAbil,
    Activity: L.String,
    Cancelable: C.Bit,
    VitalStartFactor: [C.Real,E.UnitVital],
    CmdButtonArray: [S.AbilCmdButton],
    MaxBuilders: C.UInt32,
    PowerBuildBonusRate: C.Real,
    PowerBuildCostFactor: C.Real,
}

const CAbilEffectInstant = {
    ...CAbil,
    Levels: C.UInt32,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    Activity: L.String,
    PrepEffect: [L.Effect],
    Effect: [L.Effect],
    PreEffectBehavior: S.EffectBehavior,
    PostEffectBehavior: S.EffectBehavior,
    Flags: F.AbilEffect,
    Cost: [S.Cost],
    ExtraVitalCost: [S.AccumulatedFixed,E.UnitVital],
    CancelCost: [S.Cost],
    RefundArray: F.AbilEffectStage,
    RefundFraction: SCostFactor,
    InterruptArray: F.AbilEffectStage,
    InterruptCost: S.Cost,
    Placeholder: L.Unit,
    TargetFilters: [C.TargetFilters],
    TargetSorts: S.TargetSorts,
    Range: [C.Real],
    RangeSlop: C.Real,
    Arc: C.FangleArc,
    ArcSlop: C.FangleArc,
    TrackingArc: C.FangleArc,
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
    AutoCastAcquireLevel: E.AcquireLevel,
    AutoCastFilters: C.TargetFilters,
    AutoCastRange: C.Real,
    AutoCastValidatorArray: [L.Validator],
    CastMovementLimit: C.Real,
    Precast: [C.GameTime],
    PrepTime: [C.GameTime],
    CastIntroTime: [C.GameTime],
    CastOutroTime: [C.GameTime],
    FinishTime: [C.GameTime],
    Marker: S.Marker,
    UseMarkerArray: F.AbilEffectStage,
    ShowProgressArray: F.AbilEffectStage,
    CancelableArray: F.AbilEffectStage,
    PauseableArray: F.AbilEffectStage,
    PreemptableArray: F.AbilEffectStage,
    UninterruptibleArray: F.AbilEffectStage,
    ValidatedArray: F.AbilEffectStage,
    InheritAttackPriorityArray: F.AbilEffectStage,
    ErrorAlert: L.Alert,
    AlertArray: [L.Alert],
    CursorEffect: [L.Effect],
    CastOutroTimeEffect: [L.Effect],
    CalldownEffect: L.Effect,
    AINotifyEffect: L.Effect,
    ProducedUnitArray: [L.Unit],
    ProgressButtonArray: [L.Button],
    DefaultError: C.CmdResult,
    LevelButtonImage: [A.Image],
    LevelButtonName: [L.String],
    LevelButtonTooltip: [L.String],
    LevelButtonTooltipImage: [A.Image],
    EffectRange: [C.fRange],
    LearnButtonImage: [A.Image],
    LearnButtonName: [L.String],
    LearnButtonTooltip: [L.String],
    LearnButtonTooltipImage: [A.Image],
    IgnoreFilters: C.TargetFilters,
    AcquirePriority: C.UInt32,
    CursorRangeMode: E.CursorRangeMode,
    SetLastTarget: E.AbilLastTarget,
    TargetCursorInfo: S.AbilTargetCursorInfo,
    CancelEffect: [L.Effect],
    CancelDelay: [C.GameTime],
    CmdButtonArray: [S.AbilCmdButton],
}

const CAbilEffectTarget = {
    ...CAbil,
    Levels: C.UInt32,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    Activity: L.String,
    PrepEffect: [L.Effect],
    Effect: [L.Effect],
    PreEffectBehavior: S.EffectBehavior,
    PostEffectBehavior: S.EffectBehavior,
    Flags: F.AbilEffect,
    Cost: [S.Cost],
    ExtraVitalCost: [S.AccumulatedFixed,E.UnitVital],
    CancelCost: [S.Cost],
    RefundArray: F.AbilEffectStage,
    RefundFraction: SCostFactor,
    InterruptArray: F.AbilEffectStage,
    InterruptCost: S.Cost,
    Placeholder: L.Unit,
    TargetFilters: [C.TargetFilters],
    TargetSorts: S.TargetSorts,
    Range: [C.Real],
    RangeSlop: C.Real,
    Arc: C.FangleArc,
    ArcSlop: C.FangleArc,
    TrackingArc: C.FangleArc,
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
    AutoCastAcquireLevel: E.AcquireLevel,
    AutoCastFilters: C.TargetFilters,
    AutoCastRange: C.Real,
    AutoCastValidatorArray: [L.Validator],
    CastMovementLimit: C.Real,
    Precast: [C.GameTime],
    PrepTime: [C.GameTime],
    CastIntroTime: [C.GameTime],
    CastOutroTime: [C.GameTime],
    FinishTime: [C.GameTime],
    Marker: S.Marker,
    UseMarkerArray: F.AbilEffectStage,
    ShowProgressArray: F.AbilEffectStage,
    CancelableArray: F.AbilEffectStage,
    PauseableArray: F.AbilEffectStage,
    PreemptableArray: F.AbilEffectStage,
    UninterruptibleArray: F.AbilEffectStage,
    ValidatedArray: F.AbilEffectStage,
    InheritAttackPriorityArray: F.AbilEffectStage,
    ErrorAlert: L.Alert,
    AlertArray: [L.Alert],
    CursorEffect: [L.Effect],
    CastOutroTimeEffect: [L.Effect],
    CalldownEffect: L.Effect,
    AINotifyEffect: L.Effect,
    ProducedUnitArray: [L.Unit],
    ProgressButtonArray: [L.Button],
    DefaultError: C.CmdResult,
    LevelButtonImage: [A.Image],
    LevelButtonName: [L.String],
    LevelButtonTooltip: [L.String],
    LevelButtonTooltipImage: [A.Image],
    EffectRange: [C.fRange],
    LearnButtonImage: [A.Image],
    LearnButtonName: [L.String],
    LearnButtonTooltip: [L.String],
    LearnButtonTooltipImage: [A.Image],
    IgnoreFilters: C.TargetFilters,
    AcquirePriority: C.UInt32,
    CursorRangeMode: E.CursorRangeMode,
    SetLastTarget: E.AbilLastTarget,
    TargetCursorInfo: S.AbilTargetCursorInfo,
    CancelEffect: [L.Effect],
    CancelDelay: [C.GameTime],
    CmdButtonArray: [S.AbilCmdButton],
    PlaceUnit: L.Unit,
    AcquireAttackers: C.Bit,
    FollowRange: C.Real,
    FinishCommand: L.AbilCommand,
}

const CAbilHarvest = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    FlagArray: F.AbilHarvest,
    Range: C.Real,
    AcquireRadius: C.Real,
    Effect: L.Effect,
    EffectDelay: C.GameTime,
    ReservedMarker: S.Marker,
    ResourceAcquire: F.ResourceType,
    ResourceAllowed: F.ResourceType,
    ResourceDestroy: F.ResourceType,
    ResourceAmountBonus: [C.UInt32,E.ResourceType],
    ResourceAmountMultiplier: [C.Real,E.ResourceType],
    ResourceAmountRequest: [C.UInt32,E.ResourceType],
    ResourceAmountCapacity: [C.UInt32,E.ResourceType],
    ResourceTimeBonus: [C.GameTime,E.ResourceType],
    ResourceTimeMultiplier: [C.Real,E.ResourceType],
    CancelableArray: F.AbilHarvestStage,
    UninterruptibleArray: F.AbilHarvestStage,
    SmartPriority: C.UInt32,
    ResourceQueueIndex: C.UInt32,
}

const CAbilInteract = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    Range: C.Real,
    TargetFilters: C.TargetFilters,
    ValidatorArray: [L.Validator],
    SmartPriority: C.UInt32,
    SmartValidatorArray: [L.Validator],
    AutoCastFilters: C.TargetFilters,
    AutoCastRange: C.Real,
    AutoCastValidatorArray: [L.Validator],
}

const CAbilInventory = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    TargetFilters: C.TargetFilters,
    ValidatorArray: [L.Validator],
    Range: C.Real,
    MaxDropRange: C.Real,
    InfoArray: [S.AbilInventoryInfo],
    SmartPriority: C.UInt32,
    Requirements: L.Requirement,
}

const CAbilLearn = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    InfoArray: [S.AbilLearnInfo],
    Flags: F.Unknown,
    Points: C.UInt32,
    PointsPerLevel: C.UInt32,
    VeterancyBehavior: L.Behavior,
}

const CAbilMerge = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    Alert: L.Alert,
    Effect: L.Effect,
    Info: S.AbilMergeInfo,
    Range: C.Real,
}

const CAbilMergeable = {
    ...CAbil,
    Activity: L.String,
    Cancelable: C.Bit,
    VitalStartFactor: [C.Real,E.UnitVital],
    CmdButtonArray: [S.AbilCmdButton],
}

const CAbilMorph = {
    ...CAbil,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    CmdButtonArray: [S.AbilCmdButton],
    ActorKey: C.DataSoupKey,
    Flags: F.Unknown,
    RefundFraction: SCostFactor,
    Cost: S.Cost,
    CostUnmorph: S.Cost,
    CancelUnit: L.Unit,
    InfoArray: [S.AbilMorphInfo],
    InfoArrayUnmorph: [S.AbilMorphInfo],
    StartGlobalAlert: L.Alert,
    FinishGlobalAlert: L.Alert,
    Alert: L.Alert,
    ErrorAlert: L.Alert,
    Range: C.Real,
    AutoCastAcquireLevel: E.AcquireLevel,
    AutoCastFilters: C.TargetFilters,
    AutoCastValidatorArray: [L.Validator],
    AutoCastRange: C.Real,
    AutoCastCountMin: C.UInt32,
    AutoCastCountMax: C.UInt32,
    TargetSorts: S.TargetSorts,
    CantFindTargetError: C.CmdResult,
    CantFindTargetErrorUnmorph: C.CmdResult,
    Activity: L.String,
    ValidatorArray: [L.Validator],
    ValidatorArrayUnmorph: [L.Validator],
    AbilClassEnableArray: F.ClassIdCAbil,
    AbilClassDisableArray: F.ClassIdCAbil,
    AbilLinkEnableArray: [L.Abil],
    AbilLinkDisableArray: [L.Abil],
    ProgressButton: L.Button,
    AcquirePriority: C.UInt32,
    BehaviorOn: L.Behavior,
    BehaviorOff: L.Behavior,
}

const CAbilMorphPlacement = {
    ...CAbil,
    VeterancyLevelMin: C.UInt32,
    VeterancyLevelSkip: C.UInt32,
    CmdButtonArray: [S.AbilCmdButton],
    ActorKey: C.DataSoupKey,
    Flags: F.Unknown,
    RefundFraction: SCostFactor,
    Cost: S.Cost,
    CostUnmorph: S.Cost,
    CancelUnit: L.Unit,
    InfoArray: [S.AbilMorphInfo],
    InfoArrayUnmorph: [S.AbilMorphInfo],
    StartGlobalAlert: L.Alert,
    FinishGlobalAlert: L.Alert,
    Alert: L.Alert,
    ErrorAlert: L.Alert,
    Range: C.Real,
    AutoCastAcquireLevel: E.AcquireLevel,
    AutoCastFilters: C.TargetFilters,
    AutoCastValidatorArray: [L.Validator],
    AutoCastRange: C.Real,
    AutoCastCountMin: C.UInt32,
    AutoCastCountMax: C.UInt32,
    TargetSorts: S.TargetSorts,
    CantFindTargetError: C.CmdResult,
    CantFindTargetErrorUnmorph: C.CmdResult,
    Activity: L.String,
    ValidatorArray: [L.Validator],
    ValidatorArrayUnmorph: [L.Validator],
    AbilClassEnableArray: F.ClassIdCAbil,
    AbilClassDisableArray: F.ClassIdCAbil,
    AbilLinkEnableArray: [L.Abil],
    AbilLinkDisableArray: [L.Abil],
    ProgressButton: L.Button,
    AcquirePriority: C.UInt32,
    BehaviorOn: L.Behavior,
    BehaviorOff: L.Behavior,
}

const CAbilMove = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    FleeRange: C.Real,
    FleeTime: C.GameTime,
    FollowRangeSlop: C.Real,
    FollowAcquireRange: C.Real,
    MinPatrolDistance: C.Real,
    FollowFilters: C.TargetFilters,
    MoveFilters: C.TargetFilters,
    Flags: F.Unknown,
    MoveSmartPriority: C.UInt32,
    BoardBunkerSmartPriority: C.UInt32,
    BoardTransportSmartPriority: C.UInt32,
    PowerupSmartPriority: C.UInt32,
    RechargeSmartPriority: C.UInt32,
    IgnoreRange: C.Real,
}

const CAbilPawn = {
    ...CAbil,
    InfoArray: [S.AbilPawnInfo],
    Flags: F.Unknown,
    Range: C.Real,
}

const CAbilQueue = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    QueueCount: C.UInt32,
    QueueSize: C.UInt32,
    Flags: F.Unknown,
    AddOnParentAbilClassDisableArray: F.ClassIdCAbil,
}

const CAbilRally = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    InfoArray: [S.AbilRallyInfo],
    Flags: F.Unknown,
    SmartPriority: C.UInt32,
}

const CAbilRedirectInstant = {
    ...CAbil,
    Abil: L.Abil,
    Index: T.AbilCmdIndex,
    Flags: F.Unknown,
    CmdButtonArray: [S.AbilCmdButton],
}

const CAbilRedirectTarget = {
    ...CAbil,
    Abil: L.Abil,
    Index: T.AbilCmdIndex,
    Flags: F.Unknown,
    CmdButtonArray: [S.AbilCmdButton],
}

const CAbilResearch = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    InfoArray: [S.AbilResearchInfo],
    Flags: F.Unknown,
}

const CAbilRevive = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    CmdButtonArray: [S.AbilReviveCmdButton],
    Flags: F.Unknown,
    BaseInfo: S.AbilReviveInfo,
    LevelInfo: S.AbilReviveInfo,
    MaxInfo: SAbilReviveInfoMax,
    BaseUnitCostFactor: SCostFactor,
    LevelUnitCostFactor: SCostFactor,
    LevelUnitBuildTimeFactor: C.Real,
    ActorKey: C.DataSoupKey,
    Effect: L.Effect,
    Offset: [C.GamePoint],
    Range: C.Real,
    VitalArray: [E.AbilReviveVital,E.UnitVital],
    Alert: L.Alert,
    NameOverride: L.String,
    ReplaceFilters: C.TargetFilters,
    ReplaceDeathType: E.DeathType,
    SelfReviveCmd: E.AbilReviveCmd,
    ValidatorArray: [L.Validator],
    TargetType: E.EffectLocationType,
    VeterancyBehavior: L.Behavior,
}

const CAbilSpecialize = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    InfoArray: [S.AbilSpecializeInfo],
    MaxCount: C.UInt32,
    Alert: L.Alert,
    Flags: F.Unknown,
}

const CAbilStop = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    RequestPickupBunkerSmartPriority: C.UInt32,
    RequestPickupTransportSmartPriority: C.UInt32,
}

const CAbilTrain = {
    ...CAbil,
    RefundFraction: SCostFactor,
    ErrorAlert: L.Alert,
    Activity: L.String,
    ActorKey: C.DataSoupKey,
    Flags: F.Unknown,
    MorphUnit: L.Unit,
    Offset: [C.GamePoint],
    Range: C.Real,
    InfoArray: [S.AbilTrainInfo],
    IgnoreUnitCostRequirements: L.Requirement,
    Alert: L.Alert,
    ProxyOffset: [C.GamePoint],
    ProxyUnit: L.Unit,
    DeathTypeOnFinish: E.DeathType,
    DeathTypeOnCancel: E.DeathType,
    AgentUnitValidator: L.Validator,
}

const CAbilTransport = {
    ...CAbil,
    CmdButtonArray: [S.AbilCmdButton],
    Flags: F.Unknown,
    Range: C.Real,
    MaxUnloadRange: C.Real,
    MaxCargoCount: C.UInt32,
    MaxCargoSize: T.CargoSize,
    TotalCargoSpace: T.CargoCapacity,
    LoadCargoBehavior: L.Behavior,
    LoadCargoEffect: L.Effect,
    LoadTransportEffect: L.Effect,
    LoadTransportBehavior: L.Behavior,
    UnloadCargoBehavior: L.Behavior,
    UnloadCargoEffect: L.Effect,
    UnloadTransportEffect: L.Effect,
    UnloadTransportBehavior: L.Behavior,
    InitialLoadDelay: C.GameTime,
    InitialUnloadDelay: C.GameTime,
    LoadPeriod: C.GameTime,
    UnloadPeriod: C.GameTime,
    TargetFilters: C.TargetFilters,
    SearchRadius: C.Real,
    LoadValidatorArray: [L.Validator],
    UnloadValidatorArray: [L.Validator],
    TargetSorts: S.TargetSorts,
    CalldownEffect: L.Effect,
    DeathUnloadEffect: L.Effect,
    ErrorAlert: L.Alert,
    LoadSmartPriority: C.UInt32,
    CargoFilter: C.Identifier,
}

const CAbilWarpable = {
    ...CAbil,
    Activity: L.String,
    Cancelable: C.Bit,
    VitalStartFactor: [C.Real,E.UnitVital],
    CmdButtonArray: [S.AbilCmdButton],
    PowerUserBehavior: L.Behavior,
}

const CAbilWarpTrain = {
    ...CAbil,
    InfoArray: [S.AbilWarpTrainInfo],
    Alert: L.Alert,
    RefundFraction: SCostFactor,
    Flags: F.Unknown,
}




const CAccumulator = {
    ...CData,
    SourceEffect: L.Effect,
    MinAccumulation: C.Real,
    MaxAccumulation: C.Real,
    ApplicationRule: E.AccumulatorApplicationRule,
}

const CAccumulatorConstant = {
    ...CAccumulator,
    Amount: C.Real,
}

const CAccumulatorVitals = {
    ...CAccumulator,
    Ratio: C.Real,
    Missing: C.Bit,
    VitalType: E.UnitVital,
    UnitSource: S.EffectWhichUnit,
    ModificationType: E.VitalsAccumulatorModificationType,
    ClampToMaxVitalForFractionalDamage: C.Bit,
}

const CAccumulatorDistance = {
    ...CAccumulator,
    StartLocation: S.EffectWhichLocation,
    EndLocation: S.EffectWhichLocation,
    Scale: C.Real,
}

const CAccumulatorBehavior = {
    ...CAccumulator,
    Behavior: L.Behavior,
    UnitSource: S.EffectWhichUnit,
    Type: E.AccumulatorBehaviorType,
}

const CAccumulatorAttributePoints = {
    ...CAccumulator,
    Attribute: L.Behavior,
    Flags: F.Unknown,
    UnitSource: S.EffectWhichUnit,
    Scale: C.Real,
}

const CAccumulatorTrackedUnitCount = {
    ...CAccumulator,
    Scale: C.Real,
    TrackerUnit: S.EffectWhichUnit,
    TrackingBehavior: L.Behavior,
    TrackedUnitValidatorArray: [L.Validator],
    TrackedUnitFilters: C.TargetFilters,
}

const CAccumulatorLevel = {
    ...CAccumulator,
    Amount: [C.Real],
    LevelFactor: C.Real,
    PreviousValueFactor: C.Real,
    BonusPerLevel: C.Real,
}

const CAccumulatorAbilLevel = {
    ...CAccumulator,
    Amount: [C.Real],
    LevelFactor: C.Real,
    PreviousValueFactor: C.Real,
    BonusPerLevel: C.Real,
}

const CAccumulatorUnitLevel = {
    ...CAccumulator,
    Amount: [C.Real],
    LevelFactor: C.Real,
    PreviousValueFactor: C.Real,
    BonusPerLevel: C.Real,
    UnitSource: S.EffectWhichUnit,
}

const CAccumulatorVeterancyLevel = {
    ...CAccumulator,
    Amount: [C.Real],
    LevelFactor: C.Real,
    PreviousValueFactor: C.Real,
    BonusPerLevel: C.Real,
    UnitSource: S.EffectWhichUnit,
}

const CAccumulatorCargo = {
    ...CAccumulator,
    UnitSource: S.EffectWhichUnit,
    Type: E.CargoSpace,
}

const CAccumulatorEffectAmount = {
    ...CAccumulator,
    AmountType: E.EffectAmount,
    Total: C.Bit,
}

const CAccumulatorUserData = {
    ...CAccumulator,
    Key: C.Identifier,
    FallbackValue: C.Real,
    BehaviorScope: S.EffectWhichBehavior,
}

const CAccumulatorUnitCustomValue = {
    ...CAccumulator,
    Index: C.Int32,
    FallbackValue: C.Real,
    UnitSource: S.EffectWhichUnit,
}

const CAccumulatorSwitch = {
    ...CAccumulator,
    CaseArray: [S.AccumulatorSwitchCase],
    CaseDefault: L.Accumulator,
}

const CAccumulatorArithmetic = {
    ...CAccumulator,
    Parameters: [S.AccumulatedFixed],
    Operation: E.AccumulatorOperation,
}

const CAccumulatorPlayerScoreValue = {
    ...CAccumulator,
    Player: S.EffectWhichPlayer,
    Value: L.ScoreValue,
}


const CAchievement = {
    ...CData,
    Category: L.String,
    Name: L.String,
    Description: L.String,
    Icon: L.Reward,
    Points: C.UInt32,
    RewardTable: [L.Reward],
    Flags: F.Unknown,
    Race: L.Race,
    Filters: F.Unknown,
    MinTermCount: C.UInt32,
    TermTable: [L.AchievementTerm],
    SharesTerms: L.Achievement,
    Supersedes: L.Achievement,
    Tags: [S.AchievementTag],
}

const CAchievementTerm = {
    ...CData,
    Name: L.String,
    Description: L.String,
    Evaluate: E.AchievementTermEvaluate,
    Flags: F.Unknown,
    Compare: E.ValueCompare,
    Previous: E.AchievementTermPrevious,
    Quantity: C.UInt,
    Repeat: C.UInt,
}

const CAchievementTermAbil = {
    ...CAchievementTerm,
    AbilCmd: L.AbilCommand,
    ValidatorArray: [L.Validator],
}

const CAchievementTermAbilInteract = {
    ...CAchievementTerm,
    AbilCmd: L.AbilCommand,
    ValidatorArray: [L.Validator],
}

const CAchievementTermAbilLoad = {
    ...CAchievementTerm,
    AbilCmd: L.AbilCommand,
    ValidatorArray: [L.Validator],
}

const CAchievementTermAbilUse = {
    ...CAchievementTerm,
    AbilCmd: L.AbilCommand,
    ValidatorArray: [L.Validator],
}

const CAchievementTermAchievement = {
    ...CAchievementTerm,
    Child: L.Achievement,
}

const CAchievementTermBehavior = {
    ...CAchievementTerm,
    Behavior: L.Behavior,
}

const CAchievementTermBehaviorAbsorbed = {
    ...CAchievementTerm,
    Behavior: L.Behavior,
}

const CAchievementTermBehaviorCount = {
    ...CAchievementTerm,
    Behavior: L.Behavior,
}

const CAchievementTermBehaviorElapsed = {
    ...CAchievementTerm,
    Behavior: L.Behavior,
    ElapsedTime: C.GameTime,
    ElapsedCompare: E.ValueCompare,
}

const CAchievementTermBehaviorState = {
    ...CAchievementTerm,
    Behavior: L.Behavior,
    State: C.Bit,
    ValidatorArray: [L.Validator],
}

const CAchievementTermCombine = {
    ...CAchievementTerm,
    Type: E.AchievementTermCombine,
    ChildTable: [L.AchievementTerm],
}

const CAchievementTermEffect = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectAbsorbed = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectDamaged = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectDodged = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectHealed = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectKilled = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermEffectUse = {
    ...CAchievementTerm,
    Effect: L.Effect,
    WhichPlayer: S.EffectWhichPlayer,
    ValidatorArray: [L.Validator],
}

const CAchievementTermGeneric = {
    ...CAchievementTerm,
}

const CAchievementTermReplay = {
    ...CAchievementTerm,
}

const CAchievementTermScoreValue = {
    ...CAchievementTerm,
    ScoreValue: L.ScoreValue,
}

const CAchievementTermTime = {
    ...CAchievementTerm,
}

const CAchievementTermUnit = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
}

const CAchievementTermUnitBirth = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
}

const CAchievementTermUnitDeath = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
}

const CAchievementTermUnitKills = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
}

const CAchievementTermUnitRegen = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
    Vital: E.UnitVital,
}

const CAchievementTermUnitSupplyLoss = {
    ...CAchievementTerm,
    Unit: L.Unit,
    ValidatorArray: [L.Validator],
    Period: C.GameTime,
}

const CActor = {
    ...CData,
    CopySource: C.ActorKey,
    Terms: C.ActorTerms,
    Aliases: [C.ActorKey],
    Macros: [C.ActorKey],
    Sharing: E.ActorRequestCreateSharing,
    Flags: F.Unknown,
    Filter: F.Unknown,
    FilterAtCreation: F.Unknown,
    VisibleTo: F.Unknown,
    VisibleToAtCreation: F.Unknown,
    FilterPlayers: F.Unknown,
    VisibleToPlayers: F.Unknown,
    InheritType: E.ActorHostedPropInheritType,
    Inherits: F.Unknown,
    AcceptedTransfers: F.ActorTransfer,
    AcceptedHostedPropTransfers: F.ActorHostedPropTransfer,
    FogVisibility: E.FogVisibility,
    EditorCategories: T.EditorCategories,
    PlayerIdSource: E.ActorPlayerIdSource,
    Supporter: S.ActorRequest,
    Preload: [L.Preload],
    VisibilityShape: S.ActorVisibilityShape,
}

const CActorBase = {
    ...CActor,
    Remove: [S.ActorEvent],
    On: [S.ActorEvent],
}

const CActorBearings = {
    ...CActorBase,
    AddToProximitySystem: C.Bit,
    HostForProps: S.ActorRequest,
    Host: S.ActorRequest,
    HostSiteOps: S.ActorSiteOpsData,
    ScopeBearingsTracking: E.ActorScopeBearingsTrackingType,
    MaxScale: C.Real32,
}

const CActorCamera = {
    ...CActorBearings,
    Camera: L.Camera,
    HostEye: S.ActorRequest,
    HostEyeSiteOps: S.ActorSiteOpsData,
}

const CActorModel = {
    ...CActorBearings,
    Model: L.Model,
    ModelAspectSets: [S.ActorModelAspectSet],
    Scale: C.ScaleVector,
    AutoScaleFactor: C.Real32,
    AutoScaleFromSelectionFactor: C.Real32,
    AnimBlendTime: C.Real32,
    HostedAttaches: [S.ActorHostedAttach],
    InternalSplatHeight: E.ActorSplatHeight,
    HostFor2ndVisibilityTest: S.ActorRequest,
    HostSiteOpsFor2ndVisibilityTest: S.ActorSiteOpsData,
    LocalOffsetFor2ndVisibilityTest: C.Vector3,
    ModelFlags: F.Unknown,
    EventDataFootprint: [S.EventDataFootprint],
    EventDataFootprintActor: C.ActorCreateKey,
    EventDataSound: [S.EventDataSound],
    EventDataSoundActor: C.ActorCreateKey,
    ProximityPosition: E.ActorProximity,
    CreepHeightClass: C.ActorLabelKey,
    CreepRateGrow: C.ActorLabelKey,
    CreepRateShrink: C.ActorLabelKey,
    PhysicsImpactDefault: S.ActorPhysicsImpactData,
    PhysicsImpacts: [S.ActorPhysicsImpactData],
    ModelMaterialGlazeDisplayLimit: C.UInt32,
    LookAtPriorityList: [C.ActorKey],
}

const CActorModelMaterial = {
    ...CActorModel,
    MaterialType: E.ActorModelMaterialType,
    ModelMaterialFlags: F.Unknown,
}

const CActorQuad = {
    ...CActorBearings,
    LaunchActor: C.ActorCreateKey,
    LaunchHeight: C.Real32,
    CenterActor: C.ActorCreateKey,
    CenterHeight: C.Real32,
    ImpactActor: C.ActorCreateKey,
    ImpactHeight: C.Real32,
    Quad: C.Quad,
    Height: C.Real32,
    Width: C.Real32,
    HeightRange: C.Range,
    QuadFlags: F.Unknown,
    Decoration: S.ActorQuadDecoration,
    OriginHeightLookaheadDistance: C.Real32,
    OriginHeightLookaheadIncrement: C.Real32,
    HostImpact: S.ActorRequest,
    HostImpactSiteOps: S.ActorSiteOpsData,
}

const CActorForce = {
    ...CActorModel,
    Receiver: S.ActorRequest,
    Field: E.ActorForceField,
    Duration: C.VariatorActorReal32,
    Magnitude: C.VariatorActorReal32,
    ForceFlags: F.Unknown,
}

const CActorForceLineSegment = {
    ...CActorForce,
    HostEnd: S.ActorRequest,
    HostEndSiteOps: S.ActorSiteOpsData,
}

const CActorBeam = {
    ...CActorModel,
    HostLaunch: S.ActorRequest,
    HostLaunchSiteOps: S.ActorSiteOpsData,
    HostImpact: S.ActorRequest,
    HostImpactSiteOps: S.ActorSiteOpsData,
}

const CActorRange = {
    ...CActorBearings,
    Abil: S.ActorRangeAbil,
    Behavior: L.Behavior,
    Sight: L.Unit,
    Weapon: L.Weapon,
    Range: C.Real32,
    Arc: C.Real32,
    Icon: A.Image,
    IconScale: C.Vector2,
    IconArcLength: C.Real32,
    IconTint: C.Color,
    RangeFlags: F.Unknown,
    CliffLevelFlags: F.CliffLevelCompare,
}


const CActorSound = {
    ...CActorBearings,
    Sound: L.Sound,
    SoundFlags: F.Unknown,
    Layers: [S.ActorSoundLayer],
    PlayMode: E.ActorSoundPlayMode,
    LoopCount: C.Int32,
}

const CActorSplat = {
    ...CActorBearings,
    Color: C.Color,
    FadeIn: C.Real32,
    FadeOut: C.Real32,
    HoldTime: C.Real32,
    Layer: E.SplatLayer,
    Model: L.Model,
    Scale: C.ScaleVector,
    AutoScaleFactor: C.Real32,
    AutoScaleFromSelectionFactor: C.Real32,
    Height: E.ActorSplatHeight,
}

const CActorAction = {
    ...CActorBase,
    LaunchGuideAlias: C.ActorKey,
    LaunchSiteOps: S.ActorSiteOpsData,
    LaunchSite: C.ActorCreateKey,
    LaunchSiteFallback: C.ActorCreateKey,
    LaunchAttachQuery: S.AttachQuery,
    LaunchRequest: S.ActorRequest,
    LaunchAssets: S.ActorAVPair,
    LaunchModel: C.ActorCreateKey,
    LaunchSound: C.ActorCreateKey,
    LaunchTerrainSquibModel: C.ActorCreateKey,
    LaunchTerrainSquibSound: C.ActorCreateKey,
    LaunchTerrainSquibMap: [S.ActorActionTerrainSquib],
    ContainerSiteOps: S.ActorSiteOpsData,
    ContainerSite: C.ActorCreateKey,
    ContainerAttachQuery: S.AttachQuery,
    ContainerAssets: S.ActorAVPair,
    ContainerModel: C.ActorCreateKey,
    ContainerSound: C.ActorCreateKey,
    ContainerTerrainSquibModel: C.ActorCreateKey,
    ContainerTerrainSquibSound: C.ActorCreateKey,
    ContainerTerrainSquibMap: [S.ActorActionTerrainSquib],
    Beam: C.ActorKey,
    BeamScope: E.ActorEffectScope,
    Missile: C.ActorKey,
    HostImpactSource: S.ActorRequest,
    ImpactGuideAlias: C.ActorKey,
    ImpactSiteOps: S.ActorSiteOpsData,
    ImpactSiteOpsReaction: S.ActorSiteOpsData,
    ImpactSite: C.ActorCreateKey,
    ImpactSiteFallback: C.ActorCreateKey,
    ImpactAttachQuery: S.AttachQuery,
    ImpactReattachQuery: S.AttachQuery,
    ImpactPointSiteOps: S.ActorSiteOpsData,
    ImpactPointSite: C.ActorCreateKey,
    ImpactMap: [S.ActorAVCluster],
    ImpactModel: C.ActorCreateKey,
    ImpactModelReaction: C.ActorCreateKey,
    ImpactSound: C.ActorCreateKey,
    ImpactPhysics: [S.ActorPhysicsData],
    ImpactTerrainSquibModel: C.ActorCreateKey,
    ImpactTerrainSquibSound: C.ActorCreateKey,
    ImpactTerrainSquibMap: [S.ActorActionTerrainSquib],
    DamageSiteOps: S.ActorSiteOpsData,
    DamageSiteOpsReaction: S.ActorSiteOpsData,
    DamageSite: C.ActorCreateKey,
    DamageAttachQuery: S.AttachQuery,
    DamageReattachQuery: S.AttachQuery,
    DamageMap: [S.ActorAVCluster],
    DamageModel: C.ActorCreateKey,
    DamageModelReaction: C.ActorCreateKey,
    DamageSound: C.ActorCreateKey,
    DamagePhysics: [S.ActorPhysicsData],
    DamageTerrainSquibModel: C.ActorCreateKey,
    DamageTerrainSquibSound: C.ActorCreateKey,
    DamageTerrainSquibMap: [S.ActorActionTerrainSquib],
    AcquisitionYawHalfArc: C.ActorAngle,
    AcquisitionPitchHalfArc: C.ActorAngle,
    AccuracyHalfArc: C.ActorAngle,
    WeaponFireTrackingTimeWindow: C.Real32,
    ShieldFlashType: E.ActorShieldFlashType,
    ShieldRippleScaleFactor: C.Real32,
    ActionFlags: F.Unknown,
    AttackAnimSource: C.RefKey,
    AttackAnimName: C.AnimNameKey,
    ForceCommencementFrom: L.Effect,
    CombatRevealDurationType: E.ActorCombatRevealDurationType,
    Lifetime: C.Real32,
}

const CActorActionOverride = {
    ...CActorBase,
    MissileModel: L.Model,
    ImpactModel: L.Model,
    DamageModel: L.Model,
}

const CActorArc = {
    ...CActorModel,
    Angle: C.Real32,
    Radius: C.Real32,
    AngleAnimProps: C.AnimProps,
}

const CActorBeamSimple = {
    ...CActorModel,
    HostLaunch: S.ActorRequest,
    HostLaunchSiteOps: S.ActorSiteOpsData,
    HostImpact: S.ActorRequest,
    HostImpactSiteOps: S.ActorSiteOpsData,
}

const CActorBeamStandard = {
    ...CActorBeamSimple,
    Beam: L.Beam,
}

const CActorBlob = {
    ...CActorBase,
    InitScale: C.Vector2,
    MaxScale: C.Vector2,
    ScaleDeltaTime: C.Vector2,
}

const CActorCameraModel = {
    ...CActorModel,
    Camera: C.RefKey,
    DoFAttenuationStartModel: L.Model,
    DoFAttenuationEndModel: L.Model,
}

const CActorCreep = {
    ...CActorBase,
    FoliageSpawnTarget: C.ActorCreateKey,
    SubjectResponses: [SActorQuerySubjectResponse],
}

const CActorCutscene = {
    ...CActorBearings,
    FilePath: A.Cutscene,
}

const CActorDoodad = {
    ...CActorModel,
    DoodadFlags: F.ActorDoodad,
    EditorFlags: F.Editor,
    EditorModel: L.Model,
    EditorAnim: C.AnimProps,
    EditorIcon: A.Image,
    TexSets: [L.Terrain],
    Facing: C.Facing,
    EditorFacingAlignment: C.Fangle,
    Footprint: L.Footprint,
    Radius: C.Real32,
    RandomScaleRange: C.Range,
    OccludeHeight: C.Real,
    BoostedCliffLevel: T.CliffLevel,
    BoostedHeight: [C.Real],
    MinimapIcon: A.Image,
    MinimapRenderPriority: C.ActorKey,
    MinimapSize: C.Vector2,
    MinimapShape: E.MinimapShape,
    MinimapColor: C.Color,
    MinimapImage: A.Image,
    VisibleOpacity: C.Real32,
    ShadowWhenTransparent: C.Bit,
    VisibleOpacityBlendDuration: C.Real32,
    IgnoreDurationOnLow: C.Bit,
    NoFlyZoneSoftRadius: C.Real,
    NoFlyZoneHardRadius: C.Real,
}

const CActorDoodadPreserver = {
    ...CActorModel,
}

const CActorFoliageFXSpawner = {
    ...CActorBearings,
    Radius: C.Real32,
    SpawnTarget: C.ActorCreateKey,
}

const CActorEditorCamera = {
    ...CActorModel,
}

const CActorEditorPoint = {
    ...CActorModel,
}

const CActorEventMacro = {
    ...CActorBase,
}

const CActorEventMacroRunnable = {
    ...CActorBase,
    Do: [S.ActorEvent],
}

const CActorForceBox = {
    ...CActorForce,
    Height: C.VariatorActorReal32,
    Length: C.VariatorActorReal32,
    Width: C.VariatorActorReal32,
    Origin: E.ActorForceOrigin,
}

const CActorForceConeRoundedEnd = {
    ...CActorForce,
    HostEnd: S.ActorRequest,
    HostEndSiteOps: S.ActorSiteOpsData,
    Angle: C.VariatorActorAngle,
    Length: C.VariatorActorReal32,
}

const CActorForceCylinder = {
    ...CActorForce,
    HostEnd: S.ActorRequest,
    HostEndSiteOps: S.ActorSiteOpsData,
    Radius: C.VariatorActorReal32,
    Length: C.VariatorActorReal32,
}

const CActorForceSphere = {
    ...CActorForce,
    Radius: C.VariatorActorReal32,
    IsHemisphere: C.Bit,
    Direction: E.ActorForceDirection,
}

const CActorGlobalConfig = {
    ...CActorBase,
    ActorUnitFallback: C.ActorCreateKey,
    AttachHarnessActor: C.ActorCreateKey,
    AttachHarnessSOpAttach: L.Actor,
    AttachHarnessSOpLocalOffset: L.Actor,
    AttachHarnessSOpRotationExplicit: L.Actor,
    BodySquibs: [S.ActorDeathBodySquib],
    CloakModel: L.Model,
    CloakModelLow: L.Model,
    CloakTransitionArray: [S.ActorCloakTransition],
    CommandUIActor: C.ActorCreateKey,
    CreepEngulfmentModel: L.Model,
    CreepHeightClasses: [S.ActorCreepHeightClass],
    CreepRates: [S.ActorCreepRate],
    DeathCustomPriorityList: [C.ActorKey],
    DeathCustoms: [SActorDeathDataCustom],
    MainActor: C.ActorKey,
    MaxSpeedForSound: C.Real,
    MinimapRenderPriorityList: [C.ActorKey],
    MissileBoundsOptSpeedThreshold: C.Real32,
    ModelCacheFallback: L.Model,
    ModelMaterialPriorityList: [C.ActorKey],
    PopulationLimitModel: C.UInt32,
    RevealTint: C.ColorHDR,
    SceneActor: C.ActorKey,
    LookAtTypes: [S.LookAtType],
    SplatEmitterInit: S.SplatEmitterInitInfo,
}

const CActorOverrides = {
    ...CActorBase,
    ModelOverrides: [S.ActorOverrideModel],
}

const CActorLight = {
    ...CActorModel,
}

const CActorLightOmni = {
    ...CActorModel,
}

const CActorLightSpot = {
    ...CActorModel,
}

const CActorLightModel = {
    ...CActorModel,
    Light: C.RefKey,
}

const CActorLightOmniModel = {
    ...CActorModel,
    Light: C.RefKey,
}

const CActorLightSpotModel = {
    ...CActorModel,
    Light: C.RefKey,
}

const CActorLookAt = {
    ...CActorBase,
    HostTarget: S.ActorRequest,
    HostTargetSiteOps: S.ActorSiteOpsData,
    Type: C.ActorKey,
    Types: [S.LookAtType],
}

const CActorList = {
    ...CActorBase,
    IsAutoDestroy: C.Bit,
}

const CActorListPerPlayer = {
    ...CActorList
}

const CActorPortrait = {
    ...CActorModel,
    FaceFXTarget: C.RefKey,
    AnimTargets: C.RefKey,
}

const CActorPower = {
    ...CActorBase,
    PowerSource: L.Behavior,
    VisualArray: [C.ActorCreateKey],
}

const CActorProgress = {
    ...CActorBase,
    StageArray: [S.ActorProgressStage],
}

const CActorPropertyCurveSet = {
    ...CActorBase,
}

const CActorQueryResponse = {
    ...CActorBase,
    Subject: S.ActorQuerySubject,
    OnResponse: [S.ActorQueryResponse],
}

const CActorRegion = {
    ...CActorBearings,
    QueryAbilCmd: L.AbilCommand,
    QueryEffect: L.Effect,
    QueryFilters: C.TargetFilters,
    QueryRange: C.Real32,
    NotifyRadiusKey: C.RefKey,
    NotifyArcKey: C.RefKey,
    NotifyClosestScaleKey: C.RefKey,
    RegionFlags: F.Unknown,
}

const CActorRegionArc = {
    ...CActorRegion,
    Angle: C.Real32,
    Radius: C.Real32,
}

const CActorRegionCircle = {
    ...CActorRegion,
    Radius: C.Real32,
}

const CActorRegionCombine = {
    ...CActorRegion,
    ChildArray: [C.ActorCreateKey],
}

const CActorRegionGame = {
    ...CActorRegion,
}

const CActorRegionPolygon = {
    ...CActorRegion,
    PointArray: [C.Vector2],
}

const CActorRegionQuad = {
    ...CActorRegion,
    Quad: C.Quad,
    Height: C.Real32,
    Width: C.Real32,
}

const CActorRegionWater = {
    ...CActorRegion,
}

const CActorScene = {
    ...CActorBase,
}

const CActorSelection = {
    ...CActorBearings,
    Color: C.Color,
    FadeIn: C.Real32,
    FadeOut: C.Real32,
    HoldTime: C.Real32,
    Layer: E.SplatLayer,
    Model: L.Model,
    Scale: C.ScaleVector,
    AutoScaleFactor: C.Real32,
    AutoScaleFromSelectionFactor: C.Real32,
    Height: E.ActorSplatHeight,
    Alpha: C.Vector3,
    FallOff: C.Real32,
    InnerBoundaryFallOffRatio: C.Real32,
    InnerBoundaryRatio: C.Real32,
    InnerOffsetRatio: C.Real32,
    InnerWidth: C.Real32,
    OuterWidth: C.Real32,
    HalfHeight: C.Real32,
    Attenuation: C.Real32,
    HostRadiusPercent: C.Real32,
    RotationSpeed: C.Real32,
    SegmentCount: C.UInt32,
    SegmentPercentSolid: C.Real32,
    SelectionFlags: F.Unknown,
    SelectionFilter: F.Unknown,
}

const CActorSetQueried = {
    ...CActorBase,
    Host: S.ActorRequest,
    AttachQuery: S.AttachQuery,
    SpawnTarget: C.ActorCreateKey,
    RequiredSquibType: E.SquibType,
}

const CActorShadow = {
    ...CActorBearings,
    Color: C.Color,
    FadeIn: C.Real32,
    FadeOut: C.Real32,
    HoldTime: C.Real32,
    Layer: E.SplatLayer,
    Model: L.Model,
    Scale: C.ScaleVector,
    AutoScaleFactor: C.Real32,
    AutoScaleFromSelectionFactor: C.Real32,
    Height: E.ActorSplatHeight,
    Alpha: C.Vector3,
    FallOff: C.Real32,
    HalfHeight: C.Real32,
    Attenuation: C.Real32,
    HostRadiusPercent: C.Real32,
}

const CActorShield = {
    ...CActorModel,
    Ripple: C.ActorCreateKey,
    ScaleDamageMin: C.Real32,
    ScaleDamageMax: C.Real32,
    RadiusMin: C.Real32,
    RadiusMax: C.Real32,
}

const CActorShieldImpact = {
    ...CActorBase,
    VisualDirectionalFacer: C.ActorCreateKey,
    VisualDirectionalHeader: C.ActorCreateKey,
    VisualDirectionless: C.ActorCreateKey,
    RadiusMedium: C.Real32,
    RadiusLarge: C.Real32,
    MaxCountSmall: C.UInt32,
    MaxCountMedium: C.UInt32,
    MaxCountLarge: C.UInt32,
}

const CActorSimple = {
    ...CActorBase,
}

const CActorSite = {
    ...CActorBearings,
    SiteFlags: F.Unknown,
}

const CActorSiteBillboard = {
    ...CActorSite,
    BillboardType: E.ActorSiteBillboardType,
    TowardsCameraDistance: C.Real32,
    HoldRotation: C.Bit,
    UpdateDriveBearings: C.Bit,
}

const CActorSiteMover = {
    ...CActorSite,
    Acceleration: C.Real32,
    Deceleration: C.Real32,
    Speed: C.Real32,
    SpeedMax: C.Real32,
}

const CActorSiteOrbiter = {
    ...CActorSite,
    Type: E.ActorSiteOrbiterType,
    BaseYaw: C.VariatorActorFangle,
    BaseYawPeriod: C.VariatorActorReal32,
    BasePitch: C.VariatorActorFangle,
    BasePitchPeriod: C.VariatorActorReal32,
    BaseRadiusInner: C.VariatorActorReal32,
    BaseRadiusOuter: C.VariatorActorReal32,
    BaseRadiusPeriod: C.VariatorActorReal32,
    EndYawPeriod: C.VariatorActorReal32,
    EndPitchPeriod: C.VariatorActorReal32,
    EndRollPeriod: C.VariatorActorReal32,
    EndRadiusInner: C.VariatorActorReal32,
    EndRadiusOuter: C.VariatorActorReal32,
    EndRadiusPeriod: C.VariatorActorReal32,
}

const CActorSiteRocker = {
    ...CActorSite,
    Elevation: C.VariatorActorReal32,
    ElevationPeriod: C.VariatorActorReal32,
    Pitch: C.VariatorActorFangle,
    PitchPeriod: C.VariatorActorReal32,
    Roll: C.VariatorActorFangle,
    RollPeriod: C.VariatorActorReal32,
}


const CActorSiteOp = {
    ...CActorBase,
    HoldPosition: C.Bit,
    HoldRotation: C.Bit,
}

const CActorSiteOpBase = {
    ...CActorSiteOp
}

const CActorSiteOp2DRotation = {
    ...CActorSiteOp,
}

const CActorSiteOpAction = {
    ...CActorSiteOp,
    Location: E.ActorSiteOpActionLocation,
}

const CActorSiteOpAttach = {
    ...CActorSiteOp,
    AttachQuery: S.AttachQuery,
    ReattachQuery: S.AttachQuery,
    ForceSoftAttach: C.Bit,
    Source: E.ActorSiteOpAttachSource,
}

const CActorSiteOpAttachVolume = {
    ...CActorSiteOp,
    HostIncoming: S.ActorRequest,
    HostIncomingSiteOps: S.ActorSiteOpsData,
    UpwardVisibilityEnhancement: C.Bit,
    UpwardVisibilityEnhancementVarianceUp: C.ActorAngle,
    UpwardVisibilityEnhancementVarianceDown: C.ActorAngle,
}

const CActorSiteOpBanker = {
    ...CActorSiteOp,
    RollAngleMax: C.ActorAngle,
    RollInRate: C.ActorAngle,
    RollOutRate: C.ActorAngle,
    RollOutRemainderFractionForLevelOff: C.Real32,
}

const CActorSiteOpBankerUnit = {
    ...CActorSiteOp,
    RollMax: C.VariatorActorAngle,
    RollInActivationAngle: C.ActorAngle,
    RollInArc: C.VariatorActorAngle,
    RollOutDuration: C.VariatorActorReal32,
}

const CActorSiteOpBasic = {
    ...CActorSiteOp,
    BasicType: E.ActorSiteOpBasicType,
    WorldPosition: C.Vector3,
}

const CActorSiteOpGameCameraFollow = {
    ...CActorSiteOp,
}

const CActorSiteOpDeathMotion = {
    ...CActorSiteOp,
    HostInitial: S.ActorRequest,
    HostInitialSiteOps: S.ActorSiteOpsData,
    Deceleration: C.Real32,
}

const CActorSiteOpDeltaSum = {
    ...CActorSiteOp,
    Deltas: [S.ActorHostedDelta],
    DeltaSumFlags: F.Unknown,
}

const CActorSiteOpEffect = {
    ...CActorSiteOp,
    Location: E.ActorEffectLocation,
    ZOnly: C.Bit,
}

const CActorSiteOpForward = {
    ...CActorSiteOp,
    Forward: C.Vector3,
    HostForward: S.ActorRequest,
    HostForwardSiteOps: S.ActorSiteOpsData,
    Invert: C.Bit,
}

const CActorSiteOpHeight = {
    ...CActorSiteOp,
    HeightSourceType: E.ActorHeightSourceType,
    HostHeight: S.ActorRequest,
}

const CActorSiteOpHigherOfTerrainAndWater = {
    ...CActorSiteOp,
    HeightSourceType: E.ActorHeightSourceType,
    ForcedWadingMaxDepth: C.Real32,
    TerrainAndWaterFlags: F.Unknown,
}

const CActorSiteOpHostBearings = {
    ...CActorSiteOp,
    HostBearings: S.ActorRequest,
    HostBearingsSiteOps: S.ActorSiteOpsData,
}

const CActorSiteOpHostedOffset = {
    ...CActorSiteOp,
    HostOffset: S.ActorRequest,
    HostOffsetSiteOps: S.ActorSiteOpsData,
}

const CActorSiteOpIncoming = {
    ...CActorSiteOp,
    HostImpact: S.ActorRequest,
    HostIncoming: S.ActorRequest,
    Type: E.ActorIncomingType,
    PullBack: C.Real32,
    FreezePositionAtImpact: C.Bit,
}

const CActorSiteOpLocalOffset = {
    ...CActorSiteOp,
    LocalOffset: C.Vector3,
    OverridingLength: C.VariatorActorReal32,
    OverridingLengthExtra: S.AccumulatedFixed,
}

const CActorSiteOpOrientAttachPointTo = {
    ...CActorSiteOp,
    AttachQuery: S.AttachQuery,
    Type: E.ActorSiteOpOrientAttachPointToType,
}

const CActorSiteOpPatch = {
    ...CActorSiteOp,
    PatchAngle: C.ActorAngle,
    PatchRadius: C.Real32,
    Distribution: E.ActorRadialDistribution,
    Mean: C.Real32,
    Variance: C.Real32,
}

const CActorSiteOpPersistentOffset = {
    ...CActorSiteOp,
    HostInitial: S.ActorRequest,
    HostInitialSiteOps: S.ActorSiteOpsData,
}

const CActorSiteOpOrbiter = {
    ...CActorSiteOp,
    Type: E.ActorSiteOrbiterType,
    BaseYaw: C.VariatorActorFangle,
    BaseYawPeriod: C.VariatorActorReal32,
    BasePitch: C.VariatorActorFangle,
    BasePitchPeriod: C.VariatorActorReal32,
    BaseRadiusInner: C.VariatorActorReal32,
    BaseRadiusOuter: C.VariatorActorReal32,
    BaseRadiusPeriod: C.VariatorActorReal32,
    EndYawPeriod: C.VariatorActorReal32,
    EndPitchPeriod: C.VariatorActorReal32,
    EndRollPeriod: C.VariatorActorReal32,
    EndRadiusInner: C.VariatorActorReal32,
    EndRadiusOuter: C.VariatorActorReal32,
    EndRadiusPeriod: C.VariatorActorReal32,
}

const CActorSiteOpPhysicsImpact = {
    ...CActorSiteOp,
    Type: E.ActorSiteOpPhysicsImpactType,
}

const CActorSiteOpRandomPointInCircle = {
    ...CActorSiteOp,
    Radius: C.Real32,
    Distribution: E.ActorRadialDistribution,
    Mean: C.Real32,
    Variance: C.Real32,
    RestrictToCircumference: C.Bit,
    ObserveRotation: C.Bit,
}

const CActorSiteOpRandomPointInCrossbar = {
    ...CActorSiteOp,
    HalfWidth: C.Real32,
    Distribution: E.ActorCrossbarDistribution,
    Variance: C.Real32,
}

const CActorSiteOpRandomPointInSphere = {
    ...CActorSiteOp,
    Radius: C.Real32,
    Distribution: E.ActorRadialDistribution,
    Mean: C.Real32,
    Variance: C.Real32,
    RestrictToSurface: C.Bit,
}

const CActorSiteOpRotationExplicit = {
    ...CActorSiteOp,
    Forward: C.Vector3,
    Up: C.Vector3,
    IsLocal: C.Bit,
}

const CActorSiteOpRotationRandom = {
    ...CActorSiteOp,
    YawHalfAngle: C.ActorAngle,
    PitchHalfAngle: C.ActorAngle,
}

const CActorSiteOpRotationVariancer = {
    ...CActorSiteOp,
    ForwardAngle: C.ActorAngle,
    UpAngle: C.ActorAngle,
    IsUpDominantWhenOrthogonalized: C.Bit,
}

const CActorSiteOpRotator = {
    ...CActorSiteOp,
    LocalAxis: C.Vector3,
    Rate: C.ActorAngle,
    Type: E.ActorSiteOpRotatorType,
    InitialAngle: C.ActorAngle,
}

const CActorSiteOpRotationSmooth = {
    ...CActorSiteOp,
    Acceleration: C.FangleRate,
    Deceleration: C.FangleRate,
    MaxSpeed: C.FangleRate,
}

const CActorSiteOpSelectionOffset = {
    ...CActorSiteOp,
}

const CActorSiteOpSerpentHead = {
    ...CActorSiteOp,
    Aggregate: S.SerpentAggregate,
    Segment: S.SerpentSegment,
}

const CActorSiteOpSerpentSegment = {
    ...CActorSiteOp,
    Head: C.RefKey,
    Segment: S.SerpentSegment,
}

const CActorSiteOpShadow = {
    ...CActorSiteOp,
    HeightSourceType: E.ActorHeightSourceType,
    HeightOffset: C.Real32,
    HeightOffsetOnCliff: C.Real32,
    CliffTests: [C.Vector2],
    HeightTests: [C.Vector2],
    HeightTestType: E.ActorHeightTestType,
    ShadowFlags: F.Unknown,
}

const CActorSiteOpTether = {
    ...CActorSiteOp,
    HostTether: S.ActorRequest,
    HostTetherSiteOps: S.ActorSiteOpsData,
    EnableX: E.ActorSiteOpTetherEnableType,
    EnableY: E.ActorSiteOpTetherEnableType,
    EnableZ: E.ActorSiteOpTetherEnableType,
    XMinimum: C.Real32,
    XMaximum: C.Real32,
    YMinimum: C.Real32,
    YMaximum: C.Real32,
    ZMinimum: C.Real32,
    ZMaximum: C.Real32,
}

const CActorSiteOpTipability = {
    ...CActorSiteOp,
    TipabilityFlags: F.Unknown,
}

const CActorSiteOpTilter = {
    ...CActorSiteOp,
    TiltType: E.ActorTiltType,
    TiltAmount: C.Real32,
    AngleRate: C.Real32,
}

const CActorSiteOpUp = {
    ...CActorSiteOp,
    Up: C.Vector3,
    HostUp: S.ActorRequest,
    HostUpSiteOps: S.ActorSiteOpsData,
    Invert: C.Bit,
}

const CActorSiteOpZ = {
    ...CActorSiteOp,
    HostZ: S.ActorRequest,
}

const CActorSiteOpCursor = {
    ...CActorSiteOp,
}

const CActorSiteOpYawLimiter = {
    ...CActorSiteOp,
    HostYawLimiter: S.ActorRequest,
    HostYawLimiterSiteOps: S.ActorSiteOpsData,
    YawHalfAngle: C.ActorAngle,
    ExtraYawAngle: C.ActorAngle,
}

const CActorSiteOpPitchLimiter = {
    ...CActorSiteOp,
    HostPitchLimiter: S.ActorRequest,
    HostPitchLimiterSiteOps: S.ActorSiteOpsData,
    PitchHalfAngle: C.ActorAngle,
}

const CActorSnapshot = {
    ...CActorModel,
}

const CActorStateMonitor = {
    ...CActorBase,
    StateArray: [S.ActorStateInfo],
    StateThinkInterval: C.GameTime,
}

const CActorSquib = {
    ...CActorBearings,
    Map: [S.ActorAVPair],
    HarnessModel: C.ActorCreateKey,
    HarnessSound: C.ActorCreateKey,
}

const CActorBatch = {
    ...CActorBearings,
    HarnessActor: C.ActorCreateKey,
    Count: S.AccumulatedUInt32,
}

const CActorTerrain = {
    ...CActorBase,
    PhysicsImpactDefault: S.ActorPhysicsImpactData,
    PhysicsImpacts: [S.ActorPhysicsImpactData],
}

const CActorTerrainDeformer = {
    ...CActorBearings,
    Footprint: L.Footprint,
    InfluenceRange: C.Real32,
    BlendTime: C.Real32,
    HeightDelta: C.Real32,
    TerrainDeformerFlags: F.Unknown,
    FoliageFXDeathSpawnTarget: C.ActorCreateKey,
}

const CActorText = {
    ...CActorBearings,
    TextScale: C.Real32,
    MaxSize: C.Vector2,
    FixedSize: C.UInt32,
    AlignH: E.ActorTextAlignment,
    AlignV: E.ActorTextAlignment,
    HeightOffset: C.Real32,
    Color: C.Color,
    Options: F.Unknown,
    Text: L.String,
}

const CActorTurret = {
    ...CActorBase,
    PitchQuery: S.AttachQuery,
    YawQuery: S.AttachQuery,
    TurretBody: S.ActorRequest,
}

const CActorUnit = {
    ...CActorModel,
    Baselines: [S.ActorBaseline],
    BuildModel: L.Model,
    DeathArray: [S.ActorDeathData],
    DeathCustoms: [SActorDeathDataCustom],
    DeathCustomData: [SActorDeathDataCustomGroup],
    DeathActorModel: C.ActorCreateKey,
    DeathActorModelLow: C.ActorCreateKey,
    DeathActorSound: C.ActorCreateKey,
    DeathActorVoice: C.ActorCreateKey,
    EditorModel: L.Model,
    EditorAnim: C.AnimProps,
    ImpactSoundActor: C.ActorCreateKey,
    ImpactSound: L.Sound,
    ImpactSoundExtras: [S.ActorUnitImpactSoundExtras],
    OverkillByDamagePastRemainingHealth: S.DamagePastRemainingHealth,
    OverkillByDamageOverInterval: S.DamageOverInterval,
    PhysicsMatchKeysOrdered: C.ActorTableKeys1x3,
    PlacementModel: L.Model,
    PlacementSound: L.Sound,
    PlacementActorModel: C.ActorCreateKey,
    PlaceholderActorModel: C.ActorCreateKey,
    PortraitActor: C.ActorCreateKey,
    PortraitModel: L.Model,
    PortraitCamera: L.Camera,
    RandomScaleRange: C.Range,
    RingRadius: C.Real32,
    StandAnimTurnTime: C.GameTime,
    StandAnimTurnTimeScaleMin: C.Real32,
    TerrainSquibs: [S.TerrainSquib],
    VarianceWindowStandIntro: C.Real32,
    VarianceWindowStand: C.Real32,
    VarianceWindowWalkIntro: C.Real32,
    VarianceWindowWalk: C.Real32,
    VarianceWindowWalkOutro: C.Real32,
    WalkAnimMoveSpeed: C.GameRate,
    WalkAnimTimeScalingAsFlyer: C.Bit,
    AbilSoundArray: [S.UnitAbilSound],
    AddonIndicator: L.String,
    BarDistance: C.UInt32,
    BarHeight: C.Int32,
    BarOffset: C.Int32,
    BarWidth: C.Int32,
    CantSelectUncontrollableTooltip: L.String,
    CooldownDisplay: [L.AbilCommand],
    CustomUnitStatusFrame: C.DescPath,
    CustomUnitStatusOffset: C.Vector2i,
    CustomUnitStatusAttachment: E.AttachmentID,
    CustomUnitStatusActor: C.RefKey,
    ErrorArray: [S.ErrorOverride],
    GlossaryAnim: C.String,
    GroupIcon: S.LayerIcon,
    GroupIconVariations: [SLayerIconVariation],
    GroupSoundArray: [L.Sound],
    GroupSoundThreshold: C.UInt32,
    HeroIcon: A.Image,
    HeroIconVariations: [S.IconVariation],
    HighlightTooltip: L.String,
    HighlightSubTooltip: L.String,
    InfoText: L.String,
    LifeArmorIcon: A.Image,
    MinimapIcon: A.Image,
    MinimapIconIsTeamColored: C.Bit,
    MinimapIconScale: C.Real32,
    MinimapIconBackground: A.Image,
    MinimapIconBackgroundIsTeamColored: C.Bit,
    MinimapIconBackgroundScale: C.Real32,
    MinimapIconBackgroundTintColor: C.Color,
    MinimapIconTintColor: C.Color,
    MinimapRenderPriority: C.ActorKey,
    MinimapTooltip: L.String,
    MinimapFlashWhenAttacked: C.Bit,
    MinimapUseSelfColor: C.Bit,
    MinimapUseSelectionColor: C.Bit,
    MinimapUnitStatusFrame: C.DescPath,
    MovementHerdNode: L.HerdNode,
    NameOffset: C.Int32,
    SelectAbilCmd: L.AbilCommand,
    ShieldArmorIcon: A.Image,
    SnapshotActor: C.ActorCreateKey,
    SoundArray: [L.Sound],
    StatusBarFlags: F.UnitStatus,
    StatusBarGroups: F.UnitStatusGroup,
    StatusBarOn: F.UnitStatus,
    StatusColors: [S.StatusColor],
    StatusChargeData: S.StatusChargeData,
    StatusHarvesterData: S.StatusHarvesterData,
    StatusTextInfo: S.TextTagParameters,
    UnitBorderNormalColor: C.ColorRGB,
    UnitBorderSubgroupColor: C.ColorRGB,
    UnitFlags: F.Unknown,
    UnitIcon: A.Image,
    UnitIconVariations: [S.IconVariation],
    UnitIconMultiple: A.Image,
    UnitKillRank: [S.UnitKillRank],
    UnitModelFrameActor: C.ActorCreateKey,
    VitalColors: [S.VitalColor,E.UnitVital],
    VitalNames: [L.String,E.UnitVital],
    Wireframe: S.LayerIcon,
    WireframeVariations: [SLayerIconVariation],
    WireframeShield: SLayerIconShield,
    WireframeShieldColor: C.Color,
    WireframeShieldVariations: [SLayerIconShieldVariation],
    VisibleOpacity: C.Real32,
    VisibleOpacityBlendDuration: C.Real32,
    UnitButton: L.Button,
    UnitButtonMultiple: L.Button,
}

const CActorUnitRing = {
    ...CActorModel,
    RingRadius: C.Real32,
}

const CActorMissile = {
    ...CActorUnit,
    HostReturn: S.ActorRequest,
    HostReturnSiteOps: S.ActorSiteOpsData,
    IsTentacle: C.Bit,
    PreHost: C.ActorKey,
}

const CActorMinimap = {
    ...CActorModel,
}


const CAlert = {
    ...CData,
    PrimaryActions: F.Unknown,
    SecondaryActions: F.Unknown,
    Display: F.Unknown,
    Flags: F.Unknown,
    Fade: C.Real32,
    Icon: A.Image,
    Life: C.Real32,
    OverlapDuration: C.Real32,
    OverlapGlobalCount: C.UInt32,
    OverlapLocalCount: C.UInt32,
    OverlapLocalRadius: C.Real,
    PingColor: C.Color,
    PingModel: L.Model,
    PingTime: C.Real32,
    QueueTime: C.Real32,
    Sound: L.Sound,
    Text: L.String,
    Tooltip: L.String,
    Voice: E.UnitSound,
    Peripheral: E.AlertPeripheral,
    SupersededVolume: C.Real32,
}


const CArmyCategory = {
    ...CData,
    Name: L.String,
    Title: L.String,
    Help: L.String,
    CategoryHelp: L.String,
    UnitHelp: L.String,
    Icon: A.Image,
    BankPath: S.BankPath,
    Description: L.String,
    State: E.ArmyCategoryState,
    Flags: F.Unknown,
    Unit: L.Unit,
    UpgradeArray: [L.Upgrade],
    AbilCommandArray: [L.AbilCommand],
    ArmyUnitArray: [L.ArmyUnit],
    ArmyUpgradeArray: [L.ArmyUpgrade],
    UserReference: C.UserReference,
    ExtraUpgradeRequirement: C.Int32,
    SplitRequirement: C.Int32,
}

const CArmyUnit = {
    ...CData,
    Name: L.String,
    Title: L.String,
    Help: L.String,
    Icon: A.Image,
    BankPath: S.BankPath,
    Description: L.String,
    Confirmation: L.String,
    Movie: A.Movie,
    Cost: C.Int32,
    State: E.ArmyUnitState,
    Unit: L.Unit,
    UpgradeArray: [L.Upgrade],
    AbilCommandArray: [L.AbilCommand],
    ArmyUpgradeArray: [L.ArmyUpgrade],
    UserReference: C.UserReference,
    EnableButton: C.String,
    Skin: L.Skin,
}

const CArmyUpgrade = {
    ...CData,
    Name: L.String,
    Icon: A.Image,
    Requirements: L.String,
    Description: L.String,
    Tooltip: L.String,
    Cost: C.Int32,
    Movie: A.Movie,
    State: E.ArmyUpgradeState,
    UpgradeArray: [L.Upgrade],
    AbilCommandArray: [L.AbilCommand],
    UserReference: C.UserReference,
}



const CArtifact = {
    ...CData,
    EditorCategories: T.EditorCategories,
    Name: L.String,
    InfoText: L.String,
    AttributeId: C.FourCC,
    Model: L.Model,
    RankArray: [S.ArtifactRank],
    Universe: E.HeroUniverse,
    TileCutsceneFile: A.Cutscene,
    PreviewCutsceneFile: A.Cutscene,
    HeroSelectCutsceneFile: A.Cutscene,
    ReleaseDate: S.ProductReleaseDate,
    AdditionalSearchText: L.String,
    Talent: L.Talent,
    Type: E.ArtifactType,
    HyperlinkId: T.HyperlinkId,
    AllowedCommanderKeyArray: [C.Identifier],
    Item: [L.Item],
    Upgrades: [L.Upgrade],
    PlayerResponses: [L.PlayerResponse],
    Face: L.Button,
    ApplyTo: F.PlayerRelationship
}

const CArtifactSlot = {
    ...CData,
    Name: L.String,
    RequiredReward: L.Reward,
    ProductId: T.BattleProductId,
    AllowedTypes: C.artifactTypeCountFlagArray,
}

const CAttachMethod = {
    ...CData,
}

const CAttachMethodArcTest = {
    ...CAttachMethod,
    Tests: F.Unknown,
    Type: E.AMArcTestType,
}

const CAttachMethodBestMatch = {
    ...CAttachMethod,
    Keys: C.AttachKeys,
    Flags: F.Unknown,
}

const CAttachMethodFilter = {
    ...CAttachMethod,
    Keys: [S.AttachKey],
    Logic: E.AMFilterLogic,
    AttachType: E.AMFilterAttachType,
    FilterType: E.AMFilterType,
}

const CAttachMethodAttachType = {
    ...CAttachMethod,
    AttachType: E.AMAttachType,
}

const CAttachMethodIncoming = {
    ...CAttachMethod,
}

const CAttachMethodLeastDeflection = {
    ...CAttachMethod,
}

const CAttachMethodNodeOccupancy = {
    ...CAttachMethod,
    Targets: [A.Model],
    Logic: E.AMOccupancyLogic,
}

const CAttachMethodNodeOccupancy2 = {
    ...CAttachMethod,
    Targets: [L.Model],
    Logic: E.AMOccupancyLogic,
}

const CAttachMethodNumericField = {
    ...CAttachMethod,
    Field: E.AMNumericField,
    Value: C.Real32,
    Operator: E.AMNumericFieldOp,
}

const CAttachMethodPattern = {
    ...CAttachMethod,
    Type: E.AMPatternType,
    Keyword: E.AttachKeyword,
    Base: C.DataSoupKey,
    Offset: C.UInt32,
    Multiplier: C.UInt32,
    Driver: C.DataSoupKey,
}

const CAttachMethodPortAllocator = {
    ...CAttachMethod,
    PortLimit: C.UInt32,
}

const CAttachMethodProximity = {
    ...CAttachMethod,
    RequestCount: C.UInt32,
    DistanceMax: C.Real32,
    SortResults: C.Bit,
    Location: S.EffectWhichLocation,
}

const CAttachMethodRandom = {
    ...CAttachMethod,
    RequestCount: C.UInt32,
    Distribution: E.AMRandomDistribution,
    ExponentialMean: C.Real32,
}

const CAttachMethodReduction = {
    ...CAttachMethod,
    ReductionType: E.AMReductionType,
    RequestCount: C.UInt32,
    RequestCountRange: C.UInt32,
    RequestPercentage: C.Real32,
    PassChanceEach: C.Real32,
    PassChanceFull: C.Real32,
}

const CAttachMethodVolumesRequery = {
    ...CAttachMethod,
}

const CAttachMethodVolumesTargets = {
    ...CAttachMethod,
}

const CAttachMethodVolumesWeightedPick = {
    ...CAttachMethod,
    VolumeFactor: C.Real32,
    ProximityFactorNear: C.Real32,
    ProximityFactorFar: C.Real32,
}

const CBankCondition = {
    ...CData,
}

const CBankConditionCompare = {
    ...CBankCondition,
    Bank: C.String,
    Section: C.String,
    Key: C.String,
    ValueName: C.String,
    Compare: E.ValueCompare,
}

const CBankConditionCompareValueCount = {
    ...CBankConditionCompare,
    AddCompare: E.ValueCompare,
    AddValue: C.Int32,
    Value: C.UInt32,
}

const CBankConditionCompareValueInteger = {
    ...CBankConditionCompare,
    Value: C.Int32,
}

const CBankConditionCompareValueString = {
    ...CBankConditionCompare,
    Value: C.String,
}

const CBankConditionCompareValueSum = {
    ...CBankConditionCompare,
    AddCompare: E.ValueCompare,
    AddValue: C.Int32,
    Value: C.Int32,
}

const CBankConditionCombine = {
    ...CBankCondition,
    Type: E.BankConditionCombine,
    CombineArray: [L.BankCondition],
    Negate: C.Bit,
}

const CBankConditionCurrentMap = {
    ...CBankCondition,
    Map: C.String,
}

const CBeam = {
    ...CData,
}

const CBeamSync = {
    ...CBeam,
}

const CBeamSyncSweeper = {
    ...CBeam,
}

const CBeamAsync = {
    ...CBeam,
}

const CBeamAsyncLinear = {
    ...CBeam,
    Duration: C.Real,
}

const CBeamAsyncShadow = {
    ...CBeam,
}



const CBehavior = {
    ...CData,
    Face: L.Button,
    Name: L.String,
    Tooltip: L.String,
    InfoTooltipPriority: C.UInt32,
    Alignment: E.BehaviorAlignment,
    Cost: S.Cost,
    BehaviorFlags: F.Unknown,
    InfoFlags: F.Unknown,
    InfoIcon: A.Image,
    BehaviorCategories: F.BehaviorCategory,
    EditorCategories: T.EditorCategories,
    Requirements: L.Requirement,
    TechAliasArray: [T.TechAlias],
    SortIndex: C.Int32,
    DebugTrace: C.Bit,
}

const CBehaviorAttackModifier = {
    ...CBehavior,
    Chance: S.AccumulatedFixed,
    TargetFilters: C.TargetFilters,
    ValidatorArray: [L.Validator],
    UniqueSetId: C.Identifier,
    AttackModifierFlags: F.Unknown,
    WeaponIndexEnableArray: F.Unknown,
    WeaponIndexDisableArray: F.Unknown,
    MaxStackCount: C.UInt32,
    DamageDealtScaled: [S.AccumulatedFixed,E.DamageKind],
    DamageDealtFraction: [S.AccumulatedFixed,E.DamageKind],
    DamageDealtUnscaled: [S.AccumulatedFixed,E.DamageKind],
    DamageTotalMultiplier: [S.AccumulatedFixed,E.DamageKind],
    PreImpactEffect: L.Effect,
    ImpactDamageInheritEffect: L.Effect,
    MultishotSearchPattern: L.Effect,
}

const CBehaviorAttribute = {
    ...CBehavior,
    PrimaryName: L.String,
    PrimaryTooltip: L.String,
    MinPoints: C.Int32,
    MaxPoints: C.Int32,
    Modification: S.Modification,
    PointGainEffect: L.Effect,
    PointLossEffect: L.Effect,
    PointDisplayFlags: F.EquipmentDisplay,
}

const CBehaviorUnitTracker = {
    ...CBehavior,
    TrackingValidatorArray: [L.Validator],
    MaxTrackedUnits: C.UInt32,
    UnitAddedAtMaxRule: E.BehaviorUnitTrackerAtMaxRule,
    ReplacedEffect: L.Effect,
    UnitTrackerFlags: F.Unknown,
    WhichLocation: S.EffectWhichLocation,
    SnapRange: C.Real,
    SnapCount: S.AccumulatedUInt32,
    SnapRule: E.BehaviorUnitTrackerSnapRule,
    SnapAngleAdjustment: C.Fangle,
    SharedListPlayer: S.EffectWhichPlayer,
}

const CBehaviorBuff = {
    ...CBehavior,
    DisplayDuration: F.Unknown,
    DisplayShield: F.Unknown,
    DisableValidatorArray: [L.Validator],
    RemoveValidatorArray: [L.Validator],
    BuffFlags: F.Unknown,
    MaxStackCount: C.UInt32,
    MaxStackCountPerCaster: C.UInt32,
    TimeScaleSource: S.EffectWhichTimeScale,
    Duration: S.AccumulatedGameTime,
    DurationOverride: [S.BehaviorDuration],
    DurationShield: C.GameTime,
    DurationVitalArray: [C.GameTime,E.UnitVital],
    DurationVitalMaxArray: [C.GameTime,E.UnitVital], 
    DurationRandomMin: C.GameTime,
    DurationRandomMax: C.GameTime,
    DurationBonusMin: C.GameTime,
    DurationBonusMax: C.GameTime,
    Period: C.GameTime,
    PeriodCount: C.UInt32,
    InitialEffect: L.Effect,
    RefreshEffect: L.Effect,
    PeriodicEffect: L.Effect,
    PeriodicEffectRateMultiplier: S.AccumulatedFixed,
    PeriodicDisplayEffect: [L.Effect],
    FinalEffect: L.Effect,
    ExpireEffect: L.Effect,
    Player: S.EffectWhichPlayer,
    AcquirePlayer: S.EffectWhichPlayer,
    Modification: S.Modification,
    DeathType: E.DeathType,
    AINotifyEffect: L.Effect,
    DamageResponse: S.DamageResponse,
    KillCredit: S.EffectWhichUnit,
    Replace: E.BehaviorBuffReplace,
    ReplaceLocation: S.EffectWhichLocation,
    HerdNode: L.HerdNode,
    VitalRegenVitalsRemain: [S.VitalRegenVitalRemain,E.UnitVital],
    VitalRegenVitalsRemainPercent: [S.VitalRegenVitalRemain,E.UnitVital],
    RevealUnit: S.EffectWhichUnit,
    StackAlias: C.Identifier,
    StackAliasPriority: C.UInt32,
}

const CBehaviorClickResponse = {
    ...CBehavior,
    Chance: C.Real,
    Count: C.UInt32,
    CountDelay: C.GameTime,
    CountEffect: L.Effect,
    Relationship: F.PlayerRelationship,
    ResetDelay: C.GameTime,
    ResetEffect: L.Effect,
}

const CBehaviorConjoined = {
    ...CBehavior,
    ConjoinedFlags: F.Unknown,
    Radius: C.Real,
}

const CBehaviorCreepSource = {
    ...CBehavior,
    Delay: C.GameTime,
    Period: C.GameTime,
    Build: L.Footprint,
    Start: L.Footprint,
    Birth: L.Footprint,
    Grown: L.Footprint,
    DisableValidatorArray: [L.Validator],
    RemoveValidatorArray: [L.Validator],
}

const CBehaviorJump = {
    ...CBehavior,
    TriggerHeightDeltaMin: C.Real,
    TriggerHeightDeltaMax: C.Real,
    InitiateRangeUp: C.Real,
    InitiateRangeDown: C.Real,
    JumpRangeMax: C.Real,
    JumpEffectUp: L.Effect,
    JumpEffectDown: L.Effect,
    Mover: L.Mover,
    MoverUp: L.Mover,
    MoverDown: L.Mover,
    DurationPreLaunch: C.GameTime,
    DurationPostLand: C.GameTime,
    DurationMoveOut: C.GameTime,
    Placeholder: L.Unit,
    LandAdjustmentUp: C.Real,
    LandAdjustmentDown: C.Real,
    LandArrivalRange: C.Real,
    LandCheckRadius: C.Real,
    LandEffectUp: L.Effect,
    LandEffectDown: L.Effect,
}

const CBehaviorPowerSource = {
    ...CBehavior,
    PowerLevel: T.PowerLevel,
    Radius: C.Real,
    PowerLink: T.PowerLink,
    CliffLevelFlags: F.CliffLevelCompare,
    Flags: F.Unknown,
}

const CBehaviorPowerUser = {
    ...CBehavior,
    PowerLink: T.PowerLink,
    PlacementMinPowerLevel: T.PowerLevel,
    Flags: F.Unknown,
    PoweredWhileUnderConstruction: C.Bit,
    PowerStageArray: [S.PowerStage],
}

const CBehaviorResource = {
    ...CBehavior,
    Capacity: C.UInt32,
    Contents: C.UInt32,
    HarvestTime: C.GameTime,
    HarvestAmount: C.UInt32,
    EmptyDeathType: E.DeathType,
    EmptyHarvestAmount: C.UInt32,
    EmptyUnit: L.Unit,
    Flags: F.Unknown,
    RequiredAlliance: E.AllianceId,
    ReturnDelay: C.GameTime,
    ExhaustedAlert: L.Alert,
    DepletionAlert: L.Alert,
    DepletionThreshold: C.UInt32,
    DepletionVariationCount: C.UInt32,
    CarryResourceBehavior: L.Behavior,
    IdealHarvesterCount: C.UInt32,
    EnabledSearchFilters: C.TargetFilters,
    EnabledSearchRadius: C.Real,
}

const CBehaviorReveal = {
    ...CBehavior,
    Duration: C.GameTime,
    SearchFilters: C.TargetFilters,
}

const CBehaviorSpawn = {
    ...CBehavior,
    DisplayDuration: F.Unknown,
    InfoArray: [S.SpawnInfo],
    Center: C.GamePoint,
    Offset: [C.GamePoint],
    Slop: C.Real,
    Effect: L.Effect,
    Range: C.Real,
    Flags: F.Unknown,
    Limit: C.UInt32,
    LimitDeath: E.DeathType,
    ConjoinedLink: L.Behavior,
}

const CBehaviorVeterancy = {
    ...CBehavior,
    Flags: F.Unknown,
    ShareFilters: [C.TargetFilters],
    TargetFilters: [C.TargetFilters],
    XPFraction: [C.Real],
    SharedXPRadius: [C.Real],
    SharedXPFraction: [C.Real],
    SharedXPMaxCount: [C.UInt32],
    VeterancyLevelArray: [S.VeterancyLevel],
    XPReceiveFraction: [S.BehaviorFraction],
    Levels: C.UInt32,
    MinVeterancyXPLevelFactor: C.Real,
    MinVeterancyXPPreviousValueFactor: C.Real,
    MinVeterancyXPBonusPerLevel: C.UInt32,
}

const CBehaviorWander = {
    ...CBehavior,
    Leash: C.Bit,
    Override: C.Bit,
    TimeLimitFactor: C.Real,
    MinimumRange: C.Real,
    Range: C.Real,
    Delay: C.GameTime,
}

const CBoost = {
    ...CData,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    TileTexture: A.Image,
    PreviewTexture: A.Image,
    HyperlinkId: T.HyperlinkId,
    PreviewCutsceneFile: A.Cutscene,
    TileCutsceneFile: A.Cutscene,
    StoreTypeName: L.String,
}

const CBundle = {
    ...CData,
    EditorCategories: T.EditorCategories,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    Flags: F.Bundle,
    Universe: E.HeroUniverse,
    BoostBonus: L.Boost,
    TileCutsceneFile: A.Cutscene,
    TileTexture: A.Image,
    MediumTileTexture: A.Image,
    LargeTileTexture: A.Image,
    PreviewCutsceneFile: A.Cutscene,
    ReleaseDate: S.ProductReleaseDate,
    HyperlinkId: T.HyperlinkId,
    Description: L.String,
    GameContentArray: [C.DataEntryPath],
    StoreTypeName: L.String,
    CinematicsImagePath: A.Image,
    LearnMoreBackgroundImage: A.Image,
    LearnMoreImage1: A.Image,
    LearnMoreImage2: A.Image,
    LearnMoreImage3: A.Image,
    LearnMoreTitleText1: L.String,
    LearnMoreTitleText2: L.String,
    LearnMoreTitleText3: L.String,
    LearnMoreBodyText1: L.String,
    LearnMoreBodyText2: L.String,
    LearnMoreBodyText3: L.String,
    SuppressCountryArray: [L.String],
    ExternalHyperlink: C.String,
}

const CButton = {
    ...CData,
    Name: L.String,
    Tooltip: L.String,
    TooltipAppender: [S.TooltipBlock],
    TooltipImage: A.Image,
    TooltipFlags: F.Unknown,
    TooltipResourceName: [L.String],
    TooltipVitalName: [L.String,E.UnitVital],
    TooltipSupplyName: L.String,
    TooltipCooldownOverrideText: L.String,
    TooltipVitalOverrideText: [L.String,E.UnitVital],
    TooltipTimeOverrideAbilCmd: S.TooltipTimeAbilCmd,
    Icon: A.Image,
    AlertName: L.String,
    AlertTooltip: L.String,
    AlertIcon: A.Image,
    Hotkey: L.Hotkey,
    EditorCategories: T.EditorCategories,
    TintRacially: C.Bit,
    HotkeyAlias: L.Button,
    HotkeySet: C.Identifier,
    HotkeyToggleUnit: L.Unit,
    Universal: C.Bit,
    SimpleDisplayText: L.String,
    HidesForSimpleText: C.Bit,
    UseHotkeyLabel: C.Bit,
    Placeholder: C.Bit,
    ChargeText: L.String,
    DefaultButtonLayout: S.ButtonCardLayout,
}

const CCamera = {
    ...CData,
    ParamInitial: [C.Real32],
    ZoomTable: [S.CameraZoom],
    ZoomTableObserver: [S.CameraZoom],
    ZoomDefault: C.UInt32,
    ParamSmooth: [S.CameraSmooth],
    TargetSmooth: S.CameraSmooth,
    FieldOfViewMin: C.Real32,
    FieldOfViewMax: C.Real32,
    FieldOfViewIncrement: C.Real32,
    DistanceMin: C.Real32,
    DistanceMax: C.Real32,
    DistanceIncrement: C.Real32,
    PitchMin: C.Real32,
    PitchMax: C.Real32,
    PitchIncrement: C.Real32,
    YawLeft: C.Real32,
    YawRight: C.Real32,
    YawMin: C.Real32,
    YawMax: C.Real32,
    YawIncrement: C.Real32,
    MaxScrollRate: [C.Real32],
    MaxScrollDistance: [C.Real32],
    VerticalScrollRateMultiplier: [C.Real32],
    ScrollAccelerationPeriod: [C.Real32],
    ScrollDecelerationPeriod: [C.Real32],
    ForwardScale: [C.Real32],
    StrafeScale: [C.Real32],
    RotateScale: C.Real32,
    FollowOffsetUpdateBandX: C.Range,
    FollowOffsetUpdateBandY: C.Range,
    FollowResetDecayDuration: C.Real32,
    FollowResetDecayFactor: C.Real32,
    FollowResetJumpDelay: C.Real32,
    FollowResetJumpDistance: C.Real32,
    FollowResetTimeoutNormal: C.Real32,
    FollowResetTimeoutLeashed: C.Real32,
    FollowResetTimeoutUnleashed: C.Real32,
    FollowScrollLeash: C.Rect,
    FollowScrollLimit: C.Real32,
    BorderSizeX: C.UInt8,
    BorderSizeY: C.UInt8,
    SmartPanJumpDistance: C.Real32,
    SmartPanSkipDistance: C.Real32,
    HeightDisplacementFactor: C.Real32,
    HeightDisplacementPitchMin: C.Real32,
    HeightDisplacementPitchMax: C.Real32,
    HeightDisplacementMax: C.Real32,
    HeightMap: E.CameraHeightMap,
}

const CCampaign = {
    ...CData,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    CampaignData: S.CampaignData,
    PurchaseProductIdArray: [T.BattleProductId],
    StoreTypeName: L.String,
    ScreenshotImage1: A.Image,
    ScreenshotImage2: A.Image,
    ScreenshotImage3: A.Image,
    ScreenshotImage4: A.Image,
    ScreenshotImage5: A.Image,
    LearnMoreBackgroundImage: A.Image,
    LearnMoreImage1: A.Image,
    LearnMoreImage2: A.Image,
    LearnMoreImage3: A.Image,
    LearnMoreTitleText1: L.String,
    LearnMoreTitleText2: L.String,
    LearnMoreTitleText3: L.String,
    LearnMoreBodyText1: L.String,
    LearnMoreBodyText2: L.String,
    LearnMoreBodyText3: L.String,
}

const CCharacter = {
    ...CData,
    Name: L.String,
    Age: C.UInt32,
    Gender: E.CharacterGender,
    Race: E.CharacterRace,
    RaceCustom: L.String,
    Attitude: L.String,
    Timbre: L.String,
    Dialect: L.String,
    VoiceRef: L.String,
    Description: L.String,
    Image: A.Image,
    Relevance: E.CharacterRelevance,
    Voice: C.String,
    Pitch: C.Int32,
    Color: C.Color,
    Unit: L.Unit,
    Variations: [S.CharacterVariation],
}

const CCliff = {
    ...CData,
    CliffMesh: L.CliffMesh,
    CliffMaterial: A.Model,
    EditorIcon: A.Image,
    Scale: C.UInt8,
}

const CCliffMesh = {
    ...CData,
    ModelPath: A.Model,
    CliffHeights: [C.Real32],
    WeldNormals: C.Bit,
}

const CColorStyle = {
    ...CData,
    Name: L.String,
    ColorEntry: [S.UIColorEntry],
}


const CCommander = {
    ...CData,
    Name: L.String,
    ShortName: L.String,
    AttributeId: C.FourCC,
    LevelAchievementId: C.UInt,
    Race: L.Race,
    Campaign: L.Campaign,
    Description: L.String,
    PurchaseMessage: L.String,
    Details: L.String,
    Portrait: A.Image,
    HomePanelImage: A.Image,
    CutsceneFilterSelf: C.Identifier,
    CutsceneFilterAlly: C.Identifier,
    UnitArray: [S.CommanderUnit],
    TalentTreeArray: [S.CommanderTalentTree],
    MasteryTalentArray: [S.CommanderMasteryTalent],
    MasteryMaxRank: C.UInt32,
    UserReference: C.UserReference,
    LoadingImage: A.Image,
    LoadingImageAlly: A.Image,
    TraitIcon: A.Image,
    CommanderAbilTitle: L.String,
    CommanderAbilArray: [S.CommanderAbil],
    Movie: A.Movie,
    ProductId: T.BattleProductId,
    RequiredRewardArray: [L.Reward],
    PurchaseImage: A.Image,
    StoreName: L.String,
    ConsoleSkin: L.ConsoleSkin,
    FeaturedImagePath: A.Image,
    FeaturedDescription: L.String,
    ProfileImagePath: A.Image,
    StoreTypeName: L.String,
    LearnMoreBackgroundImage: A.Image,
    LearnMoreImage1: A.Image,
    LearnMoreImage2: A.Image,
    LearnMoreImage3: A.Image,
    LearnMoreTitleText1: L.String,
    LearnMoreTitleText2: L.String,
    LearnMoreTitleText3: L.String,
    LearnMoreBodyText1: L.String,
    LearnMoreBodyText2: L.String,
    LearnMoreBodyText3: L.String,
    PrestigeArray: [L.Button],
    Color: C.Color,
    LoadingScreenCoordinates: C.Rect,
    DataCollectionAllowed: [L.DataCollection],
    CommanderArtifactKeyArray: [C.Identifier],
    CommanderPrestigeAchievementId: C.UInt,
}

const CConfig = {
    ...CData,
    Name: L.String,
    GameContentArray: [C.GameContentCreationData],
    BoostLicense: C.Identifier,
    SilencePenaltyLicense: C.UInt32,
    FreeNonKRIGRLicense: C.UInt32,
    CommanderMastery: L.Commander,
    CommanderDifficultyLevels: [S.CommanderDifficultyLevel],
    CommanderAchievementCategoryId: C.UInt32,
    CoopCampaignAchievementCategoryId: C.UInt32,
}

const CConsoleSkin = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    RequiredReward: L.Reward,
    ReleaseDate: S.ProductReleaseDate,
    MinimapPanelModel: S.ConsoleSkinModel,
    InfoPanelModel: S.ConsoleSkinModel,
    CommandPanelModel: S.ConsoleSkinModel,
    MinimapPanelImage: A.Image,
    InfoPanelImage: A.Image,
    CommandPanelImage: A.Image,
    Light: C.String,
    StoreTypeName: L.String,
    ThumbnailImage: A.Image,
    FeaturedImage: A.Image,
    Description: L.String,
    SkinId: C.String,
}

const CConversation = {
    ...CData,
    EditorCategories: T.EditorCategories,
    AnimBlendDefault: C.Int32,
    AnimBlendOut: C.Int32,
    ProductionLevelInfo: [S.ConversationProductionLevel],
    ProductionLevel: E.ConversationProductionLevel,
    ObjectStates: [L.ConversationState],
    DefaultSpeaker1: L.Character,
    DefaultSpeaker2: L.Character,
    SoundParent: L.Sound,
    FixedConditions: [S.ConversationConditionSet],
    FixedActions: [S.ConversationActionSet],
    FacialAnims: [S.ConversationFacialAnim],
    Lines: [S.ConversationLine],
    RunActions: [S.ConversationRunActions],
    Waits: [S.ConversationWait],
    Jumps: [S.ConversationJump],
    Choices: [S.ConversationChoice],
    Groups: [S.ConversationGroup],
    Comments: [S.ConversationComment],
    RootItems: [T.ConversationItemId],
}

const CConversationState = {
    ...CData,
    Flags: F.ConversationState,
    Indices: [S.ConversationStateIndex],
    ValueRange: C.iRange,
    CustomColors: [C.Color],
    InfoIds: [S.ConversationStateInfoIds],
}
const CCursor = {
    ...CData,
    Texture: A.Image,
    HotspotX: C.UInt32,
    HotspotY: C.UInt32,
    Texture16: A.Image,
    Texture64: A.Image,
}

const CDataCollection = {
    ...CData,
    Name: L.String,
    EditorCategories: T.EditorCategories,
    EditorIconSource: E.GameCatalog,
    InfoText: L.String,
    DataRecord: [S.DataCollectionRecord],
    Button: L.Button,
    ImplementionLevel: E.ImplementionLevel,
    Pattern: L.DataCollectionPattern,
}

const CDataCollectionUnit = {
    ...CDataCollection,
    AbilInfoNormal: [L.Abil],
    AbilInfoLearned: [L.Abil],
    AbilInfoUpgradeTo: [L.Unit],
    AbilInfoBuilt: [L.Unit],
    AbilInfoTrainUnit: [L.Unit],
    AbilInfoResearch: [L.Abil],
    AbilInfoSellUnit: [L.Unit],
    AbilInfoSellItem: [L.Unit],
    AbilInfoMakeItem: [L.Unit],
    UpgradeInfoUnitLifeArmorPerLevel: C.Real,
    UpgradeInfoWeapon: [S.UpgradeInfoWeapon],
    TechInfoUnit: L.Unit,
    TechInfoUnitReplaced: L.Unit,
    TechInfoUpgradeUsed: [L.Upgrade],
}

const CDataCollectionUpgrade = {
    ...CDataCollection,
    TechInfoUpgrade: L.Upgrade,
    TechInfoUpgradeReplaced: L.Upgrade,
}

const CDataCollectionAbil = {
    ...CDataCollection,
    TechInfoAbil: L.Abil,
    TechInfoAbilReplaced: L.Abil,
}

const CDataCollectionPattern = {
    ...CData,
    Fields: [S.DataFieldsPattern],
    Tokens: [S.DataTokensPattern],
}

const CDecalPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    Description: L.String,
    Image: S.TextureSheetEntry,
    ProductId: T.BattleProductId,
    ReleaseDate: S.ProductReleaseDate,
    DecalArray: [L.Reward],
    StoreTypeName: L.String,
}

const CDSP = {
    ...CData,
}

const CDSPChorus = {
    ...CData,
    Delay: C.Real32,
    Depth: C.Real32,
    DryMix: C.Real32,
    Feedback: C.Real32,
    Rate: C.Real32,
    WetMix1: C.Real32,
    WetMix2: C.Real32,
    WetMix3: C.Real32,
}

const CDSPCompressor = {
    ...CData,
    Attack: C.Real32,
    GainMakeUp: C.Real32,
    Release: C.Real32,
    Threshold: C.Real32,
}

const CDSPCustomCompressor = {
    ...CData,
    AttackMs: C.UInt32,
    Ratio: C.Real32,
    ReleaseMs: C.UInt32,
    ThresholdDB: C.Real32,
    MakeUpGainDB: C.Real32,
    DelayMs: C.UInt32,
}

const CDSPDistortion = {
    ...CData,
    Level: C.Real32,
}

const CDSPEcho = {
    ...CData,
    DecayRatio: C.Real32,
    Delay: C.Real32,
    DryMix: C.Real32,
    MaxChannels: C.Real32,
    WetMix: C.Real32,
}

const CDSPFlange = {
    ...CData,
    Depth: C.Real32,
    DryMix: C.Real32,
    Rate: C.Real32,
    WetMix: C.Real32,
}

const CDSPHighPass = {
    ...CData,
    Cutoff: C.Real32,
    Resonance: C.Real32,
}

const CDSPLimiter = {
    ...CData,
    ReleaseMs: C.UInt32,
    UseARC: C.Bit,
    ThresholdDB: C.Real32,
    MakeUpGainDB: C.Real32,
    SoftKneeWidthDB: C.Real32,
    ARCAttackMs: C.UInt32,
    ARCReleaseMs: C.UInt32,
    ARCMinReleaseMs: C.UInt32,
    ARCMaxReleaseMs: C.UInt32,
    ARCReleaseSweepMs: C.UInt32,
}

const CDSPLowPass = {
    ...CData,
    Cutoff: C.Real32,
    Resonance: C.Real32,
}

const CDSPLowPassSimple = {
    ...CData,
    Cutoff: C.Real32,
}

const CDSPNormalize = {
    ...CData,
    FadeTime: C.Real32,
    MaxAmp: C.Real32,
    Threshhold: C.Real32,
}

const CDSPOscillator = {
    ...CData,
    Type: E.Oscillator,
    Rate: C.Real32,
}

const CDSPParamEQ = {
    ...CData,
    Bandwidth: C.Real32,
    Center: C.Real32,
    Gain: C.Real32,
}

const CDSPPitchShift = {
    ...CData,
    FFTSize: C.UInt32,
    MaxChannels: C.Real32,
    Pitch: C.Real32,
}

const CDSPReverb = {
    ...CData,
    DecayHFRatio: C.Real32,
    DecayTime: C.Real32,
    Density: C.Real32,
    Diffusion: C.Real32,
    DryLevel: C.Real32,
    HFReference: C.Real32,
    LFReference: C.Real32,
    ReflectionsDelay: C.Real32,
    ReflectionsLevel: C.Real32,
    ReverbDelay: C.Real32,
    ReverbLevel: C.Real32,
    Room: C.Real32,
    RoomHF: C.Real32,
    RoomLF: C.Real32,
    RoomRolloffFactor: C.Real32,
}

const CEffect = {
    ...CData,
    Name: L.String,
    ValidatorArray: [L.Validator],
    PreloadValidatorArray: [L.Validator],
    EditorCategories: T.EditorCategories,
    Marker: S.Marker,
    AINotifyFlags: F.NotifyArea,
    TechAliasArray: [T.TechAlias],
    Chance: C.Real,
    Alert: L.Alert,
    DamageModifierSource: S.EffectWhichUnit,
    CasterHistory: E.EffectHistory,
    CanBeBlocked: C.Bit,
    DebugTrace: C.Bit,
    OwningPlayer: S.EffectWhichPlayer,
}

const CEffectResponse = {
    ...CEffect,
    ResponseFlags: F.Response,
}

const CEffectAddTrackedUnit = {
    ...CEffect,
    ResponseFlags: F.Response,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    TrackedUnit: S.EffectWhichUnit,
}

const CEffectClearTrackedUnits = {
    ...CEffect,
    ResponseFlags: F.Response,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    ClearValidatorArray: [L.Validator],
}

const CEffectAddTrackedUnits = {
    ...CEffect,
    ResponseFlags: F.Response,
    SourceBehaviorLink: L.Behavior,
    SourceTrackerUnit: S.EffectWhichUnit,
    TargetBehaviorLink: L.Behavior,
    TargetTrackerUnit: S.EffectWhichUnit,
}

const CEffectRemoveTrackedUnit = {
    ...CEffect,
    ResponseFlags: F.Response,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    TrackedUnit: S.EffectWhichUnit,
}

const CEffectApplyBehavior = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    Behavior: L.Behavior,
    KillHallucination: C.Bit,
    Count: S.AccumulatedUInt32,
    Flags: F.Unknown,
    Duration: C.GameTime,
}

const CEffectApplyForce = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    WhichUnit: S.EffectWhichUnit,
    Amount: C.Real,
    MassFraction: C.Real,
    TimeScaleSource: S.EffectWhichTimeScale,
}

const CEffectApplyKinetic = {
    ...CEffect,
    ResponseFlags: F.Response,
    ImpactUnit: S.EffectWhichUnit,
    Kinetic: L.Kinetic,
}

const CEffectCancelOrder = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    AbilCmd: L.AbilCommand,
    Count: C.UInt32,
    Flags: F.Unknown,
}

const CEffectCreateHealer = {
    ...CEffect,
    ResponseFlags: F.Response,
    LaunchUnit: S.EffectWhichUnit,
    ImpactUnit: S.EffectWhichUnit,
    TimeScaleSource: S.EffectWhichTimeScale,
    Flags: F.Unknown,
    PeriodCount: C.UInt32,
    PeriodicValidator: L.Validator,
    PeriodicEffect: L.Effect,
    PeriodicPeriod: C.GameTime,
    PeriodicEffectRateMultiplier: C.Real,
    DrainVital: E.UnitVital,
    DrainVitalCostFactor: S.AccumulatedFixed,
    DrainResourceCostFactor: [C.Real],
    RechargeVital: E.UnitVital,
    RechargeVitalFraction: C.GameRate,
    RechargeVitalRate: S.AccumulatedGameRate,
    RechargeVitalMax: C.GameRate,
    TimeFactor: C.Real,
    InitialEffect: L.Effect,
    ExpireEffect: L.Effect,
    FinalEffect: L.Effect,
    AmountScoreArray: [S.ScoreValueUpdate],
}

const CEffectCreep = {
    ...CEffect,
    WhichLocation: S.EffectWhichLocation,
    Radius: S.AccumulatedFixed,
    CreepFlags: F.Unknown,
}

const CEffectCreatePersistent = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    TimeScaleSource: S.EffectWhichTimeScale,
    OffsetVectorStartLocation: S.EffectWhichLocation,
    OffsetVectorEndLocation: S.EffectWhichLocation,
    OffsetFacingFallback: S.EffectWhichLocation,
    Flags: F.Unknown,
    InitialDelay: C.GameTime,
    InitialEffect: L.Effect,
    InitialOffset: C.EffectOffset,
    ExpireDelay: S.AccumulatedGameTime,
    ExpireEffect: L.Effect,
    ExpireOffset: C.EffectOffset,
    FinalEffect: L.Effect,
    FinalOffset: C.EffectOffset,
    PeriodCount: S.AccumulatedUInt32,
    PeriodicValidator: L.Validator,
    PeriodicEffectArray: [L.Effect],
    PeriodicOffsetArray: [C.EffectOffset],
    PeriodicPeriodArray: [C.GameTime],
    PeriodicEffectRateMultiplier: C.Real,
    RevealRadius: S.AccumulatedFixed,
    RevealFlags: F.EffectReveal,
    RevealArc: C.FangleArc,
    RevealFacing: C.Fangle,
    RevealRectangleWidth: C.Real,
    RevealRectangleHeight: C.Real,
    TeleportTrack: F.Unknown,
    TeleportValidator: L.Validator,
    DetectFilters: C.TargetFilters,
    RadarFilters: C.TargetFilters,
    HeightMap: E.HeightMap,
    AINotifyEffect: L.Effect,
    EffectRandMode: E.ListWalkMode,
    OffsetRandMode: E.ListWalkMode,
    PeriodRandMode: E.ListWalkMode,
}

const CEffectRandomPointInCircle = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    Effect: L.Effect,
    Count: C.UInt32,
    Radius: S.AccumulatedFixed,
    RestrictToCircumference: C.Bit,
}

const CEffectCreateUnit = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    Origin: S.EffectWhichLocation,
    CreateFlags: F.Unknown,
    RallyUnit: S.EffectWhichUnit,
    SpawnOwner: S.EffectWhichPlayer,
    SpawnEffect: L.Effect,
    SpawnUnit: [L.Unit],
    SpawnCount: S.AccumulatedUInt32,
    SpawnRange: C.Real,
    SpawnOffset: [C.GamePoint],
    SelectUnit: S.EffectWhichUnit,
    TypeFallbackUnit: S.EffectWhichUnit,
}

const CEffectDamage = {
    ...CEffect,
    ResponseFlags: F.Response,
    LaunchLocation: S.EffectWhichLocation,
    ImpactLocation: S.EffectWhichLocation,
    ImpactUnitValidator: L.Validator,
    AttributeBonus: [C.Real],
    AttributeFactor: [C.Real],
    AttributeForced: F.UnitAttribute,
    ShieldBonus: C.Real,
    ShieldFactor: C.Real,
    ArmorReduction: C.Real,
    Visibility: E.DamageVisibility,
    Flags: F.Damage,
    Kind: E.DamageKind,
    KindSplash: E.DamageKind,
    Type: E.DamageType,
    Total: E.DamageTotal,
    Amount: S.AccumulatedFixed,
    Fraction: S.AccumulatedFixed,
    Random: C.Real,
    VitalBonus: [C.Real,E.UnitVital],
    VitalFractionCurrent: [C.Real,E.UnitVital],
    VitalFractionMax: [C.Real,E.UnitVital],
    VitalBonusRandom: [C.Real,E.UnitVital],
    VitalFractionCurrentRandom: [C.Real,E.UnitVital],
    VitalFractionMaxRandom: [C.Real,E.UnitVital],
    LeechFraction: [C.Real],
    LeechScoreArray: [S.ScoreValueUpdate],
    Death: E.DeathType,
    KillHallucination: C.Bit,
    AreaArray: [S.EffectDamageArea],
    AreaRelativeOffset: C.GamePoint,
    RevealerParams: S.EffectSearchRevealerParams,
    ExcludeArray: [S.EffectWhichUnit],
    IncludeArray: [S.EffectWhichUnit],
    SearchFilters: C.TargetFilters,
    TargetSorts: S.TargetSorts,
    MinCountError: C.CmdResult,
    MinCount: C.UInt32,
    MaxCount: S.AccumulatedUInt32,
    RecycleCount: C.UInt32,
    SearchFlags: F.Unknown,
    DisplayFlags: F.EquipmentDisplay,
    SplashHistory: E.EffectHistory,
    AmountScoreArray: [S.ScoreValueUpdate],
    Minimum: C.Real,
    Maximum: C.Real,
    DamageInheritEffect: L.Effect,
}

const CEffectDestroyHealer = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    Effect: L.Effect,
    Count: C.UInt32,
    Radius: C.Real,
}

const CEffectDestroyPersistent = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    Effect: L.Effect,
    Count: C.UInt32,
    Radius: C.Real,
}

const CEffectEnumArea = {
    ...CEffect,
    ResponseFlags: F.Response,
    LaunchLocation: S.EffectWhichLocation,
    ImpactLocation: S.EffectWhichLocation,
    ExcludeArray: [S.EffectWhichUnit],
    IncludeArray: [S.EffectWhichUnit],
    SearchFilters: C.TargetFilters,
    TargetSorts: S.TargetSorts,
    AreaArray: [S.EffectEnumArea],
    AreaRelativeOffset: C.GamePoint,
    RevealerParams: S.EffectSearchRevealerParams,
    MinCountError: C.CmdResult,
    MinCount: C.UInt32,
    MaxCount: S.AccumulatedUInt32,
    ExtraRadiusBonus: S.AccumulatedFixed,
    RecycleCount: C.UInt32,
    SearchFlags: F.Unknown,
    UnCreep: C.Bit,
}

const CEffectEnumTrackedUnits = {
    ...CEffect,
    ResponseFlags: F.Response,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    Effect: L.Effect,
    TrackedUnitFilters: C.TargetFilters,
    DistributDamage: C.Bit,
}

const CEffectEnumMagazine = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    SearchFilters: C.TargetFilters,
    MaxCount: C.UInt32,
    EffectInternal: L.Effect,
    EffectExternal: L.Effect,
}

const CEffectEnumTransport = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    SearchFilters: C.TargetFilters,
    MaxCount: C.UInt32,
    Effect: L.Effect,
    CheckOuter: C.Bit,
}

const CEffectEnumInventory = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    SearchFilters: C.TargetFilters,
    MaxCount: C.UInt32,
    Effect: L.Effect,
    CheckOuter: C.Bit,
}

const CEffectLastTarget = {
    ...CEffect,
    ResponseFlags: F.Response,
    LastTargetType: E.AbilLastTarget,
    WhichUnit: S.EffectWhichUnit,
    Effect: L.Effect,
}

const CEffectLoadContainer = {
    ...CEffect,
    ResponseFlags: F.Response,
    ContainerType: E.EffectContainer,
    WhichUnit: S.EffectWhichUnit,
    ContainerUnit: S.EffectWhichUnit,
    ContainerAbil: L.Abil,
}

const CEffectIssueOrder = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    Abil: L.Abil,
    AbilTechAlias: T.TechAlias,
    AbilCmdIndex: T.AbilCmdIndex,
    CmdFlags: F.Cmd,
    Player: S.EffectWhichPlayer,
    Target: S.EffectWhichLocation,
}

const CEffectLaunchMissile = {
    ...CEffect,
    ResponseFlags: F.Response,
    LaunchLocation: S.EffectWhichLocation,
    ImpactLocation: S.EffectWhichLocation,
    LaunchOffset: C.EffectOffset,
    ImpactOffset: C.EffectOffset,
    LaunchEffect: L.Effect,
    ImpactEffect: L.Effect,
    FinishEffect: L.Effect,
    InterruptEffect: L.Effect,
    SearchEffect: L.Effect,
    SearchHitArriveEffect: L.Effect,
    SearchMaxCount: C.UInt32,
    PeriodCount: C.UInt32,
    PeriodicEffect: L.Effect,
    PeriodicPeriod: C.GameTime,
    PeriodicValidator: L.Validator,
    Flags: F.Unknown,
    SearchFlags: F.Unknown,
    TransferBehavior: L.Behavior,
    TransferCount: C.UInt32,
    AmmoOwner: S.EffectWhichPlayer,
    AmmoUnit: L.Unit,
    AmmoLife: C.GameTime,
    PlaceholderUnit: L.Unit,
    PlacementMinDistance: C.Real,
    PlacementAround: S.EffectWhichLocation,
    PlacementRange: C.Real,
    ImpactRange: C.Real,
    RetargetFilters: C.TargetFilters,
    RetargetRange: C.Real,
    ReturnDelay: C.GameTime,
    ReturnMovers: [S.EffectMover],
    Movers: [S.EffectMover],
    MoverRollingPattern: E.MoverPatternType,
    MoverRollingJump: C.UInt32,
    MoverExecutePattern: E.MoverPatternType,
    MoverExecuteJump: C.UInt32,
    MoverExecuteRange: C.UInt32,
    DeathType: E.DeathType,
    Visibility: E.DamageVisibility,
    BounceArray: [S.EffectMissileBounce],
}

const CEffectModifyPlayer = {
    ...CEffect,
    WhichPlayer: S.EffectWhichPlayer,
    Resources: [C.Int32],
    ResourcesCollected: [C.Int32],
    EffectArray: [S.UpgradeEffect],
    Upgrades: [S.EffectUpgrade],
    Cost: S.EffectModifyPlayerCost,
}

const CEffectModifyUnit = {
    ...CEffect,
    ResponseFlags: F.Response,
    TransferUnit: S.EffectWhichUnit,
    LaunchUnit: S.EffectWhichUnit,
    ImpactUnit: S.EffectWhichUnit,
    KillCreditUnit: S.EffectWhichUnit,
    KillHallucination: C.Bit,
    Cost: [S.EffectModifyUnitCost],
    Weapon: [S.EffectModifyWeapon],
    VitalArray: [S.EffectModifyVital,E.UnitVital],
    Height: C.Real,
    HeightTime: C.GameTime,
    ModifyFlags: F.Unknown,
    XP: C.Real,
    VeterancyBehavior: L.Behavior,
    LearnAbilReset: L.Abil,
    ResourceRestoreBonus: C.UInt32,
    ResourceRestoreFraction: C.Real,
    Resources: C.Int32,
    ResourcesHarvestedBonus: C.UInt32,
    ResourcesHarvestedFraction: C.Real,
    SalvageFactor: SCostFactor,
    SpawnCount: C.Int32,
    CopyOrderCount: C.UInt32,
    CopyRallyCount: C.UInt32,
    ModifyOwnerPlayer: S.EffectWhichPlayer,
    RallyUnit: S.EffectWhichUnit,
    ModifyTurret: S.EffectModifyTurret,
    SelectTransferUnit: S.EffectWhichUnit,
    SelectTransferFlags: F.SelectionTransfer,
    FacingLocation: S.EffectWhichLocation,
    FacingType: E.EffectModifyFacing,
    FacingAdjustment: C.Fangle,
}

const CEffectMorph = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    ActorKey: C.DataSoupKey,
    MorphFlags: F.Unknown,
    MorphUnit: L.Unit,
    TypeFallbackUnit: S.EffectWhichUnit,
    AbilKeyFallback: L.Abil,
}

const CEffectRedirectMissile = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    ImpactLocation: S.EffectWhichLocation,
    ImpactFilters: C.TargetFilters,
    Flags: F.Unknown,
    Movers: [S.EffectMover],
    MoverRollingPattern: E.MoverPatternType,
    MoverRollingJump: C.UInt32,
    MoverExecutePattern: E.MoverPatternType,
    MoverExecuteJump: C.UInt32,
    MoverExecuteRange: C.UInt32,
}

const CEffectReleaseMagazine = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
}

const CEffectRemoveBehavior = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    BehaviorCategories: F.BehaviorCategory,
    BehaviorClass: E.ClassIdCBehavior,
    BehaviorLink: L.Behavior,
    BehaviorAlignment: E.EffectRemoveBehaviorAlignment,
    Heroic: E.BehaviorHeroicState,
    StackAlias: C.Identifier,
    KillHallucination: C.Bit,
    MatchesAll: C.Bit,
    Count: C.UInt32,
    ExcludeOriginPlayer: S.EffectWhichPlayer,
    ExcludeCasterUnit: S.EffectWhichUnit,
    RequireOriginPlayer: S.EffectWhichPlayer,
    RequireCasterUnit: S.EffectWhichUnit,
}

const CEffectRemoveKinetic = {
    ...CEffect,
    ResponseFlags: F.Response,
    ImpactUnit: S.EffectWhichUnit,
    KineticLink: L.Kinetic,
}

const CEffectReturnMagazine = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    MagazineEffect: L.Effect,
}

const CEffectSet = {
    ...CEffect,
    EffectArray: [L.Effect],
    Random: C.Bit,
    RecycleCount: C.Bit,
    SetSource: C.Bit,
    MinCount: S.AccumulatedUInt32,
    MaxCount: S.AccumulatedUInt32,
    TargetLocationType: E.EffectLocationType,
}

const CEffectSwitch = {
    ...CEffect,
    CaseArray: [S.EffectSwitchCase],
    CaseDefault: L.Effect,
    TargetLocationType: E.EffectLocationType,
}

const CEffectTeleport = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    ClearQueuedOrders: C.Bit,
    MinDistance: C.Real,
    PlacementArc: C.FangleArc,
    PlacementAround: S.EffectWhichLocation,
    PlacementRange: C.Real,
    Range: C.Real,
    SourceLocation: S.EffectWhichLocation,
    TargetLocation: S.EffectWhichLocation,
    TeleportFlags: F.Unknown,
    TeleportEffect: L.Effect,
}

const CEffectTransferBehavior = {
    ...CEffect,
    ResponseFlags: F.Response,
    LaunchUnit: S.EffectWhichUnit,
    ImpactUnit: S.EffectWhichUnit,
    Behavior: L.Behavior,
    BehaviorCategories: F.BehaviorCategory,
    BehaviorAlignment: E.EffectRemoveBehaviorAlignment,
    Heroic: E.BehaviorHeroicState,
    ExcludeOriginPlayer: S.EffectWhichPlayer,
    ExcludeCasterUnit: S.EffectWhichUnit,
    RequireOriginPlayer: S.EffectWhichPlayer,
    RequireCasterUnit: S.EffectWhichUnit,
    Count: C.UInt32,
    Copy: C.Bit,
    Preserve: C.Bit,
}

const CEffectUseCalldown = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichLocation: S.EffectWhichLocation,
    CalldownCount: C.UInt32,
    CalldownEffect: L.Effect,
}

const CEffectUseMagazine = {
    ...CEffect,
    ResponseFlags: F.Response,
    WhichUnit: S.EffectWhichUnit,
    AmmoUnit: L.Unit,
    AmmoEffect: L.Effect,
    MagazineAbil: L.Abil,
    TargetLocation: S.EffectWhichLocation,
}

const CEffectUserData = {
    ...CEffect,
    Key: C.Identifier,
    Amount: S.AccumulatedFixed,
    SourceKey: C.Identifier,
    SourceFailBackValue: C.Real,
    Operation: E.UpgradeOperation,
    ValidateMin: S.AccumulatedFixed,
    ValidateMax: S.AccumulatedFixed,
    EffectSuccess: L.Effect,
    EffectFailure: L.Effect,
    TargetLocationType: E.EffectLocationType,
    BehaviorScope: S.EffectWhichBehavior,
}

const CEmoticon = {
    ...CData,
    Name: L.String,
    NameAlternate: L.String,
    NameInvalid: L.String,
    Description: L.String,
    DescriptionLocked: L.String,
    Image: S.TextureSheetEntry,
    Hidden: C.Bit,
    RequiredReward: L.Reward,
}

const CEmoticonPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    Description: L.String,
    Image: S.TextureSheetEntry,
    ProductId: T.BattleProductId,
    RequiredCampaign: S.EmoticonPackCampaign,
    RequiredCommander: L.Commander,
    RequiredRewardArray: [L.Reward],
    ReleaseDate: S.ProductReleaseDate,
    EmoticonArray: [L.Emoticon],
    ParentBundle: L.Bundle,
    Hidden: C.Bit,
    HideAchievement: C.Bit,
    StoreTypeName: L.String,
}

const CFootprint = {
    ...CData,
    Flags: F.Footprint,
    Layers: [S.FootprintLayer],
    Shape: S.FootprintShape,
    EditorCategories: T.EditorCategories,
}

const CFoW = {
    ...CData,
    Color: C.Color,
    UnhideRadius: C.Real,
    Expand: C.Bit,
    Hidden: C.Bit,
    Persistent: C.Bit,
    BlendSpeed: C.Int32,
}

const CGame = {
    ...CData,
    AttackRevealBehavior: L.Behavior,
    AcquireMovementLimit: C.Real,
    AcquireLeashRadius: C.Real,
    AcquireLeashResetRadius: C.Real,
    CallForHelpPeriod: C.GameTime,
    CallForHelpRadius: C.Real,
    CreepBlendTime: C.GameTime,
    CreepDecayLimit: C.UInt32,
    CreepDecaySound: L.Sound,
    CreepDecayTime: C.GameTime,
    CreepDecayWeightMultiplier: C.UInt32,
    CreepDecayWeightUnscaledBonus: C.UInt32,
    CreepGrowSound: L.Sound,
    DensityDecayTime: C.GameTime,
    DensityPersistent: C.Bit,
    DamageMinimum: C.Real,
    AttackRevealTime: C.GameTime,
    PenaltyRevealTime: C.GameTime,
    StalemateTestTime: C.GameTime,
    StalemateWarningTime: C.GameTime,
    DifficultyLevels: [S.DifficultyLevel],
    DifficultyDefault: T.DifficultyLevel,
    AIBuilds: [S.AIBuild],
    AIBuildDefault: T.AIBuild,
    HandicapValues: [S.Handicap],
    AirFormationDiameter: C.Real,
    MixedFormationDiameter: C.Real,
    FormationSeparationFactor: C.Real,
    MapSizes: [S.MapSize],
    UnpathableMargin: C.iQuad,
    CameraMargin: C.iQuad,
    CameraMarginAspectAdjust: [S.AspectMargin],
    TeamColors: [S.TeamColor],
    SplashDamageEffect: L.Effect,
    DefaultAttackType: E.AttackType,
    WeaponHighGroundChanceToMiss: C.Real,
    UnitSightRangeDead: C.Real,
    UnitSightRangeUnderConstruction: C.Real,
    AI: [S.AIDescription],
    TriggerLibs: [S.TriggerLib],
    FilterResults: [S.TargetFilterResult],
    BeaconInfoArray: [S.BeaconInfo],
    SprayAbil: L.Abil,
    SprayButtonReplacementTarget: [L.Button],
    TauntAbil: L.Abil,
    UncontestedCombatPeriod: C.GameTime,
    AIResourceRequest: [C.UInt32],
    DamageCategories: [S.DamageTypeInfo],
    AttackArmorTable: [S.AttackTypeInfo],
    VeterancySearchRadius: C.Real,
    VeterancySearchFilters: C.TargetFilters,
    VeterancySearchMaxCount: C.UInt32,
    VeterancyKillerFilters: C.TargetFilters,
    UnitLevelKillXPTable: [C.UInt32],
    UnitLevelKillXPLevelFactor: C.Real,
    UnitLevelKillXPPreviousValueFactor: C.Real,
    UnitLevelKillXPBonusPerLevel: C.UInt32,
    VeterancyLevelKillXPTable: [C.UInt32],
    VeterancyLevelKillXPLevelFactor: C.Real,
    VeterancyLevelKillXPPreviousValueFactor: C.Real,
    VeterancyLevelKillXPBonusPerLevel: C.UInt32,
    ResourceConvertArray: [S.ResourceConvert],
    DamageHistoryIntervalMax: C.Real,
    MeleePointsThreshold: S.MeleePointThreshold,
    MeleePointsGameDurationMin: C.GameTime,
    FoodCappedMax: C.Real,
    TeleportResetRange: [C.Real],
    CalculateFullVision: C.Bit,
    JoinInProgress: C.Bit,
    PathingConfig: F.Unknown,
    PlayerLeaveFlags: F.PlayerLeave,
    HeroOverlapPercent: C.Real,
    SmartCommandContinuous: C.Bit,
    EnforcedGameResultScoreResult: L.ScoreResult,
    DefaultPauseCountPerPlayer: C.UInt16,
    UnlimitedPause: C.Bit,
    EnableRewardSkins: C.Bit,
    EnableRewardVoicePacks: C.Bit,
    EnableRewardConsoleSkins: C.Bit,
    PlayersRequiredForLargeFormat: C.UInt32,
    DeepWaterThreshold: C.Real,
    GenerateWaterPathing: C.Bit,
    NeutralPlayerScanValidator: L.Validator,
}

const CGameUI = {
    ...CData,
    ChallengeCategory: [S.ChallengeCategory],
    ChallengeMasterAchievement: [L.Achievement],
    Campaign: [L.Campaign],
    StartupCampaign: C.UInt32,
    StartupMovieArray: [S.MovieConfig],
    Musiarray: [L.Soundtrack],
    StartupMusic: C.UInt32,
    IntroMusic: L.Soundtrack,
    PostGameMusic: L.Soundtrack,
    CreditsMusic: L.Soundtrack,
    MatchmakingMusic: L.Soundtrack,
    MusicArray: L.Soundtrack,
    LoopAmbience: L.Soundtrack,
    SoundQuality: [S.SoundQuality],
    MinimapData: S.MinimapData,
    SelectionData: S.SelectionData,
    SoundData: [S.SoundData],
    MixRouting: [S.MixRoute],
    GlobalSoundData: S.GlobalSoundData,
    StartupDSPArray: [L.DSP],
    DSPArray: [L.DSP],
    PointModels: [S.PointModel],
    RegionNameSize: C.UInt32,
    LookAtTypes: [S.LookAtType],
    CameraShakeAmplitudes: [S.CameraShakeAmplitude],
    CameraShakeFrequencies: [S.CameraShakeFrequency],
    ListenerAngleRolloff: [S.ListenerRolloff],
    ListenerDistanceRolloff: [S.ListenerRolloff],
    PlanetPanelDefaultBackground: L.Model,
    PlayerIdObserverColorMap: [E.UIColorRelation,EUnknown],
    BehaviorIconColors: [C.Color],
    BehaviorBorderColors: [C.Color],
    VitalColors: [S.VitalColor,E.UnitVital],
    SelectionColors: [C.Color],
    SelectionColorBlindColors: [C.Color],
    RadarAlpha: C.UInt8,
    OverrideColors: [S.TeamColor],
    ColorBlindColors: [S.TeamColor],
    WireframeColorArray: [C.Color],
    MovementSpeedArray: [S.UnitSpeedText],
    WeaponSpeedArray: [S.WeaponSpeedText],
    InfoColorBuffed: C.Color,
    InfoColorDebuffed: C.Color,
    InfoColorUpgraded: C.Color,
    RequirementsSatisfiedColor: C.Color,
    RequirementsUnsatisfiedColor: C.Color,
    RandomRaceIcon: A.Image,
    DisplayScaledTime: C.Bit,
    DisplayTimeInSeconds: C.Bit,
    UnitDamageFlashDuration: C.UInt32,
    UnitDamageNotificationCooldown: C.UInt32,
    UnitDamageNotificationDelay: C.UInt32,
    CancelTargetModeButtonFace: L.Button,
    CancelPlacementModeButtonFace: L.Button,
    PlacementDisplayBonusRadius: C.UInt32,
    PlacementDisplayMinimumRadius: C.UInt32,
    PlacementErrorColor: C.Color,
    PlacementWarningColor: C.Color,
    PlacementPerfectColor: C.Color,
    PlacementColorBlindErrorColor: C.Color,
    PlacementColorBlindWarningColor: C.Color,
    PlacementColorBlindDefaultColor: C.Color,
    PlacementGridDimensions: C.Vector2i,
    PossibleEnemyPlacementPingDuration: C.GameTime,
    PossibleEnemyPlacementPingModel: L.Model,
    PossibleEnemyPlacementPingColor: C.Color,
    ScreenModeTransitionDuration: C.UInt32,
    CostDisplayColor: [C.Color],
    CostDisplayFade: C.GameTime,
    CostDisplayHeight: C.UInt32,
    CostDisplayHeightOffset: C.Real,
    CostDisplaySpeed: C.GameSpeed,
    CostDisplayTime: C.GameTime,
    WayPointMultiUnitFadePoint: C.Real32,
    WayPointMultiUnitFadeAlpha: C.Real32,
    WayPointLineWidth: C.Real32,
    WayPointTileLength: C.Real32,
    DefaultPathColor: [C.Color],
    DefaultPathLineWidth: [C.Real32],
    DefaultPathTileLength: [C.Real32],
    DefaultPathTexture: [A.Image],
    DefaultPathStepModel: [A.Model],
    DefaultPathStepModelScale: [C.Real32],
    StrobeCycleLength: C.UInt32,
    StrobeFalloff: C.Real32,
    StrobeHeight: C.Real32,
    StrobeHaloEmission: C.Real32,
    StrobeHighlightColor: C.Color,
    GlowPeakMultiplier: C.Vector3,
    TransmissionSoundRect: C.Rect,
    TransmissionSoundDepth: C.Real32,
    DefaultInfoTooltipTypes: C.String,
    ObjectGroupData: [S.ObjectGroupData],
    LoadingScreenHelpIntro: [S.LoadingScreenHelp],
    LoadingScreenHelp: [S.LoadingScreenHelp],
    LoadingBars: [S.LoadingBar],
    UnitKillRank: [S.UnitKillRank],
    AlertPanMaxDuration: C.Real32,
    AlertPanMinDuration: C.Real32,
    AlertPanMaxVelocity: C.Real32,
    BeaconMinimapIcon: A.Image,
    BeaconMinimapRenderPriority: C.ActorKey,
    AchievementTags: [C.FourCC],
    GameCategories: [S.GameCategory],
    AutoVariantArcade: S.DefaultGameVariant,
    AutoVariantMelee: S.DefaultGameVariant,
    DefaultVariants: [S.DefaultGameVariant],
    DefaultUIRace: L.Race,
    ObserverSoundtrack: L.Soundtrack,
    UseMaxCooldown: C.Bit,
    CooldownDurationPrecision: C.UInt8,
    MinCooldownDisplayDuration: C.GameTime,
    MinTimeDisplayDuration: C.GameTime,
    TutorialArray: [S.TutorialConfig],
    HotkeyInfoArray: [S.HotkeyInfo],
    FontStyleFileArray: [A.FontStyle],
    CustomLayoutFileArray: [A.Layout],
    ResourceArray: [S.ResourceUI,E.ResourceType],
    TrialAllowedSinglePlayerMaps: [A.Map],
    CommandHotkeyRepeatIgnored: C.Bit,
    AllowReturnToGameplayWhenDefeated: C.Bit,
    ActivateLobbyChatOnJoin: C.Bit,
    CameraEventThresholdDistance: C.Real,
    CameraEventThresholdPitch: C.Fangle,
    CameraEventThresholdYaw: C.Fangle,
    CameraEventThresholdTarget: C.Real,
    HelpControlCategories: [S.HelpControlCategoryInfo],
    HelpControls: [S.HelpControlInfo],
    HelpGameMechanics: [S.HelpGameMechanicInfo],
    HelpTechTitle: L.String,
    HelpHiddenInGlue: C.Bit,
    HelpTechTreeSuffix: C.String,
    AltSoundtrack: [S.AltSoundtrack],
    DefaultObservedPlayerId: T.PlayerId,
    SuppressSkinsForParticipants: C.Bit,
    SuppressSkinsInReplay: C.Bit,
    MapMechanicScoreValue: L.ScoreValue,
    TargetModeValidation: E.TargetModeValidation,
    QuickCastMode: E.QuickCastMode,
    CutsceneThemeChoiceArray: [L.String],
    CutsceneAssetPath: [S.CutsceneAssetPath],
    CutsceneLatest: E.GlueTheme,
}

const CHerd = {
    ...CData,
    ClosestTo: E.HerdClosestTo,
    PositionBias: C.Real32,
    NodeSearchRadius: C.Real32,
    Levels: [S.HerdLevel],
    Nodes: [S.HerdNode],
    SpeedLimit: C.Range,
}

const CHerdNode = {
    ...CData,
}

const CHero = {
    ...CData,
    Name: L.String,
    StoreName: L.String,
    AttributeId: C.FourCC,
    Flags: F.Hero,
    Model: L.Model,
    DisplayModel: [L.Model],
    Level: C.UInt32,
    State: E.HeroState,
    AbilCategoryArray: [S.HeroAbilCategory],
    StatArray: [L.HeroStat],
    UserReference: C.UserReference,
    Unit: L.Unit,
    AlternateUnitArray: [L.Unit],
    Role: E.HeroRole,
    Melee: C.Bit,
    Description: L.String,
    InfoText: L.String,
    Title: L.String,
    Portrait: A.Image,
    SelectScreenButtonImage: A.Image,
    PartyPanelButtonImage: A.Image,
    LeaderboardImage: A.Image,
    ScoreScreenImage: A.Image,
    DraftScreenLargeImage: A.Image,
    DraftScreenLargeImageBackground: A.Image,
    DraftScreenPortrait: A.Image,
    DraftScreenPortraitBackground: A.Image,
    ImageFacing: E.HeroImageFacing,
    IntroCutsceneSize: E.HeroCutsceneSize,
    PassiveButton: L.Button,
    PassiveAbil: L.Abil,
    HeroAbilArray: [S.HeroAbil],
    HeroicAbilArray: [S.HeroHeroicAbility],
    SkinArray: [L.Skin],
    DefaultMount: L.Mount,
    VOArray: [L.Sound],
    SpecificKillVOArray: [S.HeroSpecificVO],
    RequiredRewardArray: [L.Reward],
    CanPurchaseUltimateSkinRewardArray: [L.Reward],
    TalentProfileArray: [L.TalentProfile],
    TalentTreeArray: [S.HeroTalentTree],
    TalentTierArray: [S.HeroTalentTier],
    SkinVariationRequiredReward: [L.Reward],
    MountVariationRequiredReward: [L.Reward],
    HeroSelectCutsceneFile: A.Cutscene,
    ScoreScreenCutsceneFile: A.Cutscene,
    MiniPortraitCutsceneFile: A.Cutscene,
    InGameUnitStatusCutsceneFile: A.Cutscene,
    VariationIcon: A.Image,
    Difficulty: E.HeroDifficulty,
    SpecificIntroVOArray: [S.HeroSpecificIntroVO],
    HeroTierAchievementId: C.UInt,
    CollectionIcon: A.Image,
    Gender: E.HeroGender,
    Universe: E.HeroUniverse,
    UniverseIcon: A.Image,
    ProductId: T.BattleProductId,
    PreviewCutsceneFile: A.Cutscene,
    TileCutsceneFile: A.Cutscene,
    LevelScalingArray: [S.HeroLevelScaling],
    AdditionalSearchText: L.String,
    VariationArray: [L.Skin],
    ReleaseDate: S.ProductReleaseDate,
    HyperlinkId: T.HyperlinkId,
    AllowedMountCategoryArray: [T.MountCategory],
    Ratings: S.HeroRatings,
    HomeScreenCutsceneFile: A.Cutscene,
    TalentAIBuildsArray: [S.HeroAITalentBuild],
    LayoutFile: A.Layout,
    HeroSpecificUIArray: [S.HeroSpecificUI],
    PurchaseWarning: L.String,
    PurchaseWarningCondition: E.PurchaseWarningCondition,
}

const CHeroAbil = {
    ...CData,
    Name: L.String,
    Icon: A.Image,
    Description: L.String,
    Tooltip: L.String,
    Image: A.Image,
    Movie: A.Movie,
    RequiredLevel: C.UInt32,
    RequiredMission: L.Map,
    State: E.HeroAbilState,
    UpgradeArray: [L.Upgrade],
    LevelUpgradeArray: [L.Upgrade],
    AbilCommandArray: [L.AbilCommand],
    StatModifierArray: [S.HeroStatModifier],
    UserReference: C.UserReference,
}

const CHeroStat = {
    ...CData,
    Name: L.String,
    Value: C.Int32,
    UserReference: C.UserReference,
}


const CItem = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
}

const CItemAbil = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
    Abil: L.Abil,
    ToggledFace: L.Button,
    AbilFlags: F.Unknown,
}

const CItemAbilPowerUp = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
    Abil: L.Abil,
    ToggledFace: L.Button,
    AbilFlags: F.Unknown,
    CasterFilters: C.TargetFilters,
    KillAfterUse: C.Bit,
}

const CItemEffect = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
    Effect: L.Effect,
    EffectCost: S.Cost,
    EffectFlags: F.Unknown,
    RefundFraction: SCostFactor,
    TargetFilters: C.TargetFilters,
    Range: C.Real,
}

const CItemEffectInstant = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
    Effect: L.Effect,
    EffectCost: S.Cost,
    EffectFlags: F.Unknown,
    RefundFraction: SCostFactor,
    TargetFilters: C.TargetFilters,
    Range: C.Real,
}

const CItemEffectTarget = {
    ...CData,
    Face: L.Button,
    Flags: F.Unknown,
    Class: L.ItemClass,
    Container: L.ItemContainer,
    Level: C.UInt32,
    Charge: S.Charge,
    GroupCooldownLink: T.CooldownLink,
    Requirements: L.Requirement,
    CarryBehaviorArray: [L.Behavior],
    CarryWeaponArray: [S.UnitWeaponData],
    EquipBehaviorArray: [L.Behavior],
    EquipWeaponArray: [S.UnitWeaponData],
    Effect: L.Effect,
    EffectCost: S.Cost,
    EffectFlags: F.Unknown,
    RefundFraction: SCostFactor,
    TargetFilters: C.TargetFilters,
    Range: C.Real,
}

const CItemClass = {
    ...CData,
    Name: L.String,
}

const CItemContainer = {
    ...CData,
    Model: L.Model,
    ModelHeight: C.UInt32,
    ModelWidth: C.UInt32,
    Slots: [S.ItemContainerSlot],
}

const CKinetic = {
    ...CData,
    Name: L.String,
    ValidatorArray: [L.Validator],
    EditorCategories: T.EditorCategories,
    Chance: C.Real,
    Cycles: C.UInt32,
    Duration: C.GameTime,
}

const CKineticFollow = {
    ...CKinetic,
    Where: S.EffectWhichLocation,
    Follow: E.KineticFollow,
}

const CKineticRotate = {
    ...CKinetic,
    Around: S.EffectWhichLocation,
    Pitch: C.VariatorGameFangle,
    Roll: C.VariatorGameFangle,
    Yaw: C.VariatorGameFangle,
}

const CKineticSequence = {
    ...CKinetic,
    Kinetiarray: [L.Kinetic],
}

const CKineticSet = {
    ...CKinetic,
    Kinetiarray: [L.Kinetic],
}

const CKineticTranslate = {
    ...CKinetic,
    XOffset: C.VariatorGameFixed,
    YOffset: C.VariatorGameFixed,
    ZOffset: C.VariatorGameFixed,
}

const CKineticDistance = {
    ...CKinetic,
    DistanceAwayFrom: S.EffectWhichLocation,
    Distance: S.AccumulatedFixed,
}

const CLensFlareSet = {
    ...CData,
    Flare: [S.FlareInfo],
}

const CLight = {
    ...CData,
    TimePerDay: C.TimeOfDay,
    TimePerLoop: C.TimeOfDay,
    TimeStart: C.TimeOfDay,
    TimeEventArray: [S.TimeEvent],
    ToDInfoArray: [S.LightInfo],
    EditorCategories: T.EditorCategories,
    AmbientEnvironmentMap: A.Image,
    LightingRegionMap: A.Image,
}

const CLocation = {
    ...CData,
    Name: L.String,
    Description: L.String,
    Movie: A.Movie,
    MissionTitle: L.String,
    MissionText: L.String,
    PlanetToolTip: L.String,
    PrimaryObjectiveTitle: L.String,
    PrimaryObjectiveText: L.String,
    SecondaryObjectiveTitle: L.String,
    SecondaryObjectiveText: L.String,
    RewardTitle: L.String,
    RewardText: L.String,
    BonusTitle: L.String,
    BonusText: L.String,
    ContactName: L.String,
    ContactModel: L.Model,
    ContactActor: L.Actor,
    PlanetModel: L.Model,
    BackgroundModel: L.Model,
    BackgroundImage: A.Image,
    MissionCategoryArray: [S.MissionCategory],
    AmbientSound: L.Soundtrack,
    UserReference: C.UserReference,
}

const CLoot = {
    ...CData,
    ValidatorArray: [L.Validator],
}

const CLootSpawn = {
    ...CLoot,
    SpawnLocation: E.EffectLocation,
    SpawnOwner: E.EffectPlayer,
    SpawnRange: C.Real,
}

const CLootEffect = {
    ...CLoot,
    Effect: L.Effect,
}

const CLootItem = {
    ...CLoot,
    SpawnLocation: E.EffectLocation,
    SpawnOwner: E.EffectPlayer,
    SpawnRange: C.Real,
    ClassArray: [L.ItemClass],
    MaxLevel: C.UInt32,
    MinLevel: C.UInt32,
}

const CLootSet = {
    ...CLoot,
    MinCount: C.UInt32,
    MaxCount: C.UInt32,
    ChildArray: [S.LootChoice],
}

const CLootUnit = {
    ...CLoot,
    SpawnLocation: E.EffectLocation,
    SpawnOwner: E.EffectPlayer,
    SpawnRange: C.Real,
    Unit: L.Unit,
}

const CMap = {
    ...CData,
    Name: L.String,
    File: A.Map,
    Kind: E.MapKind,
    Description: L.String,
    MissionTitle: L.String,
    MissionText: L.String,
    MissionBackgroundImage: A.Image,
    PrimaryObjectiveTitle: L.String,
    PrimaryObjectiveText: L.String,
    PrimaryObjectiveTooltip: L.String,
    SecondaryObjectiveTitle: L.String,
    SecondaryObjectiveText: L.String,
    SecondaryObjectiveTooltip: L.String,
    RewardTitle: L.String,
    RewardText: L.String,
    RewardTooltip: L.String,
    ResearchTitle: L.String,
    ResearchText: L.String,
    ResearchTooltip: L.String,
    BonusTitle: L.String,
    BonusText: L.String,
    BonusTooltip: L.String,
    TechnologyTitle: L.String,
    TechnologyNameText: L.String,
    TechnologyDescriptionText: L.String,
    TechnologyTooltip: L.String,
    TechnologyUnitLink: L.Unit,
    ContactTitle: L.String,
    ContactNameText: L.String,
    ContactModelLink: L.Model,
    ContactTooltip: L.String,
    ContactActor: L.Actor,
    LoadingImage: A.Image,
    LoadingTitle: L.String,
    LoadingSubtitle: L.String,
    LoadingBody: L.String,
    LoadingHelp: L.String,
    LoadingHelpRestart: L.String,
    LoadingHelpAlternate: L.String,
    LoadingTextOffset: C.Vector2i,
    LoadingTextWidth: C.UInt32,
    LoadingTextHeight: C.UInt32,
    LoadingTextStyle: C.StyleName,
    ArmyCategory: L.ArmyCategory,
    Location: L.Location,
    ObjectiveArray: [L.Objective],
    Summary: L.String,
    UserReference: C.UserReference,
}

const CModel = {
    ...CData,
    Model: A.Model,
    LowQualityModel: L.Model,
    RequiredAnims: [A.Anims],
    OptionalAnims: [A.Anims],
    RequiredAnimsEx: [S.AnimFile],
    AnimAliases: [S.AnimAlias],
    AnimBlendTime: C.Real32,
    AnimSpeed: C.Real32,
    AttachProps: [S.AttachProps],
    EditorCategories: T.EditorCategories,
    Events: [S.ModelDataEvent],
    FacialController: A.Facial,
    Flags: F.Unknown,
    FuzzyGeometryPadding: C.Real32,
    Image: A.Image,
    Lighting: L.Light,
    Occlusion: E.Occlusion,
    OccludingOpacity: C.Real32,
    PausedParticleSystemBehavior: E.PausedParticleSystemBehavior,
    PhysicsMaterialMappings: [S.PhysicsMaterialMapping],
    PhysicsMaterialOverride: L.PhysicsMaterial,
    PhysicsGravityFactor: C.Real32,
    PhysicsForceFactor: C.Real32,
    PhysicsDeathMotionFactor: C.VariatorActorReal32,
    PlanetPanelCamera: C.String,
    Priority: C.UInt8,
    Radius: C.Real32,
    RadiusLoose: C.Real32,
    Quality: C.UInt32,
    PortraitOffset: C.Vector3,
    ScaleMax: C.Vector3,
    ScaleMin: C.Vector3,
    SelectionLayer: C.UInt32,
    SelectionOffset: C.Vector3,
    SelectionRadius: C.Real32,
    ShadowRadius: C.Real32,
    SquibTypeDefault: E.SquibType,
    TechPurchaseCamera: C.String,
    TechPurchaseSpeed: C.Real32,
    Tipability: C.Real32,
    TipabilityLength: C.Real32,
    TipabilityWidth: C.Real32,
    TipabilityBlendRate: C.ActorAngle,
    TipabilityPitchMax: C.ActorAngle,
    TipabilityRollMax: C.ActorAngle,
    BoundingBoxPadding: C.Vector3,
    TextureAppliedGroups: C.TextureProps,
    TextureDeclares: [S.TextureDeclare],
    TextureInfos: [S.TextureInfo],
    TextureExpressionsForEditor: [S.TextureExpressionSpec],
    TextureMatchesForEditor: [S.TextureMatchSpec],
    UnitGlossaryCamera: C.String,
    UnitGlossaryVariation: C.UInt8,
    UnitGlossaryTeamColorIndex: C.UInt32,
    VariationCount: C.UInt32,
    Variations: [S.ModelVariation],
    WalkAnimMoveSpeed: C.GameRate,
    RunAnimMoveSpeed: C.GameRate,
    RunAnimMoveSpeedThreshold: C.GameRate,
}

const CModelFoliage = {
    ...CModel,
    Layer: E.FoliageLayer,
    SpringDampening: C.Real32,
    SpringStrength: C.Real32,
    DragCoefficient: C.Real32,
    WindInfluence: C.Real32,
    ForceNormalsUp: C.Bit,
    RandomDeviation: C.Real32,
    Flexibility: C.Real32,
}

const CMount = {
    ...CData,
    Name: L.String,
    InfoText: L.String,
    AttributeId: C.FourCC,
    Flags: F.Mount,
    Model: L.Model,
    Attached: C.Bit,
    RequiredRewardArray: [L.Reward],
    VOArray: [L.Sound],
    VariationIcon: A.Image,
    VariationArray: [L.Mount],
    MountCategory: T.MountCategory,
}

const CMover = {
    ...CData,
    Flags: F.Unknown,
    HeightMap: E.HeightMap,
    PathMode: E.PathMode,
    PlacementArray: [S.PathingData],
    RestoreHeightDuration: C.GameTime,
}

const CMoverAvoid = {
    ...CMover,
}

const CMoverFlock = {
    ...CMover,
}

const CMoverMissile = {
    ...CMover,
    MotionPhases: [S.MotionPhase],
    MotionOverlays: [S.MotionOverlay],
    RotationIgnoredByUnit: C.Bit,
    RespectUnitHeightAtDestination: C.Bit,
}

const CMoverNull = {
    ...CMover,
}

const CObjective = {
    ...CData,
    Name: L.String,
    Description: L.String,
    Type: E.ObjectiveType,
    RequiredCount: C.Int32,
    RewardArray: [C.Int32],
    UserReference: C.UserReference,
}

const CPhysicsMaterial = {
    ...CData,
    Density: C.Real32,
    Friction: C.Real32,
    Restitution: C.Real32,
    LinearDamping: C.Real32,
    AngularDamping: C.Real32,
}

const CPing = {
    ...CData,
    Model: L.Model,
    Sound: L.Sound,
    ActorSound: L.Actor,
    Color: C.Color,
    Duration: C.Real,
    Scale: C.Real,
    Rotation: C.Real,
    Tooltip: L.String,
    Flags: F.Ping,
}


const CPlayerResponse = {
    ...CData,
    EditorCategories: T.EditorCategories,
    Priority: C.UInt32,
    Location: E.DamageLocation,
}

const CPlayerResponseUnit = {
    ...CPlayerResponse,
    Chance: C.Real,
    Cost: S.Cost,
    Handled: L.Effect,
    CasterFilters: C.TargetFilters,
    TargetFilters: C.TargetFilters,
    ValidatorArray: [L.Validator],
    ContinueMethod: E.ResponseContinueMethod,
    ProvideCategories: F.DamageResponseCategory,
    PreventCategories: F.DamageResponseCategory,
}

const CPlayerResponseUnitDamage = {
    ...CPlayerResponseUnit,
    DeathType: F.DeathType,
    ClampMaximum: C.Real,
    ClampMinimum: C.Real,
    Exhausted: L.Effect,
    Evade: C.Bit,
    Fatal: C.Bit,
    Ignore: [C.Real],
    Kind: F.DamageKind,
    Maximum: C.Real,
    Minimum: C.Real,
    ModifyAmount: C.Real,
    ModifyFraction: C.Real,
    ModifyLimit: C.Real,
    ModifyLimitVitalMaxFractionArray: [C.Real,E.UnitVital],
    ModifyMinimumDamage: C.Bit,
    RequireEffectArray: [L.Effect],
    ExcludeEffectArray: [L.Effect],
    RequireEffectInChainArray: [L.Effect],
    ExcludeEffectInChainArray: [L.Effect],
    DamageValue: E.DamageResponseDamageValue,
    ModifyScoreArray: [S.ScoreValueUpdate],
}

const CPlayerResponseUnitDeath = {
    ...CPlayerResponseUnit,
    DeathType: F.DeathType,
}

const CPlayerResponseUnitBirth = {
    ...CPlayerResponseUnit,
    BirthType: F.ResponseUnitBirthType,
}


const CPortraitPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    Description: L.String,
    Image: S.TextureSheetEntry,
    ProductId: T.BattleProductId,
    ReleaseDate: S.ProductReleaseDate,
    PortraitArray: [L.Reward],
    StoreTypeName: L.String,
}

const CPreload = {
    ...CData,
    NormalConditions: [L.BankCondition],
    NormalTiming: E.PreloadTiming,
    QueuedConditions: [L.BankCondition],
    Flags: F.Unknown,
}

const CPreloadAsset = {
    ...CPreload,
    File: A.File,
}

const CPreloadScene = {
    ...CPreload,
    File: A.Cutscene,
    Filter: C.String,
}

const CPreloadActor = {
    ...CPreload,
    Link: L.Actor,
}

const CPreloadConversation = {
    ...CPreload,
    Link: L.Conversation,
}

const CPreloadModel = {
    ...CPreload,
    Link: L.Model,
    Variations: C.String,
    ModelFlags: F.Unknown,
}

const CPreloadSound = {
    ...CPreload,
    Link: L.Sound,
    Variations: C.String,
}

const CPreloadUnit = {
    ...CPreload,
    Link: L.Unit,
}

const CPremiumMap = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    StoreTypeName: L.String,
    ReleaseDate: S.ProductReleaseDate,
    HyperlinkId: T.ProductHyperlinkId,
    ProductId: T.BattleProductId,
    LicenseId: C.UInt32,
    Price: L.String,
    ScreenShotImageArray: [A.Image],
    ScreenShotDescriptionArray: [L.String],
    Movie: A.Movie,
    MoviePreviewImage: A.Image,
    MovieDescription: L.String,
    Description: L.String,
    Title: L.String,
    PayToPlay: C.Bit,
    SuppressedRegion: C.FourCC,
    ShortDescription: L.String,
    LanguageWarning: L.String,
    ScreenShotImageThumbnailArray: [A.Image],
    MovieImageThumbnail: A.Image,
    CustomFeaturedDescription: L.String,
}

const CRace = {
    ...CData,
    Name: L.String,
    AttributeId: C.FourCC,
    Icon: A.Image,
    RaceIcon: A.Image,
    StartLocationAlert: L.Alert,
    GameMusic: L.Soundtrack,
    Flags: F.Unknown,
    ShowResource: F.ResourceType,
    StartingUnitArray: [S.StartingUnit],
    StartingResource: [C.UInt32,E.ResourceType],
    FoodCeiling: C.UInt32,
    UpkeepTax: [S.UpkeepTax],
    GlossaryTeamColorIndex: C.UInt32,
    MiniMapBorderColor: C.Color,
    PlacementGridColorBlindColor: C.Color,
    VictorySound: L.Sound,
    DefeatSound: L.Sound,
    ExpansionOrder: C.UInt32,
    LevelAchievementId: C.UInt,
    DefaultConsoleSkin: L.ConsoleSkin,
}

const CRaceBannerPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    Description: L.String,
    Image: S.TextureSheetEntry,
    ProductId: T.BattleProductId,
    ReleaseDate: S.ProductReleaseDate,
    RaceBannerArray: [L.Reward],
    StoreTypeName: L.String,
}

const CRequirement = {
    ...CData,
    EditorCategories: T.EditorCategories,
    CanBeSuppressed: F.Requirement,
    NodeArray: [S.RequirementNode],
}

const CRequirementNode = {
    ...CData,
    Flags: F.Unknown,
    Tooltip: L.String,
}

const CRequirementGT = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementLT = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementGTE = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementLTE = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementEq = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementNE = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementAnd = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementOr = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementXor = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementNot = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementOdd = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementDiv = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementMod = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementMul = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementSum = {
    ...CRequirementNode,
    OperandArray: [L.RequirementNode],
}

const CRequirementConst = {
    ...CRequirementNode,
    Value: C.Int32,
}

const CRequirementAllowAbil = {
    ...CRequirementNode,
    Link: L.Abil,
    Index: C.UInt32,
}

const CRequirementAllowBehavior = {
    ...CRequirementNode,
    Link: L.Behavior,
}

const CRequirementAllowUnit = {
    ...CRequirementNode,
    Link: L.Unit,
}

const CRequirementAllowUpgrade = {
    ...CRequirementNode,
    Link: L.Upgrade,
}

const CRequirementCountAbil = {
    ...CRequirementNode,
    Count: S.RequirementCount,
}

const CRequirementCountBehavior = {
    ...CRequirementNode,
    Count: S.RequirementCount,
}

const CRequirementCountEffect = {
    ...CRequirementNode,
    Count: S.RequirementCount,
}

const CRequirementCountUnit = {
    ...CRequirementNode,
    Count: S.RequirementCount,
}

const CRequirementCountUpgrade = {
    ...CRequirementNode,
    Count: S.RequirementCount,
}

const CReverb = {
    ...CData,
    Room: C.Int32,
    RoomHF: C.Int32,
    RoomLF: C.Int32,
    DecayTime: C.Real32,
    DecayHFRatio: C.Real32,
    Reflections: C.Int32,
    ReflectionsDelay: C.Real32,
    Reverb: C.Int32,
    ReverbDelay: C.Real32,
    HFReference: C.Real32,
    LFReference: C.Real32,
    RoomRolloffFactor: C.Real32,
    Diffusion: C.Real32,
    Density: C.Real32,
    SpeakerMix: [C.Real32],
}

const CReward = {
    ...CData,
    Category: S.RewardCategory,
    Flags: F.Reward,
    Name: L.String,
    Description: L.String,
    DescriptionUnearned: L.String,
    IconFile: A.Image,
    IconCols: C.UInt32,
    IconRows: C.UInt32,
    IconSlot: C.UInt32,
    IgnorePlayerRace: C.Bit,
    Race: L.Race,
    Hero: L.Hero,
    License: T.BattleLicenseName,
    Upgrades: [L.Upgrade],
    Skin: L.Skin,
    UIOrderHint: C.UInt32,
    LargeImage: A.Image,
    RewardSpecificUIArray: [S.RewardSpecificUI],
    ParentBundle: L.Bundle,
}

const CRewardDecal = {
    ...CReward,
    DecalPack: L.DecalPack,
    Texture: L.Texture,
    Spray: L.Spray,
}

const CRewardIcon = {
    ...CReward,
}

const CRewardModel = {
    ...CReward,
    Model: L.Model,
}

const CRewardPortrait = {
    ...CReward,
    Model: L.Model,
    PortraitPack: L.PortraitPack,
}

const CRewardBadge = {
    ...CReward,
    Texture: L.Texture,
}

const CRewardPoints = {
    ...CReward,
    Points: C.UInt32,
}

const CRewardTrophy = {
    ...CReward,
    Trophy: L.Trophy,
}

const CRewardEmoticon = {
    ...CReward,
    Emoticon: L.Emoticon,
}

const CRewardVoicePack = {
    ...CReward,
    VoicePack: L.VoicePack,
    ReplacementArray: [S.GameReplacement],
}

const CRewardPortraitInGame = {
    ...CReward,
    Enabled: C.Bit,
}

const CRewardConsoleSkin = {
    ...CReward,
    ConsoleSkin: L.ConsoleSkin,
}

const CRewardSpray = {
    ...CReward,
    Texture: L.Texture,
    Spray: L.Spray,
}

const CRewardSprayUseDecal = {
    ...CReward,
    Enabled: C.Bit,
}

const CRewardRaceBanner = {
    ...CReward,
    RaceBannerPack: L.RaceBannerPack,
    Image1v1: A.Image,
    Image2v2: A.Image,
    Image3v3: A.Image,
    Image4v4: A.Image,
}

const CRewardStim = {
    ...CReward,
    StimPack: L.StimPack,
    Texture: L.Texture,
}

const CScoreResult = {
    ...CData,
    Name: L.String,
    PublishName: L.String,
    Tooltip: L.String,
    Icon: A.Image,
    Flags: F.ScoreResult,
    SortValue: C.Int32,
}

const CScoreResultRoot = {
    ...CScoreResult,
    HeaderTable: [L.ScoreResult],
}

const CScoreResultScore = {
    ...CScoreResult,
    ValueTable: [L.ScoreValue],
}

const CScoreResultGraph = {
    ...CScoreResult,
    ValueTable: [L.ScoreValue],
}

const CScoreResultPane = {
    ...CScoreResult,
    ValueTable: [L.ScoreValue],
}

const CScoreResultBuildOrder = {
    ...CScoreResult,
}

const CScoreResultCallouts = {
    ...CScoreResult,
}

const CScoreResultExperience = {
    ...CScoreResult,
    ValueTable: [L.ScoreValue],
}

const CScoreResultPerformance = {
    ...CScoreResult,
    ValueTable: [L.ScoreValue],
}

const CScoreValue = {
    ...CData,
    Name: L.String,
    PublishName: L.String,
    Tooltip: L.String,
    Icon: A.Image,
    Flags: F.ScoreValue,
    Sort: E.ScoreSort,
    Report: E.ScoreValueReport,
    UniqueTag: C.FourCC,
}

const CScoreValueCustom = {
    ...CScoreValue,
    Collapse: E.ScoreCollapse,
    Type: E.ScoreValueType,
}

const CScoreValueStandard = {
    ...CScoreValue,
    Value: E.ScoreValue,
}

const CScoreValueConstant = {
    ...CScoreValue,
    Collapse: E.ScoreCollapse,
    Type: E.ScoreValueType,
    Value: C.Real,
}

const CScoreValueCombine = {
    ...CScoreValue,
    Collapse: E.ScoreCollapse,
    Type: E.ScoreValueType,
    Operation: E.ScoreValueOperation,
    ValueTable: [L.ScoreValue],
}

const CShape = {
    ...CData,
    Name: L.String,
    EditorCategories: T.EditorCategories,
}

const CShapeArc = {
    ...CShape,
    Arc: C.FangleArc,
    Radius: C.Real,
}

const CShapeQuad = {
    ...CShape,
    Quad: C.fQuad,
}
const CSkin = {
    ...CData,
    Name: L.String,
    InfoText: L.String,
    AttributeId: C.FourCC,
    ReplacementArray: [S.GameReplacement],
    VariationIcon: A.Image,
    DisplayModel: [L.Model],
    ModelGroups: [S.SkinModelGroup],
    ModelMacroRun: [S.SkinModelMacroRun],
    EffectArray: [S.UpgradeEffect],
    Camera: C.String,
    Rotation: C.Int32,
    WarChestUILight: C.String,
    WarChestDisplayModel: L.Model,
    WarChestDisplayActor: L.Actor,
    CollectionDisplayModel: L.Model,
    CollectionDisplayUnit: L.Unit,
    CollectionDisplayModelAlternate: L.Model,
    CollectionDisplayUnitAlternate: L.Unit,
    CollectionDisplayActor: L.Actor,
    IsDefaultSkin: C.Bit
}

const CSkinPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    EntryArray: [S.SkinPackEntry],
    ReleaseDate: S.ProductReleaseDate,
    StoreTypeName: L.String,
    CollectionId: C.Identifier,
}

const CSound = {
    ...CData,
    EditorCategories: T.EditorCategories,
    AssetArray: [S.SoundAsset],
    AssetArrayTemplate: SSoundAssetTemplate,
    Flags: F.Unknown,
    Category: E.SoundCategory,
    CategoryLocal: E.SoundCategory,
    Chance: C.UInt8,
    ConeAngle: C.Range,
    ConeOrientation: C.Vector3,
    ConeVolume: C.Range,
    DopplerLevel: C.Real32,
    DupeDestroyCount: C.UInt16,
    DupeDestroyCountPerPlayer: C.UInt16,
    DupeFadeBlend: E.SoundBlend,
    DupeFadeIn: [S.VolumeFade],
    DupeFadeOut: [S.VolumeFade],
    DupeHistoryCount: C.UInt16,
    DupeMaximumMethod: E.SoundDupe,
    DupeMuteCount: C.UInt16,
    DupeMuteCountPerPlayer: C.UInt16,
    DupeRepeatCount: C.UInt16,
    DupeThresholdFadeTime: C.UInt32,
    DupeThresholdPoints: [S.VolumeThreshold],
    DupeWait: C.iRange,
    DupePrioritization: E.SoundDupePriority,
    Exclusivity: L.SoundExclusivity,
    FogFadeBlend: E.SoundBlend,
    FogFadeIn: [S.VolumeFade],
    FogFadeOut: [S.VolumeFade],
    HerdNode: L.HerdNode,
    LocaleFlags: S.SoundLocaleFlags,
    LoopCount: C.Int32,
    LoopDelay: C.iRange,
    LowPassGain: C.Real32,
    MixerPriority: C.Int16,
    MixerPriorityNonLocal: C.Int16,
    Mode: E.SoundMode,
    Mute: C.Bit,
    MuteFadeBlend: E.SoundBlend,
    MuteFadeIn: [S.VolumeFade],
    MuteFadeOut: [S.VolumeFade],
    OcclusionDirect: C.Range,
    OcclusionReverb: C.Range,
    OffsetFadeBlend: E.SoundBlend,
    OffsetFadeIn: [S.VolumeFade],
    OffsetFadeOut: [S.VolumeFade],
    OffsetShiftBlend: E.SoundBlend,
    OffsetShiftIn: [S.PitchShift],
    OffsetShiftOut: [S.PitchShift],
    OverlapPitchDelta: C.Real32,
    OverlapTimeDelta: C.UInt16,
    Pan: C.Range,
    PanLevel: C.Real32,
    PanLevelNonLocal: C.Real32,
    Pitch: C.PitchRange,
    PlayDelay: C.iRange,
    PositionRandomOffset: C.Vector3,
    PositionRandomOffsetPower: C.Real32,
    ResourcePriority: C.UInt8,
    ReverbBalance: S.ReverbBalance,
    ReverbRolloffBlend: E.SoundBlend,
    ReverbRolloffPoints: [S.ReverbRolloff],
    Select: E.SoundSelect,
    Solo: C.Bit,
    SpeakerMix: [C.Real32],
    SpeakerMixNonLocal: [C.Real32],
    Spread: C.Real32,
    SustainFadeBlend: E.SoundBlend,
    SustainFade: [S.VolumeFade],
    Timeout: C.UInt32,
    VariationMinimum: C.UInt32,
    Volume: C.VolumeRange,
    VolumeRolloffBlend: E.SoundBlend,
    VolumeRolloffFadeBlend: E.SoundBlend,
    VolumeRolloffFadeIn: [S.VolumeFade],
    VolumeRolloffFadeOut: [S.VolumeFade],
    VolumeRolloffPoints: [S.VolumeRolloff],
    LocalVolumeAdjustment: C.VolumeRange,
    NonLocalVolumeAdjustment: C.VolumeRange,
    CategoryDuckingLocal: L.SoundMixSnapshot,
    CategoryDuckingNonLocal: L.SoundMixSnapshot,
}

const CSoundExclusivity = {
    ...CData,
    Group: C.UInt32,
    Priority: C.Real32,
    CollideWithLower: E.ExclusivityAction,
    CollideWithEqual: E.ExclusivityAction,
    CollideWithHigher: E.ExclusivityAction,
    QCollideWithLower: E.ExclusivityQueueAction,
    QCollideWithEqual: E.ExclusivityQueueAction,
    QCollideWithHigher: E.ExclusivityQueueAction,
    QTimeout: C.UInt32,
    QDelay: C.UInt32,
    InterruptFadeBlend: E.SoundBlend,
    InterruptFade: [S.VolumeFade],
    InterruptDelay: C.UInt32,
    Flags: F.Unknown,
    SuppressGroups: [C.UInt32],
    DupeWait: C.UInt32,
}

const CSoundMixSnapshot = {
    ...CData,
    Attack: C.UInt32,
    Hold: C.UInt32,
    Release: C.UInt32,
    Flags: F.Unknown,
    MixGlobal: [C.Volume],
    MixNonLocal: [C.Volume],
}

const CSoundtrack = {
    ...CData,
    CueArray: [S.SoundtrackCue],
    Delay: C.iRange,
    Flags: F.Unknown,
    Select: E.SoundSelect,
    Next: L.Soundtrack,
}

const CSpray = {
    ...CData,
    Model: L.Model,
    Texture: L.Texture,
    Button: L.Button,
}

const CSprayPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    Description: L.String,
    Image: S.TextureSheetEntry,
    ProductId: T.BattleProductId,
    ReleaseDate: S.ProductReleaseDate,
    SprayArray: [L.Reward],
    StoreTypeName: L.String,
}

const CStimPack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    ProductId: T.BattleProductId,
    StoreTypeName: L.String,
    Duration: C.UInt32,
    ReleaseDate: S.ProductReleaseDate,
}

const CTacCooldown = {
    ...CData,
    UnitLink: L.Unit,
    TacAbilData: [S.TacAbilData],
}

const CTactical = {
    ...CData,
}

const CTacticalOrder = {
    ...CData,
    Abil: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    Marker: S.Marker,
    Retreat: C.Bit,
    TargetFind: L.TargetFind,
    Validator: L.Validator,
}

const CTacticalSet = {
    ...CData,
    Array: [L.Tactical],
}

const CTalent = {
    ...CData,
    Face: L.Button,
    Abil: L.Abil,
    RankArray: [S.TalentRank],
    AbilityModificationArray: [S.TalentAbilityModification],
    Active: C.Bit,
    Trait: C.Bit,
}

const CTalentProfile = {
    ...CData,
    Name: L.String,
    Talents: [L.Talent],
    Flags: F.TalentProfile,
}

const CTargetFind = {
    ...CData,
    Flags: F.TargetFind,
    TargetFilters: C.TargetFilters,
    CasterValidator: L.Validator,
    TargetValidator: L.Validator,
}

const CTargetFindBestPoint = {
    ...CTargetFind,
    DamageBase: C.Real,
    Effect: L.Effect,
    MinCount: C.UInt32,
    MinScore: C.Real,
    BonusAttri: E.UnitAttribute,
}

const CTargetFindWorkerRallyPoint = {
    ...CTargetFind,
    CommandIndex: C.UInt32,
}

const CTargetFindRallyPoint = {
    ...CTargetFind,
    CommandIndex: C.UInt32,
}

const CTargetFindEnumArea = {
    ...CTargetFind,
    LaunchLocation: S.EffectWhichLocation,
    ImpactLocation: S.EffectWhichLocation,
    ExcludeArray: [S.EffectWhichUnit],
    IncludeArray: [S.EffectWhichUnit],
    SearchFilters: C.TargetFilters,
    MinCountError: C.CmdResult,
    MinCount: C.UInt32,
    MaxCount: S.AccumulatedUInt32,
    RecycleCount: C.UInt32,
    SearchFlags: F.Unknown,
    AreaArray: [S.TargetFindEnumArea],
    Abil: L.Abil,
    ExtendRadius: C.Real,
    TargetSorts: S.TargetSorts,
}

const CTargetFindEffect = {
    ...CTargetFind,
    Effect: L.Effect,
    ExtendRadius: C.Real,
    TargetSorts: S.TargetSorts,
}

const CTargetFindLastAttacker = {
    ...CTargetFind,
}

const CTargetFindOffset = {
    ...CTargetFind,
    Angle: C.Fangle,
    Distance: C.fRange,
}

const CTargetFindOrder = {
    ...CTargetFind,
    Abil: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
}

const CTargetFindSet = {
    ...CTargetFind,
    Type: E.TargetFindSet,
    Array: [L.TargetFind],
}

const CTargetSort = {
    ...CData,
    WhichUnit: S.EffectWhichUnit,
    Descending: C.Bit,
}

const CTargetSortAlliance = {
    ...CTargetSort,
    Alliance: E.AllianceId,
    WithPlayer: S.EffectWhichPlayer,
}

const CTargetSortAngle = {
    ...CTargetSort,
    LaunchLocation: S.EffectWhichLocation,
    ImpactLocation: S.EffectWhichLocation,
}

const CTargetSortBehaviorCount = {
    ...CTargetSort,
    Behavior: L.Behavior,
    Value: C.UInt32,
}

const CTargetSortBehaviorDuration = {
    ...CTargetSort,
    Behavior: L.Behavior,
    Value: C.Real,
}

const CTargetSortChargeCount = {
    ...CTargetSort,
    Ability: L.Abil,
    Charge: T.ChargeLink,
    Value: C.Real,
}

const CTargetSortChargeRegen = {
    ...CTargetSort,
    Ability: L.Abil,
    Charge: T.ChargeLink,
    Value: C.Real,
}

const CTargetSortCooldown = {
    ...CTargetSort,
    Ability: L.Abil,
    Cooldown: T.CooldownLink,
    Value: C.Real,
}

const CTargetSortDistance = {
    ...CTargetSort,
    WhichLocation: S.EffectWhichLocation,
}

const CTargetSortField = {
    ...CTargetSort,
    Field: T.CatalogFieldPath,
    Value: C.Identifier,
}

const CTargetSortInterruptible = {
    ...CTargetSort,
    Value: C.Bit,
}

const CTargetSortMarker = {
    ...CTargetSort,
    Value: C.UInt32,
}

const CTargetSortPowerSourceLevel = {
    ...CTargetSort,
    Behavior: L.Behavior,
    Value: C.UInt32,
}

const CTargetSortPowerUserLevel = {
    ...CTargetSort,
    Behavior: L.Behavior,
    Value: C.UInt32,
}

const CTargetSortPriority = {
    ...CTargetSort,
    Value: T.AttackTargetPriority,
}

const CTargetSortRandom = {
    ...CTargetSort,
}

const CTargetSortValidator = {
    ...CTargetSort,
    Validator: L.Validator,
}

const CTargetSortVeterancy = {
    ...CTargetSort,
    Behavior: L.Behavior,
    Value: C.UInt32,
}

const CTargetSortVital = {
    ...CTargetSort,
    Value: C.Real,
    Vital: E.UnitVital,
}

const CTargetSortVitalFraction = {
    ...CTargetSort,
    Value: C.Real,
    Vital: E.UnitVital,
}


const CTerrain = {
    ...CData,
    Name: L.String,
    EditorCategories: T.EditorCategories,
    EditorHidden: C.Bit,
    Lighting: L.Light,
    LoadingScreen: A.Image,
    TextureProp: C.TextureProps,
    Camera: L.Camera,
    Ambience: L.Soundtrack,
    DSPArray: [S.DSPArray],
    DSPArrayMasterOutput: [L.DSP],
    ReverbGlobal: L.Reverb,
    ReverbAmbient: L.Reverb,
    SoundDistanceFactor: C.Real32,
    SoundDopplerFactor: C.Real32,
    SoundRolloffFactor: C.Real32,
    TilingFreq: C.Real32,
    POMScale: C.Real32,
    HideLowestLevel: C.Bit,
    MinimapBackgroundColor: C.Color,
    MinimapBrightenFactor: C.Real32,
    BlendTextures: [L.TerrainTex],
    HardTiles: [L.Tile],
    CliffSets: [L.Cliff],
    FixedSkyboxActor: C.ActorCreateKey,
    FixedSkyboxModel: L.Model,
    NonFixedSkyboxActor: C.ActorCreateKey,
    NonFixedSkyboxModel: L.Model,
    EnvironmentMap: A.Image,
    FOWColor: C.Color,
    FOWPlaneEnabled: C.Bit,
    FogEnabled: C.Bit,
    FogColor: C.Color,
    FogDensity: C.Real32,
    FogFalloff: C.Real32,
    FogStartingHeight: C.Real32,
    FogNearPlane: C.Real32,
    FogFarPlane: C.Real32,
    FogDistanceFalloff: C.Real32,
    Gravity: C.Real32,
    PhysicsTimeScale: C.Real32,
    WindAngleHorizontal: C.Real32,
    WindAngleVertical: C.Real32,
    WindSpeed: C.Real32,
    WindTurbulencePower: C.Real32,
    WindTurbulenceSpeed: C.Real32,
    CreepBaseTexture: A.Image,
    CreepBaseSpecularMap: A.Image,
    CreepEdgeNormalMap: A.Image,
    CreepHeightMap: A.Image,
    CreepNoiseMap: A.Image,
    CreepSettingsArray: [S.CreepSettings],
    FoliageSettingsArray: [S.FoliageSimulationConfig],
    HeightFlags: F.Unknown,
    HeightMapEnabled: C.Bit,
    MinimumVisionCliffLevel: C.UInt8,
    RampNoBuild: C.Bit,
}

const CTerrainObject = {
    ...CData,
    Model: A.Model,
    EditorFlags: F.Editor,
    EditorModel: L.Model,
    EditorIcon: A.Image,
    EditorCategories: T.EditorCategories,
    EditorCursorOffset: C.Real,
    TexSets: [L.Terrain],
    Footprint: L.Footprint,
    Radius: C.Real,
    OccludeHeight: C.Real,
    BoostedCliffLevel: T.CliffLevel,
}

const CCliffDoodad = {
    ...CData,
    Model: A.Model,
    EditorFlags: F.Editor,
    EditorModel: L.Model,
    EditorIcon: A.Image,
    EditorCategories: T.EditorCategories,
    EditorCursorOffset: C.Real,
    TexSets: [L.Terrain],
    Footprint: L.Footprint,
    Radius: C.Real,
    OccludeHeight: C.Real,
    BoostedCliffLevel: T.CliffLevel,
    CliffSet: L.Cliff,
    NumCellsDown: C.UInt32,
    NumCellsAcross: C.UInt32,
    HeightCodes: [C.String],
}

const CTerrainTex = {
    ...CData,
    Texture: A.Image,
    Normalmap: A.Image,
    Heightmap: A.Image,
    HeightMapOffset: C.Real32,
    HeightMapScale: C.Real32,
    EditorIcon: A.Image,
    AnimRate: C.Vector2f,
    DoodadEntry: [S.TerrainDoodad],
    PhysicsMaterial: L.PhysicsMaterial,
}

const CTexture = {
    ...CData,
    File: A.Image,
    Prefix: C.Identifier,
    Slot: C.TextureSlot,
    PropsAdd: C.TextureProps,
    PropsRemove: C.TextureProps,
    PropsSet: C.TextureProps,
    MovieSoundSettings: L.Sound,
    MovieSoundSettings5dot1: L.Sound,
    MovieSoundSettingsStereo: L.Sound,
    Flags: F.Unknown,
}

const CTextureSheet = {
    ...CData,
    Image: A.Image,
    Rows: C.UInt32,
    Columns: C.UInt32,
}

const CTile = {
    ...CData,
    Material: A.Image,
    EditorIcon: A.Image,
    Flags: F.Unknown,
    TesselationDistance: C.Real32,
    TileWidthDistance: C.Real32,
    TileHeightRepetitions: C.UInt32,
    CapLength: C.Real32,
    DefaultSplineWidth: C.Real32,
    DefaultWingWidth: C.Real32,
}

const CTrophy = {
    ...CData,
    DefinitionId: C.UInt32,
    TopCutsceneFilter: C.String,
    BottomCutsceneFilter: C.String,
    CutsceneFile: A.Cutscene,
    GameModel: L.Model,
    Skin: L.Skin,
}

const CTurret = {
    ...CData,
    Idle: E.TurretIdle,
    YawStart: C.Fangle,
    YawArc: C.FangleArc,
    YawRate: C.FangleRate,
    YawIdleRate: C.FangleRate,
    Fidget: S.Fidget,
}

const CUnit = {
    ...CData,
    Name: L.String,
    UserTag: L.String,
    RandomNameArray: [L.String],
    Subtitle: L.String,
    Description: L.String,
    InfoTooltipPriority: C.UInt32,
    DeathTime: C.GameTime,
    DeathRevealFilters: C.TargetFilters,
    DeathRevealRadius: C.Real,
    DeathRevealDuration: C.GameTime,
    DeathRevealType: E.DeathReveal,
    ReviveDelay: C.GameTime,
    ReviveType: L.Unit,
    Facing: C.Facing,
    EditorFacingAlignment: C.Fangle,
    Race: L.Race,
    Mob: E.UnitMob,
    Gender: E.UnitGender,
    FlagArray: F.Unit,
    UserFlagArray: F.UnitUser,
    ResourceState: E.ResourceState,
    ResourceType: E.ResourceType,
    ResourceDropOff: F.ResourceType,
    FogVisibility: E.FogVisibility,
    EditorFlags: F.Editor,
    PlaneArray: F.Plane,
    PushPriority: C.Real,
    Collide: [C.Bit,E.UnitCollide],
    DefaultAcquireLevel: E.AcquireLevel,
    Response: E.UnitResponse,
    Attributes: F.UnitAttribute,
    Level: C.UInt32,
    ArmorType: E.ArmorType,
    LifeStart: C.Real,
    LifeMax: C.Real,
    LifeArmor: C.Real,
    LifeArmorFormula: S.UnitArmorFormula,
    LifeArmorDisplayFlags: F.EquipmentDisplay,
    LifeRegenDelay: C.GameTime,
    LifeRegenRate: C.GameRate,
    LifeRegenRateCreep: C.GameRate,
    LifeRegenRateNight: C.GameRate,
    LifeArmorName: L.String,
    LifeArmorTip: L.String,
    LifeArmorLevel: C.UInt32,
    LifeDamageGain: [C.Real],
    LifeDamageLeech: [C.Real],
    EnergyStart: C.Real,
    EnergyMax: C.Real,
    EnergyArmor: C.Real,
    EnergyArmorFormula: S.UnitArmorFormula,
    EnergyRegenDelay: C.GameTime,
    EnergyRegenRate: C.GameRate,
    EnergyRegenRateCreep: C.GameRate,
    EnergyRegenRateNight: C.GameRate,
    EnergyDamageGain: [C.Real],
    EnergyDamageLeech: [C.Real],
    EnergyDamageRatio: C.Real,
    ShieldsStart: C.Real,
    ShieldsMax: C.Real,
    ShieldArmor: C.Real,
    ShieldArmorFormula: S.UnitArmorFormula,
    ShieldArmorDisplayFlags: F.EquipmentDisplay,
    ShieldRegenDelay: C.GameTime,
    ShieldRegenRate: C.GameRate,
    ShieldRegenRateCreep: C.GameRate,
    ShieldRegenRateNight: C.GameRate,
    ShieldArmorName: L.String,
    ShieldArmorTip: L.String,
    ShieldArmorLevel: C.UInt32,
    ShieldDamageGain: [C.Real],
    ShieldDamageLeech: [C.Real],
    ShieldDamageRatio: C.Real,
    ResourceDamageLeech: [S.UnitResourceRatio,E.DamageKind],
    ResourceDamageLeechFilters: C.TargetFilters,
    VitalBonusDensity: [C.Real,E.UnitVital],
    VitalMultiplierDensity: [C.Real,E.UnitVital],
    Mover: L.Mover,
    Speed: C.GameSpeed,
    SpeedDisplayFlags: F.EquipmentDisplay,
    SpeedBonusCreep: C.GameSpeed,
    SpeedMultiplierCreep: C.Real,
    SpeedMaximum: C.GameSpeed,
    SpeedMinimum: C.GameSpeed,
    AttackSpeedMultiplierCreep: C.Real,
    Acceleration: C.GameAcceleration,
    Deceleration: C.GameAcceleration,
    LateralAcceleration: C.GameAcceleration,
    StationaryTurningRate: C.FangleRate,
    TurningRate: C.FangleRate,
    Sight: C.Real,
    SightBonus: [C.Real],
    Height: C.Real,
    VisionHeight: C.Real,
    OccludeHeight: C.Real,
    BoostedCliffLevel: T.CliffLevel,
    BoostedHeight: [C.Real],
    Food: C.Real,
    CostCategory: E.CostCategory,
    CostResource: [C.Int32,E.ResourceType],
    StockCharge: S.StockCharge,
    PawnItemReduction: C.Real,
    BuildTime: C.GameTime,
    RepairTime: C.GameTime,
    ReviveTime: C.GameTime,
    AttackTargetPriority: T.AttackTargetPriority,
    AIOverideTargetPriority: T.AttackTargetPriority,
    DamageDealtXP: C.UInt32,
    DamageTakenXP: C.UInt32,
    KillXP: C.UInt32,
    KillResource: [C.Int32,E.ResourceType],
    AbilArray: [S.UnitAbilData],
    BehaviorArray: [S.UnitBehaviorData],
    TurretArray: [L.Turret],
    WeaponArray: [S.UnitWeaponData],
    EffectArray: [L.Effect],
    CardLayouts: [S.CardLayout],
    Radius: T.UnitRadius,
    DeadRadius: T.UnitRadius,
    SeparationRadius: C.Real,
    FormationRank: C.UInt8,
    InnerRadius: T.UnitRadius,
    InnerRadiusSafetyMultiplier: C.Real,
    DeadInnerRadius: T.UnitRadius,
    CargoOverlapFilters: C.TargetFilters,
    CargoSize: T.CargoSize,
    Footprint: L.Footprint,
    DeadFootprint: L.Footprint,
    PlacementFootprint: L.Footprint,
    AddedOnArray: [S.AddedOnData],
    AddOnOffsetX: C.Real,
    AddOnOffsetY: C.Real,
    BuiltOn: [L.Unit],
    BuildOnAs: [L.Unit],
    ScoreMake: C.Int32,
    ScoreMakeCostFactor: [C.Real],
    ScoreKill: C.Int32,
    ScoreKillCostFactor: [C.Real],
    ScoreLost: C.Int32,
    ScoreLostCostFactor: [C.Real],
    ScoreResult: L.ScoreResult,
    SubgroupPriority: C.UInt8,
    SubgroupPriorityDelta: C.Int16,
    MinimapRadius: C.Real,
    EditorCategories: T.EditorCategories,
    TacticalAI: L.Tactical,
    TacticalAIRange: T.GalaxyFunction,
    TacticalAIThink: T.GalaxyFunction,
    TacticalAIChannel: T.GalaxyFunction,
    TacticalAIFilters: C.TargetFilters,
    AIKiteRange: C.Real,
    AIEvalFactor: C.Real,
    AIEvalConstant: C.Real,
    Item: L.Item,
    Mass: C.Real,
    PowerupCost: S.Cost,
    PowerupEffect: L.Effect,
    PowerupFilters: C.TargetFilters,
    PowerupRange: C.Real,
    LeaderAlias: L.Unit,
    HotkeyAlias: L.Unit,
    SelectAlias: L.Unit,
    SubgroupAlias: L.Unit,
    TechAliasArray: [T.TechAlias],
    EquipmentArray: [S.UnitEquipment],
    SyncModelData: A.SyncModelData,
    AINotifyEffect: L.Effect,
    GlossaryCategory: L.String,
    GlossaryPriority: C.Int32,
    GlossaryStrongArray: [L.Unit],
    GlossaryWeakArray: [L.Unit],
    GlossaryAlias: L.Unit,
    HotkeyCategory: L.String,
    KillDisplay: E.KillDisplay,
    RankDisplay: E.RankDisplay,
    AIEvaluateAlias: L.Unit,
    TechTreeProducedUnitArray: [L.Unit],
    TechTreeUnlockedUnitArray: [L.Unit],
    Fidget: S.Fidget,
    LootArray: [L.Loot],
    TauntDuration: [C.GameTime,E.UnitTaunt],
    TauntDoesntStopUnit: F.Unknown,
    IdleCommand: L.AbilCommand,
    ReviveInfoBase: S.UnitReviveInfo,
    ReviveInfoLevel: S.UnitReviveInfo,
    OverlapIndex: C.UInt8,
    AlliedPushPriority: C.Int8,
    AcquireMovementLimit: C.Real,
    AcquireLeashRadius: C.Real,
    AcquireLeashResetRadius: C.Real,
    OrderDisplayMinimum: C.UInt32,
    EffectHistoryLimit: [C.UInt16],
    TargetingHitTestPriority: C.UInt8,
    DataCollection: L.DataCollection,
}

const CUnitHero = {
    ...CUnit,
    AttributePointsInfoArray: [S.AttributePointsInfo],
    LearnInfoArray: [S.AbilLearnInfo],
    MainAttribute: L.Behavior,
    MainAttributeDamageBonus: [C.Real],
    TierRequirements: [L.Requirement],
}

const CUpgrade = {
    ...CData,
    Flags: F.Unknown,
    Name: L.String,
    InfoTooltipPriority: C.UInt32,
    WebPriority: C.UInt32,
    Icon: A.Image,
    Alert: L.Alert,
    Race: L.Race,
    ScoreAmount: C.UInt32,
    ScoreCount: E.ScoreValue,
    ScoreValue: E.ScoreValue,
    ScoreResult: L.ScoreResult,
    EffectArray: [S.UpgradeEffect],
    EffectArrayTemplate: [SUpgradeEffectTemplate],
    UnitAllowed: [L.Unit],
    UnitDisallowed: [L.Unit],
    EditorCategories: T.EditorCategories,
    TechAliasArray: [T.TechAlias],
    AffectedUnitArray: [L.Unit],
    MaxLevel: C.UInt8,
    LeaderAlias: L.Upgrade,
    LeaderPriority: C.UInt32,
    LeaderLevel: C.UInt32,
    DataCollection: L.DataCollection,
    EnumRequiredUserFlags: F.UnitUser,
    EnumExcludedUserFlags: F.UnitUser,
    LevelButton: [L.Button],
    LevelRequirements: [L.Requirement],
    BonusResourcePerLevel: [C.Int32,E.ResourceType],
    BonusTimePerLevel: C.GameTime,
}

const CUser = {
    ...CData,
    Fields: [S.UserField],
    Instances: [S.UserInstance],
}



const CValidator = {
    ...CData,
    IgnoreWhileChanneling: C.UInt8,
    ResultFailed: C.CmdResult,
}

const CValidatorCombine = {
    ...CValidator,
    Type: E.ValidateCombine,
    CombineArray: [L.Validator],
    Negate: C.Bit,
}

const CValidatorCondition = {
    ...CValidator,
    IfArray: [S.ValidatorCondition],
    Else: L.Validator,
}

const CValidatorFunction = {
    ...CValidator,
    Line: [S.ValidatorFunction],
    ResultFallback: C.CmdResult,
}

const CValidatorEffect = {
    ...CValidator,
    WhichEffect: L.Effect,
    ResultNoEffect: C.CmdResult,
}

const CValidatorEffectCompare = {
    ...CValidator,
    WhichEffect: L.Effect,
    ResultNoEffect: C.CmdResult,
    OtherEffect: L.Effect,
    Compare: E.ValueCompare,
}

const CValidatorEffectCompareDodged = {
    ...CValidator,
    WhichEffect: L.Effect,
    ResultNoEffect: C.CmdResult,
    OtherEffect: L.Effect,
    Compare: E.ValueCompare,
    Value: C.UInt32,
}

const CValidatorEffectCompareEvaded = {
    ...CValidator,
    WhichEffect: L.Effect,
    ResultNoEffect: C.CmdResult,
    OtherEffect: L.Effect,
    Compare: E.ValueCompare,
    Value: C.UInt32,
}

const CValidatorEffectTreeUserData = {
    ...CValidator,
    CheckExistence: C.Bit,
    ResultNoKey: C.CmdResult,
    Compare: E.ValueCompare,
    Key: C.Identifier,
    Value: S.AccumulatedFixed,
    BehaviorScope: S.EffectWhichBehavior,
}

const CValidatorGameCompareTimeEvent = {
    ...CValidator,
    Compare: E.ValueCompare,
    TimeEvent: E.GameTimeEvent,
}

const CValidatorGameCompareTimeOfDay = {
    ...CValidator,
    Compare: E.ValueCompare,
    Value: C.TimeOfDay,
}

const CValidatorGameCompareTerrain = {
    ...CValidator,
    Compare: E.ValueCompare,
    Value: L.Terrain,
}

const CValidatorGameCommanderActive = {
    ...CValidator,
    Commander: L.Commander,
}

const CValidatorLocation = {
    ...CValidator,
    WhichLocation: S.EffectWhichLocation,
}

const CValidatorLocationCompareCliffLevel = {
    ...CValidatorLocation,
    OtherLocation: S.EffectWhichLocation,
    Compare: E.ValueCompare,
    Value: T.CliffLevel,
}

const CValidatorLocationComparePower = {
    ...CValidatorLocation,
    FromUnit: S.EffectWhichUnit,
    WhichPlayer: S.EffectWhichPlayer,
    PowerLink: T.PowerLink,
    PowerSource: [L.Behavior],
    Compare: E.ValueCompare,
    Value: T.PowerLevel,
}

const CValidatorLocationCompareRange = {
    ...CValidatorLocation,
    Compare: E.ValueCompare,
    Range: C.Real,
    Pathing: C.Bit,
    Value: S.EffectWhichLocation,
}

const CValidatorLocationArc = {
    ...CValidatorLocation,
    OtherLocation: S.EffectWhichLocation,
    Find: C.Bit,
    Arc: C.FangleArc,
    Value: S.EffectWhichLocation,
}

const CValidatorLocationCreep = {
    ...CValidatorLocation,
    WhichPlayer: S.EffectWhichPlayer,
    Find: C.Bit,
    RadiusBonus: C.Real,
}

const CValidatorLocationCrossChasm = {
    ...CValidatorLocation,
    OtherLocation: S.EffectWhichLocation,
    Find: C.Bit,
}

const CValidatorLocationCrossCliff = {
    ...CValidatorLocation,
    OtherLocation: S.EffectWhichLocation,
    Find: C.Bit,
    CrossRamp: C.Bit,
}

const CValidatorLocationEnumArea = {
    ...CValidatorLocation,
    AreaArray: [S.ValidatorEnumArea],
    Compare: E.ValueCompare,
    Count: C.UInt32,
    SearchFlags: F.Unknown,
    LaunchLocation: S.EffectWhichLocation,
    SearchFilters: C.TargetFilters,
    ExcludeArray: [S.EffectWhichUnit],
    IncludeArray: [S.EffectWhichUnit],
    CachedSearch: C.Identifier,
    CombinedVital: E.UnitVital,
    CombinedVitalCompare: E.ValueCompare,
    CombinedVitalUnit: S.EffectWhichUnit,
    CombinedVitalValue: C.UInt32,
}

const CValidatorLocationPathable = {
    ...CValidatorLocation,
    Find: C.Bit,
    Types: F.PathingType,
}

const CValidatorLocationInPlayableMapArea = {
    ...CValidatorLocation,
    Find: C.Bit,
}

const CValidatorLocationPlacement = {
    ...CValidatorLocation,
    FromUnit: S.EffectWhichUnit,
    OtherUnit: S.EffectWhichUnit,
    Range: C.Real,
    Unit: L.Unit,
}

const CValidatorLocationShrub = {
    ...CValidatorLocation,
    WhichPlayer: S.EffectWhichPlayer,
    Find: C.Bit,
}

const CValidatorLocationType = {
    ...CValidatorLocation,
    None: L.Validator,
    Point: L.Validator,
    Unit: L.Validator,
}

const CValidatorLocationVision = {
    ...CValidatorLocation,
    WhichPlayer: S.EffectWhichPlayer,
    Find: C.Bit,
}

const CValidatorPlayer = {
    ...CValidator,
    WhichPlayer: S.EffectWhichPlayer,
    OtherPlayer: S.EffectWhichPlayer,
    ResultNoPlayer: C.CmdResult,
}

const CValidatorPlayerAlliance = {
    ...CValidatorPlayer,
    Find: C.Bit,
    WithPlayer: S.EffectWhichPlayer,
    Value: E.AllianceId,
}

const CValidatorPlayerRequirement = {
    ...CValidatorPlayer,
    Find: C.Bit,
    UnitSelectionNotRequired: C.Bit,
    Value: L.Requirement,
    WhichUnit: S.EffectWhichUnit,
}

const CValidatorPlayerTalent = {
    ...CValidatorPlayer,
    Find: C.Bit,
    Value: L.Talent,
}

const CValidatorPlayerFood = {
    ...CValidatorPlayer,
    AllowCheat: C.Bit,
    Value: C.Real,
    TestUnitType: L.Unit,
    TypeFallbackUnit: S.EffectWhichUnit,
    Count: C.UInt32,
    ResultFoodMax: C.CmdResult,
}

const CValidatorPlayerCompare = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
}

const CValidatorPlayerCompareDifficulty = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: T.DifficultyLevel,
}

const CValidatorPlayerCompareFoodAvailable = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: C.Real,
}

const CValidatorPlayerCompareFoodMade = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: C.Real,
}

const CValidatorPlayerCompareFoodUsed = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: C.Real,
}

const CValidatorPlayerCompareRace = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: L.Race,
}

const CValidatorPlayerCompareResource = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Resource: E.ResourceType,
    Value: C.UInt32,
}

const CValidatorPlayerCompareResult = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: E.GameResult,
}

const CValidatorPlayerCompareType = {
    ...CValidatorPlayer,
    Compare: E.ValueCompare,
    Value: E.PlayerType,
}

const CValidatorUnit = {
    ...CValidator,
    WhichUnit: S.EffectWhichUnit,
    OtherUnit: S.EffectWhichUnit,
    ResultNoUnit: C.CmdResult,
}

const CValidatorUnitInWeaponRange = {
    ...CValidatorUnit,
}

const CValidatorUnitAI = {
    ...CValidatorUnit,
    Find: C.Bit,
    Flag: E.UnitAIFlag,
}

const CValidatorUnitCombatAI = {
    ...CValidatorUnit,
    Find: C.Bit,
}

const CValidatorUnitAlliance = {
    ...CValidatorUnit,
    Find: C.Bit,
    WithPlayer: S.EffectWhichPlayer,
    Value: E.AllianceId,
    AlliancePlayer: E.AlliancePlayer,
}

const CValidatorUnitAbil = {
    ...CValidatorUnit,
    Find: C.Bit,
    AbilClass: E.ClassIdCAbil,
    AbilLink: L.Abil,
}

const CValidatorUnitBehaviorStackAlias = {
    ...CValidatorUnit,
    Find: C.Bit,
    IgnoreDisabledBehavior: C.Bit,
    StackAlias: C.Identifier,
}

const CValidatorUnitBehaviorState = {
    ...CValidatorUnit,
    Enabled: C.Bit,
    BehaviorState: E.BehaviorState,
}

const CValidatorUnitState = {
    ...CValidatorUnit,
    Enabled: C.Bit,
    State: E.UnitTestState,
}

const CValidatorUnitDetected = {
    ...CValidatorUnit,
    WhichPlayer: S.EffectWhichPlayer,
    Detected: C.Bit,
    Flags: F.Unknown,
}

const CValidatorUnitArmor = {
    ...CValidatorUnit,
    Find: C.Bit,
    ArmorType: E.ArmorType,
}

const CValidatorUnitFilters = {
    ...CValidatorUnit,
    Filters: C.TargetFilters,
}

const CValidatorUnitFlying = {
    ...CValidatorUnit,
    Find: C.Bit,
}

const CValidatorUnitInventory = {
    ...CValidatorUnit,
    ResultNoInventory: C.CmdResult,
    RequireEnabled: C.Bit,
}

const CValidatorUnitInventoryIsFull = {
    ...CValidatorUnit,
    ResultNoInventory: C.CmdResult,
    RequireEnabled: C.Bit,
    Find: C.Bit,
}

const CValidatorUnitInventoryContainsItem = {
    ...CValidatorUnit,
    ResultNoInventory: C.CmdResult,
    RequireEnabled: C.Bit,
    Find: C.Bit,
    Item: L.Unit,
}

const CValidatorUnitLastDamagePlayer = {
    ...CValidatorUnit,
    Relationship: E.PlayerRelationship,
}

const CValidatorUnitKinetic = {
    ...CValidatorUnit,
    Value: L.Kinetic,
    Find: C.Bit,
}

const CValidatorUnitMissileNullified = {
    ...CValidatorUnit,
    Find: C.Bit,
}

const CValidatorUnitMover = {
    ...CValidatorUnit,
    Value: L.Mover,
    Find: C.Bit,
}

const CValidatorUnitOrder = {
    ...CValidatorUnit,
    AbilLink: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    CmdFlags: F.Cmd,
    Target: S.EffectWhichLocation,
    CheckStateOnly: C.Bit,
}

const CValidatorUnitOrderQueue = {
    ...CValidatorUnit,
    AbilLink: L.Abil,
    AbilClass: E.ClassIdCAbil,
    AbilTechAlias: T.TechAlias,
    AbilCmdIndex: T.AbilCmdIndex,
    Find: C.Bit,
    Queued: C.Bit,
    Target: S.EffectWhichLocation,
    Item: L.Item,
}

const CValidatorUnitOrderTargetPathable = {
    ...CValidatorUnit,
    AbilLink: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    Find: C.Bit,
    MaxDistance: C.Real,
}

const CValidatorUnitOrderTargetType = {
    ...CValidatorUnit,
    AbilLink: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    Find: C.Bit,
    Type: E.EffectLocationType,
}

const CValidatorUnitPathable = {
    ...CValidatorUnit,
    WhichLocation: S.EffectWhichLocation,
    Find: C.Bit,
    Range: C.Real,
    MaxDistance: C.Real,
}

const CValidatorUnitPathing = {
    ...CValidatorUnit,
    Find: C.Bit,
}

const CValidatorUnitScanning = {
    ...CValidatorUnit,
    Find: C.Bit,
}

const CValidatorUnitType = {
    ...CValidatorUnit,
    Value: L.Unit,
    Find: C.Bit,
    Type: E.UnitType,
}

const CValidatorUnitWeaponAnimating = {
    ...CValidatorUnit,
    Weapon: L.Weapon,
    Find: C.Bit,
}

const CValidatorUnitWeaponFiring = {
    ...CValidatorUnit,
    Weapon: L.Weapon,
    Find: C.Bit,
}

const CValidatorUnitWeaponPlane = {
    ...CValidatorUnit,
    Find: C.Bit,
    Plane: E.Plane,
}

const CValidatorUnitTestWeaponType = {
    ...CValidatorUnit,
    Find: C.Bit,
    WeaponType: E.WeaponType,
    RequireActivated: C.Bit,
    RequireEnabled: C.Bit,
}

const CValidatorUnitCompare = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
}

const CValidatorUnitCompareAIAreaEvalRatio = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Radius: C.Real,
    Value: C.Real,
}

const CValidatorUnitCompareAbilLevel = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    AbilLink: L.Abil,
    Value: C.UInt32,
}

const CValidatorUnitCompareAbilSkillPoint = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    AbilLink: L.Abil,
    CountType: E.SkillPoint,
    Value: C.Int32,
}

const CValidatorUnitCompareAbilStage = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    AbilityStage: E.AbilEffectStage,
    Ability: L.Abil,
}

const CValidatorUnitCompareAttackPriority = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Attacker: S.EffectWhichUnit,
    AttackerAlternateType: L.Unit,
    Flags: F.Unknown,
    Value: T.AttackTargetPriority,
}

const CValidatorUnitCompareBehaviorCount = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: S.AccumulatedUInt32,
    Behavior: L.Behavior,
    Categories: F.BehaviorCategory,
    BehaviorAlignment: E.EffectRemoveBehaviorAlignment,
    Heroic: E.BehaviorHeroicState,
    ExcludeOriginPlayer: S.EffectWhichPlayer,
    ExcludeCasterUnit: S.EffectWhichUnit,
    RequireOriginPlayer: S.EffectWhichPlayer,
    RequireCasterUnit: S.EffectWhichUnit,
}

const CValidatorUnitCompareCargo = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Type: E.CargoSpace,
    Value: C.UInt8,
}

const CValidatorUnitCompareChargeUsed = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    ChargeLink: T.ChargeLink,
    Location: E.ChargeLocation,
    Ability: L.Abil,
    Behavior: L.Behavior,
    Value: C.Real,
}

const CValidatorUnitCompareCooldown = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    CooldownLink: T.CooldownLink,
    Location: E.CooldownLocation,
    Ability: L.Abil,
    Behavior: L.Behavior,
    Value: C.Real,
}

const CValidatorUnitCompareDamageDealtTime = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.GameTime,
}

const CValidatorUnitCompareDamageTakenTime = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.GameTime,
}

const CValidatorUnitCompareDeath = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: E.DeathType,
}

const CValidatorUnitCompareDetectRange = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.Real,
    Radar: C.Bit,
}

const CValidatorUnitCompareField = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Field: T.CatalogFieldPath,
    Value: C.Identifier,
}

const CValidatorUnitCompareKillCount = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt16,
}

const CValidatorUnitCompareMarkerCount = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
}

const CValidatorUnitCompareMoverPhase = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
}

const CValidatorUnitCompareOrderCount = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    AbilLink: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    Value: C.UInt32,
}

const CValidatorUnitCompareOrderTargetRange = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    AbilLink: L.Abil,
    AbilCmdIndex: T.AbilCmdIndex,
    Value: C.Real,
    Pathing: C.Bit,
}

const CValidatorUnitComparePowerSourceLevel = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    Behavior: L.Behavior,
}

const CValidatorUnitComparePowerUserLevel = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    Behavior: L.Behavior,
}

const CValidatorUnitCompareRallyPointCount = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    AbilLink: L.Abil,
    Point: C.UInt32,
}

const CValidatorUnitCompareResourceContents = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    Behavior: L.Behavior,
}

const CValidatorUnitCompareResourceHarvesters = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    Active: C.Bit,
    Queued: C.Bit,
    Behavior: L.Behavior,
}

const CValidatorUnitCompareSpeed = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.GameSpeed,
}

const CValidatorUnitCompareVeterancyLevel = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    Behavior: L.Behavior,
    ResultMaxLevel: C.CmdResult,
}

const CValidatorUnitCompareVital = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Type: E.VitalType,
    Value: C.Real,
    Vital: E.UnitVital,
}

const CValidatorUnitCompareVitality = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    Type: E.VitalType,
    Value: C.Real,
}

const CValidatorUnitCompareHeight = {
    ...CValidatorUnit,
    Compare: E.ValueCompare,
    CasterAdd: C.Real,
    TargetAdd: C.Real,
    CasterHeight: C.Bit,
    CasterGroundHeight: C.Bit,
    CasterZ: C.Bit,
    TargetHeight: C.Bit,
    TargetGroundHeight: C.Bit,
    TargetZ: C.Bit,
}

const CValidatorCompareTrackedUnitsCount = {
    ...CValidator,
    Compare: E.ValueCompare,
    Value: C.UInt32,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    TrackedUnitValidatorArray: [L.Validator],
    TrackedUnitFilters: C.TargetFilters,
}

const CValidatorIsUnitTracked = {
    ...CValidator,
    Find: C.Bit,
    BehaviorLink: L.Behavior,
    TrackerUnit: S.EffectWhichUnit,
    TrackedUnit: S.EffectWhichUnit,
}

const CVoiceOver = {
    ...CData,
    Character: L.Character,
    Skins: [S.VoiceOverSkin],
    Groups: [S.VoiceOverGroup],
    Lines: [S.VoiceOverLine],
}

const CVoicePack = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    TypeName: L.String,
    Description: L.String,
    Icon: A.Image,
    ProductId: T.BattleProductId,
    UnlockedRewardArray: [L.Reward],
    ExampleLineArray: [S.VoicePackExampleLine],
    ReleaseDate: S.ProductReleaseDate,
    ParentBundle: L.Bundle,
    LocaleRestriction: C.FourCC,
    IsPurchaseHidden: C.Bit,
    ImageTexture: A.Image,
    StoreTypeName: L.String,
}

const CWarChest = {
    ...CData,
    Default: C.Bit,
    Name: L.String,
    ShortName: L.String,
    StoreName: L.String,
    HyperlinkId: T.ProductHyperlinkId,
    ProductId: T.BattleProductId,
    ReleaseDate: S.ProductReleaseDate,
    SeasonId: L.String,
    IsBundle: C.Bit,
    CelebrationString: C.Identifier,
    StoreTypeName: L.String,
}

const CWarChestSeason = {
    ...CData,
    Name: L.String,
    ESportsSeason: L.String,
    ESportsName: L.String,
    ESportsLocation: L.String,
    ESportsDate: L.String,
    ESportsShowPlayers: C.Bit,
    HowItWorks1: L.String,
    HowItWorks2: L.String,
    HowItWorks3: L.String,
    HowItWorks4: L.String,
    LearnMoreTitle1: L.String,
    LearnMoreTitle2: L.String,
    LearnMoreTitle3: L.String,
    LearnMoreDescription1: L.String,
    LearnMoreDescription2: L.String,
    LearnMoreDescription3: L.String,
    LearnMoreImage1: A.Image,
    LearnMoreImage2: A.Image,
    LearnMoreImage3: A.Image,
    PurchaseTitle: L.String,
    PurchaseDescription: L.String,
    PurchaseWarning: L.String,
    PurchaseImage: A.Image,
}

const CWater = {
    ...CData,
    TextureKey: A.Image,
    TilingFreq: C.Vector4,
    ScrollVectors: C.Vector4,
    FramesPerSec: C.Real32,
    State: [S.WaterStateDesc],
    CausticsFPS: C.Real32,
    CausticsTilingFreq: C.Vector2,
    ReceiveShadows: C.Bit,
    IsLava: C.Bit,
    Density: C.Real32,
    Drag: C.Real32,
    AngularDamping: C.Real32,
    MaxLinearVelocity: C.Real32,
    BeachShoreline: L.Model,
    CliffShoreline: L.Model,
    LavaModel: L.Model,
    Doodads: [S.WaterDoodad],
    Sound: L.Sound,
    ReflectionCubeMap: A.Image,
}


const CWeapon = {
    ...CData,
    Name: L.String,
    EditorCategories: T.EditorCategories,
    InfoTooltipPriority: C.UInt32,
    Tip: L.String,
    Options: F.Unknown,
    Icon: A.Image,
    DisplayEffect: L.Effect,
    DisplayAttackCount: C.UInt32,
    DisplayName: L.String,
    Level: C.UInt32,
    TargetFilters: C.TargetFilters,
    ChaseFilters: C.TargetFilters,
    SupportedFilters: C.TargetFilters,
    AcquireFilters: C.TargetFilters,
    AcquireCallForHelpFilters: C.TargetFilters,
    AcquireProvokeFilters: C.TargetFilters,
    AcquireScanFilters: C.TargetFilters,
    AcquireTargetSorts: S.TargetSorts,
    AcquirePrioritization: E.WeaponPrioritization,
    AcquireCliffLevelRange: C.fRange,
    MinScanRange: C.Real,
    Range: C.Real,
    RangeSlop: C.Real,
    RangeDisplayFlags: F.EquipmentDisplay,
    MinimumRange: C.Real,
    TeleportResetRange: C.Real,
    Arc: C.FangleArc,
    ArcSlop: C.FangleArc,
    Marker: S.Marker,
    Cost: S.Cost,
    Period: C.GameTime,
    PeriodDisplayFlags: F.EquipmentDisplay,
    RateMultiplier: C.Real,
    AttackType: E.AttackType,
    DamagePoint: C.GameTime,
    PreswingBeforeAttack: C.GameTime,
    PreswingBetweenAttacks: C.GameTime,
    Backswing: C.GameTime,
    Effect: L.Effect,
    PreEffect: L.Effect,
    CriticalEffect: L.Effect,
    PreEffectBehavior: S.EffectBehavior,
    PostEffectBehavior: S.EffectBehavior,
    CriticalChance: C.Real,
    CursorRangeMode: E.CursorRangeMode,
}

const CWeaponLegacy = {
    ...CWeapon,
    LegacyOptions: F.Unknown,
    AllowedMovement: E.WeaponLegacyMovement,
    PathingAmmoUnit: L.Unit,
    ReloadDuration: C.GameTime,
    RandomDelayMin: C.GameTime,
    RandomDelayMax: C.GameTime,
    UninterruptibleDelay: C.GameTime,
    UninterruptibleDuration: C.GameTime,
}

const CWeaponStrafe = {
    ...CWeapon,
    LoiterInnerRadius: C.Real,
    LoiterRadius: C.Real,
}


export const SClasses = {
        CAbil,
        CAbilProgress,
        CAbilEffect,
        CAbilQueueable,
        CAbilRedirect,
        CAbilArmMagazine,
        CAbilAttack,
        CAbilAugment,
        CAbilAttackModifier,
        CAbilBattery,
        CAbilBeacon,
        CAbilBehavior,
        CAbilBuild,
        CAbilBuildable,
        CAbilEffectInstant,
        CAbilEffectTarget,
        CAbilHarvest,
        CAbilInteract,
        CAbilInventory,
        CAbilLearn,
        CAbilMerge,
        CAbilMergeable,
        CAbilMorph,
        CAbilMorphPlacement,
        CAbilMove,
        CAbilPawn,
        CAbilQueue,
        CAbilRally,
        CAbilRedirectInstant,
        CAbilRedirectTarget,
        CAbilResearch,
        CAbilRevive,
        CAbilSpecialize,
        CAbilStop,
        CAbilTrain,
        CAbilTransport,
        CAbilWarpable,
        CAbilWarpTrain,
        CAccumulator,
        CAccumulatorConstant,
        CAccumulatorVitals,
        CAccumulatorDistance,
        CAccumulatorBehavior,
        CAccumulatorAttributePoints,
        CAccumulatorTrackedUnitCount,
        CAccumulatorLevel,
        CAccumulatorAbilLevel,
        CAccumulatorUnitLevel,
        CAccumulatorVeterancyLevel,
        CAccumulatorCargo,
        CAccumulatorEffectAmount,
        CAccumulatorUserData,
        CAccumulatorUnitCustomValue,
        CAccumulatorSwitch,
        CAccumulatorArithmetic,
        CAccumulatorPlayerScoreValue,
        CAchievement,
        CAchievementTerm,
        CAchievementTermAbil,
        CAchievementTermAbilInteract,
        CAchievementTermAbilLoad,
        CAchievementTermAbilUse,
        CAchievementTermAchievement,
        CAchievementTermBehavior,
        CAchievementTermBehaviorAbsorbed,
        CAchievementTermBehaviorCount,
        CAchievementTermBehaviorElapsed,
        CAchievementTermBehaviorState,
        CAchievementTermCombine,
        CAchievementTermEffect,
        CAchievementTermEffectAbsorbed,
        CAchievementTermEffectDamaged,
        CAchievementTermEffectDodged,
        CAchievementTermEffectHealed,
        CAchievementTermEffectKilled,
        CAchievementTermEffectUse,
        CAchievementTermGeneric,
        CAchievementTermReplay,
        CAchievementTermScoreValue,
        CAchievementTermTime,
        CAchievementTermUnit,
        CAchievementTermUnitBirth,
        CAchievementTermUnitDeath,
        CAchievementTermUnitKills,
        CAchievementTermUnitRegen,
        CAchievementTermUnitSupplyLoss,
        CActor,
        CActorBase,
        CActorBearings,
        CActorCamera,
        CActorModel,
        CActorModelMaterial,
        CActorQuad,
        CActorForce,
        CActorForceLineSegment,
        CActorBeam,
        CActorRange,
        CActorRegion,
        CActorSite,
        CActorSiteOp,
        CActorSiteOpBase,
        CActorSound,
        CActorSplat,
        CActorAction,
        CActorActionOverride,
        CActorArc,
        CActorBeamSimple,
        CActorBeamStandard,
        CActorBlob,
        CActorCameraModel,
        CActorCreep,
        CActorCutscene,
        CActorDoodad,
        CActorDoodadPreserver,
        CActorFoliageFXSpawner,
        CActorEditorCamera,
        CActorEditorPoint,
        CActorEventMacro,
        CActorEventMacroRunnable,
        CActorForceBox,
        CActorForceConeRoundedEnd,
        CActorForceCylinder,
        CActorForceSphere,
        CActorGlobalConfig,
        CActorOverrides,
        CActorLight,
        CActorLightOmni,
        CActorLightSpot,
        CActorLightModel,
        CActorLightOmniModel,
        CActorLightSpotModel,
        CActorLookAt,
        CActorList,
        CActorListPerPlayer,
        CActorPortrait,
        CActorPower,
        CActorProgress,
        CActorPropertyCurveSet,
        CActorQueryResponse,
        CActorRegionArc,
        CActorRegionCircle,
        CActorRegionCombine,
        CActorRegionGame,
        CActorRegionPolygon,
        CActorRegionQuad,
        CActorRegionWater,
        CActorScene,
        CActorSelection,
        CActorSetQueried,
        CActorShadow,
        CActorShield,
        CActorShieldImpact,
        CActorSimple,
        CActorSiteBillboard,
        CActorSiteMover,
        CActorSiteOrbiter,
        CActorSiteRocker,
        CActorSiteOp2DRotation,
        CActorSiteOpAction,
        CActorSiteOpAttach,
        CActorSiteOpAttachVolume,
        CActorSiteOpBanker,
        CActorSiteOpBankerUnit,
        CActorSiteOpBasic,
        CActorSiteOpGameCameraFollow,
        CActorSiteOpDeathMotion,
        CActorSiteOpDeltaSum,
        CActorSiteOpEffect,
        CActorSiteOpForward,
        CActorSiteOpHeight,
        CActorSiteOpHigherOfTerrainAndWater,
        CActorSiteOpHostBearings,
        CActorSiteOpHostedOffset,
        CActorSiteOpIncoming,
        CActorSiteOpLocalOffset,
        CActorSiteOpOrientAttachPointTo,
        CActorSiteOpPatch,
        CActorSiteOpPersistentOffset,
        CActorSiteOpOrbiter,
        CActorSiteOpPhysicsImpact,
        CActorSiteOpRandomPointInCircle,
        CActorSiteOpRandomPointInCrossbar,
        CActorSiteOpRandomPointInSphere,
        CActorSiteOpRotationExplicit,
        CActorSiteOpRotationRandom,
        CActorSiteOpRotationVariancer,
        CActorSiteOpRotator,
        CActorSiteOpRotationSmooth,
        CActorSiteOpSelectionOffset,
        CActorSiteOpSerpentHead,
        CActorSiteOpSerpentSegment,
        CActorSiteOpShadow,
        CActorSiteOpTether,
        CActorSiteOpTipability,
        CActorSiteOpTilter,
        CActorSiteOpUp,
        CActorSiteOpZ,
        CActorSiteOpCursor,
        CActorSiteOpYawLimiter,
        CActorSiteOpPitchLimiter,
        CActorSnapshot,
        CActorStateMonitor,
        CActorSquib,
        CActorBatch,
        CActorTerrain,
        CActorTerrainDeformer,
        CActorText,
        CActorTurret,
        CActorUnit,
        CActorUnitRing,
        CActorMissile,
        CActorMinimap,
        CAlert,
        CArmyCategory,
        CArmyUnit,
        CArmyUpgrade,
        CArtifact,
        CArtifactSlot,
        CAttachMethod,
        CAttachMethodArcTest,
        CAttachMethodBestMatch,
        CAttachMethodFilter,
        CAttachMethodAttachType,
        CAttachMethodIncoming,
        CAttachMethodLeastDeflection,
        CAttachMethodNodeOccupancy,
        CAttachMethodNodeOccupancy2,
        CAttachMethodNumericField,
        CAttachMethodPattern,
        CAttachMethodPortAllocator,
        CAttachMethodProximity,
        CAttachMethodRandom,
        CAttachMethodReduction,
        CAttachMethodVolumesRequery,
        CAttachMethodVolumesTargets,
        CAttachMethodVolumesWeightedPick,
        CBankCondition,
        CBankConditionCompare,
        CBankConditionCompareValueCount,
        CBankConditionCompareValueInteger,
        CBankConditionCompareValueString,
        CBankConditionCompareValueSum,
        CBankConditionCombine,
        CBankConditionCurrentMap,
        CBeam,
        CBeamSync,
        CBeamSyncSweeper,
        CBeamAsync,
        CBeamAsyncLinear,
        CBeamAsyncShadow,
        CBehavior,
        CBehaviorAttackModifier,
        CBehaviorAttribute,
        CBehaviorUnitTracker,
        CBehaviorBuff,
        CBehaviorClickResponse,
        CBehaviorConjoined,
        CBehaviorCreepSource,
        CBehaviorJump,
        CBehaviorPowerSource,
        CBehaviorPowerUser,
        CBehaviorResource,
        CBehaviorReveal,
        CBehaviorSpawn,
        CBehaviorVeterancy,
        CBehaviorWander,
        CBoost,
        CBundle,
        CButton,
        CCamera,
        CCampaign,
        CCharacter,
        CCliff,
        CCliffMesh,
        CColorStyle,
        CCommander,
        CConfig,
        CConsoleSkin,
        CConversation,
        CConversationState,
        CCursor,
        CDataCollection,
        CDataCollectionUnit,
        CDataCollectionUpgrade,
        CDataCollectionAbil,
        CDataCollectionPattern,
        CDecalPack,
        CDSP,
        CDSPChorus,
        CDSPCompressor,
        CDSPCustomCompressor,
        CDSPDistortion,
        CDSPEcho,
        CDSPFlange,
        CDSPHighPass,
        CDSPLimiter,
        CDSPLowPass,
        CDSPLowPassSimple,
        CDSPNormalize,
        CDSPOscillator,
        CDSPParamEQ,
        CDSPPitchShift,
        CDSPReverb,
        CEffect,
        CEffectResponse,
        CEffectAddTrackedUnit,
        CEffectClearTrackedUnits,
        CEffectAddTrackedUnits,
        CEffectRemoveTrackedUnit,
        CEffectApplyBehavior,
        CEffectApplyForce,
        CEffectApplyKinetic,
        CEffectCancelOrder,
        CEffectCreateHealer,
        CEffectCreep,
        CEffectCreatePersistent,
        CEffectRandomPointInCircle,
        CEffectCreateUnit,
        CEffectDamage,
        CEffectDestroyHealer,
        CEffectDestroyPersistent,
        CEffectEnumArea,
        CEffectEnumTrackedUnits,
        CEffectEnumMagazine,
        CEffectEnumTransport,
        CEffectEnumInventory,
        CEffectLastTarget,
        CEffectLoadContainer,
        CEffectIssueOrder,
        CEffectLaunchMissile,
        CEffectModifyPlayer,
        CEffectModifyUnit,
        CEffectMorph,
        CEffectRedirectMissile,
        CEffectReleaseMagazine,
        CEffectRemoveBehavior,
        CEffectRemoveKinetic,
        CEffectReturnMagazine,
        CEffectSet,
        CEffectSwitch,
        CEffectTeleport,
        CEffectTransferBehavior,
        CEffectUseCalldown,
        CEffectUseMagazine,
        CEffectUserData,
        CEmoticon,
        CEmoticonPack,
        CFootprint,
        CFoW,
        CGame,
        CGameUI,
        CHerd,
        CHerdNode,
        CHero,
        CHeroAbil,
        CHeroStat,
        CItem,
        CItemAbil,
        CItemAbilPowerUp,
        CItemEffect,
        CItemEffectInstant,
        CItemEffectTarget,
        CItemClass,
        CItemContainer,
        CKinetic,
        CKineticFollow,
        CKineticRotate,
        CKineticSequence,
        CKineticSet,
        CKineticTranslate,
        CKineticDistance,
        CLensFlareSet,
        CLight,
        CLocation,
        CLoot,
        CLootSpawn,
        CLootEffect,
        CLootItem,
        CLootSet,
        CLootUnit,
        CMap,
        CModel,
        CModelFoliage,
        CMount,
        CMover,
        CMoverAvoid,
        CMoverFlock,
        CMoverMissile,
        CMoverNull,
        CObjective,
        CPhysicsMaterial,
        CPing,
        CPlayerResponse,
        CPlayerResponseUnit,
        CPlayerResponseUnitDamage,
        CPlayerResponseUnitDeath,
        CPlayerResponseUnitBirth,
        CPortraitPack,
        CPreload,
        CPreloadAsset,
        CPreloadScene,
        CPreloadActor,
        CPreloadConversation,
        CPreloadModel,
        CPreloadSound,
        CPreloadUnit,
        CPremiumMap,
        CRace,
        CRaceBannerPack,
        CRequirement,
        CRequirementNode,
        CRequirementGT,
        CRequirementLT,
        CRequirementGTE,
        CRequirementLTE,
        CRequirementEq,
        CRequirementNE,
        CRequirementAnd,
        CRequirementOr,
        CRequirementXor,
        CRequirementNot,
        CRequirementOdd,
        CRequirementDiv,
        CRequirementMod,
        CRequirementMul,
        CRequirementSum,
        CRequirementConst,
        CRequirementAllowAbil,
        CRequirementAllowBehavior,
        CRequirementAllowUnit,
        CRequirementAllowUpgrade,
        CRequirementCountAbil,
        CRequirementCountBehavior,
        CRequirementCountEffect,
        CRequirementCountUnit,
        CRequirementCountUpgrade,
        CReverb,
        CReward,
        CRewardDecal,
        CRewardIcon,
        CRewardModel,
        CRewardPortrait,
        CRewardBadge,
        CRewardPoints,
        CRewardTrophy,
        CRewardEmoticon,
        CRewardVoicePack,
        CRewardPortraitInGame,
        CRewardConsoleSkin,
        CRewardSpray,
        CRewardSprayUseDecal,
        CRewardRaceBanner,
        CRewardStim,
        CScoreResult,
        CScoreResultRoot,
        CScoreResultScore,
        CScoreResultGraph,
        CScoreResultPane,
        CScoreResultBuildOrder,
        CScoreResultCallouts,
        CScoreResultExperience,
        CScoreResultPerformance,
        CScoreValue,
        CScoreValueCustom,
        CScoreValueStandard,
        CScoreValueConstant,
        CScoreValueCombine,
        CShape,
        CShapeArc,
        CShapeQuad,
        CSkin,
        CSkinPack,
        CSound,
        CSoundExclusivity,
        CSoundMixSnapshot,
        CSoundtrack,
        CSpray,
        CSprayPack,
        CStimPack,
        CTacCooldown,
        CTactical,
        CTacticalOrder,
        CTacticalSet,
        CTalent,
        CTalentProfile,
        CTargetFind,
        CTargetFindBestPoint,
        CTargetFindWorkerRallyPoint,
        CTargetFindRallyPoint,
        CTargetFindEnumArea,
        CTargetFindEffect,
        CTargetFindLastAttacker,
        CTargetFindOffset,
        CTargetFindOrder,
        CTargetFindSet,
        CTargetSort,
        CTargetSortAlliance,
        CTargetSortAngle,
        CTargetSortBehaviorCount,
        CTargetSortBehaviorDuration,
        CTargetSortChargeCount,
        CTargetSortChargeRegen,
        CTargetSortCooldown,
        CTargetSortDistance,
        CTargetSortField,
        CTargetSortInterruptible,
        CTargetSortMarker,
        CTargetSortPowerSourceLevel,
        CTargetSortPowerUserLevel,
        CTargetSortPriority,
        CTargetSortRandom,
        CTargetSortValidator,
        CTargetSortVeterancy,
        CTargetSortVital,
        CTargetSortVitalFraction,
        CTerrain,
        CTerrainObject,
        CCliffDoodad,
        CTerrainTex,
        CTexture,
        CTextureSheet,
        CTile,
        CTrophy,
        CTurret,
        CUnit,
        CUnitHero,
        CUpgrade,
        CUser,
        CValidator,
        CValidatorCombine,
        CValidatorCondition,
        CValidatorFunction,
        CValidatorEffect,
        CValidatorEffectCompare,
        CValidatorEffectCompareDodged,
        CValidatorEffectCompareEvaded,
        CValidatorEffectTreeUserData,
        CValidatorGameCompareTimeEvent,
        CValidatorGameCompareTimeOfDay,
        CValidatorGameCompareTerrain,
        CValidatorGameCommanderActive,
        CValidatorLocation,
        CValidatorLocationCompareCliffLevel,
        CValidatorLocationComparePower,
        CValidatorLocationCompareRange,
        CValidatorLocationArc,
        CValidatorLocationCreep,
        CValidatorLocationCrossChasm,
        CValidatorLocationCrossCliff,
        CValidatorLocationEnumArea,
        CValidatorLocationPathable,
        CValidatorLocationInPlayableMapArea,
        CValidatorLocationPlacement,
        CValidatorLocationShrub,
        CValidatorLocationType,
        CValidatorLocationVision,
        CValidatorPlayer,
        CValidatorPlayerAlliance,
        CValidatorPlayerRequirement,
        CValidatorPlayerTalent,
        CValidatorPlayerFood,
        CValidatorPlayerCompare,
        CValidatorPlayerCompareDifficulty,
        CValidatorPlayerCompareFoodAvailable,
        CValidatorPlayerCompareFoodMade,
        CValidatorPlayerCompareFoodUsed,
        CValidatorPlayerCompareRace,
        CValidatorPlayerCompareResource,
        CValidatorPlayerCompareResult,
        CValidatorPlayerCompareType,
        CValidatorUnit,
        CValidatorUnitInWeaponRange,
        CValidatorUnitAI,
        CValidatorUnitCombatAI,
        CValidatorUnitAlliance,
        CValidatorUnitAbil,
        CValidatorUnitBehaviorStackAlias,
        CValidatorUnitBehaviorState,
        CValidatorUnitState,
        CValidatorUnitDetected,
        CValidatorUnitArmor,
        CValidatorUnitFilters,
        CValidatorUnitFlying,
        CValidatorUnitInventory,
        CValidatorUnitInventoryIsFull,
        CValidatorUnitInventoryContainsItem,
        CValidatorUnitLastDamagePlayer,
        CValidatorUnitKinetic,
        CValidatorUnitMissileNullified,
        CValidatorUnitMover,
        CValidatorUnitOrder,
        CValidatorUnitOrderQueue,
        CValidatorUnitOrderTargetPathable,
        CValidatorUnitOrderTargetType,
        CValidatorUnitPathable,
        CValidatorUnitPathing,
        CValidatorUnitScanning,
        CValidatorUnitType,
        CValidatorUnitWeaponAnimating,
        CValidatorUnitWeaponFiring,
        CValidatorUnitWeaponPlane,
        CValidatorUnitTestWeaponType,
        CValidatorUnitCompare,
        CValidatorUnitCompareAIAreaEvalRatio,
        CValidatorUnitCompareAbilLevel,
        CValidatorUnitCompareAbilSkillPoint,
        CValidatorUnitCompareAbilStage,
        CValidatorUnitCompareAttackPriority,
        CValidatorUnitCompareBehaviorCount,
        CValidatorUnitCompareCargo,
        CValidatorUnitCompareChargeUsed,
        CValidatorUnitCompareCooldown,
        CValidatorUnitCompareDamageDealtTime,
        CValidatorUnitCompareDamageTakenTime,
        CValidatorUnitCompareDeath,
        CValidatorUnitCompareDetectRange,
        CValidatorUnitCompareField,
        CValidatorUnitCompareKillCount,
        CValidatorUnitCompareMarkerCount,
        CValidatorUnitCompareMoverPhase,
        CValidatorUnitCompareOrderCount,
        CValidatorUnitCompareOrderTargetRange,
        CValidatorUnitComparePowerSourceLevel,
        CValidatorUnitComparePowerUserLevel,
        CValidatorUnitCompareRallyPointCount,
        CValidatorUnitCompareResourceContents,
        CValidatorUnitCompareResourceHarvesters,
        CValidatorUnitCompareSpeed,
        CValidatorUnitCompareVeterancyLevel,
        CValidatorUnitCompareVital,
        CValidatorUnitCompareVitality,
        CValidatorUnitCompareHeight,
        CValidatorCompareTrackedUnitsCount,
        CValidatorIsUnitTracked,
        CVoiceOver,
        CVoicePack,
        CWarChest,
        CWarChestSeason,
        CWater,
        CWeapon,
        CWeaponLegacy,
        CWeaponStrafe
}

//this is used by VData to determind object a structure
SCSchema.classes = SClasses

SCSchema["Const"] = [S.Const],
SCSchema["*Struct"] = [SCSchema.struct]
SCSchema["*Data"] = [SCSchema.classes]

SCSchema.Catalog = {
    path: A.XML,
    //constants will be stored in a separate array 
    const: [S.Const],
    //these are variative fields... did not find a best way to imlpement schema for the catalog.
    //if tag schema not found for example, there ar no CUnit field
    //if persist all CUNits would be saved in CUnit array
    //but instead cnverter will search for variative filds if any validate the CUnit it will be added to this array .
    //if validate method returns Schema object it will be used as schema  (VData will return CUnit from schema types it will be used instead of VData)
    //separate structures and catalogs 
    "*Struct": [SCSchema.structDefinitions],
    "*Data": [SCSchema.classes],
    // "@type": C.String, //can be used to identify result json object as catalog data
    // ...SStructs, // only 1 structure element per type
    // ...Object.fromEntries(Object.entries(SClasses).map(([e,c]) => ([e,[c]]))) //multiple classes
}

SCSchema.Includes = {
    Catalog: [{path: A.XML}]
}