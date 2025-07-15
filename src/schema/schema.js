

export const SCSchema = {
}


export function getSchema(tag, schema = SCSchema) {
  if (schema[tag] || schema['%' + tag] || schema['@' + tag]) return schema[tag]
  for (let key in schema) {
    if (key[0] === '*' && schema[key][0]?.[tag]) {
      return schema[key][0][tag]
    }
  }
  return null
}

export function getSchemaField(tag, schema = SCSchema) {
  if (schema[tag]) return { schema: schema[tag], field: tag };
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