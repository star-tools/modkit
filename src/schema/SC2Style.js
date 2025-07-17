
import { CColor, CWord , CString} from "../types/types.js"
import { Int, Real } from "../types/numbers.js"
import {CEnum} from "../types/core.js"
import A from "../types/files.js"

export class EStyle extends CEnum { static enum = ["Shadow","ShadowrGlow","InlineJustification","Uppercase","TightGradient","Outline","Bold","Italic","HintingOff","HintingNative","HintingAuto","HintStyleNormal","HintStyleLight","HintStyleLCD","HintStyleLCDVertical"]}
export class EVJustify extends CEnum { static enum = ["Top","Middle","Bottom"]}
export class EHJustify extends CEnum { static enum = ["Left","Center","Right"]}

export const SStyle = {
    // need option for ignorecase
    name:                 CWord,
    template:             CWord,
    font:                 CWord,//FontGroupLink ,//file name (preferably a constant)
    height:               Int,//integer [1, 200]
    vjustify:             EVJustify,
    hjustify:             EHJustify,
    styleflags:           CString,//EStyle,    !Shadow|Glow|Uppercase
    textcolor:            CColor,
    disabledcolor:        CColor,
    highlightcolor:       CColor,
    hotkeycolor:          CColor,
    hyperlinkcolor:       CColor,
    glowcolor:            CColor,
    glowMode:             CWord,//"Add","Normal"
    highlightglowcolor:   CColor,
    disabledglowcolor:    CColor,
    shadowoffset:         Int,//integer value [-128, 127]
    outlinewidth:         Int,//integer value [0,height]
    outlinecolor:         CColor,
    linespacing:          Real,//decimal multiplier [1.0, 4.0]
    characterSpacing:     Int,   //integer addition [0, 255]
    requiredtoload: CString,
    fontflags: CString //  "!Bold",
}

export const SStyleFile = {
    // need option for ignorecase
    "@": "StyleFile",
    Constant: [{name:CWord,val: CString}],
    // "*Style": [{style: SStyle}], //lowercase typo in core.sc2mod
    Style: [SStyle],
    FontGroup: [{
        name : CWord,
        requiredtoload: CWord,
        CodepointRange: [{font: A.Font}]
    }]
}

export default {
    StyleFile: SStyleFile
}