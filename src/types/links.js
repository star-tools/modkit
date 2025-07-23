/**
 * StarCraft II Catalog Link Types Generator
 * ------------------------------------------
 * This module defines catalog link types for SC2 data models.
 *
 * The `CLink` base class represents a generic link to an object in a specific SC2 catalog 
 * (e.g., "Unit", "Effect", "Abil", etc.). Each specific catalog link is represented by 
 * a subclass of `CLink`, such as `CUnitLink`, `CEffectLink`, etc.
 *
 * Optimization:
 * - To avoid writing repetitive code for ~90 link classes, this file dynamically generates 
 *   subclasses of `CLink` at runtime based on the catalog names.
 * - Each generated subclass defines only a static `catalog` property.
 *
 * Usage:
 * - Use specific link classes like `CUnitLink`, `CAbilityLink`, etc., for schema validation 
 *   or relation mapping.
 * - Access links dynamically via `CatalogLinks["Unit"]` → returns `CUnitLink`, etc.
 * - `validate()` checks if a link exists in the relevant catalog of `this.mod.catalogs`.
 * - `relations()` returns traceable references for dependency resolution or graph traversal.
 *
 * Maintenance:
 * - To add a new catalog link type, simply append its catalog name to the `catalogNames` array.
 * - This approach ensures easy extension and avoids boilerplate.
 *
 * Example:
 *   const unitLink = new CUnitLink();
 *   unitLink.validate("Marine"); // returns true if "Marine" exists in mod.catalogs.Unit
 *
 * Exports:
 * - Individual classes like `CUnitLink`, `CWeaponLink`, etc.
 * - `CatalogLinks` object for dynamic access: CatalogLinks["Unit"] → CUnitLink class.
 */
import { CDataType, CList } from "./core.js";
import { GAME_CATALOGS } from "./shared.js";

class CLink extends CDataType {
  static catalog = '';

  constructor() {
    super("Link");
  }

  static relations(value, trace) {
    return [{ type: this.catalog, value, trace }];
  }

  validate(val) {
    return !!this.mod.catalogs[this.constructor.catalog]?.[val];
  }
}

// List of catalog names corresponding to subclasses needed
const catalogNames = [...Object.keys(GAME_CATALOGS), "String", "Hotkey", "Asset", "Bank"];

// Dynamically create subclasses and export them
export const Links = {};

for (const name of catalogNames) {
  const className = `C${name}Link`;
  Links[className] = class extends CLink {
    static catalog = name;
  };
  Object.defineProperty(Links[className], 'name', { value: className });

}


Links["CStringLink"] = class CStringLink extends CLink {
  static catalog = "String"
};
Links["CHotkeyLink"] = class CHotkeyLink extends CLink {
  static catalog = "Hotkey"
};
Links["CAssetLink"] = class CAssetLink extends CLink {
  static catalog = "Asset"
};
Links["CBankLink"] = class CBankLink extends CLink {
  static catalog = "Bank"
};

// Export classes individually if needed
export const {
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
  CTalentProfileLink,
  CMapLink,
  CBehaviorLink,
  CArmyCategoryLink,
  CLocationLink,
  CObjectiveLink,
  CLightLink,
  CPhysicsMaterialLink,
  CConversationLink,
  CRequirementLink,
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
  CAssetLink,
  CBankLink
} = Links;



// Export a map for easy access by catalog name
const CatalogLinks = catalogNames.reduce((acc, name) => {
  acc[name] = Links[`C${name}Link`];
  return acc;
}, { 
  String: CStringLink,
  Hitkey: CHotkeyLink,
  Asset: CAssetLink,
  Bank : CBankLink
    // AbilCommand: CAbilCommand ,
    // PhysicsMaterials: CPhysicsMaterialLinks
});

export default CatalogLinks