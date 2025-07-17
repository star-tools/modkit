import {C} from "./../types/types.js"

export const SLibraryElement =   {
  // $Type: C.Word,
  // $Id: C.Word,
  Type: C.Word,
  Id: C.Word,
  // Flags: {
    Internal: {},
    Disabled: {},
    FlagAction: {},
    FlagCall: {},
    FlagInline: {},
    FlagNoScriptPrefix: {},
    InitOff: {},

    ParamFlagAltDisplay: {},
    ParamFlagMultiple: {},
    ParamFlagMatchConst: {},
    ParamFlagReference: {},
    PreviousParamType: {Value: String},
Color: {Value: String},
EventResponse: [{
  Type: String,
  Library: String,
  Id: String,
}],
FlagHidden: {},
FlagCustomAI: {},
    ParamFlagVariableOnly: {},
    PresetShowAsBasic: {},
    Deprecated: {},
    PresetGenIdentFunc: {},
    FlagEvent: {},
    FlagCustomScript: {},
    FlagRestricted: {},
    PresetCustom: {},
    DefinesDefault: {},
    PresetAsBits: {},
    PresetInteger: {},
    ParamFlagPreload: {},
    FlagCondition: {},
    FlagCreateThread: {},
    PresetGenConstVar: {},
    Template: {},
    NotYetImplemented: {},
    FlagSubFunctions: {},
    FlagAllowBreak: {},
    FlagOperator: {},
    FlagNative: {},
  // },
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
    ReferenceType: {Value: String},
    Type: {Value: C.String},
    Constant: {},
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
    ReferenceType: {Value: String},
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
    ReferenceType: {Value: String},
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
  StructMember: {
    Type: C.Word,
    Library: C.Word,
    Id: C.Word
  },
  Icon: {content: C.String},
  DisplayText: {content: C.String},
  Section: {
    Value: C.Word
  },
  PresetExtends: {
    Type: C.String,//'>Preset',
    Library: C.String,//'>Ntve',
    Id: C.String//'>37841D63'
  },
}

export const SLibraryRoot = {
    Item: [{ Id: C.Word, Library: C.Word, Type: C.Word}],
    Library: C.Word,
    Type: C.Word,
    Id: C.Word
}
  
export const TLibrary = {
    "@": "Library",
  Id: C.Word,
  Root: SLibraryRoot,
  LibraryShareToMods: C.Words,
  SharedLib: [
    {
      Id: C.Word
    }
  ],
  Element: [SLibraryElement]
}


export const STriggerData = {
    "@": "TriggerData",
    library: [{external: C.String }],//[TriggerLibs/VoidMultiLib
    Library: [TLibrary],
    Standard: {
      Id: String
    },
    Root: SLibraryRoot,
    Element: [SLibraryElement]
}

export default {
  TriggerData: STriggerData,
  Library: TLibrary
}