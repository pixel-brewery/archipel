---
title: 'Variable: JSON\_SCHEMA\_FINGERPRINT\_ALGORITHM'
generated: true
editUrl: false
---

# Variable: JSON\_SCHEMA\_FINGERPRINT\_ALGORITHM

```ts
const JSON_SCHEMA_FINGERPRINT_ALGORITHM: 'json-schema-validation-sha256-v1';
```

Defined in: [libs/platform-openapi/src/json-schema/JsonSchemaFingerprintAlgorithm.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/json-schema/JsonSchemaFingerprintAlgorithm.ts#L9)

Stable identifier for the validation-semantic JSON Schema fingerprint.

Consumers must compare this identifier together with the fingerprint. A new
identifier is required whenever canonicalization rules change.
