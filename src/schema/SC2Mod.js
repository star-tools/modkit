import { SBankList } from "./SC2BankList.js";
import { SCatalog } from "./SC2Catalog.js";
import { SCutsceneState } from "./SC2Cutscene.js";
import { SComponents } from "./SC2Components.js";
import { SEditorCategories } from "./SC2EditorCategories.js";
import { SDesc } from "./SC2Layout.js";
import { SPreload } from "./SC2Preload.js";
import { SStyleFile } from "./SC2Style.js";
import { SText } from "./SC2Text.js";
import { STriggerData } from "./SC2Triggers.js";
import { SDocInfo } from "./SC2DocInfo.js";
import { SIncludes } from "./SC2Includes.js";
import { SPreloadAssetDB } from "./SC2PreloadAssetDB.js";
import { MRegions } from "./SC2MapRegions.js";
import { MObjects } from "./SC2MapObjects.js";
import { MTerrain } from "./SC2MapTerrain.js";
import { SActorState } from "./SC2Scene.js";

import { CRaw, CString } from "../types/types.js";
import A from "../types/files.js"

export const STextureMapping = {file: A.Image,value: [Number]}
export const SBinaryFile =   {data: CRaw, id: A.Asset}
export const SBinaryModelFile =   {...SBinaryFile, textures: [A.Image]}

export const SMod = {
  components: SComponents,
  assets: [CString],
  info: SDocInfo,
  styles: SStyleFile,
  triggers: STriggerData,
  preload: SPreload,
  banklist: SBankList,
  regions: MRegions,
  objects: MObjects,
  terrain: MTerrain,
  includes: SIncludes,
  texturereduction: [STextureMapping],
  preloadassetdb: SPreloadAssetDB,
  standardinfo: SDocInfo,
  descindex: SDesc,
  librarylist: STriggerData,
  editorcategories: SEditorCategories,
  sc2lib:  [STriggerData],
  layouts: [SDesc],
  catalogs: [SCatalog],
  galaxy: [[CString]],
  cutscenes: [SCutsceneState],
  scenes: [SActorState],
  strings: {
    Hotkeys: [SText],
    Game: [SText],
    Objects: [SText],
    Trigger: [SText],
    Conversation: [SText],
    EditorCategories: [SText],
  },
  binary: {
    header:  [SBinaryFile],
    version: [SBinaryFile],
    audio:   [SBinaryFile],
    image:   [SBinaryFile],
    video:   [SBinaryFile],
    model:   [SBinaryModelFile],
    modela:  [SBinaryModelFile],
    modelh:  [SBinaryModelFile]
  }
}

export default {
    Mod: SMod
}

