
// File Example 
// <PlacedObjects Version="27">
//     <ObjectUnit Id="2807" Position="34,118,0" Scale="1,1,1" UnitType="Aiur01MechanismDisabler" Player="5">
//         <Flag Index="ForcePlacement" Value="1"/>
//     </ObjectUnit>
// </PlacedObjects>
import {C} from "../types/types.js"
import L from "../types/links.js"

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
    "@": "Objects",
    ObjectDoodad: [MObjectDoodad],
    ObjectPoint: [MObjectPoint],
    ObjectCamera: [MObjectCamera],
    ObjectUnit: [MObjectUnit],
    Group: [MGroup],
    $Version: C.Int
}
export default {
    Objects: MObjects,
    Object: MObject,
    ObjectDoodad: MObjectDoodad,
    ObjectPoint: MObjectPoint,
    ObjectCamera: MObjectCamera,
    ObjectUnit: MObjectUnit,
    Group: MGroup,
}
