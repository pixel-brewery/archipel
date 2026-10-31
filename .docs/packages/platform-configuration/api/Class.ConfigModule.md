---
title: 'Class: ConfigModule'
generated: true
editUrl: false
---

# Class: ConfigModule

Defined in: [libs/platform-configuration/src/ConfigModule.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L27)

The `ConfigModule` class.

## Constructors

### Constructor

```ts
new ConfigModule(): ConfigModule;
```

#### Returns

`ConfigModule`

## Methods

### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [libs/platform-configuration/src/ConfigModule.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L54)

Bootstraps the global configuration service. Call this once in the
application's root module.

#### Parameters

| Parameter | Type                                                                  | Description                                     |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| `options` | `Partial`\<[`IConfigModuleOptions`](Interface.IConfigModuleOptions)\> | Strategy factory and optional static overrides. |

#### Returns

`DynamicModule`

A global `DynamicModule` providing `ConfigService`.

---

### register()

```ts
static register(module, entries): DynamicModule;
```

Defined in: [libs/platform-configuration/src/ConfigModule.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L39)

Registers environment variable keys from a library module into the
central [ConfigRegistry](Class.ConfigRegistry). Call this in each library's module
to declare the configuration it depends upon.

#### Parameters

| Parameter | Type                                                                                                   | Description                                                 |
| --------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `module`  | `string`                                                                                               | The logical module name (e.g. `'platform-authentication'`). |
| `entries` | readonly `Omit`\<[`IConfigRegistryEntry`](Interface.IConfigRegistryEntry)\<`unknown`\>, `"module"`\>[] | The configuration entries the module depends on.            |

#### Returns

`DynamicModule`

A `DynamicModule` that can be added to the module's `imports` array.
