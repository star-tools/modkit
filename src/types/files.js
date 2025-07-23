/**
 * StarCraft II Asset File Types
 * -----------------------------
 * This module defines SC2 asset file type validators and relations.
 *
 * The `CFile` base class represents a generic file asset (e.g., texture, model, sound).
 * Each subclass of `CFile` corresponds to a specific asset category and defines:
 *   - `catalog`: Optional grouping/category (e.g., "Image", "Sound", "Model")
 *   - `extensions`: Allowed file extensions (e.g., "dds", "m3", "ogg")
 *
 * Features:
 * - `validate()`: Validates file extensions if `extensions` are specified.
 *   Currently returns `true` by default but can be extended for stricter validation.
 * - `relations()`: Returns a relation object with type "File" for dependency tracking.
 * - Supports mapping file types to catalogs and extensions for modular asset management.
 *
 * Usage Example:
 *   const texture = new CFileImage();
 *   texture.validate("hero.dds"); // returns true
 * 
 * Special Cases:
 * - `CFile` is the generic fallback if no specific type is known.
 * - `Assets` object provides easy dynamic access: 
 *     Assets.Image → `CFileImage`, Assets.Sound → `CFileSound`, etc.
 *
 * Maintenance:
 * - To add new file types, define a subclass of `CFile` with `catalog` and `extensions`.
 * - Register it in the `Assets` object for dynamic lookup.
 *
 * Example Catalog Mapping:
 *   Assets = {
 *     Image: CFileImage,
 *     Movie: CFileMovie,
 *     Map: CFileMap,
 *     Model: CFileModel,
 *     ...
 *   }
 */
import { CDataType } from "./core.js";

export class CFile extends CDataType {
  static isFile = true
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
export class CFileFont extends CFile { static catalog = "Font" ; static extensions = ["ttf","otf"]}

export const FilesClasses = {
    CFileImage,
    CFileMovie,
    CFileMap,
    CFileModel,
    CFileCutscene,
    CFileFontStyle,
    CFileLayout,
    CFileSound,
    CFileAnims,
    CFileFacial,
    CFileSyncModelData,
    CFileXML,
    CFileFont,
}


export default {
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

export const FileTypes = {
  CTexturePath: CFileImage,
  CImagePath: CFileImage
}

