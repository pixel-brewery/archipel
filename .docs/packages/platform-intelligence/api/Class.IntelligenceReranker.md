---
title: 'Class: IntelligenceReranker'
generated: true
editUrl: false
---

# Class: IntelligenceReranker

Defined in: [libs/platform-intelligence/src/IntelligenceReranker.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceReranker.ts#L23)

Provider-neutral semantic reranking facade.

## Constructors

### Constructor

```ts
new IntelligenceReranker(modelResolver): IntelligenceReranker;
```

Defined in: [libs/platform-intelligence/src/IntelligenceReranker.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceReranker.ts#L32)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceReranker`

## Methods

### rerank()

```ts
rerank<TDocument>(options): Promise<IIntelligenceRerankingResult<TDocument>>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceReranker.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceReranker.ts#L49)

Reranks documents by relevance to a query.

#### Type Parameters

| Type Parameter                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="type-parameter-tdocument"></a> `TDocument` _extends_ \| `string` \| `Readonly`\<`Record`\<`string`, [`IntelligenceJsonValue`](TypeAlias.IntelligenceJsonValue)\>\> |

#### Parameters

| Parameter | Type                                                                                      |
| --------- | ----------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceRerankingOptions`](Interface.IIntelligenceRerankingOptions)\<`TDocument`\> |

#### Returns

`Promise`\<[`IIntelligenceRerankingResult`](Interface.IIntelligenceRerankingResult)\<`TDocument`\>\>
