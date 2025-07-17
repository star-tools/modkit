import { CFile } from "../types/files.js";
import { Links } from "../types/links.js";
import { GAME_CATALOGS } from "../types/shared.js";

let catalogs = Object.keys(GAME_CATALOGS).map(c => "C" + c)

export const SPreloadAssetDB = {
  ...Object.fromEntries(catalogs.map(catalog => [catalog,[
    ({
      id: Links[catalog],
      asset: [CFile],
      ...Object.fromEntries(catalogs.map(catalog => [catalog,[Links[catalog]]]))
    })
  ]]))
}


export default {
    PreloadAssetDB: SPreloadAssetDB
}