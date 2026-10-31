---
title: 'Interface: IIntelligencePrompt'
generated: true
editUrl: false
---

# Interface: IIntelligencePrompt

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts#L12)

Provider-neutral language-model prompt.

## Properties

### instructions?

```ts
readonly instructions?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts#L15)

---

### messages?

```ts
readonly messages?: readonly IIntelligenceModelMessage[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts#L18)

---

### prompt?

```ts
readonly prompt?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts#L17)

---

### system?

```ts
readonly system?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePrompt.ts#L16)
