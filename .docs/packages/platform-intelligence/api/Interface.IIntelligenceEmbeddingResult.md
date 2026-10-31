---
title: 'Interface: IIntelligenceEmbeddingResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceEmbeddingResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L12)

Provider-neutral embedding result.

## Properties

### embedding

```ts
readonly embedding: readonly number[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L16)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L17)

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L20)

---

### value

```ts
readonly value: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L15)

---

### warnings

```ts
readonly warnings: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingResult.ts#L19)
