import SC2AI from "./SC2AI.js"
import SC2BankList from "./SC2BankList.js"
import SC2Catalog from "./SC2Catalog.js"
import SC2Components from "./SC2Components.js"
import SC2Cutscene from "./SC2Cutscene.js"
import SC2DataClasses from "./SC2DataClasses.js"
import SC2DataStructures from "./SC2DataStructures.js"
import SC2DocInfo from "./SC2DocInfo.js"
import SC2EditorCategories from "./SC2EditorCategories.js"
import SC2Includes from "./SC2Includes.js"
import SC2Layout from "./SC2Layout.js"
import SC2MapObjects from "./SC2MapObjects.js"
import SC2MapRegions from "./SC2MapRegions.js"
import SC2MapTerrain from "./SC2MapTerrain.js"
import SC2Mod from "./SC2Mod.js"
import SC2Preload from "./SC2Preload.js"
import SC2PreloadAssetDB from "./SC2PreloadAssetDB.js"
import SC2Style from "./SC2Style.js"
import SC2Text from "./SC2Text.js"
import SC2Triggers from "./SC2Triggers.js"
import SC2Credits from "./SC2Credits.js"
import SC2Hash from "./SC2Hash.js"
import SC2Regions from "./SC2Regions.js"
import SC2Locales from "./SC2Locales.js"

//Combined schema. includes all sc2 types
export default {
    ...SC2AI,
    ...SC2BankList,
    ...SC2Catalog,
    ...SC2Components,
    ...SC2Cutscene,
    ...SC2DataClasses,
    ...SC2DataStructures,
    ...SC2DocInfo,
    ...SC2EditorCategories,
    ...SC2Includes,
    ...SC2Layout,
    ...SC2MapObjects,
    ...SC2MapRegions,
    ...SC2MapTerrain,
    ...SC2Mod,
    ...SC2Preload,
    ...SC2PreloadAssetDB,
    ...SC2Style,
    ...SC2Text,
    ...SC2Triggers,
    ...SC2Credits,
    ...SC2Hash,
    ...SC2Regions,
    ...SC2Locales,
}