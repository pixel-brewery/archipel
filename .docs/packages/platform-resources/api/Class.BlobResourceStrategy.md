---
title: 'Class: BlobResourceStrategy'
generated: true
editUrl: false
---

# Class: BlobResourceStrategy

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L47)

Strategy for loading resources from blob storage.

## Implements

- [`IResourceStrategy`](Interface.IResourceStrategy)

## Constructors

### Constructor

```ts
new BlobResourceStrategy(blobService, config?): BlobResourceStrategy;
```

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L63)

Constructs a new instance of the `BlobResourceStrategy` class.

#### Parameters

| Parameter     | Type                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| `blobService` | [`IBlobServiceAdapter`](Interface.IBlobServiceAdapter)                 |
| `config?`     | [`IBlobResourceStrategyConfig`](Interface.IBlobResourceStrategyConfig) |

#### Returns

`BlobResourceStrategy`

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L72)

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

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L136)

Checks if a resource exists without loading it.
Note: Blob storage is inherently async, so this delegates to existsAsync internally.

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The resource key |

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

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:147](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L147)

Checks if a resource exists without loading it (asynchronous).

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The resource key |

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

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L88)

Loads a resource by its key.
Note: Blob storage is inherently async, so this delegates to loadAsync internally.

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The resource key |

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

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:99](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L99)

Loads a resource by its key (asynchronous).

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The resource key |

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

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:163](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L163)

List all files and folders in the base paths for debugging purposes.

#### Returns

`void`

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`whatDoIHave`](Interface.IResourceStrategy#whatdoihave)
