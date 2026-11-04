---
title: 'Class: BlobStoragePreconditionFailedError'
generated: true
editUrl: false
---

# Class: BlobStoragePreconditionFailedError

Defined in: [libs/platform-blob-storage/src/errors/BlobStoragePreconditionFailedError.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStoragePreconditionFailedError.ts#L8)

The selected object no longer meets the caller's conditional deletion guard.

## Extends

- [`BlobStorageError`](Class.BlobStorageError)

## Constructors

### Constructor

```ts
new BlobStoragePreconditionFailedError(
   providerId,
   operation,
   key,
   cause?
): BlobStoragePreconditionFailedError;
```

Defined in: [libs/platform-blob-storage/src/errors/BlobStoragePreconditionFailedError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/errors/BlobStoragePreconditionFailedError.ts#L23)

Initializes a provider-neutral precondition failure.

#### Parameters

| Parameter    | Type      | Description                                                        |
| ------------ | --------- | ------------------------------------------------------------------ |
| `providerId` | `string`  | Active storage provider.                                           |
| `operation`  | `string`  | Guarded operation.                                                 |
| `key`        | `string`  | Selected object key.                                               |
| `cause?`     | `unknown` | Original provider failure, retained without exposing its contents. |

#### Returns

`BlobStoragePreconditionFailedError`

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
