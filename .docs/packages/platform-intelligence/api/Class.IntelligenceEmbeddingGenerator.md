---
title: 'Class: IntelligenceEmbeddingGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceEmbeddingGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts#L26)

Provider-neutral single and batch embedding facade.

## Constructors

### Constructor

```ts
new IntelligenceEmbeddingGenerator(modelResolver): IntelligenceEmbeddingGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts#L35)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceEmbeddingGenerator`

## Methods

### embed()

```ts
embed(options): Promise<IIntelligenceEmbeddingResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts#L52)

Embeds one text value.

#### Parameters

| Parameter | Type                                                                       |
| --------- | -------------------------------------------------------------------------- |
| `options` | [`IIntelligenceEmbeddingOptions`](Interface.IIntelligenceEmbeddingOptions) |

#### Returns

`Promise`\<[`IIntelligenceEmbeddingResult`](Interface.IIntelligenceEmbeddingResult)\>

---

### embedMany()

```ts
embedMany(options): Promise<IIntelligenceEmbeddingBatchResult>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceEmbeddingGenerator.ts#L84)

Embeds multiple values with bounded provider parallelism.

#### Parameters

| Parameter | Type                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| `options` | [`IIntelligenceEmbeddingBatchOptions`](Interface.IIntelligenceEmbeddingBatchOptions) |

#### Returns

`Promise`\<[`IIntelligenceEmbeddingBatchResult`](Interface.IIntelligenceEmbeddingBatchResult)\>
