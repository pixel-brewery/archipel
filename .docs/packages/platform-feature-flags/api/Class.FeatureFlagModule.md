---
title: 'Class: FeatureFlagModule'
generated: true
editUrl: false
---

# Class: FeatureFlagModule

Defined in: [libs/platform-feature-flags/src/FeatureFlagModule.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/FeatureFlagModule.ts#L21)

NestJS module providing feature flag infrastructure.
Exposes a configurable feature flag reader and a route guard.
Optionally exposes a writer abstract base for CRUD operations when `featureFlagWriter` is provided.
The specific provider (Azure App Configuration, Vercel Edge Config) is selected via the options.

## Constructors

### Constructor

```ts
new FeatureFlagModule(): FeatureFlagModule;
```

#### Returns

`FeatureFlagModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-feature-flags/src/FeatureFlagModule.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/FeatureFlagModule.ts#L31)

Configures the module with the specified options.

#### Parameters

| Parameter | Type                                                               | Description                       |
| --------- | ------------------------------------------------------------------ | --------------------------------- |
| `options` | [`IFeatureFlagModuleOptions`](Interface.IFeatureFlagModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.
