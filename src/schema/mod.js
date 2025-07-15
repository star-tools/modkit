import { SBankData } from "./bank.js";
import { EGameCatalog } from "./catalog-enums.js";
import { SCatalog, SIncludes } from "./catalog-struct.js";
import { SCCutscene } from "./cutscenes.js";
import { SComponents, SDocInfo } from "./document.js";
import { SEditorCategories } from "./editor.js";
import { SDesc } from "./layouts.js";
import { MObjects, MRegions, MTerrain } from "./maps.js";
import { SPreload } from "./preload.js";
import { CSStyle } from "./style.js";
import { SText } from "./text.js";
import { TTriggerData } from "./triggers.js";
import { CFile, CFileImage, CFileName, CRaw, CString, Links, UInt } from "./types.js";

export const STextureMapping = {file: CFileImage,value: [UInt]}

export const SPreloadAssetDB = {
  ...Object.fromEntries(EGameCatalog.enum.map(catalog => [catalog,[
    ({
      id: Links[catalog],
      asset: [CFileImage],
      ...Object.fromEntries(EGameCatalog.enum.map(catalog => [catalog,[Links[catalog]]]))
    })
  ]]))
}
export const SBinaryFile =   {data: CRaw, id: CFileName}
export const SBinaryModelFile =   {...SBinaryFile, textures: [CFileImage]}

export const SMod = {
  components: SComponents,
  assets: [CString],
  info: SDocInfo,
  styles: CSStyle,
  triggers: TTriggerData,
  banklist: SBankData,
  regions: MRegions,
  objects: MObjects,
  preload: SPreload,
  terrain: MTerrain,
  components: SComponents,
  includes: SIncludes,
  texturereduction: [STextureMapping],
  preloadassetdb: SPreloadAssetDB,
  standardinfo: SDocInfo,
  descindex: SDesc,
  librarylist: TTriggerData,
  editorcategories: SEditorCategories,
  sc2lib:  [TTriggerData],
  layouts: SDesc,
  catalogs: [SCatalog],
  galaxy: [[CString]],
  cutscenes: [SCCutscene],
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