---
title: 'Interface: IIntelligenceRealtimeUsage'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeUsage

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeUsage.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeUsage.ts#L15)

Normalized token usage reported by a realtime provider.

Null values mean the provider did not expose that dimension. Applications
can therefore distinguish missing data from an actual zero-token count.

## Extends

- [`IIntelligenceUsage`](Interface.IIntelligenceUsage)

## Properties

### cachedInputAudioTokens

```ts
readonly cachedInputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L27)

Cached input tokens attributed to audio.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`cachedInputAudioTokens`](Interface.IIntelligenceUsage#cachedinputaudiotokens)

---

### cachedInputImageTokens

```ts
readonly cachedInputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L25)

Cached input tokens attributed to images.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`cachedInputImageTokens`](Interface.IIntelligenceUsage#cachedinputimagetokens)

---

### cachedInputTextTokens

```ts
readonly cachedInputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L23)

Cached input tokens attributed to text.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`cachedInputTextTokens`](Interface.IIntelligenceUsage#cachedinputtexttokens)

---

### cachedInputTokens

```ts
readonly cachedInputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L19)

Input tokens read from a provider cache.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`cachedInputTokens`](Interface.IIntelligenceUsage#cachedinputtokens)

---

### cacheWriteInputTokens

```ts
readonly cacheWriteInputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L21)

Input tokens written to a provider cache.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`cacheWriteInputTokens`](Interface.IIntelligenceUsage#cachewriteinputtokens)

---

### inputAudioTokens

```ts
readonly inputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L33)

Input tokens attributed to audio.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`inputAudioTokens`](Interface.IIntelligenceUsage#inputaudiotokens)

---

### inputImageTokens

```ts
readonly inputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L31)

Input tokens attributed to images.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`inputImageTokens`](Interface.IIntelligenceUsage#inputimagetokens)

---

### inputTextTokens

```ts
readonly inputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L29)

Input tokens attributed to text.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`inputTextTokens`](Interface.IIntelligenceUsage#inputtexttokens)

---

### inputTokens

```ts
readonly inputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L13)

All uncached and cached input tokens reported for the operation.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`inputTokens`](Interface.IIntelligenceUsage#inputtokens)

---

### outputAudioTokens

```ts
readonly outputAudioTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L39)

Output tokens attributed to generated audio.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`outputAudioTokens`](Interface.IIntelligenceUsage#outputaudiotokens)

---

### outputImageTokens

```ts
readonly outputImageTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L37)

Output tokens attributed to generated images.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`outputImageTokens`](Interface.IIntelligenceUsage#outputimagetokens)

---

### outputTextTokens

```ts
readonly outputTextTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L35)

Output tokens attributed to text, including reasoning when the provider does so.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`outputTextTokens`](Interface.IIntelligenceUsage#outputtexttokens)

---

### outputTokens

```ts
readonly outputTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L15)

All output tokens, including any reasoning tokens, reported for the operation.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`outputTokens`](Interface.IIntelligenceUsage#outputtokens)

---

### rawUsage

```ts
readonly rawUsage: unknown;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeUsage.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeUsage.ts#L18)

---

### reasoningTokens

```ts
readonly reasoningTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L41)

Reasoning tokens included in the provider's output total.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`reasoningTokens`](Interface.IIntelligenceUsage#reasoningtokens)

---

### totalTokens

```ts
readonly totalTokens: number | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceUsage.ts#L17)

Provider-reported total input and output tokens.

#### Inherited from

[`IIntelligenceUsage`](Interface.IIntelligenceUsage).[`totalTokens`](Interface.IIntelligenceUsage#totaltokens)
