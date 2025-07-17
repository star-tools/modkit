
// Cutscene example
//  <CutsceneState cutsceneVersion="1.300000">
//     <CCutsceneNodeDirector guid="10214146330152079112" name="Director" sortIndex="0" interactive="1" waitForResources="1">
//         <CCutsceneNodeActiveCamera guid="11132535849866170120" name="Active Camera (Two Buttons)" sortIndex="0">
//             <CCutsceneElementActiveCamera guid="5371335434193538824" cameraIndex="0" objectGuid="12669037902971473672"/>
//         </CCutsceneNodeActiveCamera>
//         <CCutsceneNodeBookmark guid="13540519958837137160" name="Bookmarks" sortIndex="1">
//             <CCutsceneElementBookmark guid="8062300885164953352" start="1016" bookmarkName="2DBirth"/>
//             <CCutsceneElementBookmark guid="7562595471933509384" start="1334" bookmarkName="LoopStart"/>
//         </CCutsceneNodeBookmark>
//         <CCutsceneNodeActiveLight guid="12915248423633096456" name="Active Light" sortIndex="2">
//             <CCutsceneElementActiveLight guid="8980796194218512136" lightGUID="0" lightID="TaldarimProtossCallDownTwo" lightIndex="0" blendTime="0"/>
//         </CCutsceneNodeActiveLight>
//         <CCutsceneNodeEndScene guid="12127979049965522696" name="End Scene Markers" sortIndex="3">
//             <CCutsceneElementEndScene guid="5118087966099705608" start="29280"/>
//         </CCutsceneNodeEndScene>
//     </CCutsceneNodeDirector>
//     <CCutsceneNodeActor guid="12669037902971473672" name="UI Screens Mission Protoss Taldarim Calldown Two" sortIndex="1" modelLink="UI_Screens_Mission_ProtossTaldarimCalldownTwo" shadowBox="0" teamColorDiffuse="0.705800,0.078300,0.117600,1.000000" teamColorEmissive="0.545100,0.062700,0.086100,1.000000">
//         <CCutsceneElementObject guid="8988974095417937672" duration="30079" lockedToEnd="1"/>
//         <CCutsceneNodeAnimLayer guid="10986371253720518408" name="Animation Layer" sortIndex="0">
//             <CCutsceneElementAnim guid="5106352019502993160" duration="1334" anim="Birth" priority="7" originalDuration="1333" looping="1" blendOutTime="0" fullMatchLegacy="1"/>
//             <CCutsceneElementAnim guid="6484915991851765512" start="1334" duration="5333" anim="Stand" priority="3" originalDuration="10133" looping="1" blendTime="0" blendOutTime="0" fullMatchLegacy="1"/>
//         </CCutsceneNodeAnimLayer>
//         <CCutsceneNodePropertyValue guid="9564223156981374265" name="Property - Visible" sortIndex="1" propertyName="visible">
//             <CCutsceneElementPropertyValue guid="8365338226632727865" value="1"/>
//             <CCutsceneElementPropertyValue guid="4787334593132051841" start="8000" value="0"/>
//         </CCutsceneNodePropertyValue>
//     </CCutsceneNodeActor>
// </CutsceneState>


import {C,T} from "../types/types.js"
import A from "../types/files.js"
import L from "../types/links.js"
import N from "../types/numbers.js"
import F from "../types/flags.js"
import E from "../types/enums.js"
import S from "./SC2DataStructures.js"

export const CCutsceneElementPropertyValue = {
}

export const CCutsceneElement= {
    guid: Number,
}
export const CCutsceneElementAnim = {
    ...CCutsceneElement,
    duration: Number,
    lockedToEnd: Number,
    anim:C.String,//GLstand animname
    priority: Number,
    originalDuration:Number,
    looping: N.Bit,
    blendTime:Number,
    blendOutTime:Number,
    fullMatchLegacy: N.Bit
}
export const CCutsceneElementObject = {
    ...CCutsceneElement,
    duration: Number,
    lockedToEnd: N.Bit
}
export const CCutsceneNode = {
    ...CCutsceneElement,
    name: String,
    sortIndex: Number,
}
export const CCutsceneNodeAnimLayer = {
    CCutsceneElementAnim: [CCutsceneElementAnim],
    ...CCutsceneNode,
    enabled:N.Bit
}

export const CCutsceneNodePropertyValue = {
    CCutsceneElementPropertyValue: [CCutsceneElementPropertyValue]
}

export const CCutsceneNodeActor = {
    ...CCutsceneNode,
    CCutsceneElementObject: [CCutsceneElementObject],
    CCutsceneNodeAnimLayer: [CCutsceneNodeAnimLayer],
    CCutsceneNodePropertyValue: [CCutsceneNodePropertyValue],
    modelLink: L.Model,
    shadowBox: Number,
    teamColorDiffuse: C.Reals,
    teamColorEmissive: C.Reals,
}

export const CCutsceneElementActiveCamera = {
    ...CCutsceneElement,
    cameraIndex: Number,
    objectGuid: String
}
export const CCutsceneElementActiveLight = {
    ...CCutsceneElement,
    lightGUID: String,
    "lightID": L.Light,
    "lightIndex": Number,
    "blendTime":Number

}
export const CCutsceneElementBookmark = {
    ...CCutsceneElement,
    bookmarkName: String,
    start: Number,
    jumpToBookmarkWhenHit: String //StandStart amnim name?
}


export const CCutsceneNodeActiveCamera = {
    ...CCutsceneNode,
    CCutsceneElementActiveCamera: [CCutsceneElementActiveCamera]
}
export const CCutsceneNodeActiveLight = {
    ...CCutsceneNode,
    CCutsceneElementActiveLight: [CCutsceneElementActiveLight]
}
export const CCutsceneNodeBookmark = {
    ...CCutsceneNode,
    CCutsceneElementBookmark: [CCutsceneElementBookmark]
}

export const CCutsceneNodeDirector = {
    guid: Number,
    name: String,
    sortIndex: Number,
    interactive: Number,
    CCutsceneNodeActiveCamera: [CCutsceneNodeActiveCamera],
    CCutsceneNodeActiveLight: [CCutsceneNodeActiveLight],
    CCutsceneNodeBookmark: [CCutsceneNodeBookmark]
}


export const SCutsceneState = {
    cutsceneVersion: Number,
    CCutsceneNodeDirector,
    CCutsceneNodeActor: [CCutsceneNodeActor]
}

export default {
    CutsceneState: SCutsceneState
}