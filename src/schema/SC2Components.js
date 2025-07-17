import { ELocaleId } from "../types/enums.js"
import { CEnum } from "../types/core.js"

export class EComponent extends CEnum {static enum = [
    "gada",
    "text",
    "info",
    "uiui",
    "trig",
    "font",
]}


// const component = {
//     "@Type": EComponent,
// }
// const gada = {...component}
// const text = {...component, Locale: [CString]}
// const info = {...component}
// const uiui = {...component}
// const trig = {...component}
// const font = {...component}

// export const SComponents = {
//     gada,
//     text,
//     info,
//     uiui,
//     trig,
//     font,
// }

export const SComponents =  {
    "@": "Components",
    Optimized: {},
    // "*Components": [SCSchema.components,EComponent],
    DataComponent: [{Type: String, Locale: ELocaleId}]
}

export default {
    Components: SComponents
}
