import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

/**
 * Recursively removes schema-level metadata `id` keys from an OpenAPI schema tree.
 *
 * This intentionally does not remove regular model fields named `id` inside
 * `properties`, because those are part of the actual API contract.
 */
function stripSchemaMetadataId(schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map(stripSchemaMetadataId)
  }

  if (!schema || typeof schema !== 'object') {
    return schema
  }

  const record = { ...(schema as Record<string, unknown>) }

  if (record.properties && typeof record.properties === 'object') {
    record.properties = Object.fromEntries(
      Object.entries(record.properties as Record<string, unknown>).map(([key, value]) => [
        key,
        stripSchemaMetadataId(value),
      ])
    )
  }

  for (const key of ['items', 'additionalProperties', 'not']) {
    if (key in record) {
      record[key] = stripSchemaMetadataId(record[key])
    }
  }

  for (const key of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
    if (Array.isArray(record[key])) {
      record[key] = (record[key] as unknown[]).map(stripSchemaMetadataId)
    }
  }

  delete record.id

  return record
}

/**
 * Normalizes the generated OpenAPI document for SDK generators such as Orval.
 *
 * `nestjs-zod` can emit schema metadata `id` keys inside `components.schemas`.
 * Those keys are not part of the runtime payload shape and may cause some
 * OpenAPI consumers to reject the document during validation.
 *
 * We only strip metadata-level schema `id` keys here and preserve real resource
 * fields like `properties.id`.
 */
export function cleanupSdkOpenApiDoc(doc: OpenAPIObject): OpenAPIObject {
  const schemas = doc.components?.schemas

  if (!schemas) {
    return doc
  }

  const cleanedSchemas = Object.fromEntries(
    Object.entries(schemas).map(([key, value]) => [
      key,
      stripSchemaMetadataId(value as SchemaObject),
    ])
  ) as Record<string, SchemaObject | ReferenceObject>

  return {
    ...doc,
    components: {
      ...doc.components,
      schemas: cleanedSchemas,
    },
  }
}
