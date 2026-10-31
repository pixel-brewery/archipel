---
title: 'Interface: IIntelligenceProviderCallStartEvent'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderCallStartEvent

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L9)

Exact standardized input facts observed immediately before a provider call.

Unlike telemetry callbacks, the owning hook is awaited on the provider call
path and a thrown error prevents the provider from being contacted.

## Properties

### inputUtf8Bytes

```ts
readonly inputUtf8Bytes: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L17)

UTF-8 byte size of the standardized provider context for this attempt.

---

### maxOutputTokens

```ts
readonly maxOutputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L19)

Configured output-token limit, or `null` when the call has no explicit limit.

---

### modelId

```ts
readonly modelId: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L13)

Native model identifier reported by the standardized model.

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L11)

Native provider identifier reported by the standardized model.

---

### providerCallNumber

```ts
readonly providerCallNumber: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L15)

One-based attempt number within this language operation.

---

### providerToolCount

```ts
readonly providerToolCount: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L23)

Number of opaque provider-owned tools in the standardized request.

---

### textOnly

```ts
readonly textOnly: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderCallStartEvent.ts#L21)

Whether the standardized context is text/JSON only and contains no provider-owned tool.
