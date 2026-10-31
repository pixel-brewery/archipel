---
title: 'Interface: IIntelligenceImageGenerationResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceImageGenerationResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L13)

Provider-neutral image generation result.

## Properties

### images

```ts
readonly images: readonly IIntelligenceGeneratedFile[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L16)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L17)

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L20)

---

### warnings

```ts
readonly warnings: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationResult.ts#L19)
