---
title: 'Interface: IBlobUploadResult'
generated: true
editUrl: false
---

# Interface: IBlobUploadResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L52)

## Properties

### metadata

```ts
metadata: IBlobObjectMetadata;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L53)

---

### metadataPersisted?

```ts
metadataPersisted?: boolean;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L65)

Whether the registered persistence abstract base recorded this object.

The object is already stored when the abstract base runs, so a failing abstract base must not fail the upload.
Callers that keep their own accounting use this flag to detect the resulting drift instead of
having to choose between losing a successful upload and swallowing the error silently.

`undefined` when no persistence abstract base is registered.

---

### rawResponse?

```ts
rawResponse?: unknown;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L54)
