---
title: 'Class: BlobStorageUnsupportedOperationError'
generated: true
editUrl: false
---

# Class: BlobStorageUnsupportedOperationError

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageUnsupportedOperationError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageUnsupportedOperationError.ts#L12)

Indicates that the selected provider does not implement an operation.

## Extends

- [`BlobStorageError`](Class.BlobStorageError)

## Constructors

### Constructor

```ts
new BlobStorageUnsupportedOperationError(
   providerId,
   operation,
   key
): BlobStorageUnsupportedOperationError;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageUnsupportedOperationError.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageUnsupportedOperationError.ts#L26)

Initializes a new instance of the BlobStorageUnsupportedOperationError class.

#### Parameters

| Parameter    | Type     | Description                                |
| ------------ | -------- | ------------------------------------------ |
| `providerId` | `string` | Identifier of the active storage provider. |
| `operation`  | `string` | Unsupported storage operation.             |
| `key`        | `string` | Object key involved in the operation.      |

#### Returns

`BlobStorageUnsupportedOperationError`

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
