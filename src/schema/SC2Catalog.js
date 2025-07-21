import {C} from "../types/types.js"
import A from "../types/files.js"
import E from "../types/enums.js"
import F from "../types/flags.js"
import SC2DataStructures, { DataStructs } from "./SC2DataStructures.js"
import SC2DataClasses, { DataClasses } from "./SC2DataClasses.js"

// -------------------------------
// Special Types
// -------------------------------

export const SConst = {
    id: C.Word,
    type: E.TypeId,
    value: C.TokenValue,
    path: C.Path,
}

export const SConstDefinition = {
    ...SConst,
    "@class": E.ConstId,
}

export const SStructDefinition = {
    "@class": E.StructId
}


// -------------------------------
// specific things
// -------------------------------

// export const Structs = Object.fromEntries(
//     Object.entries(SC2DataStructures).map(([key, value]) => [key.slice(1), value])
// );

export const StructDefinitions = Object.fromEntries(
  Object.entries(SC2DataStructures).map(([name, def]) => [
    `S${name}`,
    { ...def, ...SStructDefinition }
  ])
);

// export const S = {
//     ...Structs,
//     Const: SConst,
//     Token: SToken,
// }

// // used by VStruct to determind object a structure
// SCSchema.struct = {
//     ...StructsClasses,
//     SConst,
//     SToken,
// }

// SCSchema.structDefinitions = Object.fromEntries(
//   Object.keys(StructDefinitions).map(k => [k.replace(/Definition$/, ""), StructDefinitions[k]])
// );

//this is used by VData to determind object a structure
// SCSchema.classes = CatalogClasses
// SCSchema["Const"] = [S.Const],
// SCSchema["*Struct"] = [SCSchema.struct]
// SCSchema["*Data"] = [SCSchema.classes]
// const structs = Object.fromEntries(Object.entries(SC2DataStructures).map(([k,v]) => [`S${k}`, v]));
// const classes = Object.fromEntries(Object.entries(SC2DataClasses).map(([k,v]) => [`C${k}`, v]));

export const CatalogEntities = {
  ...DataClasses,
  ...StructDefinitions,
  const: SConstDefinition
}
const combinedCatalogData = {
  "%": "class", 
  ...CatalogEntities
}

export const SCatalog = {
    //constants will be stored in a separate array 
    "@": "Catalog",
    path: A.XML,
    mod: String,
    namespace: E.GameCatalog,
    //these are variative fields... did not find a best way to imlpement schema for the catalog.
    //if tag schema not found for example, there ar no CUnit field
    //if persist all CUNits would be saved in CUnit array
    //but instead cnverter will search for variative filds if any validate the CUnit it will be added to this array .
    //if validate method returns Schema object it will be used as schema  (VData will return CUnit from schema types it will be used instead of VData)
    //separate structures and catalogs 
    // "@type": C.String, //can be used to identify result json object as catalog data
    // ...SStructs, // only 1 structure element per type
    // ...Object.fromEntries(Object.entries(CatalogClasses).map(([e,c]) => ([e,[c]]))) //multiple classes

    // "*Struct": [StructDefinitions],
    // "*Data": [classes]
    "*data": [combinedCatalogData]
}

export default {
    Const: SConst,
    Catalog: SCatalog,
    ...SC2DataStructures,
    ...SC2DataClasses
}