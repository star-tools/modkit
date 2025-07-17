
export const SEditorCategories = {
    "@": "EditorCategories",
    fieldVal: [{
        path: String, //AbilSetId,CAbil_Alignment,CAbil_CmdButtonArr
        advanced: Number,
        explorefwd: Number,
        exploreback: Number,
        explorerecurse: Number,
        explorepastroot: Number,
        explorereverse: Number,
        sort: Number,
        explorebackpastroot: Number,
        value: {
            category: String
        },
    }],
    category: [{
        name: String,
        value: [{
            group: String //[CutScene,Mission,Conversation,Fidget,UnitVO,Generic,Briefing,Prerendered,ScriptedScenes,TVReports,Gossip,Installer,Unit,Item,Destructible,Doodad,Ability,Research,Arifact,Buff,Weapon,Tileset,LoadOut]
        }]
    }],
    group: [{
        name: String // [CutScene,Conversation,Fidget,Mission,UnitVO,Generic,Briefing,Gossip,Prerendered,ScriptedScenes,TVReports,Installer,Ability,Arifact,Buff,Destructible,Doodad,Item,Research,Unit,Weapon,LoadOut,Tileset]
    }],
    objectUsage: [{
        type: String, //[Abil,Actor,Alert,AttachMethod,BankCondition,Beam,Behavior,Button,Camera,Conversation,DSP,Effect,FootprNumber,Game,GameUI,Hero,Item,Light,Loot,Model,Mount,Mover,Preload,Requirement,RequirementNode,Reward,Skin,Sound,SoundExclusivity,SoundMixSnapshot,Tactical,Talent,TargetFind,TargetSort,Terrain,Turret,Unit,Upgrade,Validator,Water,Weapon,Accumulator,DataCollection],
        objects: {
            usage: [{
                source: String//[External,EntryType,Parent,Field]
            }]
        },
        fields: {
            usage: [{
                source: String //[External]
            }]
        }
    }],
}

export default {
    EditorCategories: SEditorCategories
}