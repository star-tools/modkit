import {CString} from "../types/types.js"

export const SDocInfo = {
    "@": "DocInfo",
    ScreenshotHowToPlay: {
        File:  {Value: [{"&content": CString}]},
        CaptionId:  {Value: [{"&content": CString}]},
        Flags:  {Value: [{"&content": CString}]}
    },
    Flags: {Value: [{"&content": CString}]},
    Icon: {Value: [{"&content": CString}]},
    Dependencies: {Value: [{"&content": CString}]},
    ModType: {Value: [{"&content": CString}]},
    Preload: {Value: [{"&content": CString}]}, //   <Value>AssetFile;Assets\COOP\Mengsk\Units\Blimp_Mengsk_COOP\Blimp_Mengsk_COOP.m3</Value>
}

export default {
    DocInfo: SDocInfo
}