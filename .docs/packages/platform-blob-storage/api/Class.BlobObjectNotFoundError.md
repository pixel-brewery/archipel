---
title: 'Class: BlobObjectNotFoundError'
generated: true
editUrl: false
---

# Class: BlobObjectNotFoundError

Defined in: [libs/platform-blob-storage/src/errors/BlobObjectNotFoundError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobObjectNotFoundError.ts#L12)

Indicates that the requested blob object does not exist.

## Extends

- [`BlobStorageError`](Class.BlobStorageError)

## Constructors

### Constructor

```ts
new BlobObjectNotFoundError(
   providerId,
   operation,
   key,
   cause?
): BlobObjectNotFoundError;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobObjectNotFoundError.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobObjectNotFoundError.ts#L27)

Initializes a new instance of the BlobObjectNotFoundError class.

#### Parameters

| Parameter    | Type      | Description                                           |
| ------------ | --------- | ----------------------------------------------------- |
| `providerId` | `string`  | Identifier of the active storage provider.            |
| `operation`  | `string`  | Storage operation that discovered the missing object. |
| `key`        | `string`  | Missing object key.                                   |
| `cause?`     | `unknown` | Original provider error.                              |

#### Returns

`BlobObjectNotFoundError`

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
