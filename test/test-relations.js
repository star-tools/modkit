

import SC2JSONDebugger from '../src/converter/debugger.js';
import NodeReader from '../src/readers/node-reader.js';
import {readModData} from '../src/readers/mod-reader.js';
import {SCMod} from '../src/converter/scmod.js';
import { getSchema } from '../src/converter/scjson.js';
import { C_NAMESPACES } from '../src/schema/catalog-enums.js';


const reader = new NodeReader("./assets/data/");
const cdebugger = new SC2JSONDebugger( {file: './debug.json'});
let data = await readModData(reader,"bundles/VoidMulti5013.sc2mod",{debugger: cdebugger});


let mod = new SCMod({
    ...data
})
mod._make_cache();


function relations(value, schema, trace = "") {
    if(!schema)return []
    let result = []
    if(schema.constructor === Object){
        for (let attribute in value) {
            if(["index",'class', "removed" ,'id','default'].includes(attribute))continue
            let subschema = (attribute === "parent") ? schema : schema[attribute];
    
            schema[attribute] && result.push(...relations(value[attribute], subschema, trace + "." + attribute))
        }
    }
    else if(schema.constructor === Array){
        for(let index in value){
            result.push(...relations(value[index], schema[0], trace + "." + index))
        }
    }
    else{
        schema.relations && result.push(...schema.relations(value, trace))
    }
    return result
}

for(let cache in mod.cache){
    for(let id in mod.cache[cache]){
        let entity = mod.cache[cache][id]

        let refs =  relations(entity.data,getSchema(entity.data.class),C_NAMESPACES[entity.data.class]+ "." + entity.data.id)
        
        for(let ref of refs){
            let target = mod.cache[ref.type]?.[ref.value]
            if(target){
                if(!target.relations)target.relations = []
                target.relations.push(ref)
            }else{
                console.log(`reference ${ref.target} not found`)
            }
        }
        
        entity.references = refs.map(ref=> ({origin: ref.trace, target: ref.type + "." + ref.value}))

    }
}

console.log("fnished")