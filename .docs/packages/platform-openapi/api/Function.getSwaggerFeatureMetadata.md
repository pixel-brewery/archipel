---
title: 'Function: getSwaggerFeatureMetadata()'
generated: true
editUrl: false
---

# Function: getSwaggerFeatureMetadata()

```ts
function getSwaggerFeatureMetadata(target): ISwaggerFeatureMetadata | undefined;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:219](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L219)

Reads the [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) previously attached to a module class
by the [SwaggerFeature](Function.SwaggerFeature) decorator.

## Parameters

| Parameter | Type                        | Description                  |
| --------- | --------------------------- | ---------------------------- |
| `target`  | new (...`args`) => `object` | The module class to inspect. |

## Returns

\| [`ISwaggerFeatureMetadata`](Interface.ISwaggerFeatureMetadata)
\| `undefined`

The feature metadata, or `undefined` if the class was not decorated.
