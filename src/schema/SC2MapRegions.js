// File Example
// <Regions>
//     <region id="1">
//         <name value="Intro Planetcracker Death Region"/>
//         <color value="255,0,0,0"/>
//         <shape type="circle">
//             <center value="136.808,33.044"/>
//             <radius value="17.6313"/>
//         </shape>
//     </region>
// </Regions>
import {C} from "../types/types.js"

export const MShape ={
    center: C.Reals,
    radius: C.Real,
    type: C.Word,//'>circle|rect|diamond',
    quad: C.Reals,
    width: C.Real,
    height: C.Real,
    negative: C.Unknown
}
    
export const MRegion = {
    name: C.String,
    invisible: C.Unknown,
    shape: [MShape],
    id: C.Int,
    color: C.Ints
}

export const MRegions = {
    "@": "Regions",
    region: [MRegion]
}

export default {
    region: MRegion,
    shape: MShape,
    Regions: MRegions
}

