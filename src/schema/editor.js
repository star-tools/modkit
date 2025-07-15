
import {SCSchema} from "./schema.js"
import { Int, Real, CWord, CString} from "./types.js"

export const SEditorCategories = {
    "@": "EditorCategories",
    fieldVal: [{
        path: CString, //AbilSetId,CAbil_Alignment,CAbil_CmdButtonArr
        advanced: Int,
        explorefwd: Int,
        exploreback: Int,
        explorerecurse: Int,
        explorepastroot: Int,
        explorereverse: Int,
        sort: Int,
        explorebackpastroot: Int,
        value: {
            category: CWord
        },
    }],
    category: [{
        name: CString,
        value: [{
            group: CWord //[CutScene,Mission,Conversation,Fidget,UnitVO,Generic,Briefing,Prerendered,ScriptedScenes,TVReports,Gossip,Installer,Unit,Item,Destructible,Doodad,Ability,Research,Arifact,Buff,Weapon,Tileset,LoadOut]
        }]
    }],
    group: [{
        name: CWord // [CutScene,Conversation,Fidget,Mission,UnitVO,Generic,Briefing,Gossip,Prerendered,ScriptedScenes,TVReports,Installer,Ability,Arifact,Buff,Destructible,Doodad,Item,Research,Unit,Weapon,LoadOut,Tileset]
    }],
    objectUsage: [{
        type: CWord, //[Abil,Actor,Alert,AttachMethod,BankCondition,Beam,Behavior,Button,Camera,Conversation,DSP,Effect,Footprint,Game,GameUI,Hero,Item,Light,Loot,Model,Mount,Mover,Preload,Requirement,RequirementNode,Reward,Skin,Sound,SoundExclusivity,SoundMixSnapshot,Tactical,Talent,TargetFind,TargetSort,Terrain,Turret,Unit,Upgrade,Validator,Water,Weapon,Accumulator,DataCollection],
        objects: {
            usage: [{
                source: CWord//[External,EntryType,Parent,Field]
            }]
        },
        fields: {
            usage: [{
                source: CWord //[External]
            }]
        }
    }],
}