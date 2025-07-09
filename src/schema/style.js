
import {SCSchema} from "./schema.js"
import {CEnum, CColor, CWord, Int, Real , CString, Assets as A} from "./types.js"

export class EStyle extends CEnum { static enum = ["ShadowrGlow","InlineJustification","Uppercase","TightGradient","Outline","Bold","Italic","HintingOff","HintingNative","HintingAuto","HintStyleNormal","HintStyleLight","HintStyleLCD","HintStyleLCDVertical"]}
export class EVJustify extends CEnum { static enum = ["Top","Middle","Bottom"]}
export class EHJustify extends CEnum { static enum = ["Left","Center","Right"]}

export const CSStyle = {
    Constant: [{name:CWord,val: CString}],
    Style: [{
        name:                 CWord,
        template:             CWord,
        font:                 CWord,//FontGroupLink ,//file name (preferably a constant)
        height:               Int,//integer [1, 200]
        vjustify:             EVJustify,
        hjustify:             EHJustify,
        styleflags:           EStyle,
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
        lineSpacing:          Real,//decimal multiplier [1.0, 4.0]
        characterSpacing:     Int//integer addition [0, 255]
    }],
    FontGroup: [{
        name : CWord,
        requiredtoload: CWord,
        CodepointRange: [{font: A.Font}]
    }]
}

export default {
    Style: CSStyle
}



SCSchema.StyleFile = CSStyle


