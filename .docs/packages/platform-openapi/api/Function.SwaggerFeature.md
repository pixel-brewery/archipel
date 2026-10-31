---
title: 'Function: SwaggerFeature()'
generated: true
editUrl: false
---

# Function: SwaggerFeature()

```ts
function SwaggerFeature(metadata): (target) => new (...args) => object;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:196](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L196)

Class decorator that marks a NestJS module as a Swagger feature.

When applied, the decorator:

1. Attaches the resolved [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) to the class via
   `Reflect.defineMetadata` (retrievable with [getSwaggerFeatureMetadata](Function.getSwaggerFeatureMetadata)).
2. Registers the metadata in a process-global store so that
   [getRegisteredSwaggerFeatures](Function.getRegisteredSwaggerFeatures) can discover all features at bootstrap
   without requiring an explicit import of every module.

If [path](Interface.ISwaggerFeatureMetadata#path) is not provided, it defaults
to `docs/{name}`.

## Parameters

| Parameter  | Type                                                           | Description                                              |
| ---------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| `metadata` | [`ISwaggerFeatureMetadata`](Interface.ISwaggerFeatureMetadata) | Configuration describing the feature's OpenAPI document. |

## Returns

A class decorator function.

(`target`) => new (...`args`) => `object`

## Example

```typescript
@SwaggerFeature({
    name: 'tip',
    title: 'My App API - Tips',
    description: 'API endpoints for tip management',
    tag: 'Tip',
    tags: ['Tip'],
    strictModels: [TipDraftRequest],
})
@Module({
    controllers: [TipController],
    providers: [TipService],
    exports: [TipService],
})
export class TipModule {}
```
