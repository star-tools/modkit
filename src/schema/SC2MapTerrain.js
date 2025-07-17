// File Example
// <terrain version="115">
//     <heightMap tileSet="AiurCity" 
//         uvtiling="17.250000 18.750000 1.500000 -5.250000 " 
//         dim="185 201 " 
//         offset="0.000000 0.000000 0.000000 " 
//         scale="1.000000e+00 1.000000e+00 1.000000e+00 ">
//         <cliffSetList num="3">
//             <cliffSet i="0" name="HybridLabXelNagaCliff1"/>
//         </cliffSetList>
//         <rampList num="3">
//             <ramp dir="5" hi="2" lo="1" leftLo="u(1.000000e+00, 0.000000e+00) r(0.000000e+00, -1.000000e+00) c=(9.600000e+01, 2.800000e+01) w=2.000000e+00 h=2.000000e+00" leftHi="u(0.000000e+00, 0.000000e+00) r(0.000000e+00, 0.000000e+00) c=(4.000000e+00, 4.000000e+00) w=0.000000e+00 h=0.000000e+00" rightLo="u(1.000000e+00, 0.000000e+00) r(0.000000e+00, -1.000000e+00) c=(9.000000e+01, 2.200000e+01) w=2.000000e+00 h=2.000000e+00" rightHi="u(0.000000e+00, 0.000000e+00) r(0.000000e+00, 0.000000e+00) c=(0.000000e+00, 0.000000e+00) w=0.000000e+00 h=0.000000e+00" base="u(7.071068e-01, -7.071068e-01) r(-7.071068e-01, -7.071068e-01) c=(9.500000e+01, 2.300000e+01) w=4.242640e+00 h=0.000000e+00" mid="u(7.071068e-01, -7.071068e-01) r(-7.071068e-01, -7.071068e-01) c=(9.300000e+01, 2.500000e+01) w=4.242640e+00 h=2.828427e+00" cid="1" leftLoVar="0" leftHiVar="4294967295" rightLoVar="0" rightHiVar="4294967295"/>
//         </rampList>
//         <cliffDoodadList num="3">
//             <cliffDoodad name="TerrainObjectExpeditionGate2" pos="34.000000 118.000000 2.000000 " rot="0"/>
//         </cliffDoodadList>
//         <vertData quantizeBias="9.023161e+00" quantizeScale="2.826847e-04" standardHeight="8.000000e+00" name="t3HeightMap"/>
//         <masks name="t3TextureMasks"/>
//         <textureSetList num="8">
//             <textureSet i="0" name="AiurCity"/>
//         </textureSetList>
//         <textureList num="64">
//             <texture i="0" name="AiurCity1"/>
//         </textureList>
//         <blockTextureSetList num="575">
//             <blockTextureSet i="0" tileSet="0"/>
//         </blockTextureSetList>
//         <cliffCellList num="9200" numOccupied="4941">
//             <cc i="0" f="0" cid="1" cvar="0"/>
//         </cliffCellList>
//     </heightMap>
// </terrain>


import {C} from "../types/types.js"

export const MTerrain = {
    "@": "Terrain",
    heightMap: [{
        cliffSetList: {
            cliffSet: [{
                i: C.Int,
                name: C.String//'cliff'
            }],
            num: C.Int
        },
        rampList: {
            ramp: [{
                dir: C.Int,
                hi: C.Int,
                lo: C.Int,
                leftLo: C.Unknown,
                leftHi: C.Unknown,
                rightLo: C.Unknown,
                rightHi: C.Unknown,
                base: C.Unknown,
                mid: C.Unknown,
                cid: C.Int,
                leftLoVar: C.Int,
                leftHiVar: C.Int,
                rightLoVar: C.Int,
                rightHiVar: C.Int
            }],
            num: C.Int
        },
        vertData: {
            quantizeBias: C.Unknown,
            quantizeScale: C.Unknown,
            standardHeight: C.Unknown,
            name: C.String
        },
        masks: {
            name: C.String
        },
        textureSetList: {
            textureSet: [{
                i: C.Int,
                name: C.String// 'terrain'
            }],
            num: C.Int
        },
        textureList: {
            texture: [{
                i: C.Int,
                name: C.String //'terraintex'
            }],
            num: C.Int
        },
        blockTextureSetList: {
            blockTextureSet: [{
                i: C.Int,
                tileSet: C.Int
            } ],
            num: C.Int
        },
        cliffCellList: {
            cc: [{
                i: C.Int,
                f: C.Int,
                cid: C.Int,
                cvar: C.Int
            }],
            num: C.Int,
            numOccupied: C.Int
        },
        tileSet: C.String,//'terrain',
        uvtiling: C.Unknown,
        dim: C.Unknown,
        offset: C.Unknown,
        scale: C.Unknown,
        cliffDoodadList: {
            cliffDoodad: [{
                name: C.String,//'cliff',
                pos: C.Unknown,
                rot: C.Int
            }],
            num: C.Int
        }
    }],
    version: C.Int
}
export default {
    Terrain: MTerrain
}

