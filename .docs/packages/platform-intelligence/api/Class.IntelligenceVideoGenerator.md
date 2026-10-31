---
title: 'Class: IntelligenceVideoGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceVideoGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts#L23)

Provider-neutral video generation facade.

## Extends

- `IntelligenceGeneratorBase`

## Constructors

### Constructor

```ts
new IntelligenceVideoGenerator(modelResolver): IntelligenceVideoGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts#L30)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceVideoGenerator`

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
generate(options): Promise<IIntelligenceVideoGenerationResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceVideoGenerator.ts#L47)

Generates one or more videos.

#### Parameters

| Parameter | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceVideoGenerationOptions`](Interface.IIntelligenceVideoGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceVideoGenerationResult`](Interface.IIntelligenceVideoGenerationResult)\>
