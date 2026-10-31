---
title: 'Class: FileConfigStrategy'
generated: true
editUrl: false
---

# Class: FileConfigStrategy

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L17)

The `FileConfigStrategy` class.

## Extends

- [`ConfigStrategyBase`](Class.ConfigStrategyBase)

## Constructors

### Constructor

```ts
new FileConfigStrategy(envFile): FileConfigStrategy;
```

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L27)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `envFile` | `string` |

#### Returns

`FileConfigStrategy`

#### Overrides

[`ConfigStrategyBase`](Class.ConfigStrategyBase).[`constructor`](Class.ConfigStrategyBase#constructor)

## Methods

### has()

```ts
has(key): boolean;
```

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L64)

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

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L37)

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

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L43)

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

Defined in: [libs/platform-configuration/src/strategies/FileConfigStrategy.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/strategies/FileConfigStrategy.ts#L53)

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
