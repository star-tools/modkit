
import {SCSchema} from "./schema.js"
import {Assets as A,C, Links as L} from "./types.js"


export const SLibraryElement =   {
  $Type: C.Word,
  $Id: C.Word,
  Internal: C.String,
  Disabled: C.String,
  FlagAction: C.String,
  FlagCall: C.String,
  FlagInline: C.String,
  FlagNoScriptPrefix: C.String,
  InitOff: C.String,
  PresetInteger: C.String,
  ParamFlagPreload: C.String,
  FlagCondition: C.String,
  FlagCreateThread: C.String,
  PresetGenConstVar: C.String,
  ValueTypeInfo: {Value: C.Int},
  ValueContext: {Value: C.String},
  ExpressionCode: {Value: C.String},
  Item: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Label: { Id: C.Word, Library: C.Word, Type: C.Word},
  Action: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  FunctionDef: { Id: C.Word, Library: C.Word, Type: C.Word},
  ParameterDef: { Id: C.Word, Library: C.Word, Type: C.Word},
  Variable: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Array: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  VariableType: {
    Type: {Value: C.String},
    Constant: C.String,
    GameType: {Value:C.Word},
    ArraySize: [{
      Dim:C.Int,
      Value:C.Int,
      Type: C.String,
      Library: C.String,
      Id: C.String
    }],
    UserType: {
      Value: C.Word
    },
    AssetType: {
      Value: C.Word
    },
    TypeElement: {
      Type: C.Word,
      Library: C.Word,
      Id: C.Word
    },
    EntryType: {
      Value: C.Word
    }
  },
  ValueElement: { Id: C.Word, Library: C.Word, Type: C.Word},
  ValuePreset: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Preset: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Parameter: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  ValueParam: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  ExpressionParam: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Default: { Id: C.Word, Library: C.Word, Type: C.Word},
  ParameterType: {
    Type:{Value:C.Word},
    TypeElement:{Type:C.Word,Library:C.Word,Id:C.Word},
    GameType : {Value:C.Word},
    EntryType : {Value:C.Word},
    CmdTarget: {
      Value: C.String
    },
    VariableType: {
      Value: C.Word
    },
    UserType: {
      Value: C.Word
    },
    AssetType: {
      Value: C.Word
    }
  },
  FunctionCall: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  SubFunctionType: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Event: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  Condition: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
  ValueId:{ Id: C.Word},
  ValueType: { Type: C.Word},
  ValueGameType: { Type: C.Word},
  BaseType: { Type: C.Word, Value:C.Word},
  ReturnType: {
    Type: {Value: C.Word},
    GameType: { Type: C.Word , Value: C.Word},
    TypeElement: { Id: C.Word, Library: C.Word, Type: C.Word},
    AssetType: {
      Value: C.Word
    },
    EntryType: {
      Value: C.Word
    },
    UserType: {
      Value: C.Word
    }
  },
  CustomType: { Type: C.Word},
  ExpressionType: { Type: C.Word},
  Comment:  {content : C.String },
  Value: { Id: C.Word, Library: C.Word, Type: C.Word , 
    content: C.String //'..ValueGameType.Type|..ValueType.Type|string'
},
  Identifier: {content : C.String },
  ExpressionText:  {content: C.String},
  ScriptCode: {content: C.String},
  InitFunc:  {content: C.String},
  Limits: {
    Value: C.String
  },
  NotYetImplemented: C.String,
  FlagSubFunctions: C.String,
  FlagAllowBreak: C.String,
  FlagOperator: C.String,
  StructMember: {
    Type: C.Word,
    Library: C.Word,
    Id: C.Word
  },
  Icon: {content: C.String},
  Template: C.String,
  DisplayText: {content: C.String},
  Section: {
    Value: C.Word
  },
  ParamFlagVariableOnly: C.String,
  FlagEvent: C.String,
  PresetShowAsBasic: C.String,
  Deprecated: C.String,
  PresetGenIdentFunc: C.String,
  FlagCustomScript: C.String,
  FlagRestricted: C.String,
  PresetCustom: C.String,
  DefinesDefault: C.String,
  PresetAsBits: C.String,
  PresetExtends: {
    Type: C.String,//'>Preset',
    Library: C.String,//'>Ntve',
    Id: C.String//'>37841D63'
  },
  FlagNative: C.String,
}

export const TLibrary = {
  Id: C.Word,
  Root: {
    Item: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
    Library: C.Word,
    Type: C.Word,
    Id: C.Word
  },
  LibraryShareToMods: C.Words,
  SharedLib: [
    {
      Id: C.Word
    }
  ],
  Element: [SLibraryElement]
}


export const TTriggerData = {
    library: [{external: C.String }],//[TriggerLibs/VoidMultiLib
    Library: [TLibrary],
}

export default {
  TriggerData: TTriggerData,
  Library: TLibrary
}
SCSchema.TriggerData = TTriggerData

