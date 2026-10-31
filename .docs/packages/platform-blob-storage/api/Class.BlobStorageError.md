---
title: 'Class: BlobStorageError'
generated: true
editUrl: false
---

# Class: BlobStorageError

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L6)

Describes a provider-independent blob storage operation failure.

## Extends

- `Error`

## Extended by

- [`BlobObjectNotFoundError`](Class.BlobObjectNotFoundError)
- [`BlobStorageDisabledError`](Class.BlobStorageDisabledError)
- [`BlobStorageUnavailableError`](Class.BlobStorageUnavailableError)
- [`BlobStorageUnsupportedOperationError`](Class.BlobStorageUnsupportedOperationError)

## Constructors

### Constructor

```ts
new BlobStorageError(
   code,
   message,
   providerId,
   operation,
   key,
   cause?
): BlobStorageError;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L29)

Initializes a new instance of the BlobStorageError class.

#### Parameters

| Parameter    | Type      | Description                                |
| ------------ | --------- | ------------------------------------------ |
| `code`       | `string`  | Stable machine-readable error code.        |
| `message`    | `string`  | Safe human-readable error message.         |
| `providerId` | `string`  | Identifier of the active storage provider. |
| `operation`  | `string`  | Storage operation that failed.             |
| `key`        | `string`  | Object key involved in the failure.        |
| `cause?`     | `unknown` | Original provider error.                   |

#### Returns

`BlobStorageError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L9)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L10)

---

### operation

```ts
readonly operation: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L11)

---

### providerId

```ts
readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStorageError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStorageError.ts#L12)
