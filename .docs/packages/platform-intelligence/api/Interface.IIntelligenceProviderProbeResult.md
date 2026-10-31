---
title: 'Interface: IIntelligenceProviderProbeResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderProbeResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L13)

Provider-neutral result of a bounded provider availability probe.

## Properties

### capability

```ts
readonly capability: IntelligenceCapability;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L19)

---

### checkedAt

```ts
readonly checkedAt: Date;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L20)

---

### failureCode

```ts
readonly failureCode: string | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L21)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L17)

---

### status

```ts
readonly status: IntelligenceProviderProbeStatus;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderProbeResult.ts#L16)
