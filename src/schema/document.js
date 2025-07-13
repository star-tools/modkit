import {CString} from "./types.js"
import {SCSchema} from "./schema.js"
import {CEnum } from "./types.js"


export class EComponent extends CEnum {static enum = [
    "gada",
    "text",
    "info",
    "uiui",
    "trig",
    "font",
]}

SCSchema.DocInfo = {
    "@": "DocInfo",
    Dependencies: {Value: [{"&content": CString}]},
    ModType: {Value: [{"&content": CString}]},
    Preload: {Value: [{"&content": CString}]}, //   <Value>AssetFile;Assets\COOP\Mengsk\Units\Blimp_Mengsk_COOP\Blimp_Mengsk_COOP.m3</Value>
}


const component = {
    "@Type": EComponent,
}
const gada = {...component}
const text = {...component, Locale: [CString]}
const info = {...component}
const uiui = {...component}
const trig = {...component}
const font = {...component}

export const SComponents = {
    gada,
    text,
    info,
    uiui,
    trig,
    font,
}

SCSchema.components = SComponents

SCSchema.Components = {
    "@": "Components",
    Optimized: {},
    // "*Components": [SCSchema.components,EComponent],
    DataComponent: [{Type: CString, Locale: CString}]
}