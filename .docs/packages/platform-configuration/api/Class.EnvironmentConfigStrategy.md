---
title: 'Class: EnvironmentConfigStrategy'
generated: true
editUrl: false
---

# Class: EnvironmentConfigStrategy

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L15)

The `EnvironmentConfigStrategy` class.

## Extends

- [`ConfigStrategyBase`](Class.ConfigStrategyBase)

## Constructors

### Constructor

```ts
new EnvironmentConfigStrategy(): EnvironmentConfigStrategy;
```

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L24)

#### Returns

`EnvironmentConfigStrategy`

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`constructor`](Class.ConfigStrategyBase#constructor)

## Methods

### has()

```ts
has(key): boolean;
```

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L58)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`boolean`

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`has`](Class.ConfigStrategyBase#has)

---

### initialize()

```ts
initialize(): void;
```

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L33)

`initialize` - Initializes the configuration.

#### Returns

`void`

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`initialize`](Class.ConfigStrategyBase#initialize)

---

### resolve()

```ts
resolve<T>(key): T;
```

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L37)

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

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`resolve`](Class.ConfigStrategyBase#resolve)

---

### tryResolve()

```ts
tryResolve<T>(key, fallback): T;
```

Defined in: [libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/EnvironmentConfigStrategy.ts#L47)

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

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`tryResolve`](Class.ConfigStrategyBase#tryresolve)
