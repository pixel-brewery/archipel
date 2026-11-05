---
title: 'Interface: IBlobExecutionOptions'
generated: true
editUrl: false
---

# Interface: IBlobExecutionOptions

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts#L9)

Requests a provider-enforced deadline and optional caller cancellation.

A strategy must explicitly support these options; they may never be silently
ignored. Cancellation cannot undo a mutation already accepted by the provider.

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts#L12)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobExecutionOptions.ts#L11)

Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries and body consumption.
