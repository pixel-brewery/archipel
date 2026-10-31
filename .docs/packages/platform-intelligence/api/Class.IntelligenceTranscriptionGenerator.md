---
title: 'Class: IntelligenceTranscriptionGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceTranscriptionGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts#L39)

Provider-neutral bounded and streaming transcription facade.

## Extends

- `IntelligenceGeneratorBase`

## Constructors

### Constructor

```ts
new IntelligenceTranscriptionGenerator(modelResolver): IntelligenceTranscriptionGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts#L46)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceTranscriptionGenerator`

#### Overrides

`IntelligenceGeneratorBase.constructor`

## Properties

### modelResolver

```ts
protected readonly modelResolver: IntelligenceModelResolver;
```

Defined in: [libs/platform-intelligence/src/generators/abstracts/IntelligenceGeneratorBase.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/abstracts/IntelligenceGeneratorBase.ts#L15)

#### Inherited from

`IntelligenceGeneratorBase.modelResolver`

## Methods

### createProviderError()

```ts
protected createProviderError(
   error,
   provider,
   model,
   capability,
   operation,
   requestId,
   startedAt
): IntelligenceProviderError;
```

Defined in: [libs/platform-intelligence/src/generators/abstracts/IntelligenceGeneratorBase.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/abstracts/IntelligenceGeneratorBase.ts#L35)

#### Parameters

| Parameter    | Type                                                         |
| ------------ | ------------------------------------------------------------ |
| `error`      | `unknown`                                                    |
| `provider`   | `string`                                                     |
| `model`      | `string`                                                     |
| `capability` | [`IntelligenceCapability`](TypeAlias.IntelligenceCapability) |
| `operation`  | `string`                                                     |
| `requestId`  | `string` \| `undefined`                                      |
| `startedAt`  | `number`                                                     |

#### Returns

[`IntelligenceProviderError`](Class.IntelligenceProviderError)

#### Inherited from

`IntelligenceGeneratorBase.createProviderError`

---

### stream()

```ts
stream(options): Promise<IIntelligenceTranscriptionStream>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts#L105)

Streams incremental and final transcripts from live raw audio.

#### Parameters

| Parameter | Type                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceStreamingTranscriptionOptions`](Interface.IIntelligenceStreamingTranscriptionOptions) |

#### Returns

`Promise`\<[`IIntelligenceTranscriptionStream`](Interface.IIntelligenceTranscriptionStream)\>

---

### transcribe()

```ts
transcribe(options): Promise<IIntelligenceTranscriptionResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceTranscriptionGenerator.ts#L63)

Transcribes bounded audio input.

#### Parameters

| Parameter | Type                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceTranscriptionOptions`](Interface.IIntelligenceTranscriptionOptions) |

#### Returns

`Promise`\<[`IIntelligenceTranscriptionResult`](Interface.IIntelligenceTranscriptionResult)\>
