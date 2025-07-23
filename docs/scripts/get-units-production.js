import SC2ModReader from '../../src/SC2ModReader.js';
import { performance } from 'perf_hooks'

let reader = new SC2ModReader("/Applications/StarCraft II/tools/wiki/data.v3")
let mod = await reader.read(`void/data.json`)


const start = performance.now();
mod.makeCache()
// mod.calculateAllEntityValues(mod.cache.Unit.BarracksTechLab)

//do not add the following entities and its children to the output data
// mod.ignoreEntities({
//     Unit: [
//         "DESTRUCTIBLE",
//         "POWERUP",
//         "STARMAP",
//         "Shape",
//         "MISSILE_INVULNERABLE",
//         "MISSILE",
//         "MISSILE_HALFLIFE",
//         "PLACEHOLDER",
//         "PLACEHOLDER_AIR",
//         "PATHINGBLOCKER",
//         "BEACON",
//         "SMCHARACTER",
//         "SMCAMERA",
//         "SMSET",
//         "ITEM",
//     ]
// })

mod.calculateAllValues()
mod.calculateProduction()

const end = performance.now();

for(let unitId in mod.cache.Unit){
    let unit = mod.cache.Unit[unitId]
    unit.morphs?.length && console.log(`${unitId} <-> ${unit.morphs.map(u => u[0].id).join(",")}`)
    unit.producedUnits?.length && console.log(`${unitId} --> ${unit.producedUnits.map(u => u[0].id).join(",")}`)
    unit.producedUpgrades?.length && console.log(`${unitId} ==> ${unit.producedUpgrades.map(u => u[0].id).join(",")}`)
}
console.log("finished")

console.log(`Execution time: ${(end - start).toFixed(3)} ms`);



