---
title: 'Class: ConfigRegistry'
generated: true
editUrl: false
---

# Class: ConfigRegistry

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L53)

A static, global registry that collects all configuration keys registered by
platform libraries. This enables a central overview of every environment
variable the application depends on, grouped by source module.

Libraries register their keys during module initialisation via
[ConfigModule.register](Class.ConfigModule#register) or by calling [ConfigRegistry.register](#register)
directly.

## Constructors

### Constructor

```ts
new ConfigRegistry(): ConfigRegistry;
```

#### Returns

`ConfigRegistry`

## Methods

### getAll()

```ts
static getAll(): readonly IConfigRegistryEntry<unknown>[];
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L78)

Returns all registered configuration entries as a flat array.

#### Returns

readonly [`IConfigRegistryEntry`](Interface.IConfigRegistryEntry)\<`unknown`\>[]

---

### getByModule()

```ts
static getByModule(): ReadonlyMap<string, readonly IConfigRegistryEntry<unknown>[]>;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L85)

Returns all registered entries grouped by their source module.

#### Returns

`ReadonlyMap`\<`string`, readonly [`IConfigRegistryEntry`](Interface.IConfigRegistryEntry)\<`unknown`\>[]\>

---

### getModules()

```ts
static getModules(): readonly string[];
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:110](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L110)

Returns all unique module names that have registered keys.

#### Returns

readonly `string`[]

---

### getRequired()

```ts
static getRequired(): readonly IConfigRegistryEntry<unknown>[];
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L103)

Returns all registered entries whose `required` flag is `true`.

#### Returns

readonly [`IConfigRegistryEntry`](Interface.IConfigRegistryEntry)\<`unknown`\>[]

---

### register()

```ts
static register(module, entries): void;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L68)

Registers one or more configuration entries.

#### Parameters

| Parameter | Type                                                                                                   | Description                                          |
| --------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `module`  | `string`                                                                                               | The logical module name (e.g. `'platform-mailing'`). |
| `entries` | readonly `Omit`\<[`IConfigRegistryEntry`](Interface.IConfigRegistryEntry)\<`unknown`\>, `"module"`\>[] | The configuration entries to register.               |

#### Returns

`void`
