---
title: 'Class: SwaggerFeatureRegistry'
generated: true
editUrl: false
---

# Class: SwaggerFeatureRegistry

Defined in: [libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts#L15)

Registry service for dynamically discovered Swagger features.
Collects feature configurations from `@SwaggerFeature` decorators.

## Constructors

### Constructor

```ts
new SwaggerFeatureRegistry(): SwaggerFeatureRegistry;
```

Defined in: [libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts#L26)

#### Returns

`SwaggerFeatureRegistry`

## Methods

### finalize()

```ts
finalize(): void;
```

Defined in: [libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts#L65)

Finalize feature registration and prepare for use

#### Returns

`void`

---

### getFeatures()

```ts
getFeatures(): IFeatureSwaggerConfig[];
```

Defined in: [libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts#L77)

Get all registered features

#### Returns

[`IFeatureSwaggerConfig`](Interface.IFeatureSwaggerConfig)[]

---

### registerFeature()

```ts
registerFeature(feature): void;
```

Defined in: [libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/registry/SwaggerFeatureRegistry.ts#L39)

Register a new feature for Swagger documentation

#### Parameters

| Parameter | Type                                                       | Description               |
| --------- | ---------------------------------------------------------- | ------------------------- |
| `feature` | [`IFeatureSwaggerConfig`](Interface.IFeatureSwaggerConfig) | The feature configuration |

#### Returns

`void`
