---
title: 'Function: getRegisteredSwaggerFeatures()'
generated: true
editUrl: false
---

# Function: getRegisteredSwaggerFeatures()

```ts
function getRegisteredSwaggerFeatures(): ISwaggerFeatureMetadata[];
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:235](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L235)

Returns all [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) entries that have been registered
via the [SwaggerFeature](Function.SwaggerFeature) decorator, sorted alphabetically by
[name](Interface.ISwaggerFeatureMetadata#name).

Typically called once during application bootstrap to build the multi-document
Swagger setup.

## Returns

[`ISwaggerFeatureMetadata`](Interface.ISwaggerFeatureMetadata)[]

A sorted array of feature metadata. Empty if no features were registered.
