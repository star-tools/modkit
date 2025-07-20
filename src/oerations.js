export function mergeMods( mods, options ){
    let merged = new SC2Mod()
    for(let mod of mods){
        let modData = mod.data
        merged.merge(modData)
    }
    merged.mergeCatalogs();
    return merged
}