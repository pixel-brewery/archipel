---
title: 'Class: EmbeddedResourceStrategy'
generated: true
editUrl: false
---

# Class: EmbeddedResourceStrategy

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L14)

Strategy for loading embedded resources from memory.

## Implements

- [`IResourceStrategy`](Interface.IResourceStrategy)

## Constructors

### Constructor

```ts
new EmbeddedResourceStrategy(resources?): EmbeddedResourceStrategy;
```

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L29)

Constructs a new instance of the `EmbeddedResourceStrategy` class.

#### Parameters

| Parameter    | Type                           |
| ------------ | ------------------------------ |
| `resources?` | `Record`\<`string`, `string`\> |

#### Returns

`EmbeddedResourceStrategy`

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L37)

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

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L93)

Checks if a resource exists without loading it.

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

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:104](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L104)

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

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L52)

Loads a resource by its key.

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

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L82)

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

### register()

```ts
register(key, content): void;
```

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L115)

Registers a new embedded resource.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `key`     | `string` | The resource key     |
| `content` | `string` | The resource content |

#### Returns

`void`

---

### whatDoIHave()

```ts
whatDoIHave(): void;
```

Defined in: [libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts:124](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/EmbeddedResourceStrategy.ts#L124)

List all files and folders in the base paths for debugging purposes.

#### Returns

`void`

#### Implementation of

[`IResourceStrategy`](Interface.IResourceStrategy).[`whatDoIHave`](Interface.IResourceStrategy#whatdoihave)
