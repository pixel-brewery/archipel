---
title: 'Class: ResourceManager'
generated: true
editUrl: false
---

# Class: ResourceManager

Defined in: [libs/platform-resources/src/ResourceManager.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L74)

Central manager for loading resources from various sources.
Supports multiple strategies (file, blob, embedded) with caching.

## Implements

- `IResourceManager`

## Constructors

### Constructor

```ts
new ResourceManager(config): ResourceManager;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L92)

Constructs a new instance of the `ResourceManager` class.

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `config`  | [`IResourceManagerConfig`](Interface.IResourceManagerConfig) |

#### Returns

`ResourceManager`

## Methods

### exists()

```ts
exists(key): boolean;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:236](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L236)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`boolean`

#### Implementation of

`IResourceManager.exists`

---

### existsAsync()

```ts
existsAsync(key): Promise<boolean>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:245](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L245)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`IResourceManager.existsAsync`

---

### invalidate()

```ts
invalidate(key): void;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:254](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L254)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`void`

#### Implementation of

`IResourceManager.invalidate`

---

### invalidateAsync()

```ts
invalidateAsync(key): Promise<void>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:261](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L261)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IResourceManager.invalidateAsync`

---

### load()

```ts
load(key): IResourceResult;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L105)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

[`IResourceResult`](Interface.IResourceResult)

#### Implementation of

`IResourceManager.load`

---

### loadAsBuffer()

```ts
loadAsBuffer(key): Buffer;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:210](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L210)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Buffer`

#### Implementation of

`IResourceManager.loadAsBuffer`

---

### loadAsBufferAsync()

```ts
loadAsBufferAsync(key): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:223](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L223)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

#### Implementation of

`IResourceManager.loadAsBufferAsync`

---

### loadAsString()

```ts
loadAsString(key, encoding?): string;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:178](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L178)

#### Parameters

| Parameter   | Type             | Default value |
| ----------- | ---------------- | ------------- |
| `key`       | `string`         | `undefined`   |
| `encoding?` | `BufferEncoding` | `'utf-8'`     |

#### Returns

`string`

#### Implementation of

`IResourceManager.loadAsString`

---

### loadAsStringAsync()

```ts
loadAsStringAsync(key, encoding?): Promise<string>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:194](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L194)

#### Parameters

| Parameter   | Type             | Default value |
| ----------- | ---------------- | ------------- |
| `key`       | `string`         | `undefined`   |
| `encoding?` | `BufferEncoding` | `'utf-8'`     |

#### Returns

`Promise`\<`string`\>

#### Implementation of

`IResourceManager.loadAsStringAsync`

---

### loadAsync()

```ts
loadAsync(key): Promise<IResourceResult>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L136)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<[`IResourceResult`](Interface.IResourceResult)\>

#### Implementation of

`IResourceManager.loadAsync`

---

### tryLoad()

```ts
tryLoad(key): IResourceResult | undefined;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L113)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

[`IResourceResult`](Interface.IResourceResult) \| `undefined`

#### Implementation of

`IResourceManager.tryLoad`

---

### tryLoadAsBuffer()

```ts
tryLoadAsBuffer(key): Buffer<ArrayBufferLike> | undefined;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:218](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L218)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Buffer`\<`ArrayBufferLike`\> \| `undefined`

#### Implementation of

`IResourceManager.tryLoadAsBuffer`

---

### tryLoadAsBufferAsync()

```ts
tryLoadAsBufferAsync(key): Promise<Buffer<ArrayBufferLike> | undefined>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:231](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L231)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\> \| `undefined`\>

#### Implementation of

`IResourceManager.tryLoadAsBufferAsync`

---

### tryLoadAsString()

```ts
tryLoadAsString(key, encoding?): string | undefined;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:186](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L186)

#### Parameters

| Parameter   | Type             | Default value |
| ----------- | ---------------- | ------------- |
| `key`       | `string`         | `undefined`   |
| `encoding?` | `BufferEncoding` | `'utf-8'`     |

#### Returns

`string` \| `undefined`

#### Implementation of

`IResourceManager.tryLoadAsString`

---

### tryLoadAsStringAsync()

```ts
tryLoadAsStringAsync(key, encoding?): Promise<string | undefined>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:202](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L202)

#### Parameters

| Parameter   | Type             | Default value |
| ----------- | ---------------- | ------------- |
| `key`       | `string`         | `undefined`   |
| `encoding?` | `BufferEncoding` | `'utf-8'`     |

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Implementation of

`IResourceManager.tryLoadAsStringAsync`

---

### tryLoadAsync()

```ts
tryLoadAsync(key): Promise<IResourceResult | undefined>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L144)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`Promise`\<[`IResourceResult`](Interface.IResourceResult) \| `undefined`\>

#### Implementation of

`IResourceManager.tryLoadAsync`

---

### whatDoIHave()

```ts
whatDoIHave(): void;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:268](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L268)

#### Returns

`void`

#### Implementation of

`IResourceManager.whatDoIHave`
