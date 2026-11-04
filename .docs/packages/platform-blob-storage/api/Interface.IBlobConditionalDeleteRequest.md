---
title: 'Interface: IBlobConditionalDeleteRequest'
generated: true
editUrl: false
---

# Interface: IBlobConditionalDeleteRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L10)

Deletes only the object that still has the exact observed strong ETag.

At most one version or snapshot selector may be supplied. Omitting both selects
the base object. Empty selectors, wildcard/weak/list ETags and alternate buckets
are rejected rather than broadening the deletion.

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L20)

---

### bucket?

```ts
readonly bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L14)

---

### ifMatch

```ts
readonly ifMatch: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L17)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L11)

---

### resourceId?

```ts
readonly resourceId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L13)

Expected actual resource identity; when supplied, the provider must reject a mismatch before deletion.

---

### snapshotId?

```ts
readonly snapshotId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L16)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L19)

Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries.

---

### versionId?

```ts
readonly versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L15)
