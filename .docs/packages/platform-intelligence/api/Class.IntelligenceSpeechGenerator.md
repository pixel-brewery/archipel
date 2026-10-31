---
title: 'Class: IntelligenceSpeechGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceSpeechGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts#L23)

Provider-neutral speech generation facade.

## Extends

- `IntelligenceGeneratorBase`

## Constructors

### Constructor

```ts
new IntelligenceSpeechGenerator(modelResolver): IntelligenceSpeechGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts#L30)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceSpeechGenerator`

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

### generate()

```ts
generate(options): Promise<IIntelligenceSpeechGenerationResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceSpeechGenerator.ts#L47)

Generates spoken audio from text.

#### Parameters

| Parameter | Type                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceSpeechGenerationOptions`](Interface.IIntelligenceSpeechGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceSpeechGenerationResult`](Interface.IIntelligenceSpeechGenerationResult)\>
