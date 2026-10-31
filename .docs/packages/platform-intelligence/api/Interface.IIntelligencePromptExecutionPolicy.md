---
title: 'Interface: IIntelligencePromptExecutionPolicy'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptExecutionPolicy

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L17)

Native settings and provider-neutral requirements declared by an intelligence prompt.

## Properties

### latency?

```ts
readonly latency?: IntelligencePromptLatency;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L23)

---

### model?

```ts
readonly model?: IIntelligencePromptModelRequirement;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L24)

---

### options?

```ts
readonly options?: IIntelligenceLanguageGenerationOptions;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L20)

---

### quality?

```ts
readonly quality?: IntelligencePromptQuality;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L21)

---

### reasoning?

```ts
readonly reasoning?: IntelligencePromptReasoning;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L22)

---

### requiredCapabilities?

```ts
readonly requiredCapabilities?: readonly IntelligencePromptCapability[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionPolicy.ts#L25)
