import {CString} from "./types.js"
import {SCSchema} from "./schema.js"

SCSchema.DocInfo = {
    Dependencies: {Value: [{content: CString}]}
},
SCSchema.Components = {
    DataComponent: [{Type: CString, Locale:CString}]
}