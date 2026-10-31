---
title: 'Class: IntelligenceImageGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceImageGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts#L24)

Provider-neutral image generation facade.

## Extends

- `IntelligenceGeneratorBase`

## Constructors

### Constructor

```ts
new IntelligenceImageGenerator(modelResolver): IntelligenceImageGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts#L31)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceImageGenerator`

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
generate(options): Promise<IIntelligenceImageGenerationResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceImageGenerator.ts#L48)

Generates one or more images.

#### Parameters

| Parameter | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceImageGenerationOptions`](Interface.IIntelligenceImageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceImageGenerationResult`](Interface.IIntelligenceImageGenerationResult)\>
