---
title: 'Interface: IIntelligencePromptExecutionResult\<TOutput, TMetadata\>'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptExecutionResult\<TOutput, TMetadata\>

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L15)

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

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L37)

---

### finishReason

```ts
readonly finishReason: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L30)

---

### metadata

```ts
readonly metadata: TMetadata | undefined;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L38)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L22)

---

### output

```ts
readonly output: TOutput;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L18)

---

### promptName

```ts
readonly promptName: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L19)

---

### promptVersion

```ts
readonly promptVersion: number;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L20)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L21)

---

### reasoningText?

```ts
readonly reasoningText?: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L29)

---

### requestedPolicy

```ts
readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L36)

---

### sources?

```ts
readonly sources?: readonly {
  id?: string;
  title?: string;
  type: string;
  url?: string;
}[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L35)

Sources the provider cited for the generated output, for example web results of a provider-owned search.
Empty when the provider reported none.

---

### stepUsage?

```ts
readonly stepUsage?: readonly (IIntelligenceUsage | null)[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L28)

Usage of each provider call in execution order; `usage` is their sum. See
`IIntelligenceLanguageCompletion.stepUsage`.

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptExecutionResult.ts#L23)
