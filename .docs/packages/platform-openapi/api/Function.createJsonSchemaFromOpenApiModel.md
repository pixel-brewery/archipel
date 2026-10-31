---
title: 'Function: createJsonSchemaFromOpenApiModel()'
generated: true
editUrl: false
---

# Function: createJsonSchemaFromOpenApiModel()

```ts
function createJsonSchemaFromOpenApiModel(model, options?): Readonly<Record<string, unknown>>;
```

Defined in: [libs/platform-openapi/src/json-schema/createJsonSchemaFromOpenApiModel.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/json-schema/createJsonSchemaFromOpenApiModel.ts#L74)

Creates a self-contained JSON Schema from a NestJS Swagger model.

The converter delegates DTO discovery to NestJS Swagger, keeps only the root
model's recursively reachable component schemas, bundles them in a reserved
collision-free `$defs` namespace, rebases component-local JSON Pointers, and
converts OpenAPI `nullable` flags into JSON Schema null unions.

## Parameters

| Parameter  | Type                                                                                             | Description                                  |
| ---------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `model`    | `Type`\<`unknown`\>                                                                              | Root DTO model to convert.                   |
| `options?` | [`ICreateJsonSchemaFromOpenApiModelOptions`](Interface.ICreateJsonSchemaFromOpenApiModelOptions) | Optional JSON Schema normalization controls. |

## Returns

`Readonly`\<`Record`\<`string`, `unknown`\>\>

A provider-neutral, self-contained JSON Schema object.

## Throws

Error when the root or a referenced component is missing, a nullable
schema has no valid explicit sibling type, or multiple DTOs or enums claim
the same OpenAPI schema name.
