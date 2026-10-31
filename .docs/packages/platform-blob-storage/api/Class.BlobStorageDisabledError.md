---
title: 'Class: BlobStorageDisabledError'
generated: true
editUrl: false
---

# Class: BlobStorageDisabledError

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageDisabledError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageDisabledError.ts#L12)

Indicates that a blob operation was attempted while storage is disabled.

## Extends

- [`BlobStorageError`](Class.BlobStorageError)

## Constructors

### Constructor

```ts
new BlobStorageDisabledError(operation, key): BlobStorageDisabledError;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageDisabledError.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageDisabledError.ts#L25)

Initializes a new instance of the BlobStorageDisabledError class.

#### Parameters

| Parameter   | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| `operation` | `string` | Storage operation that was attempted. |
| `key`       | `string` | Object key involved in the operation. |

#### Returns

`BlobStorageDisabledError`

#### Overrides

[`BlobStorageError`](Class.BlobStorageError).[`constructor`](Class.BlobStorageError#constructor)

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L9)

#### Inherited from

[`BlobStorageError`](Class.BlobStorageError).[`code`](Class.BlobStorageError#code)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L10)

#### Inherited from

[`BlobStorageError`](Class.BlobStorageError).[`key`](Class.BlobStorageError#key)

---

### operation

```ts
readonly operation: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L11)

#### Inherited from

[`BlobStorageError`](Class.BlobStorageError).[`operation`](Class.BlobStorageError#operation)

---

### providerId

```ts
readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L12)

#### Inherited from

[`BlobStorageError`](Class.BlobStorageError).[`providerId`](Class.BlobStorageError#providerid)
