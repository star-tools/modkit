

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