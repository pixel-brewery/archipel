---
title: 'Interface: IIntelligencePromptPolicyRequest'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptPolicyRequest

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L14)

Policy resolution request for one prompt invocation.

## Properties

### context

```ts
readonly context: IIntelligencePromptExecutionContext;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L21)

---

### mode

```ts
readonly mode: IntelligencePromptMode;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L19)

---

### promptName

```ts
readonly promptName: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L17)

---

### promptVersion

```ts
readonly promptVersion: number;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L18)

---

### requestedPolicy

```ts
readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptPolicyRequest.ts#L20)
