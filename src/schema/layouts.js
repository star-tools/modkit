
import {Assets as A, Links as L,   Int, Real,    CReals,     CWord, CString} from "./types.js"
import {SCSchema} from "./schema.js"




export const LAnchor = {
    side: CString,
    relative: CString,
    pos: CString,
    offset: CString,
}

export const LShortcut = {
    val: CString,
    priority: CString,
}

export const LRenderPriority = {
    val: CString
}

export const LCoords = {
    top:     Real,
    left:    Real,
    bottom:  Real,
    right:   Real,
}

export const LAnimation = {
    name: CWord,
    Event: {
        event: CString,
        action:CString,
        frame: CString,
    },
    Controller: {
        stateGroup:  CString,
        dimension:  CString,
        relative:  CString,
        side:  CString,
        type:  CString,
        end:   CString,
        frame: CString,
        Key:   CString,
        type:  CString,
        time:  CString,
        event: CString,
        property: CString
    }
}


export const LConstant = {
    name:CString,
    val:CString,
}

export const LAction = {
    Toggled: CString,
    group: CString,
    state: CString,
    Layer: CString,
    LayerAlpha: CString,
    TextureCoords: CReals,
    Texture: CString,
    Camera: CString,
        visible:CString,
    type: CString,
    frame:CString,
    DesaturationColor: CString,
    Desaturated: CString,
    ColorAdjustMode: CString,
    LightAdjustColor:CString,
    DarkAdjustColor:CString,
    LayerVisible:   CString,
    on:CString,
    A: CString,
    Texture:A.Image,
    event: CString,
    undo: CString,
    Visible: CString,
    side: CString,
    pos: CString,
    relative: CString,
    offset: CString,
    UnitWorldZ: CString,
    Color: CString,
}

export const LState = {
    name: CString,
    Action:LAction,
    When: {
        Hovering: CString,
        Toggled: CString,
        Alpha: CString,
        PowerState: CString,
        Visible: CString,
        ObserverUIState: CString,
        UnitStatusValidatorState: CString,
        type: CString,
        frame: CString,
        operator: CString,
        Text: CString,
        Texture: A.Image,
        UseClassicIcons:  CString,
        ClassicIcon:  CString,
        Desaturated: CString,
        DesaturationColor:  CString,
        Enabled:  CString,
        ClassicIconRacialTint:  CString,
        ClassicIconState: CString,
        IsBWRace:  CString,
        UnitLink:  CString,
        A:  CString,
        CurrentValue:  CString,
        Action:L.Action,
    }
}
export const LStateGroup = {
    name: {
        value: CString
       },
    DefaultState : {
     val: CString
    },
    State: LState,
    template: {
       value:CString
        },
}

export const LFrame = {
    type: CString,
    name: CString,
    file: CString,
    AutoSizeClamps: CString,
    Height:   { val: CString },
    Width:   { val: CString },
    Style :   { val: CString },
    Enabled :   { val: CString },
    Text:  { val: CString },
    template: CString,
    Visible: { val: CString },
    Anchor: LAnchor,
    Shortcut: LShortcut,
    RenderPriority: LRenderPriority,
    Handle: CString,
    Texture: { val: CString, layer : Int },
    TextureCoords: LCoords,
    AutoSizeClamps: CString,
    AutoSizeClamps: CString,
    AutoSizeClamps: CString,
    FormatText: { val: CString },
    Replacement: { val: CString },
    Hotkey: { val: CString },
    DescFlags: { val: CString },
    Color: { val: CString },
    DesaturateOnDisable: { val: CString },
    Alpha: { val: CString },
    SubpixelRendering: { val: CString },
    AcceptsMouse: { val: CString },
    SnapToDevicePixels: { val: CString },
    CollapseLayout: { val: CString },
    Constant: { val: CString, name: CString, A: CString, B: CString },
    Operator: { val: CString },
    TextureType: { val: CString,layer: CString },
    Rotation: { val: CString },
    IgnoreParentAlpha: { val: CString },
    ClicksOn: { val: CString },
    Toggleable: { val: CString },
    Toggled: { val: CString },
    Animation : LAnimation,
    StateGroup: LStateGroup,
    TooltipAnchorPosition: { val: CString },
    StartValue: { val: CString },
    CurrentValue: { val: CString },
    RenderType: { val: CString },
    Behavior: { val: L.Behavior },
    HideMax: { val: CString },
    StackFormatString: { val: CString },
    MinValue: { val: CString },
    MaxValue: { val: CString },
    Value: { val: CString },
    UseSelectionLeader: { val: CString },
    UnitTag: { val: CString },
    UseAlternateTime: { val: CString },
    CountdownTime: { val: CString },
    TargetValue: { val: CString },
    AdjustmentColor: { val: CString },
    ColorAdjustMode: { val: CString },
    Desaturated: { val: CString },
    DesaturationColor: { val: CString },
    AutoPlay: { val: CString },
    File: { val: CString },
    Fading: { val: CString },
    Tooltip: { val: CString },
    DesaturateOnDisable: { val: CString },
    TabListItem: { val: CString },
    PanelListItem: { val: CString },
    RequiredDefines: { val: CString },
    DragCursor: { val: CString },
    DragHoverCursor: { val: CString },
    Draggable: { val: CString },
    DragConstraintFrame: { val: CString },
    Muted: { val: CString },
    NormalImage: { val: CString },
    HoverImage: { val: CString },
    Unclipped: { val: CString },
    LayerColor: { val: CString },
    LayerCount: { val: CString },
    Color: { val: CString },
    URL: { val: CString },
    DescFlags: { val: CString },
    SubpixelRendering: { val: CString },
    PreserveAnchorOffset: { val: CString },
    A: { val: CString },
    B: { val: CString },
    Operator: { val: CString },
    Validator: { val: CString },
    SnapToDevicePixels: { val: CString },
    SegmentValue: { val: CString },
    BarInsetRect:  LCoords,
    BackgroundInsetRect:  LCoords,
    BackgroundShown: { val: CString },
    BackgroundColor: { val: CString },
    OwnerColor: { val: CString },
    AllyColor: { val: CString },
    EnemyColor: { val: CString },
    ReductionColor: { val: CString },
    ReductionShown: { val: CString },
    IncreaseDuration: { val: CString },
    DecreaseDuration: { val: CString },
    Segmented: { val: CString },
    BarCount: { val: CString },
    OwnerRenderPriority: { val: CString },
    AllyRenderPriority: { val: CString },
    EnemyRenderPriority: { val: CString },
    RejectsFocus: { val: CString },
    MaxCharacters: { val: CString },
    UseFillContainer: { val: CString },
    AcceptsMouseTooltip: { val: CString },
    ShowOnDefeat: { val: CString },
    HitTestFrame: { val: CString },
    TooltipFrame: { val: CString },
    ClickSound: { val: CString },
    HoverSound: { val: CString },
    DisplayType: { val: CString },
    AlphaMaskTexture: { val: CString },
    AlphaMaskSiblings: { val: CString },
    ConsoleWorldTopOffset: { val: CString },
    ConsoleWorldBottomOffset: { val: CString },
    VisibleToEnemy: { val: CString },
    VisibleToAlly: { val: CString },
    Batch: { val: CString },
}
//nested framesA
LFrame.Frame = [LFrame]


export const LLayout = {
    Include: [{path: A.Layout, requiredtoload: CWord}],
    Frame: [LFrame],
    StateGroup: LStateGroup,
    Constant: LConstant
}

export default {
    Anchor: LAnchor,
    Shortcut: LShortcut,
    RenderPriority: LRenderPriority,
    Coords: LCoords,
    Animation: LAnimation,
    Constant: LConstant,
    Action: LAction,
    State: LState,
    StateGroup: LStateGroup,
    Frame: LFrame,
    Layout: LLayout,
}

SCSchema.Desc = LLayout







