---
title: 'Class: ConfigService'
generated: true
editUrl: false
---

# Class: ConfigService

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L10)

## Constructors

### Constructor

```ts
new ConfigService(strategy, statics): ConfigService;
```

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L20)

#### Parameters

| Parameter  | Type                                             |
| ---------- | ------------------------------------------------ |
| `strategy` | [`ConfigStrategyBase`](Class.ConfigStrategyBase) |
| `statics`  | `Record`\<`string`, `string`\>                   |

#### Returns

`ConfigService`

## Methods

### compare()

```ts
compare<T>(key, value): boolean;
```

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L77)

Compares the value of the specified configuration key with the given value.

#### Type Parameters

| Type Parameter                    | Default type | Description                            |
| --------------------------------- | ------------ | -------------------------------------- |
| <a id="type-parameter-t"></a> `T` | `string`     | Expected type of the comparison value. |

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `key`     | `string` | The configuration key to compare. |
| `value`   | `T`      | The value to compare against.     |

#### Returns

`boolean`

True if the resolved value matches; otherwise, false.

---

### get()

```ts
get<T>(key): T;
```

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L41)

Retrieves the parsed value of the specified configuration key.
Automatically parses strings into numbers, booleans, or null if applicable.

#### Type Parameters

| Type Parameter                      | Default type | Description                          |
| ----------------------------------- | ------------ | ------------------------------------ |
| <a id="type-parameter-t-1"></a> `T` | `string`     | Expected type of the returned value. |

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `key`     | `string` | The configuration key to retrieve. |

#### Returns

`T`

The parsed configuration value.

---

### initialize()

```ts
initialize(): void;
```

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L29)

#### Returns

`void`

---

### tryGet()

```ts
tryGet<T>(key, fallback): T;
```

Defined in: [libs/platform-configuration/src/services/ConfigService.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/services/ConfigService.ts#L61)

Attempts to retrieve the value of the specified configuration key.
If the key does not exist, returns the provided fallback value.

#### Type Parameters

| Type Parameter                      | Default type | Description                          |
| ----------------------------------- | ------------ | ------------------------------------ |
| <a id="type-parameter-t-2"></a> `T` | `string`     | Expected type of the returned value. |

#### Parameters

| Parameter  | Type     | Description                                           |
| ---------- | -------- | ----------------------------------------------------- |
| `key`      | `string` | The configuration key to retrieve.                    |
| `fallback` | `T`      | The fallback value to return if the key is not found. |

#### Returns

`T`

The resolved configuration value or the fallback value.
