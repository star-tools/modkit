
import {Assets as A,C, Links as L} from "./types.js"
import {SCSchema} from "./schema.js"



export const SPreload = {
    "@": "Preload",
    Asset: [{
        path: A.Asset,
        Type: C.Word,//'Layout|Cutscene|Image'
    }],
    Unit: [{id: L.Unit, UserTag: C.Unknown, Variations: C.Reals}],
    Actor: [{id:L.Actor, Variations: C.Reals}],
    Sound: [{id: L.Sound, Variations: C.Ints}],
    Race: [{id: L.Race}],
    User: [{id: L.User}],
    Upgrade: [{id: L.Upgrade}],
    Achievement: [{id: L.Achievement}],
    Weapon: [{id: L.Weapon}],
    Spray: [{id: L.Spray}],
    Button: [{id: L.Button}],
    Commander: [{id: L.Commander}],
    Behavior: [{id: L.Behavior}],
    Model: [{id: L.Model}],
    Terrain: [{id: L.Terrain}],
    Effect: [{id: L.Effect}],
    Objective: [{id: L.Objective}],
    Light: [{id: L.Light}],
    Soundtrack: [{id: L.Soundtrack}],
    Abil: [{id: L.Abil}],
    TerrainObject: [{id: L.Cliff}],
    Map: [{id: L.Map}],
    PlayerResponse: [{id:L.PlayerResponse}]
}


