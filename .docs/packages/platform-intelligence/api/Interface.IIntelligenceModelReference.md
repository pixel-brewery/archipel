---
title: 'Interface: IIntelligenceModelReference'
generated: true
editUrl: false
---

# Interface: IIntelligenceModelReference

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts#L6)

Selects a provider-owned model without exposing a provider SDK model object.

## Properties

### model?

```ts
readonly model?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts#L13)

Provider model identifier.

---

### provider?

```ts
readonly provider?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelReference.ts#L10)

Provider registered with [IntelligenceModule](Class.IntelligenceModule).
