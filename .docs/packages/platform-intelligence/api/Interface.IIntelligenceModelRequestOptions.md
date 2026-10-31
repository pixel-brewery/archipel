---
title: 'Interface: IIntelligenceModelRequestOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceModelRequestOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L20)

Shared provider/model controls for intelligence operations.

## Remarks

Provider APIs do not expose one portable idempotency-key contract across all
capabilities. A provider operation can therefore be billed or materialize an
asset more than once after ambiguous transport failure. Consumers must
deduplicate the owning business operation and persist usage or generated
assets idempotently.

## Extended by

- [`IIntelligenceFileUploadOptions`](Interface.IIntelligenceFileUploadOptions)
- [`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions)
- [`IIntelligenceSkillUploadOptions`](Interface.IIntelligenceSkillUploadOptions)

## Properties

### model?

```ts
readonly model?: IIntelligenceModelReference;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L24)

Optional provider/model override.

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L33)

Optional provider-specific settings.

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L27)

Correlation identifier included in structured Archipel logs.

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.
