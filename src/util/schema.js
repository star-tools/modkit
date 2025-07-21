export function getSchema(tag, schema ) {
  if (schema[tag] || schema['%' + tag] || schema['@' + tag]|| schema['$' + tag]) return schema[tag]
  for (let key in schema) {
    if (key[0] === '*' && schema[key][0]?.[tag]) {
      return schema[key][0][tag]
    }
  }
  return null
}

export function getSchemaField(tag, schema) {
  if (schema[tag]) return { schema: schema[tag], field: tag };
  if (schema['$' + tag]) return { schema: schema['$' + tag], field: tag };
  if (schema['%' + tag]) return { schema: schema['%' + tag], field: tag };
  if (schema['@' + tag]) return { schema: schema['@' + tag], field: tag };
  for (let key in schema) {
    if (key[0] === '*' && schema[key][0]?.[tag]) {
      const subSchema = schema[key][0][tag];
      return {
        schema: Array.isArray(schema[key]) ? [subSchema] : subSchema,
        field: key.substring(1)
      };
    }
  }
  return { schema: null, field: null };
}

export function relations(value, schema, trace = "") {
    if(!schema)return []
    //todo i should implement how to define it in schema
    if(schema["%"] ){
      let subSchemaField = value[schema["%"]]
      schema = schema[subSchemaField]
    }
    let result = []
    if(schema.constructor === Object){
        for (let atr in value) {
            if(["index",'class', "removed" ,'id','default'].includes(atr))continue

            let subschema  = schema
            if(atr !== "parent"){
              subschema=schema[atr]||schema['$'+atr]||schema['%'+atr]||schema['@'+atr]||schema['*'+atr]
            }
    
            subschema && result.push(...relations(value[atr], subschema, trace + "." + atr))
        }
    }
    else if(schema.constructor === Array){
        for(let index in value){
            result.push(...relations(value[index], schema[0], trace + "." + index))
        }
    }
    else if(schema.constructor === String || schema.constructor === Number){
        return result;
    }
    else{
        schema.relations && result.push(...schema.relations(value, trace))
    }
    return result
}