---
title: 'Class: FileResourceStrategy'
generated: true
editUrl: false
---

# Class: FileResourceStrategy

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L45)

Strategy for loading resources from the local file system.

## Implements

- [`IResourceStrategy`](Interface.IResourceStrategy)

## Constructors

### Constructor

```ts
new FileResourceStrategy(config): FileResourceStrategy;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L55)

#### Parameters

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `config`  | [`IFileResourceStrategyConfig`](Interface.IFileResourceStrategyConfig) |

#### Returns

`FileResourceStrategy`

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L67)

The unique name of this strategy.

##### Returns

`string`

The unique name of this strategy.

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`name`](Interface.IResourceStrategy#name)

## Methods

### exists()

```ts
exists(key): boolean;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L106)

Checks if a resource exists without loading it.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`boolean`

True if the resource exists

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`exists`](Interface.IResourceStrategy#exists)

---

### existsAsync()

```ts
existsAsync(key): Promise<boolean>;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:110](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L110)

Checks if a resource exists without loading it (asynchronous).

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`Promise`\<`boolean`\>

Promise resolving to true if the resource exists

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`existsAsync`](Interface.IResourceStrategy#existsasync)

---

### load()

```ts
load(key): IResourceResult | undefined;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L75)

Loads a resource by its key.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

[`IResourceResult`](Interface.IResourceResult) \| `undefined`

The resource result or undefined if not found

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`load`](Interface.IResourceStrategy#load)

---

### loadAsync()

```ts
loadAsync(key): Promise<IResourceResult | undefined>;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:102](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L102)

Loads a resource by its key (asynchronous).

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`Promise`\<[`IResourceResult`](Interface.IResourceResult) \| `undefined`\>

Promise resolving to the resource result or undefined if not found

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`loadAsync`](Interface.IResourceStrategy#loadasync)

---

### whatDoIHave()

```ts
whatDoIHave(): void;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L114)

List all files and folders in the base paths for debugging purposes.

#### Returns

`void`

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`whatDoIHave`](Interface.IResourceStrategy#whatdoihave)
