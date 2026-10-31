---
title: 'Interface: IIntelligenceUsage'
generated: true
editUrl: false
---

# Interface: IIntelligenceUsage

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L9)

Provider-neutral usage counters.

Null values mean that a provider did not report the dimension. Consumers
must not interpret missing counters as zero usage.

## Extended by

- [`IIntelligenceRealtimeUsage`](Interface.IIntelligenceRealtimeUsage)

## Properties

### cachedInputAudioTokens

```ts
readonly cachedInputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L27)

Cached input tokens attributed to audio.

---

### cachedInputImageTokens

```ts
readonly cachedInputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L25)

Cached input tokens attributed to images.

---

### cachedInputTextTokens

```ts
readonly cachedInputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L23)

Cached input tokens attributed to text.

---

### cachedInputTokens

```ts
readonly cachedInputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L19)

Input tokens read from a provider cache.

---

### cacheWriteInputTokens

```ts
readonly cacheWriteInputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L21)

Input tokens written to a provider cache.

---

### inputAudioTokens

```ts
readonly inputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L33)

Input tokens attributed to audio.

---

### inputImageTokens

```ts
readonly inputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L31)

Input tokens attributed to images.

---

### inputTextTokens

```ts
readonly inputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L29)

Input tokens attributed to text.

---

### inputTokens

```ts
readonly inputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L13)

All uncached and cached input tokens reported for the operation.

---

### outputAudioTokens

```ts
readonly outputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L39)

Output tokens attributed to generated audio.

---

### outputImageTokens

```ts
readonly outputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L37)

Output tokens attributed to generated images.

---

### outputTextTokens

```ts
readonly outputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L35)

Output tokens attributed to text, including reasoning when the provider does so.

---

### outputTokens

```ts
readonly outputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L15)

All output tokens, including any reasoning tokens, reported for the operation.

---

### reasoningTokens

```ts
readonly reasoningTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L41)

Reasoning tokens included in the provider's output total.

---

### totalTokens

```ts
readonly totalTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L17)

Provider-reported total input and output tokens.
