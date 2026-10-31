---
title: 'Class: IntelligenceModule'
generated: true
editUrl: false
---

# Class: IntelligenceModule

Defined in: [libs/platform-intelligence/src/IntelligenceModule.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceModule.ts#L87)

Core module exposing the shared intelligence infrastructure.

## Constructors

### Constructor

```ts
new IntelligenceModule(): IntelligenceModule;
```

#### Returns

`IntelligenceModule`

## Methods

### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [libs/platform-intelligence/src/IntelligenceModule.ts:110](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceModule.ts#L110)

Registers the intelligence module and optional class-based tools.

#### Parameters

| Parameter  | Type                                                                 | Description                        |
| ---------- | -------------------------------------------------------------------- | ---------------------------------- |
| `options?` | [`IIntelligenceModuleOptions`](Interface.IIntelligenceModuleOptions) | Intelligence module configuration. |

#### Returns

`DynamicModule`

A configured dynamic module definition.
