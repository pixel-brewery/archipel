---
title: 'Interface: IIntelligenceEmbeddingBatchResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceEmbeddingBatchResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L12)

Provider-neutral batch embedding result.

## Properties

### embeddings

```ts
readonly embeddings: readonly (readonly number[])[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L16)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L17)

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L20)

---

### values

```ts
readonly values: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L15)

---

### warnings

```ts
readonly warnings: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchResult.ts#L19)
