---
title: 'Interface: IIntelligencePromptExecutionResult\<TOutput, TMetadata\>'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptExecutionResult\<TOutput, TMetadata\>

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L14)

Normalized result of an intelligence prompt execution.

## Type Parameters

| Type Parameter                                    | Default type |
| ------------------------------------------------- | ------------ |
| <a id="type-parameter-toutput"></a> `TOutput`     | -            |
| <a id="type-parameter-tmetadata"></a> `TMetadata` | `undefined`  |

## Properties

### effectivePolicy

```ts
readonly effectivePolicy: IIntelligencePromptEffectivePolicy;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L31)

---

### finishReason

```ts
readonly finishReason: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L29)

---

### metadata

```ts
readonly metadata: TMetadata | undefined;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L32)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L21)

---

### output

```ts
readonly output: TOutput;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L17)

---

### promptName

```ts
readonly promptName: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L18)

---

### promptVersion

```ts
readonly promptVersion: number;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L19)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L20)

---

### reasoningText?

```ts
readonly reasoningText?: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L28)

---

### requestedPolicy

```ts
readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L30)

---

### stepUsage?

```ts
readonly stepUsage?: readonly (IIntelligenceUsage | null)[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L27)

Usage of each provider call in execution order; `usage` is their sum. See
`IIntelligenceLanguageCompletion.stepUsage`.

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L22)
