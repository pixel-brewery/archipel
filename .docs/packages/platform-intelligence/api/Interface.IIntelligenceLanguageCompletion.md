---
title: 'Interface: IIntelligenceLanguageCompletion\<TOutput\>'
generated: true
editUrl: false
---

# Interface: IIntelligenceLanguageCompletion\<TOutput\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L14)

Normalized language generation result.

## Type Parameters

| Type Parameter                                | Default type |
| --------------------------------------------- | ------------ |
| <a id="type-parameter-toutput"></a> `TOutput` | `string`     |

## Properties

### files

```ts
readonly files: readonly IIntelligenceGeneratedFile[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L29)

---

### finishReason

```ts
readonly finishReason: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L21)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L20)

---

### output

```ts
readonly output: TOutput;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L19)

---

### reasoningText?

```ts
readonly reasoningText?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L22)

---

### sources

```ts
readonly sources: readonly {
  id?: string;
  title?: string;
  type: string;
  url?: string;
}[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L23)

---

### stepUsage?

```ts
readonly stepUsage?: readonly (IIntelligenceUsage | null)[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L41)

Usage of each provider call in execution order; `usage` is their sum.

A tool loop calls the provider once per step. A provider that prices every call on its own, for example with a
surcharge above an input-token threshold, must be priced per entry rather than on the summed `usage`. Absent when
the underlying SDK result carries no step details.

---

### text

```ts
readonly text: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L17)

---

### toolCalls

```ts
readonly toolCalls: readonly IIntelligenceToolCall[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L30)

---

### toolResults

```ts
readonly toolResults: readonly unknown[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L31)

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L33)

---

### warnings

```ts
readonly warnings: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageCompletion.ts#L32)
