---
title: 'Interface: ICreateJsonSchemaFromOpenApiModelOptions'
generated: true
editUrl: false
---

# Interface: ICreateJsonSchemaFromOpenApiModelOptions

Defined in: [libs/platform-openapi/src/json-schema/ICreateJsonSchemaFromOpenApiModelOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/json-schema/ICreateJsonSchemaFromOpenApiModelOptions.ts#L6)

Controls conversion of a NestJS Swagger model into self-contained JSON Schema.

## Properties

### additionalProperties?

```ts
readonly additionalProperties?: false;
```

Defined in: [libs/platform-openapi/src/json-schema/ICreateJsonSchemaFromOpenApiModelOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/json-schema/ICreateJsonSchemaFromOpenApiModelOptions.ts#L15)

Adds `additionalProperties: false` to object schemas that do not already
declare an additional-properties policy.

Omit this option to preserve NestJS Swagger's generated object semantics.
