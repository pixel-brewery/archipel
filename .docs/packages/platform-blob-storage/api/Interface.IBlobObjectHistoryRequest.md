---
title: 'Interface: IBlobObjectHistoryRequest'
generated: true
editUrl: false
---

# Interface: IBlobObjectHistoryRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L6)

Reads one bounded page of provider history for an exact canonical object key.

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L15)

---

### bucket?

```ts
readonly bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L9)

The configured bucket. An unsupported alternate bucket is rejected.

---

### continuationToken?

```ts
readonly continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L10)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L7)

---

### maxKeys?

```ts
readonly maxKeys?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L12)

Integer from 1 to 5,000; defaults to 1,000.

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryRequest.ts#L14)

Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries.
