
import { CEnum } from "./core.js";
import { CGAME_CLASSES, GAME_TYPES, SGAMEDATA_STRUCTURES, CGAME_CATALOGS, GAME_NAMESPACES, GAME_LOCALES } from "./shared.js";

export class EStructId extends CEnum {static enum = SGAMEDATA_STRUCTURES}
export class ETypeId extends CEnum {static enum =  GAME_TYPES}
export class EClassId extends CEnum {static enum = CGAME_CLASSES}
export class ELocaleId extends CEnum {static enum = GAME_LOCALES } 

export class EClassIdCAbil extends CEnum { static enum = ["CAbilUnknown",...CGAME_CATALOGS.CAbil]}
export class EClassIdCAccumulator extends CEnum { static enum = ["CAccumulatorUnknown",...CGAME_CATALOGS.CAccumulator]}
export class EClassIdCAchievement extends CEnum { static enum = ["CAchievementUnknown",...CGAME_CATALOGS.CAchievement]}
export class EClassIdCAchievementTerm extends CEnum { static enum = ["CAchievementTermUnknown",...CGAME_CATALOGS.CAchievementTerm]}
export class EClassIdCActor extends CEnum { static enum = ["CActorUnknown",...CGAME_CATALOGS.CActor]}
export class EClassIdCActorSupport extends CEnum { static enum = ["CActorSupportUnknown",...CGAME_CATALOGS.CActorSupport]}
export class EClassIdCAlert extends CEnum { static enum = ["CAlerUnknown",...CGAME_CATALOGS.CAlert]}
export class EClassIdCArmyCategory extends CEnum { static enum = ["CArmyCategoryUnknown",...CGAME_CATALOGS.CArmyCategory]}
export class EClassIdCArmyUnit extends CEnum { static enum = ["CArmyUnitUnknown",...CGAME_CATALOGS.CArmyUnit]}
export class EClassIdCArmyUpgrade extends CEnum { static enum = ["CArmyUpgradeUnknown",...CGAME_CATALOGS.CArmyUpgrade]}
export class EClassIdCArtifact extends CEnum { static enum = ["CArtifactUnknown",...CGAME_CATALOGS.CArtifact]}
export class EClassIdCArtifactSlot extends CEnum { static enum = ["CArtifactSlotUnknown",...CGAME_CATALOGS.CArtifactSlot]}
export class EClassIdCAttachMethod extends CEnum { static enum = ["CAttachMethodUnknown",...CGAME_CATALOGS.CAttachMethod]}
export class EClassIdCBankCondition extends CEnum { static enum = ["CBankConditionUnknown",...CGAME_CATALOGS.CBankCondition]}
export class EClassIdCBeam extends CEnum { static enum = ["CBeamUnknown",...CGAME_CATALOGS.CBeam]}
export class EClassIdCBehavior extends CEnum { static enum = ["CBehaviorUnknown",...CGAME_CATALOGS.CBehavior]}
export class EClassIdCBoost extends CEnum { static enum = ["CBoostUnknown",...CGAME_CATALOGS.CBoost]}
export class EClassIdCBundle extends CEnum { static enum = ["CBundleUnknown",...CGAME_CATALOGS.CBundle]}
export class EClassIdCButton extends CEnum { static enum = ["CButtonUnknown",...CGAME_CATALOGS.CButton]}
export class EClassIdCCamera extends CEnum { static enum = ["CCameraUnknown",...CGAME_CATALOGS.CCamera]}
export class EClassIdCCampaign extends CEnum { static enum = ["CCampaignUnknown",...CGAME_CATALOGS.CCampaign]}
export class EClassIdCCharacter extends CEnum { static enum = ["CCharacterUnknown",...CGAME_CATALOGS.CCharacter]}
export class EClassIdCCliff extends CEnum { static enum = ["CCliffUnknown",...CGAME_CATALOGS.CCliff]}
export class EClassIdCCliffMesh extends CEnum { static enum = ["CCliffMeshUnknown",...CGAME_CATALOGS.CCliffMesh]}
export class EClassIdCColorStyle extends CEnum { static enum = ["CColorStyleUnknown",...CGAME_CATALOGS.CColorStyle]}
export class EClassIdCCommander extends CEnum { static enum = ["CCommanderUnknown",...CGAME_CATALOGS.CCommander]}
export class EClassIdCConfig extends CEnum { static enum = ["CConfigUnknown",...CGAME_CATALOGS.CConfig]}
export class EClassIdCConsoleSkin extends CEnum { static enum = ["CConsoleSkinUnknown",...CGAME_CATALOGS.CConsoleSkin]}
export class EClassIdCConversation extends CEnum { static enum = ["CConversationUnknown",...CGAME_CATALOGS.CConversation]}
export class EClassIdCConversationState extends CEnum { static enum = ["CConversationStateUnknown",...CGAME_CATALOGS.CConversationState]}
export class EClassIdCCursor extends CEnum { static enum = ["CCursorUnknown",...CGAME_CATALOGS.CCursor]}
export class EClassIdCDataCollection extends CEnum { static enum = ["CDataCollectionUnknown",...CGAME_CATALOGS.CDataCollection]}
export class EClassIdCDataCollectionPattern extends CEnum { static enum = ["CDataCollectionPatternUnknown",...CGAME_CATALOGS.CDataCollectionPattern]}
export class EClassIdCDecalPack extends CEnum { static enum = ["CDecalPackUnknown",...CGAME_CATALOGS.CDecalPack]}
export class EClassIdCDSP extends CEnum { static enum = ["CDSPUnknown",...CGAME_CATALOGS.CDSP]}
export class EClassIdCEffect extends CEnum { static enum = ["CEffectUnknown",...CGAME_CATALOGS.CEffect]}
export class EClassIdCEmoticon extends CEnum { static enum = ["CEmoticonUnknown",...CGAME_CATALOGS.CEmoticon]}
export class EClassIdCEmoticonPack extends CEnum { static enum = ["CEmoticonPackUnknown",...CGAME_CATALOGS.CEmoticonPack]}
export class EClassIdCError extends CEnum { static enum = ["CErrorUnknown",...CGAME_CATALOGS.CError]}
export class EClassIdCFootprint extends CEnum { static enum = ["CFootprintUnknown",...CGAME_CATALOGS.CFootprint]}
export class EClassIdCFoW extends CEnum { static enum = ["CFoWUnknown",...CGAME_CATALOGS.CFoW]}
export class EClassIdCGame extends CEnum { static enum = ["CGameUnknown",...CGAME_CATALOGS.CGame]}
export class EClassIdCGameUI extends CEnum { static enum = ["CGameUIUnknown",...CGAME_CATALOGS.CGameUI]}
export class EClassIdCHerd extends CEnum { static enum = ["CHerdUnknown",...CGAME_CATALOGS.CHerd]}
export class EClassIdCHerdNode extends CEnum { static enum = ["CHerdNodeUnknown",...CGAME_CATALOGS.CHerdNode]}
export class EClassIdCHero extends CEnum { static enum = ["CHeroUnknown",...CGAME_CATALOGS.CHero]}
export class EClassIdCHeroAbil extends CEnum { static enum = ["CHeroAbilUnknown",...CGAME_CATALOGS.CHeroAbil]}
export class EClassIdCHeroStat extends CEnum { static enum = ["CHeroStatUnknown",...CGAME_CATALOGS.CHeroStat]}
export class EClassIdCItem extends CEnum { static enum = ["CItemUnknown",...CGAME_CATALOGS.CItem]}
export class EClassIdCItemClass extends CEnum { static enum = ["CItemClassUnknown",...CGAME_CATALOGS.CItemClass]}
export class EClassIdCItemContainer extends CEnum { static enum = ["CItemContainerUnknown",...CGAME_CATALOGS.CItemContainer]}
export class EClassIdCKinetic extends CEnum { static enum = ["CKineticUnknown",...CGAME_CATALOGS.CKinetic]}
export class EClassIdCLensFlareSet extends CEnum { static enum = ["CLensFlareSetUnknown",...CGAME_CATALOGS.CLensFlareSet]}
export class EClassIdCLight extends CEnum { static enum = ["CLightUnknown",...CGAME_CATALOGS.CLight]}
export class EClassIdCLocation extends CEnum { static enum = ["CLocationUnknown",...CGAME_CATALOGS.CLocation]}
export class EClassIdCLoot extends CEnum { static enum = ["CLootUnknown",...CGAME_CATALOGS.CLoot]}
export class EClassIdCMap extends CEnum { static enum = ["CMapUnknown",...CGAME_CATALOGS.CMap]}
export class EClassIdCModel extends CEnum { static enum = ["CModelUnknown",...CGAME_CATALOGS.CModel]}
export class EClassIdCMount extends CEnum { static enum = ["CMountUnknown",...CGAME_CATALOGS.CMount]}
export class EClassIdCMover extends CEnum { static enum = ["CMoverUnknown",...CGAME_CATALOGS.CMover]}
export class EClassIdCObjective extends CEnum { static enum = ["CObjectiveUnknown",...CGAME_CATALOGS.CObjective]}
export class EClassIdCPhysicsMaterial extends CEnum { static enum = ["CPhysicsMaterialUnknown",...CGAME_CATALOGS.CPhysicsMaterial]}
export class EClassIdCPing extends CEnum { static enum = ["CPingUnknown",...CGAME_CATALOGS.CPing]}
export class EClassIdCPlayerResponse extends CEnum { static enum = ["CPlayerResponseUnknown",...CGAME_CATALOGS.CPlayerResponse]}
export class EClassIdCPortraitPack extends CEnum { static enum = ["CPortraitPackUnknown",...CGAME_CATALOGS.CPortraitPack]}
export class EClassIdCPreload extends CEnum { static enum = ["CPreloadUnknown",...CGAME_CATALOGS.CPreload]}
export class EClassIdCPremiumMap extends CEnum { static enum = ["CPremiumMapUnknown",...CGAME_CATALOGS.CPremiumMap]}
export class EClassIdCRace extends CEnum { static enum = ["CRaceUnknown",...CGAME_CATALOGS.CRace]}
export class EClassIdCRaceBannerPack extends CEnum { static enum = ["CRaceBannerPackUnknown",...CGAME_CATALOGS.CRaceBannerPack]}
export class EClassIdCRequirement extends CEnum { static enum = ["CRequirementUnknown",...CGAME_CATALOGS.CRequirement]}
export class EClassIdCRequirementNode extends CEnum { static enum = ["CRequirementNodeUnknown",...CGAME_CATALOGS.CRequirementNode]}
export class EClassIdCReverb extends CEnum { static enum = ["CReverbUnknown",...CGAME_CATALOGS.CReverb]}
export class EClassIdCReward extends CEnum { static enum = ["CRewardUnknown",...CGAME_CATALOGS.CReward]}
export class EClassIdCScoreResult extends CEnum { static enum = ["CScoreResultUnknown",...CGAME_CATALOGS.CScoreResult]}
export class EClassIdCScoreValue extends CEnum { static enum = ["CScoreValueUnknown",...CGAME_CATALOGS.CScoreValue]}
export class EClassIdCShape extends CEnum { static enum = ["CShapeUnknown",...CGAME_CATALOGS.CShape]}
export class EClassIdCSkin extends CEnum { static enum = ["CSkinUnknown",...CGAME_CATALOGS.CSkin]}
export class EClassIdCSkinPack extends CEnum { static enum = ["CSkinPackUnknown",...CGAME_CATALOGS.CSkinPack]}
export class EClassIdCSound extends CEnum { static enum = ["CSoundUnknown",...CGAME_CATALOGS.CSound]}
export class EClassIdCSoundExclusivity extends CEnum { static enum = ["CSoundExclusivityUnknown",...CGAME_CATALOGS.CSoundExclusivity]}
export class EClassIdCSoundMixSnapshot extends CEnum { static enum = ["CSoundMixSnapshotUnknown",...CGAME_CATALOGS.CSoundMixSnapshot]}
export class EClassIdCSoundtrack extends CEnum { static enum = ["CSoundtrackUnknown",...CGAME_CATALOGS.CSoundtrack]}
export class EClassIdCSpray extends CEnum { static enum = ["CSprayUnknown",...CGAME_CATALOGS.CSpray]}
export class EClassIdCSprayPack extends CEnum { static enum = ["CSprayPackUnknown",...CGAME_CATALOGS.CSprayPack]}
export class EClassIdCStimPack extends CEnum { static enum = ["CStimPackUnknown",...CGAME_CATALOGS.CStimPack]}
export class EClassIdCTacCooldown extends CEnum { static enum = ["CTacCooldownUnknown",...CGAME_CATALOGS.CTacCooldown]}
export class EClassIdCTactical extends CEnum { static enum = ["CTacticalUnknown",...CGAME_CATALOGS.CTactical]}
export class EClassIdCTalent extends CEnum { static enum = ["CTalentUnknown",...CGAME_CATALOGS.CTalent]}
export class EClassIdCTalentProfile extends CEnum { static enum = ["CTalentProfileUnknown",...CGAME_CATALOGS.CTalentProfile]}
export class EClassIdCTargetFind extends CEnum { static enum = ["CTargetFindUnknown",...CGAME_CATALOGS.CTargetFind]}
export class EClassIdCTargetSort extends CEnum { static enum = ["CTargetSortUnknown",...CGAME_CATALOGS.CTargetSort]}
export class EClassIdCTerrain extends CEnum { static enum = ["CTerrainUnknown",...CGAME_CATALOGS.CTerrain]}
export class EClassIdCTerrainObject extends CEnum { static enum = ["CTerrainObjectUnknown",...CGAME_CATALOGS.CTerrainObject]}
export class EClassIdCCliffDoodad extends CEnum { static enum = ["CCliffDoodadUnknown",...CGAME_CATALOGS.CCliffDoodad]}
export class EClassIdCTerrainTex extends CEnum { static enum = ["CTerrainTexUnknown",...CGAME_CATALOGS.CTerrainTex]}
export class EClassIdCTexture extends CEnum { static enum = ["CTextureUnknown",...CGAME_CATALOGS.CTexture]}
export class EClassIdCTextureSheet extends CEnum { static enum = ["CTextureSheetUnknown",...CGAME_CATALOGS.CTextureSheet]}
export class EClassIdCTile extends CEnum { static enum = ["CTileUnknown",...CGAME_CATALOGS.CTile]}
export class EClassIdCTrophy extends CEnum { static enum = ["CTrophyUnknown",...CGAME_CATALOGS.CTrophy]}
export class EClassIdCTurret extends CEnum { static enum = ["CTurretUnknown",...CGAME_CATALOGS.CTurret]}
export class EClassIdCUnit extends CEnum { static enum = ["CUnitUnknown",...CGAME_CATALOGS.CUnit]}
export class EClassIdCUpgrade extends CEnum { static enum = ["CUpgradeUnknown",...CGAME_CATALOGS.CUpgrade]}
export class EClassIdCUser extends CEnum { static enum = ["CUserUnknown",...CGAME_CATALOGS.CUser]}
export class EClassIdCValidator extends CEnum { static enum = ["CValidatorUnknown",...CGAME_CATALOGS.CValidator]}
export class EClassIdCVoiceOver extends CEnum { static enum = ["CVoiceOverUnknown",...CGAME_CATALOGS.CVoiceOver]}
export class EClassIdCVoicePack extends CEnum { static enum = ["CVoicePackUnknown",...CGAME_CATALOGS.CVoicePack]}
export class EClassIdCWarChest extends CEnum { static enum = ["CWarChestUnknown",...CGAME_CATALOGS.CWarChest]}
export class EClassIdCWarChestSeason extends CEnum { static enum = ["CWarChestSeasonUnknown",...CGAME_CATALOGS.CWarChestSeason]}
export class EClassIdCWater extends CEnum { static enum = ["CWaterUnknown",...CGAME_CATALOGS.CWater]}
export class EClassIdCWeapon extends CEnum { static enum = ["CWeaponUnknown",...CGAME_CATALOGS.CWeapon]}



export class EAbilTechPlayer extends CEnum {}
export class EAbilAlignment extends CEnum {}
export class EAcquireLevel extends CEnum {}
export class ECursorRangeMode extends CEnum {}
export class EAbilArmMagazineLaunch extends CEnum {}
export class EEffectLocationType extends CEnum {}
export class EAbilBehaviorCycleMode extends CEnum {}
export class EAbilBuildType extends CEnum {}
export class EAbilReviveVital extends CEnum {}
export class EAbilOrderDisplayType extends CEnum {}
export class ECooldownLocation extends CEnum {}
export class EChargeLocation extends CEnum {}
export class EAbilArmMagazineManage extends CEnum {}
export class EAbilCmdState extends CEnum {}
export class EAbilInventoryAlignment extends CEnum {}
export class EAbilMorphPhase extends CEnum {}
export class EAbilMorphSection extends CEnum {}
export class EAbilTrainLocation extends CEnum {}
export class EAbilTrainRotation extends CEnum {}
export class ECargoSpace extends CEnum {}
export class EAccumulatorOperation extends CEnum {}
export class EAchievementTermEvaluate extends CEnum {}
export class EAchievementTermPrevious extends CEnum {}
export class EAchievementTermCombine extends CEnum {}
export class EActorRequestCreateSharing extends CEnum {}
export class EActorHostedPropInheritType extends CEnum {}
export class EActorScopeBearingsTrackingType extends CEnum {}
export class EFogVisibility extends CEnum {}
export class EActorSplatHeight extends CEnum {}
export class EActorProximity extends CEnum {}
export class EActorModelMaterialType extends CEnum {}
export class EActorSoundPlayMode extends CEnum {}
export class ESplatLayer extends CEnum {}
export class EActorEffectScope extends CEnum {}
export class EActorShieldFlashType extends CEnum {}
export class EMinimapShape extends CEnum {}
export class ESquibType extends CEnum {}
export class EActorSiteBillboardType extends CEnum {}
export class EActorSiteOrbiterType extends CEnum {}
export class EActorSiteOpActionLocation extends CEnum {}
export class EActorSiteOpAttachSource extends CEnum {}
export class EActorSiteOpBasicType extends CEnum {}
export class EActorEffectLocation extends CEnum {}
export class EActorHeightSourceType extends CEnum {}
export class EActorIncomingType extends CEnum {}
export class EActorSiteOpOrientAttachPointToType extends CEnum {}
export class EActorRadialDistribution extends CEnum {}
export class EActorSiteOpPhysicsImpactType extends CEnum {}
export class EActorCrossbarDistribution extends CEnum {}
export class EActorSiteOpRotatorType extends CEnum {}
export class EActorHeightTestType extends CEnum {}
export class EActorTiltType extends CEnum {}
export class EActorTextAlignment extends CEnum {}
export class EAttachmentID extends CEnum {}
export class EUnitSound extends CEnum {}
export class EAlertPeripheral extends CEnum {}
export class EAMArcTestType extends CEnum {}
export class EAMFilterLogic extends CEnum {}
export class EAMFilterAttachType extends CEnum {}
export class EAMFilterType extends CEnum {}
export class EAMAttachType extends CEnum {}
export class EAMOccupancyLogic extends CEnum {}
export class EAMNumericField extends CEnum {}
export class EAMNumericFieldOp extends CEnum {}
export class EAMPatternType extends CEnum {}
export class EAttachKeyword extends CEnum {}
export class EAMRandomDistribution extends CEnum {}
export class EAMReductionType extends CEnum {}
export class EBankConditionCombine extends CEnum {}
export class EBehaviorAlignment extends CEnum {}
export class EBehaviorBuffReplace extends CEnum {}
export class ECameraHeightMap extends CEnum {}
export class ECharacterGender extends CEnum {}
export class ECharacterRace extends CEnum {}
export class ECharacterRelevance extends CEnum {}
export class EConversationProductionLevel extends CEnum {}
export class EImplementionLevel extends CEnum {}
export class EOscillator extends CEnum {}
export class EListWalkMode extends CEnum {}
export class EDamageVisibility extends CEnum {}
export class EDamageTotal extends CEnum {}
export class EMoverPatternType extends CEnum {}
export class EEffectRemoveBehaviorAlignment extends CEnum {}
export class EBehaviorHeroicState extends CEnum {}
export class EGlueTheme extends CEnum {}
export class EPurchaseWarningCondition extends CEnum {}
export class EOcclusion extends CEnum {}
export class EPausedParticleSystemBehavior extends CEnum {}
export class EFoliageLayer extends CEnum {}
export class EPathMode extends CEnum {}
export class EResponseContinueMethod extends CEnum {}
export class EDamageResponseDamageValue extends CEnum {}
export class EPreloadTiming extends CEnum {}
export class EScoreSort extends CEnum {}
export class EScoreValueReport extends CEnum {}
export class EScoreCollapse extends CEnum {}
export class EScoreValueType extends CEnum {}
export class EScoreValue extends CEnum {}
export class EScoreValueOperation extends CEnum {}
export class ESoundBlend extends CEnum {}
export class ESoundDupe extends CEnum {}
export class ESoundMode extends CEnum {}
export class ESoundSelect extends CEnum {}
export class EExclusivityAction extends CEnum {}
export class EExclusivityQueueAction extends CEnum {}
export class ETargetFindSet extends CEnum {}
export class ETurretIdle extends CEnum {}
export class EDeathReveal extends CEnum {}
export class EUnitMob extends CEnum {}
export class EUnitGender extends CEnum {}
export class EResourceState extends CEnum {}
export class EUnitResponse extends CEnum {}
export class ECostCategory extends CEnum {}
export class EKillDisplay extends CEnum {}
export class ERankDisplay extends CEnum {}
export class EEditorTextType extends CEnum {}
export class ETextTagEdge extends CEnum {}
export class EValidateCombine extends CEnum {}
export class EGameResult extends CEnum {}
export class EUnitAIFlag extends CEnum {}
export class EBehaviorState extends CEnum {}
export class EUnitTestState extends CEnum {}
export class EPlayerRelationship extends CEnum {}
export class EUnitType extends CEnum {}
export class EWeaponType extends CEnum {}
export class EVitalType extends CEnum {}
export class EWeaponPrioritization extends CEnum {}
export class EWeaponLegacyMovement extends CEnum {}
export class EAchievementTagCheck extends CEnum {}
export class EActorRequestScope extends CEnum {}
export class EActorRequestActor extends CEnum {}
export class EActorModelAspectPerson extends CEnum {}
export class EActorModelAspectObservingPoV extends CEnum {}
export class EActorModelAspectRegardsAs extends CEnum {}
export class EActorModelAspectDuring extends CEnum {}
export class EActorModelAspectObservedPlayerType extends CEnum {}
export class EActorModelAspectModelOwnerType extends CEnum {}
export class EActorModelAspectTest extends CEnum {}
export class EActorPhysicsImpactRangeType extends CEnum {}
export class EActorQuadDecorationFunction extends CEnum {}
export class EActorSoundValueSource extends CEnum {}
export class EActorResponseScope extends CEnum {}
export class EActorIntersectType extends CEnum {}
export class EActorAnimTransitionType extends CEnum {}
export class EActorAnimPropMatchType extends CEnum {}
export class ESerpentType extends CEnum {}
export class ECmdResult extends CEnum {}
export class EEffectTimeScale extends CEnum {}
export class EDamageResponseHandledValue extends CEnum {}
export class EConversationConditionOp extends CEnum {}
export class EConversationActionOp extends CEnum {}
export class EConversationConditionCheck extends CEnum {}
export class EConversationSelectionMethod extends CEnum {}
export class EEffectModifyTurret extends CEnum {}
export class EFootprintShapeMode extends CEnum {}
export class ESoundFormat extends CEnum {}
export class ESoundResampler extends CEnum {}
export class ESpeakerMode extends CEnum {}
export class EMuteControl extends CEnum {}
export class EVolumeControl extends CEnum {}
export class ESoundMaxMethod extends CEnum {}
export class EGameCategoryUsage extends CEnum {}
export class EVariationCommands extends CEnum {}
export class ETonemapRegionTypes extends CEnum {}
export class EModelEvent extends CEnum {}
export class EModelQuality extends CEnum {}
export class EPhysicsMaterial extends CEnum {}
export class EMotionDriverType extends CEnum {}
export class EMotionTurnType extends CEnum {}
export class EMotionActorTrackingType extends CEnum {}
export class EMotionArrivalTestType extends CEnum {}
export class EMotionBlendType extends CEnum {}
export class EMotionRotationLaunchActorType extends CEnum {}
export class EMotionRotationActorType extends CEnum {}
export class EMotionThrowRotationType extends CEnum {}
export class EMotionOverlayType extends CEnum {}
export class EMotionOverlayPolarity extends CEnum {}
export class ERequirementState extends CEnum {}
export class ECardButtonType extends CEnum {}
export class EVoiceOverSkinState extends CEnum {}
export class EVoiceOverSoundType extends CEnum {}
export class ESoundMaxPrioritization extends CEnum {}
export class EActorOverkillTestType extends CEnum {}
export class ESkillPoint extends CEnum {}
export class ESoundDupePriority extends CEnum {}
export class EKineticFollow extends CEnum {}
export class ETargetModeValidation extends CEnum {}
export class EQuickCastMode extends CEnum {}
export class EHerdClosestTo extends CEnum {}
export class EEffectContainer extends CEnum {}
export class EEffectModifyFacing extends CEnum {}
export class EBehaviorUnitTrackerAtMaxRule extends CEnum {}
export class EBehaviorUnitTrackerSnapRule extends CEnum {}
export class EArtifactType extends CEnum {}
export class EActorForceOrigin extends CEnum {}
export class EActorCombatRevealDurationType extends CEnum {}
export class EActorForceField extends CEnum {}
export class EAbilLastTarget extends CEnum {}
export class EAccumulatorApplicationRule extends CEnum {}
export class EVitalsAccumulatorModificationType extends CEnum {}
export class EAccumulatorBehaviorType extends CEnum {}
export class EActorPlayerIdSource extends CEnum {}
export class EActorForceDirection extends CEnum {}
export class EActorSiteOpTetherEnableType extends CEnum {}
export class EAbilAttackStage extends CEnum { static enum = ["Approach","Attack","Loiter"]}
export class EAbilBehaviorStage extends CEnum { static enum = ["Untoggled","Toggled"]}
export class EAbilBuildStage extends CEnum { static enum = ["Approach","Wait","Construct","Halt","Resume","Finish","Collide"]}
export class EAbilEffectStage extends CEnum { static enum = ["Approach","Wait","Prep","Cast","Channel","Finish","Bail"]}
export class EAbilHarvestStage extends CEnum { static enum = ["ApproachResource","WaitAtResource","Harvest","WaitToReturn","WaitForDropOff","ApproachDropOff","DropOff"]}
export class EAbilMorphStage extends CEnum { static enum = ["Approach","Wait","AbilsStart","AbilsEnd","ActorStart","ActorEnd","CollideStart","CollideEnd","FacingStart","FacingEnd","MoverStart","MoverEnd","StatsStart","StatsEnd","UnitStart","UnitEnd"]}
export class EAbilRallyStage extends CEnum { static enum = ["Place"]}
export class EAbilArmMagazineCmd extends CEnum { static enum = ["Ammo1","Ammo2","Ammo3","Ammo4","Ammo5","Ammo6","Ammo7","Ammo8","Ammo9","Ammo10","Ammo11","Ammo12","Ammo13","Ammo14","Ammo15","Ammo16","Ammo17","Ammo18","Ammo19","Ammo20"]}
export class EAbilAttackCmd extends CEnum { static enum = ["Execute","Towards","Barrage"]}
export class EAbilAttackModifierCmd extends CEnum { static enum = ["Execute"]}
export class EAbilAugmentCmd extends CEnum { static enum = ["Execute"]}
export class EAbilBatteryCmd extends CEnum { static enum = ["Execute"]}
export class EAbilBeaconCmd extends CEnum { static enum = ["Cancel","Move"]}
export class EAbilBehaviorCmd extends CEnum { static enum = ["On","Off"]}
export class EAbilBuildCmd extends CEnum { static enum = ["Build1","Build2","Build3","Build4","Build5","Build6","Build7","Build8","Build9","Build10","Build11","Build12","Build13","Build14","Build15","Build16","Build17","Build18","Build19","Build20","Build21","Build22","Build23","Build24","Build25","Build26","Build27","Build28","Build29","Build30","Halt"]}
export class EAbilBuildableCmd extends CEnum { static enum = ["Cancel","Halt"]}
export class EAbilEffectInstantCmd extends CEnum { static enum = ["Execute","Cancel"]}
export class EAbilEffectTargetCmd extends CEnum { static enum = ["Execute","Cancel"]}
export class EAbilHarvestCmd extends CEnum { static enum = ["Gather","Return","Cancel"]}
export class EAbilInteractCmd extends CEnum { static enum = ["Designate"]}
export class EAbilInventoryCmd extends CEnum { static enum = ["Drop","Move","Take","ItemInstant","ItemTarget","ItemCancel","PawnInstant","ItemTogOn","ItemTogOff"]}
export class EAbilLearnCmd extends CEnum { static enum = ["Learn1","Learn2","Learn3","Learn4","Learn5","Learn6","Learn7","Learn8","Learn9","Learn10","Learn11","Learn12","Learn13","Learn14","Learn15","Learn16","Learn17","Learn18","Learn19","Learn20"]}
export class EAbilMergeCmd extends CEnum { static enum = ["SelectedUnits","WithTarget"]}
export class EAbilMorphCmd extends CEnum { static enum = ["Execute","Cancel","Unmorph"]}
export class EAbilMergeableCmd extends CEnum { static enum = ["Cancel"]}
export class EAbilMoveCmd extends CEnum { static enum = ["Move","Patrol","HoldPos","AcquireMove","Turn"]}
export class EAbilPawnCmd extends CEnum { static enum = ["Pawn1","Pawn2","Pawn3","Pawn4","Pawn5","Pawn6","Pawn7","Pawn8","Pawn9","Pawn10","Pawn11","Pawn12","Pawn13","Pawn14","Pawn15","Pawn16","Pawn17","Pawn18","Pawn19","Pawn20"]}
export class EAbilQueueCmd extends CEnum { static enum = ["CancelLast","CancelSlot"]}
export class EAbilRallyCmd extends CEnum { static enum = ["Rally1","Rally2","Rally3","Rally4"]}
export class EAbilRedirectInstantCmd extends CEnum { static enum = ["Execute"]}
export class EAbilRedirectTargetCmd extends CEnum { static enum = ["Execute"]}
export class EAbilResearchCmd extends CEnum { static enum = ["Research1","Research2","Research3","Research4","Research5","Research6","Research7","Research8","Research9","Research10","Research11","Research12","Research13","Research14","Research15","Research16","Research17","Research18","Research19","Research20","Research21","Research22","Research23","Research24","Research25","Research26","Research27","Research28","Research29","Research30"]}
export class EAbilReviveCmd extends CEnum { static enum = ["Revive1","Revive2","Revive3","Revive4","Revive5","Revive6","Revive7","Revive8","Revive9","Revive10","Revive11","Revive12","Revive13","Revive14","Revive15","Revive16","Revive17","Revive18","Revive19","Revive20","ReviveAtTarget1","ReviveAtTarget2","ReviveAtTarget3","ReviveAtTarget4","ReviveAtTarget5","ReviveAtTarget6","ReviveAtTarget7","ReviveAtTarget8","ReviveAtTarget9","ReviveAtTarget10"]}
export class EAbilSpecializeCmd extends CEnum { static enum = ["Specialize1","Specialize2","Specialize3","Specialize4","Specialize5","Specialize6","Specialize7","Specialize8","Specialize9","Specialize10","Specialize11","Specialize12","Specialize13","Specialize14","Specialize15","Specialize16","Specialize17","Specialize18","Specialize19","Specialize20"]}
export class EAbilStopCmd extends CEnum { static enum = ["Stop","HoldFire","Cheer","Dance","Tease","RequestPickup"]}
export class EAbilTrainCmd extends CEnum { static enum = ["Train1","Train2","Train3","Train4","Train5","Train6","Train7","Train8","Train9","Train10","Train11","Train12","Train13","Train14","Train15","Train16","Train17","Train18","Train19","Train20","Train21","Train22","Train23","Train24","Train25","Train26","Train27","Train28","Train29","Train30"]}
export class EAbilTransportCmd extends CEnum { static enum = ["Load","UnloadAll","UnloadAt","UnloadUnit","LoadAll"]}
export class EAbilWarpableCmd extends CEnum { static enum = ["Cancel"]}
export class EAbilWarpTrainCmd extends CEnum { static enum = ["Train1","Train2","Train3","Train4","Train5","Train6","Train7","Train8","Train9","Train10","Train11","Train12","Train13","Train14","Train15","Train16","Train17","Train18","Train19","Train20"]}
export class EAbilityCategory extends CEnum { static enum = ["User1","User2","User3","User4","User5","Magic","Physical","Aura","Passive","Dispel","PassivePhysical","PassiveMagic","Heal","SpellSteal","Repair","Polymorph","BlockByMorph","Ultimate","CanBeDisabled","CanBeSilenced","CanBeIllusionDisabled"]}
export class EUnitStatusGroup extends CEnum { static enum = ["Owner","Allied","Enemy","All"]}
export class EUnitStatus extends CEnum { static enum = ["Shields","Life","Energy","Cargo","Progress","Duration","Magazine","Workers","Custom","Charges"]}
export class EFlyerDisplay extends CEnum { static enum = ["None","Selected","All"]}
export class EArmyCategoryState extends CEnum { static enum = ["Locked","Unlocked"]}
export class EArmyUnitState extends CEnum { static enum = ["Locked","Unlocked","Purchased","Disabled"]}
export class EArmyUpgradeState extends CEnum { static enum = ["Locked","Unlocked","Purchased","Disabled"]}
export class EBehaviorCategory extends CEnum { static enum = ["Permanent","Restorable","Temporary","Cloak","Invulnerable","Slow","Fast","Stun","Reveal","Magic","Physical","Aura","Passive","PassiveMagic","TeleportRemove","CanSteal","TimedLife","User1","User2","User3","User4","User5","User6","User7","User8","User9","User10","User11","User12","User13","User14","User15"]}
export class EAttackModifierStage extends CEnum { static enum = ["Init","Idle","Waiting","Applied","Fired"]}
export class EDamageLocation extends CEnum { static enum = ["Attacker","Defender"]}
export class EUIColorMode extends CEnum {}
export class EUIColorRelation extends CEnum {}
export class ECommanderTalentType extends CEnum { static enum = ["Passive","Ability","Bundle","Unit"]}
export class ECommanderMasteryTalentType extends CEnum { static enum = ["None","Seconds","Percent"]}
export class EPortraitOverlayType extends CEnum { static enum = ["Level","HeroLeague","TeamLeague"]}
export class EAllianceId extends CEnum { static enum = ["Passive","Vision","Control","Spend","Trade","SeekHelp","GiveHelp","Chat","Defeat","Pushable","Power"]}
export class EAlliancePlayer extends CEnum { static enum = ["Control","Upkeep"]}
export class EFlagOperation extends CEnum { static enum = ["Set","Clear","Toggle"]}
export class EPlayerType extends CEnum { static enum = ["None","User","Computer","Neutral","Hostile"]}
export class ETargetFilter extends CEnum { static enum = ["Self","Player","Ally","Neutral","Enemy","Air","Ground","Light","Armored","Biological","Robotic","Mechanical","Psionic","Massive","Structure","Hover","Heroic","User1","Worker","RawResource","HarvestableResource","Missile","Destructible","Item","Uncommandable","CanHaveEnergy","CanHaveShields","PreventDefeat","PreventReveal","Buried","Cloaked","Visible","Stasis","UnderConstruction","Dead","Revivable","Hidden","Hallucination","Invulnerable","HasEnergy","HasShields","Benign","Passive","Detector","Radar","Stunned","Summoned","Unstoppable","Outer","Resistant","Silenced","Dazed","MapBoss","Decaying","Raisable","HeroUnit","NonBuildingUnit","GroundUnit","AirUnit","Powerup","PowerupOrItem","NeutralHostile"]}
export class EMarkerMatch extends CEnum { static enum = ["Id","Link","CasterPlayer","CasterUnit"]}
export class EHeightMap extends CEnum { static enum = ["Air","Glide","Ground"]}
export class EPlane extends CEnum { static enum = ["Ground","Air"]}
export class EPlacementTest extends CEnum { static enum = ["Creep","Power","Fog","IgnoreBlockers","IgnoreInvisible","Zone","Cliff","Density","OriginSideOfFootprints"]}
export class EUnitUserFlag extends CEnum { static enum = ["Unit","ArmyUnit","Hero","Building","Ancient","Ward","Item","Powerup","Projectile","Destructible","Tree","Bridge","CanSleep","User14","User15","User16"]}
export class EUnitVital extends CEnum { static enum = ["Life","Shields","Energy"]}
export class EDamageType extends CEnum { static enum = ["Normal","Enhanced","Fire","Cold","Lightning","Poison","Disease","Divine","Magic","Sonic","Acid","Force","Death","Mind","Plant","Defensive","Demolition","SlowPoison","SpiritLink","ShadowStrike","Universal"]}
export class EDamageCategory extends CEnum { static enum = ["Universal","Magical","Physical"]}
export class EAttackType extends CEnum { static enum = ["Spell","Normal","Pierce","Siege","Magic","Chaos","Hero"]}
export class EArmorType extends CEnum { static enum = ["Small","Medium","Large","Fort","Normal","Hero","Divine","None"]}
export class EDamageKind extends CEnum { static enum = ["Spell","Melee","Ranged","Splash","NoProc"]}
export class EDeathType extends CEnum { static enum = ["Normal","Remove","Blast","Disintegrate","Eat","Electrocute","Eviscerate","Fire","Freeze","Impact","Morph","Reincarnation","Silentkill","Squish","Timeout","Unlink","UnderConstruction","Salvage","Cancel","TrainingComplete","TrainingCancel"]}
export class ECooldownOperation extends CEnum { static enum = ["Default","Add","Multiply","Min","Max","Set"]}
export class EResourceType extends CEnum { static enum = ["Minerals","Vespene","Terrazine","Custom"]}
export class EEffectLocation extends CEnum { static enum = ["CasterUnit","CasterPoint","CasterUnitOrPoint","CasterOuterUnit","CasterOuterPoint","CasterOuterUnitOrPoint","SourceUnit","SourcePoint","SourceUnitOrPoint","OuterUnit","OuterPoint","OuterUnitOrPoint","TargetUnit","TargetPoint","TargetUnitOrPoint","TargetOuterUnit","TargetOuterPoint","TargetOuterUnitOrPoint","OriginUnit","OriginPoint","OriginUnitOrPoint"]}
export class EEffectPlayer extends CEnum { static enum = ["Origin","Creator","Caster","CasterOuter","Outer","Source","Target","TargetOuter","Neutral","Hostile"]}
export class EEffectUnit extends CEnum { static enum = ["Caster","CasterOuter","Outer","Source","Target","TargetOuter","Origin"]}
export class ETeamColor extends CEnum { static enum = ["Diffuse","Emissive","Selected","Attacked"]}
export class ETechCategory extends CEnum {}
export class EValueCompare extends CEnum { static enum = ["Eq","NE","LT","GT","LE","GE"]}
export class EBeacon extends CEnum { static enum = ["Army","Defend","Attack","Harass","Idle","Auto","Detect","Scout","Claim","Expand","Rally","Custom1","Custom2","Custom3","Custom4"]}
export class ECustomBuildOpening extends CEnum { static enum = ["Invalid","One","Two","Three","Four","Five"]}
export class ECustomBuildLateGame extends CEnum { static enum = ["Invalid","One","Two","Three","Four","Five"]}
export class EUnitTaunt extends CEnum { static enum = ["Cheer","Dance","Tease"]}
export class EEffectAmount extends CEnum { static enum = ["Absorbed","Damaged","Dodged","Found","Healed","Killed","Splashed","LifeChanged","ShieldsChanged","EnergyChanged","LifeLeeched","ShieldsLeeched","EnergyLeeched","LifeGained","ShieldsGained","EnergyGained","DamageInherited"]}
export class EEffectHistory extends CEnum { static enum = ["Damage","Death","Healing","Modifier"]}
export class EGameCatalog extends CEnum { static enum = GAME_NAMESPACES}
export class EUnitColorStyle extends CEnum { static enum = ["Normal","OverrideMinimap","OverrideWorld"]}
export class EHotkey extends CEnum { static enum = ["FPS","Music","Sound","PTT","DisplayMode","ChatAll","ChatAllies","ChatCancel","ChatDefault","ChatIndividual","ChatRecipient","ChatSend","DialogDismiss","MenuAchievements","MenuGame","MenuMessages","MenuHelp","MenuSocial","LeaderNone","LeaderResources","LeaderIncome","LeaderSpending","LeaderUnits","LeaderStructures","LeaderUnitsLost","LeaderProduction","LeaderUpgrades","LeaderArmy","LeaderAPM","LeaderCPM","ObserveAllPlayers","ObserveAutoCamera","ObserveClearSelection","ObserveCommentator","ObservePlayer0","ObservePlayer1","ObservePlayer2","ObservePlayer3","ObservePlayer4","ObservePlayer5","ObservePlayer6","ObservePlayer7","ObservePlayer8","ObservePlayer9","ObservePlayer10","ObservePlayer11","ObservePlayer12","ObservePlayer13","ObservePlayer14","ObservePlayer15","ObservePreview","ObserveSelected","ObserveStatusBars","ObserveZoomCameraLevel1","ObserveZoomCameraLevel2","NamePanel","StatPanelResources","StatPanelArmySupply","StatPanelUnitsLost","StatPanelAPM","StatPanelCPM","ToggleVersusModeSides","ToggleWorldPanel","ConversationSkipOne","CinematicSkip","AICommunication","AIArmy","AIScout","AIDetect","AIExpand","AIBuild","AIClearAll","AIDelete","AIExit","AICancel","AlertRecall","ArmySelect","CameraCenter","CameraFollow","CameraMoveUp","CameraMoveDown","CameraMoveLeft","CameraMoveRight","CameraTurnLeft","CameraTurnRight","CameraZoomFirst","CameraZoomLast","CameraZoomNext","CameraZoomPrev","CameraPush","CommanderAbility0","CommanderAbility1","CommanderAbility2","CommanderAbility3","ControlGroupAppend0","ControlGroupAppend1","ControlGroupAppend2","ControlGroupAppend3","ControlGroupAppend4","ControlGroupAppend5","ControlGroupAppend6","ControlGroupAppend7","ControlGroupAppend8","ControlGroupAppend9","ControlGroupAppendAndSteal0","ControlGroupAppendAndSteal1","ControlGroupAppendAndSteal2","ControlGroupAppendAndSteal3","ControlGroupAppendAndSteal4","ControlGroupAppendAndSteal5","ControlGroupAppendAndSteal6","ControlGroupAppendAndSteal7","ControlGroupAppendAndSteal8","ControlGroupAppendAndSteal9","ControlGroupAssign0","ControlGroupAssign1","ControlGroupAssign2","ControlGroupAssign3","ControlGroupAssign4","ControlGroupAssign5","ControlGroupAssign6","ControlGroupAssign7","ControlGroupAssign8","ControlGroupAssign9","ControlGroupAssignAndSteal0","ControlGroupAssignAndSteal1","ControlGroupAssignAndSteal2","ControlGroupAssignAndSteal3","ControlGroupAssignAndSteal4","ControlGroupAssignAndSteal5","ControlGroupAssignAndSteal6","ControlGroupAssignAndSteal7","ControlGroupAssignAndSteal8","ControlGroupAssignAndSteal9","ControlGroupRecall0","ControlGroupRecall1","ControlGroupRecall2","ControlGroupRecall3","ControlGroupRecall4","ControlGroupRecall5","ControlGroupRecall6","ControlGroupRecall7","ControlGroupRecall8","ControlGroupRecall9","GameSpeedDec","GameSpeedInc","GameTooltipsOn","HeroCharacterSheetPanel","HeroLeaderPanel","HeroSelect0","HeroSelect1","HeroSelect2","HeroSelect3","HeroSelect4","HeroSelect5","HeroSelect6","HeroSelect7","HeroTalentTreeSelection","IdleWorker","InventoryButtonAlt0","InventoryButtonAlt1","InventoryButtonAlt2","InventoryButtonAlt3","InventoryButtonAlt4","InventoryButtonAlt5","InventoryButtonAlt6","InventoryButtonAlt7","InventoryButtonUseSelf0","InventoryButtonUseSelf1","InventoryButtonUseSelf2","InventoryButtonUseSelf3","InventoryButtonUseSelf4","InventoryButtonUseSelf5","InventoryButtonUseSelf6","InventoryButtonUseSelf7","InventoryButtonUse0","InventoryButtonUse1","InventoryButtonUse2","InventoryButtonUse3","InventoryButtonUse4","InventoryButtonUse5","InventoryButtonUse6","InventoryButtonUse7","MinimapColors","MinimapPing","MinimapTargetingView","MinimapNormalView","MinimapTerrain","PauseGame","Ping","PingSelection0","PingSelection1","PingSelection2","PingSelection3","PingSelection4","PingSelection5","QuickPing","QuickSave","QuickHeroTalentTreeSelection","QuickHeroTalentTreeSelection0","QuickHeroTalentTreeSelection1","QuickHeroTalentTreeSelection2","QuickHeroTalentTreeSelection3","QuickHeroTalentTreeSelection4","EmoteMenu","ReplayPlayPause","ReplayRestart","ReplaySkipBack","ReplaySkipNext","ReplaySpeedDec","ReplaySpeedInc","ReplayStop","ReplayHide","Screenshot","SelectionCancelDrag","Selection","SmartCommand","Spotlight","StatusAll","StatusOwner","StatusAlly","StatusEnemy","SubgroupNext","SubgroupPrev","TargetCancel","TargetChoose","TeamResources","TownCamera","VideoRecord","WarpIn","CommandButtonAlt00","CommandButtonAlt01","CommandButtonAlt02","CommandButtonAlt03","CommandButtonAlt04","CommandButtonAlt05","CommandButtonAlt06","CommandButtonAlt07","CommandButtonAlt08","CommandButtonAlt09","CommandButtonAlt10","CommandButtonAlt11","CommandButtonAlt12","CommandButtonAlt13","CommandButtonAlt14","CommandButtonSelf00","CommandButtonSelf01","CommandButtonSelf02","CommandButtonSelf03","CommandButtonSelf04","CommandButtonSelf05","CommandButtonSelf06","CommandButtonSelf07","CommandButtonSelf08","CommandButtonSelf09","CommandButtonSelf10","CommandButtonSelf11","CommandButtonSelf12","CommandButtonSelf13","CommandButtonSelf14","CommandButton00","CommandButton01","CommandButton02","CommandButton03","CommandButton04","CommandButton05","CommandButton06","CommandButton07","CommandButton08","CommandButton09","CommandButton10","CommandButton11","CommandButton12","CommandButton13","CommandButton14","CameraSave0","CameraSave1","CameraSave2","CameraSave3","CameraSave4","CameraSave5","CameraSave6","CameraSave7","CameraView0","CameraView1","CameraView2","CameraView3","CameraView4","CameraView5","CameraView6","CameraView7","UIEditorToggle","UIEditorReload","UIEditorSaveSelected","UIEditorSaveAll","UIEditorUndo","UIEditorRedo","UIEditorDeselect","UIEditorShowInfoTooltip","UIEditorToggleVisible","UIEditorHoverControls","UIEditorLockInfoTooltip","UIEditorOutlineAnchors","UIEditorIncreaseGridSpacing","UIEditorDecreaseGridSpacing","UIEditorToggleStateGroupOverlay","UIEditorBreakToDebugger","UIEditorSize720x406","UIEditorSize800x600","UIEditorSize1024x768","UIEditorSize1280x1024","UIEditorSize1280x960","UIEditorSize1280x720","UIEditorSize1680x1050","UIEditorSize1400x1050","UIEditorSize1920x1200","UIEditorSize1920x1080","UIEditorSize1600x1200","UIEditorSize2048x1536","UIEditorSize2560x1600","UIEditorSize2560x2048","UIEditorSize4096x2560","UIEditorSize4096x2304","UIEditorSize4096x3072"]}
export class EPathLocation extends CEnum { static enum = ["World","Minimap"]}
export class ENydusLink extends CEnum { static enum = ["BreakingNews","PTRAvailable","AccountManagement","AccountPurchase","AccountTrialUpgrade","AccountNew","AccountTrial","SecurityPassword","Forum","Community","FeedHomepage","FeedHomepageBackground","FeedCommunity","FeedFeaturedMaps","FeedLiveEvent","Store","SecurityHelp","Support","OnlineGuide","Copyright","ParentalControls","Regions","CacheList","RefundPolicy","TermsOfService","TermsOfSale","RecruitFriend","LowVirtualMemory","StarterEdition","PremiumMap","StimpackInfo","MaintenanceInfo","ExternalLink","CCPA"]}
export class EHeroState extends CEnum { static enum = ["Locked","Unlocked"]}
export class EHeroAbilCategoryState extends CEnum { static enum = ["Locked","Unlocked"]}
export class EHeroCutsceneSize extends CEnum { static enum = ["Small","Medium","Large"]}
export class EHeroFlag extends CEnum { static enum = ["Flyer","Random","UsesMount","ExcludeFromMapIntro","GoodForModeA","GoodForModeB","AllowAIRandomSelection","ShowInStore"]}
export class EHeroRole extends CEnum { static enum = ["Warrior","Damage","Support","Specialist"]}
export class EHeroDifficulty extends CEnum { static enum = ["Easy","Medium","Hard","VeryHard"]}
export class EHeroVO extends CEnum { static enum = ["AIAttack","AICaution","AIGoodJob","AIHeal","AIMercCapture","AIOnMyWay","AIRetreat","AIUhOh","Celebrate","Cheer","Comeback","EndEnemyKillSpree","GetHit","GetHitLarge","GetHitSmall","GlueExamineLocked","GlueExaminePurchased","GlueGift","GluePurchase","GlueTrial","GlueWaitLocked","GlueWaitPurchased","Goodbye","Healed","Hello","IntroAgree","IntroBoast","IntroQuestion","IntroResponse","KillGeneric","Laugh","No","PingAssistHero","PingAssistMe","PingAttackCore","PingAttackHere","PingAttackHero","PingAttackMercCamp","PingAttackTown","PingAttackWatchTower","PingDefendCore","PingDefendHere","PingDefendTown","PingDefendWatchTower","Pissed","Resurrected","Revive","Sorry","SpecChosen","TeamKilled","Thanks","UILockin","WellPlayed","WorthIt"]}
export class EHeroGender extends CEnum { static enum = ["Male","Female"]}
export class EHeroUniverse extends CEnum { static enum = ["StarCraft","Warcraft","Diablo","Heroes","Retro"]}
export class EHeroAbilFlag extends CEnum { static enum = ["ShowInHeroSelect","UsesCharges","AffectedByCooldownReduction","AffectedByOverdrive","Heroic","Trait","MountReplacement","HideHotkey"]}
export class EHeroImageFacing extends CEnum { static enum = ["Left","Right","Mid"]}
export class EHeroAITalentBuildType extends CEnum { static enum = ["General","Damage","Tank","Support"]}
export class EHeroAbilState extends CEnum { static enum = ["Locked","Unlocked","New"]}
export class EHeroStatState extends CEnum { static enum = ["Downgrade","Unchanged","Upgrade"]}
export class EGameTimeEvent extends CEnum { static enum = ["Dawn","Dusk"]}
export class ETimeOfDayValue extends CEnum { static enum = ["Value","Hours","Minutes","Seconds"]}
export class EMissionState extends CEnum { static enum = ["Locked","Unlocked","Hidden","Complete"]}
export class EMapKind extends CEnum { static enum = ["Mission","Story","Upgrade"]}
export class EAnimProp extends CEnum { static enum = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","VariationEnd","IGNORE","Default","Stand","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Alternate","Attached","Attack","Back","Birth","Blast","Blink","Block","Build","Burrow","Channel","Cinematic","Cloak","Close","Click","Complex","Corrupted","Cover","Creep","Custom","Dance","Dead","Death","Defeat","Detect","Dialogue","Disintegrate","Dominant","Double","Down","Eat","Electrocute","End","Enemy","Equal","Eviscerate","Far","Fast","Fidget","Fire","Flail","Fling","Fly","Forward","Freeze","Gather","GLbirth","GLdeath","GLdead","GLstand","Glow","Hearth","Highlight","Hover","Hold","In","Inferior","Interact","Intro","Jump","Kill","Land","Large","Left","Level","Listen","Lighting","Load","Medium","Melee","Morph","Mount","NearImpact","Omni","Out","Penetrate","Pickup","Placement","Portrait","Pose","Range","Ready","Reload","Restart","Resurrect","Ride","Right","Run","Scared","Shield","Silentkill","Simple","Slow","Small","Spell","Squish","Standup","Start","Stun","Superior","Surf","Talk","Taunt","Teleport","Thrown","Turbo","Turn","Unburrow","Unload","Unpowered","Up","Victory","Walk","Work","Wounded","Angry","Happy","Sad","AngryEyes","ClosedEyes","FearEyes","HappyEyes","NeutralEyes","SadEyes","SeriousEyes","SurpriseEyes","Arm","Chest","Eye","Leg","Adjutant","Dehaka","Evomaster","Horner","Kerrigan","Lasarra","Raynor","Stukov","Valerian","Zagara","Protoss","Terran","Zerg","Alternateex","Berserk","Bone","Chain","Combat","Complete","Critical","Decay","Defend","Devour","Dissipate","Drain","EatTree","Entangle","Fill","Flesh","Gold","Hit","Light","Lightning","Looping","Lumber","Moderate","Monkey","Off","Puke","Severe","Slam","Sleep","Spiked","Spin","StageFirst","StageSecond","StageThird","StageFourth","StageFifth","Swim","Throw","Upgrade","Ridebeast","Ridebike","Ridenone","Ridesurf"]}
export class EMountFlag extends CEnum { static enum = ["FreePlay","IsVariation"]}
export class EMountVO extends CEnum { static enum = ["Mounted","Dismounted","Looping","Moving","Stationary"]}
export class EObjectiveType extends CEnum { static enum = ["Optional","Primary"]}
export class EObjectiveReward extends CEnum { static enum = ["DNA","Infestation","Mutagen"]}
export class EPingFlag extends CEnum { static enum = ["UseUnitTeamColor","UseUnitVisibility"]}
export class ESoundCategory extends CEnum { static enum = ["Test","ME","Movie","TV","Dialogue","Mission","Music","Other","Ambient","SAmbient","Alert","Death","Ready","Spell","SpellOneshotImpact","SpellOneshotLaunch","Combat","Voice","Message","UI","UIMovie","Flames","Build","Gather","Doodad","SEmitters","SPieces","Foley","Movement","User1","User2","User3","User4","User5","User6","User7","User8","User9","User10","User11","User12","User13","User14","User15","User16","User17","User18","User19","User20","User21","User22","User23","User24","User25","User26","User27","User28","User29","User30","User31","User32","User33","User34","User35"]}
export class ESoundtrackCategory extends CEnum { static enum = ["Ambience","Music"]}
export class ETalentModification extends CEnum { static enum = ["None","CooldownReduction","FlatModification","MultiplyLevelModification","StringReplacement","CatalogReplacement"]}
export class ETalentProfileFlag extends CEnum { static enum = ["Hidden"]}
export class EUnitFlag extends CEnum { static enum = ["Bounce","Turnable","Movable","Worker","CreateVisible","Unclickable","Uncommandable","Unhighlightable","Untooltipable","Unselectable","Untargetable","Uncursorable","Hero","HiddenCargoUI","IndividualSubgroups","NoDraw","PreventReveal","PreventDefeat","PreventDestroy","PenaltyRevealed","Uncloakable","Missile","Undetectable","Unradarable","UseLineOfSight","KillCredit","TownAlert","Invulnerable","Destructible","Cloaked","Buried","NoScore","IgnoreTerrainZInit","TurnBeforeMove","AlwaysThreatens","NoDeathEvent","NoPortraitTalk","TownCamera","AIThreatGround","AIThreatAir","AILifetime","AISplash","AIHighPrioTarget","AISplitter","AIDefense","AICaster","AISupport","AICantAddToWave","ShowResources","ArmorDisabledWhileConstructing","Pawnable","AIFleeDamageDisabled","AIPressForwardDisabled","AIObservatory","ForceCollisionCheck","AIChangeling","ShareControl","BuiltOnOptional","AcquireRally","AIAllowSuicideOverride","AIForceTactical","VisionTestCenterOnly","Unstoppable","AIPreferBurrow","ClearRallyOnDeath","ClearRallyOnTargetLost","SelectableWhileDead","TargetableWhileDead","IgnoreAttackAlert","PreferLastAttackTarget","ResumeLastMoveOrder","AIResourceBlocker","ArmySelect","Resistant","PlayerRevivable","AIMakeIgnore","AIPreplacedForceBully","StatTrackAbilities","StatTrackDamageDone","StatTrackDamageReceived","StatTrackCreation","CameraFollow","LeechBehaviorShieldDamage","TownStructureWall","TownStructureGate","TownStructureTownHall","TownStructureCannonTower","TownStructureMoonwell","TownStructureCore","HideFromHarvestingCount","TreatStructureAsUnitForSelection","NonBuildingUnit","NeverThink","GrantLevelKillXP","UseOuterRadius","FootprintAlwaysIgnoreHeight","FootprintPersistRotate"]}
export class EUnitCollide extends CEnum { static enum = ["Land1","Land2","Land3","Land4","Land5","Land6","Land7","Land8","Land9","Land10","Land11","Land12","Land13","Land14","Land15","Land16","Air1","Air2","Air3","Air4","Air5","Air6","Air7","Air8","Air9","Air10","Air11","Air12","Air13","Air14","Air15","Air16"]}
export class EUnitAttribute extends CEnum { static enum = ["Light","Armored","Biological","Mechanical","Robotic","Psionic","Massive","Structure","Hover","Heroic","Summoned","User1","MapBoss"]}
export class ECmdFlags extends CEnum {}
export class EUpgradeOperation extends CEnum { static enum = ["Add","Subtract","AddBaseMultiply","SubtractBaseMultiply","Multiply","Divide","Set"]}
export class EUserType extends CEnum { static enum = ["AbilCmd","Actor","Color","Compare","Fixed","GameLink","Image","Int","Model","Movie","Sound","String","Text","Unit","Upgrade","User"]}
export class EChance extends CEnum { static enum = ["Anim","Idle","Turn"]}
export class EPlayerId extends CEnum { static enum = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]}

export const EnumClasses = {
  ELocaleId,
  EPlayerId,
  ETypeId,
  EStructId,
  EClassId,
  EClassIdCActorSupport,
  EClassIdCAbil,
  EClassIdCAccumulator,
  EClassIdCAchievement,
  EClassIdCAchievementTerm,
  EClassIdCActor,
  EClassIdCAlert,
  EClassIdCArmyCategory,
  EClassIdCArmyUnit,
  EClassIdCArmyUpgrade,
  EClassIdCArtifact,
  EClassIdCArtifactSlot,
  EClassIdCAttachMethod,
  EClassIdCBankCondition,
  EClassIdCBeam,
  EClassIdCBehavior,
  EClassIdCBoost,
  EClassIdCBundle,
  EClassIdCButton,
  EClassIdCCamera,
  EClassIdCCampaign,
  EClassIdCCharacter,
  EClassIdCCliff,
  EClassIdCCliffMesh,
  EClassIdCColorStyle,
  EClassIdCCommander,
  EClassIdCConfig,
  EClassIdCConsoleSkin,
  EClassIdCConversation,
  EClassIdCConversationState,
  EClassIdCCursor,
  EClassIdCDataCollection,
  EClassIdCDataCollectionPattern,
  EClassIdCDecalPack,
  EClassIdCDSP,
  EClassIdCEffect,
  EClassIdCEmoticon,
  EClassIdCEmoticonPack,
  EClassIdCError,
  EClassIdCFootprint,
  EClassIdCFoW,
  EClassIdCGame,
  EClassIdCGameUI,
  EClassIdCHerd,
  EClassIdCHerdNode,
  EClassIdCHero,
  EClassIdCHeroAbil,
  EClassIdCHeroStat,
  EClassIdCItem,
  EClassIdCItemClass,
  EClassIdCItemContainer,
  EClassIdCKinetic,
  EClassIdCLensFlareSet,
  EClassIdCLight,
  EClassIdCLocation,
  EClassIdCLoot,
  EClassIdCMap,
  EClassIdCModel,
  EClassIdCMount,
  EClassIdCMover,
  EClassIdCObjective,
  EClassIdCPhysicsMaterial,
  EClassIdCPing,
  EClassIdCPlayerResponse,
  EClassIdCPortraitPack,
  EClassIdCPreload,
  EClassIdCPremiumMap,
  EClassIdCRace,
  EClassIdCRaceBannerPack,
  EClassIdCRequirement,
  EClassIdCRequirementNode,
  EClassIdCReverb,
  EClassIdCReward,
  EClassIdCScoreResult,
  EClassIdCScoreValue,
  EClassIdCShape,
  EClassIdCSkin,
  EClassIdCSkinPack,
  EClassIdCSound,
  EClassIdCSoundExclusivity,
  EClassIdCSoundMixSnapshot,
  EClassIdCSoundtrack,
  EClassIdCSpray,
  EClassIdCSprayPack,
  EClassIdCStimPack,
  EClassIdCTacCooldown,
  EClassIdCTactical,
  EClassIdCTalent,
  EClassIdCTalentProfile,
  EClassIdCTargetFind,
  EClassIdCTargetSort,
  EClassIdCTerrain,
  EClassIdCTerrainObject,
  EClassIdCCliffDoodad,
  EClassIdCTerrainTex,
  EClassIdCTexture,
  EClassIdCTextureSheet,
  EClassIdCTile,
  EClassIdCTrophy,
  EClassIdCTurret,
  EClassIdCUnit,
  EClassIdCUpgrade,
  EClassIdCUser,
  EClassIdCValidator,
  EClassIdCVoiceOver,
  EClassIdCVoicePack,
  EClassIdCWarChest,
  EClassIdCWarChestSeason,
  EClassIdCWater,
  EClassIdCWeapon,
  EAbilTechPlayer,
  EAbilAlignment,
  EAcquireLevel,
  ECursorRangeMode,
  EAbilArmMagazineLaunch,
  EEffectLocationType,
  EAbilBehaviorCycleMode,
  EAbilBuildType,
  EAbilReviveVital,
  EAbilOrderDisplayType,
  ECooldownLocation,
  EChargeLocation,
  EAbilArmMagazineManage,
  EAbilCmdState,
  EAbilInventoryAlignment,
  EAbilMorphPhase,
  EAbilMorphSection,
  EAbilTrainLocation,
  EAbilTrainRotation,
  ECargoSpace,
  EAccumulatorOperation,
  EAchievementTermEvaluate,
  EAchievementTermPrevious,
  EAchievementTermCombine,
  EActorRequestCreateSharing,
  EActorHostedPropInheritType,
  EActorScopeBearingsTrackingType,
  EFogVisibility,
  EActorSplatHeight,
  EActorProximity,
  EActorModelMaterialType,
  EActorSoundPlayMode,
  ESplatLayer,
  EActorEffectScope,
  EActorShieldFlashType,
  EMinimapShape,
  ESquibType,
  EActorSiteBillboardType,
  EActorSiteOrbiterType,
  EActorSiteOpActionLocation,
  EActorSiteOpAttachSource,
  EActorSiteOpBasicType,
  EActorEffectLocation,
  EActorHeightSourceType,
  EActorIncomingType,
  EActorSiteOpOrientAttachPointToType,
  EActorRadialDistribution,
  EActorSiteOpPhysicsImpactType,
  EActorCrossbarDistribution,
  EActorSiteOpRotatorType,
  EActorHeightTestType,
  EActorTiltType,
  EActorTextAlignment,
  EAttachmentID,
  EUnitSound,
  EAlertPeripheral,
  EAMArcTestType,
  EAMFilterLogic,
  EAMFilterAttachType,
  EAMFilterType,
  EAMAttachType,
  EAMOccupancyLogic,
  EAMNumericField,
  EAMNumericFieldOp,
  EAMPatternType,
  EAttachKeyword,
  EAMRandomDistribution,
  EAMReductionType,
  EBankConditionCombine,
  EBehaviorAlignment,
  EBehaviorBuffReplace,
  ECameraHeightMap,
  ECharacterGender,
  ECharacterRace,
  ECharacterRelevance,
  EConversationProductionLevel,
  EImplementionLevel,
  EOscillator,
  EListWalkMode,
  EDamageVisibility,
  EDamageTotal,
  EMoverPatternType,
  EEffectRemoveBehaviorAlignment,
  EBehaviorHeroicState,
  EGlueTheme,
  EPurchaseWarningCondition,
  EOcclusion,
  EPausedParticleSystemBehavior,
  EFoliageLayer,
  EPathMode,
  EResponseContinueMethod,
  EDamageResponseDamageValue,
  EPreloadTiming,
  EScoreSort,
  EScoreValueReport,
  EScoreCollapse,
  EScoreValueType,
  EScoreValue,
  EScoreValueOperation,
  ESoundBlend,
  ESoundDupe,
  ESoundMode,
  ESoundSelect,
  EExclusivityAction,
  EExclusivityQueueAction,
  ETargetFindSet,
  ETurretIdle,
  EDeathReveal,
  EUnitMob,
  EUnitGender,
  EResourceState,
  EUnitResponse,
  ECostCategory,
  EKillDisplay,
  ERankDisplay,
  EEditorTextType,
  ETextTagEdge,
  EValidateCombine,
  EGameResult,
  EUnitAIFlag,
  EBehaviorState,
  EUnitTestState,
  EPlayerRelationship,
  EUnitType,
  EWeaponType,
  EVitalType,
  EWeaponPrioritization,
  EWeaponLegacyMovement,
  EAchievementTagCheck,
  EActorRequestScope,
  EActorRequestActor,
  EActorModelAspectPerson,
  EActorModelAspectObservingPoV,
  EActorModelAspectRegardsAs,
  EActorModelAspectDuring,
  EActorModelAspectObservedPlayerType,
  EActorModelAspectModelOwnerType,
  EActorModelAspectTest,
  EActorPhysicsImpactRangeType,
  EActorQuadDecorationFunction,
  EActorSoundValueSource,
  EActorResponseScope,
  EActorIntersectType,
  EActorAnimTransitionType,
  EActorAnimPropMatchType,
  ESerpentType,
  ECmdResult,
  EEffectTimeScale,
  EDamageResponseHandledValue,
  EConversationConditionOp,
  EConversationActionOp,
  EConversationConditionCheck,
  EConversationSelectionMethod,
  EEffectModifyTurret,
  EFootprintShapeMode,
  ESoundFormat,
  ESoundResampler,
  ESpeakerMode,
  EMuteControl,
  EVolumeControl,
  ESoundMaxMethod,
  EGameCategoryUsage,
  EVariationCommands,
  ETonemapRegionTypes,
  EModelEvent,
  EModelQuality,
  EPhysicsMaterial,
  EMotionDriverType,
  EMotionTurnType,
  EMotionActorTrackingType,
  EMotionArrivalTestType,
  EMotionBlendType,
  EMotionRotationLaunchActorType,
  EMotionRotationActorType,
  EMotionThrowRotationType,
  EMotionOverlayType,
  EMotionOverlayPolarity,
  ERequirementState,
  ECardButtonType,
  EVoiceOverSkinState,
  EVoiceOverSoundType,
  ESoundMaxPrioritization,
  EActorOverkillTestType,
  ESkillPoint,
  ESoundDupePriority,
  EKineticFollow,
  ETargetModeValidation,
  EQuickCastMode,
  EHerdClosestTo,
  EEffectContainer,
  EEffectModifyFacing,
  EBehaviorUnitTrackerAtMaxRule,
  EBehaviorUnitTrackerSnapRule,
  EArtifactType,
  EActorForceOrigin,
  EActorCombatRevealDurationType,
  EActorForceField,
  EAbilLastTarget,
  EAccumulatorApplicationRule,
  EVitalsAccumulatorModificationType,
  EAccumulatorBehaviorType,
  EActorPlayerIdSource,
  EActorForceDirection,
  EActorSiteOpTetherEnableType,
  EAbilAttackStage,
  EAbilBehaviorStage,
  EAbilBuildStage,
  EAbilEffectStage,
  EAbilHarvestStage,
  EAbilMorphStage,
  EAbilRallyStage,
  EAbilArmMagazineCmd,
  EAbilAttackCmd,
  EAbilAttackModifierCmd,
  EAbilAugmentCmd,
  EAbilBatteryCmd,
  EAbilBeaconCmd,
  EAbilBehaviorCmd,
  EAbilBuildCmd,
  EAbilBuildableCmd,
  EAbilEffectInstantCmd,
  EAbilEffectTargetCmd,
  EAbilHarvestCmd,
  EAbilInteractCmd,
  EAbilInventoryCmd,
  EAbilLearnCmd,
  EAbilMergeCmd,
  EAbilMorphCmd,
  EAbilMergeableCmd,
  EAbilMoveCmd,
  EAbilPawnCmd,
  EAbilQueueCmd,
  EAbilRallyCmd,
  EAbilRedirectInstantCmd,
  EAbilRedirectTargetCmd,
  EAbilResearchCmd,
  EAbilReviveCmd,
  EAbilSpecializeCmd,
  EAbilStopCmd,
  EAbilTrainCmd,
  EAbilTransportCmd,
  EAbilWarpableCmd,
  EAbilWarpTrainCmd,
  EAbilityCategory,
  EUnitStatusGroup,
  EUnitStatus,
  EFlyerDisplay,
  EArmyCategoryState,
  EArmyUnitState,
  EArmyUpgradeState,
  EBehaviorCategory,
  EAttackModifierStage,
  EDamageLocation,
  EUIColorMode,
  EUIColorRelation,
  ECommanderTalentType,
  ECommanderMasteryTalentType,
  EPortraitOverlayType,
  EAllianceId,
  EAlliancePlayer,
  EFlagOperation,
  EPlayerType,
  ETargetFilter,
  EMarkerMatch,
  EHeightMap,
  EPlane,
  EPlacementTest,
  EUnitUserFlag,
  EUnitVital,
  EDamageType,
  EDamageCategory,
  EAttackType,
  EArmorType,
  EDamageKind,
  EDeathType,
  ECooldownOperation,
  EResourceType,
  EEffectLocation,
  EEffectPlayer,
  EEffectUnit,
  ETeamColor,
  ETechCategory,
  EValueCompare,
  EBeacon,
  ECustomBuildOpening,
  ECustomBuildLateGame,
  EUnitTaunt,
  EEffectAmount,
  EEffectHistory,
  EGameCatalog,
  EUnitColorStyle,
  EHotkey,
  EPathLocation,
  ENydusLink,
  EHeroState,
  EHeroAbilCategoryState,
  EHeroCutsceneSize,
  EHeroFlag,
  EHeroRole,
  EHeroDifficulty,
  EHeroVO,
  EHeroGender,
  EHeroUniverse,
  EHeroAbilFlag,
  EHeroImageFacing,
  EHeroAITalentBuildType,
  EHeroStatState,
  EHeroAbilState,
  EUpgradeOperation,
  EUserType,
  EChance,
  EAnimProp,
  EMapKind,
  EMissionState,
  EGameTimeEvent,
  ETimeOfDayValue,
  EMountFlag,
  EMountVO,
  EObjectiveType,
  EObjectiveReward,
  EPingFlag,
  ESoundCategory,
  ESoundtrackCategory,
  ETalentModification,
  ETalentProfileFlag,
  EUnitFlag,
  EUnitCollide,
  EUnitAttribute,
  ECmdFlags,
}

export const Enums = Object.fromEntries(
    Object.entries(EnumClasses).map(([key, value]) => [key.slice(1), value])
);

export default Enums


//todo 
//need to add support of data based ocnstants 
// `
//     <const id="Small" path="CUnit.Collide.index" value="Land16"/>
//     <const id="Burrow" path="CUnit.Collide.index" value="Land1"/>
//     <const id="TinyCritter" path="CUnit.Collide.index" value="Land8"/>
//     <const id="Swarm" path="CUnit.Collide.index" value="Land4"/>
//     <const id="ForceField" path="CUnit.Collide.index" value="Land9"/>
//     <const id="Locust" path="CUnit.Collide.index" value="Land11"/>
//     <const id="DisruptorPhased" path="CUnit.Collide.index" value="Land15"/>
//     <const id="Structure" path="CUnit.Collide.index" value="Land6"/>
//     <const id="FlyingImmobile" path="CUnit.Collide.index" value="Air2"/>
//     <const id="FlyingEscorts" path="CUnit.Collide.index" value="Air3"/>
//     <const id="Ground" path="CUnit.Collide.index" value="Land2"/>
//     <const id="LocustForceField" path="CUnit.Collide.index" value="Land12"/>
//     <const id="Flying" path="CUnit.Collide.index" value="Air1"/>
//     <const id="Colossus" path="CUnit.Collide.index" value="Land5"/>
//     <const id="CreepTumor" path="CUnit.Collide.index" value="Land10"/>
//     <const id="RoachBurrow" path="CUnit.Collide.index" value="Land7"/>
//     <const id="Phased" path="CUnit.Collide.index" value="Land14"/>
//     <const id="Larva" path="CUnit.Collide.index" value="Land3"/>
// ` 

// const enumConstants = {
//     CUnit: {
//         Collide: {
//             index: {
//                 Small: "Land16" // 15
//             }
//         }
//     }
// }  
    // <const id="lumber" path="CUnitHero.CostResource.index" value="Custom"/>

//  <const id="$Spell" type="CActorMsgPayloadPtr" value="AnimPlay Spell Spell"/>
//         <On Terms="ActorCreation" Send="$Stand PlayForever,RandomStartOffset"/>

// <const id="ward" path="CAbilEffectInstant.TargetFilters" value="Robotic"/>

// <TargetFilters index="0" value="mechanical;self,enemies,ward,ancient,wall,tree,Missile,debris,UnderConstruction,Dead,Hallucination,Decaying,Raisable,item"/>


    // <const id="divine" path="CEffectDamage.AttributeFactor.index" value="Robotic"/>
    //     <!--AttributeFactor index="divine" value="-0.95"/>
