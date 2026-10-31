---
title: 'Abstract Class: ConfigStrategyBase'
generated: true
editUrl: false
---

# Abstract Class: ConfigStrategyBase

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L8)

The `ConfigStrategyBase` class.
Represents the base class for configuration strategies.

## Extended by

- [`EnvironmentConfigStrategy`](Class.EnvironmentConfigStrategy)
- [`FileConfigStrategy`](Class.FileConfigStrategy)

## Constructors

### Constructor

```ts
protected new ConfigStrategyBase(): ConfigStrategyBase;
```

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L17)

Initializes a new instance of the `ConfigStrategyBase` class.

#### Returns

`ConfigStrategyBase`

## Methods

### has()

```ts
abstract has(key): boolean;
```

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L43)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`boolean`

---

### initialize()

```ts
abstract initialize(): void;
```

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L31)

`initialize` - Initializes the configuration.

#### Returns

`void`

---

### resolve()

```ts
abstract resolve<T>(key): T;
```

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L39)

`resolve` - Resolves the configuration.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `string` | The key to resolve. |

#### Returns

`T`

The resolved configuration value.

---

### tryResolve()

```ts
abstract tryResolve<T>(key, fallback): T;
```

Defined in: [libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/abstracts/ConfigStrategyBase.ts#L41)

#### Type Parameters

| Type Parameter                      |
| ----------------------------------- |
| <a id="type-parameter-t-1"></a> `T` |

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `key`      | `string` |
| `fallback` | `T`      |

#### Returns

`T`
