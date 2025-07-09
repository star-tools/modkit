import {Links as L, C } from "./types.js"
import {SCSchema} from "./schema.js"

export const MObject = {
    Flag: [{
        index: C.Word,//'>PointHidden|ForcePlacement|HeightOffset|SoundFogVisible',
        Value: C.Int
    }],
    Id: C.Int,
    Position: C.Reals,
    Rotation: C.Real,
    Scale: C.Ints,
    Name: C.String
}
export const MObjectDoodad = {
    ...MObject,
    Variation: C.Int,
    Type: C.String , //'actor',
    TintColor: C.Unknown,
    Pitch: C.Real,
    Roll: C.Real,
    TeamColor: C.Int,
    UserTag: C.String,//'>Prot|Terr|Zerg|Neutral',
    Texture: {
    TexSlot: C.String , //'>main',
    TexProps: C.Unknown,
    TexLink: C.Unknown
    },
    TileSet: C.String //'terrain'
}
export const MObjectPoint = {
    ...MObject,
    Color: C.Ints,
    Type: C.Word,//'NoFlyZone|Normal|StartLoc|BlockPathing|ThreeD|SoundEmitter',
    PathingRadiusSoft: C.Real,
    PathingRadiusHard: C.Real,
    UserTag: C.String,//'race',
    Sound: L.Sound,
    Model: L.Model,
    Animation: C.String , //'>Default|Stand',
    SoundActor: L.Actor
}
export const MObjectCamera = {
    ...MObject,
    CameraValue: [{
        index: C.Word,//'FieldOfView|NearClip|FarClip|ShadowClip|Distance|Pitch|Yaw|HeightOffset|FocalDepth|FalloffEnd|BokehFStop|BokehMaxCoC|FalloffStart|FalloffStartNear|FalloffEndNear|DepthOfField',
        Value: C.Real
    }],
    Color: C.Ints,
    CameraTarget: C.Reals,
}
export const MObjectUnit = {
    ...MObject,
    AIRebuild: [{
        Index: C.Int,
        Value: C.Int
    }],
    Variation: C.Int,
    UnitType: L.Unit,
    Resources: C.Int,
    AIFlag: [{
        index: C.Word,//'IsUseable',
        Value: C.Int
    }],
    UserTag: C.Unknown,
    Player: C.Int,
    AIActive: [{
        Index: C.Int,
        Value: C.Int
    }],
    Texture: {
        TexSlot: C.Word,//'main|decal',
        TexProps: C.String,//'words',
        TexLink: L.Texture //'texture'
    },
    Footprint: L.Footprint
}
export const MGroup = {
    GroupObject: [
    {
        Id: C.Int
    }
    ],
    Type: C.Word,//'ObjectUnit|ObjectPoint|ObjectDoodad',
    Name: C.String,
    Icon: File.Image,
    Id: C.Int
}
export const MObjects = {
    ObjectDoodad: [MObjectDoodad],
    ObjectPoint: [MObjectPoint],
    ObjectCamera: [MObjectCamera],
    ObjectUnit: [MObjectUnit],
    Group: [MGroup],
    $Version: C.Int
}
export const MTerrain = {
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
export const MRegions = {
    region: [{
        name: C.String,
        invisible: C.Unknown,
        shape: [{
            center: C.Reals,
            radius: C.Real,
            type: C.Word,//'>circle|rect|diamond',
            quad: C.Reals,
            width: C.Real,
            height: C.Real,
            negative: C.Unknown
        }],
        id: C.Int,
        color: C.Ints
    }]
}

export default {
    Object: MObject,
    ObjectDoodad: MObjectDoodad,
    ObjectPoint: MObjectPoint,
    ObjectCamera: MObjectCamera,
    ObjectUnit: MObjectUnit,
    Group: MGroup,
    Objects: MObjects,
    Terrain: MTerrain,
    Regions: MRegions,
}

SCSchema.objects = {
    ObjectDoodad:MObjectDoodad,
    ObjectPoint:MObjectPoint,
    ObjectCamera:MObjectCamera,
    ObjectUnit:MObjectUnit,
    Group:MGroup
}
SCSchema.Objects = MObjects
SCSchema.Terrain = MTerrain
SCSchema.Regions = MRegions






