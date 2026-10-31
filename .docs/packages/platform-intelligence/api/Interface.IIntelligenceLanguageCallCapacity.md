---
title: 'Interface: IIntelligenceLanguageCallCapacity'
generated: true
editUrl: false
---

# Interface: IIntelligenceLanguageCallCapacity

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L12)

Immutable standardized input facts for one prepared language call.

The serialized byte count covers the exact initial prompt, tool contracts,
tool choice, response format, and provider options observed at the AI SDK's
final provider boundary. Preparation captures it with a local synthetic
response and never contacts the provider. Consumers can combine it with
their bounded multi-step policy before executing the prepared call.

## Properties

### maximumToolNameUtf8Bytes

```ts
readonly maximumToolNameUtf8Bytes: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L20)

Largest selected tool name measured as UTF-8 bytes.

---

### messageCount

```ts
readonly messageCount: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L16)

Number of standardized messages represented by the captured prompt.

---

### opaqueToolCount

```ts
readonly opaqueToolCount: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L24)

Number of selected tools whose complete contract is opaque to Archipel.

---

### serializedInputUtf8Bytes

```ts
readonly serializedInputUtf8Bytes: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L14)

UTF-8 bytes in the captured standardized initial provider input.

---

### textOnly

```ts
readonly textOnly: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L22)

Whether the standardized input contains only measurable text/JSON content.

---

### toolCount

```ts
readonly toolCount: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCallCapacity.ts#L18)

Number of standardized tool contracts.
