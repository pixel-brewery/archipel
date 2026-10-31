---
title: 'Function: createJsonSchemaFingerprint()'
generated: true
editUrl: false
---

# Function: createJsonSchemaFingerprint()

```ts
function createJsonSchemaFingerprint(schema): string;
```

Defined in: [libs/platform-openapi/src/json-schema/createJsonSchemaFingerprint.ts:126](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/json-schema/createJsonSchemaFingerprint.ts#L126)

Creates a versioned, stable SHA-256 fingerprint for a JSON Schema document.

The fingerprint represents validation semantics rather than annotations.
Known annotations and OpenAPI vendor extensions are removed, validation
collections are normalized deterministically, local JSON Pointer references
are canonicalized, and OpenAPI 3.0 compatibility keywords are translated.
Unknown keywords fail closed so a new validation rule can never disappear
silently from the fingerprint.

Pair the returned value with `JSON_SCHEMA_FINGERPRINT_ALGORITHM`. Consumers
must reject fingerprints carrying a different algorithm identifier.

## Parameters

| Parameter | Type         | Description                                  |
| --------- | ------------ | -------------------------------------------- |
| `schema`  | `JsonSchema` | Self-contained JSON Schema 2020-12 document. |

## Returns

`string`

Lowercase hexadecimal SHA-256 fingerprint.
