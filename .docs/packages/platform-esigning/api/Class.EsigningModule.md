---
title: 'Class: EsigningModule'
generated: true
editUrl: false
---

# Class: EsigningModule

Defined in: [libs/platform-esigning/src/EsigningModule.ts:98](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L98)

NestJS module providing generic e-signing infrastructure.
Exposes a configurable signing client and optional persistence tracking.
The specific e-signing provider is selected via the options.

## Constructors

### Constructor

```ts
new EsigningModule(): EsigningModule;
```

#### Returns

`EsigningModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L108)

Configures the module with the specified options.

#### Parameters

| Parameter | Type                                                         | Description                       |
| --------- | ------------------------------------------------------------ | --------------------------------- |
| `options` | [`IEsigningModuleOptions`](Interface.IEsigningModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.

---

### registerAsync()

```ts
static registerAsync(options): DynamicModule;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:143](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L143)

Configures the module asynchronously with factory-based options.
Use this when the provider type or configuration entries need to be resolved
at runtime (e.g., from environment or a config service).

#### Parameters

| Parameter | Type                                                                   | Description                             |
| --------- | ---------------------------------------------------------------------- | --------------------------------------- |
| `options` | [`IEsigningModuleAsyncOptions`](Interface.IEsigningModuleAsyncOptions) | The async module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.
