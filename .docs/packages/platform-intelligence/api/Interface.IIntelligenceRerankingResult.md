---
title: 'Interface: IIntelligenceRerankingResult\<TDocument\>'
generated: true
editUrl: false
---

# Interface: IIntelligenceRerankingResult\<TDocument\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts#L12)

Provider-neutral reranking result.

## Type Parameters

| Type Parameter                                                                                                                                                            | Default type |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| <a id="type-parameter-tdocument"></a> `TDocument` _extends_ \| `string` \| `Readonly`\<`Record`\<`string`, [`IntelligenceJsonValue`](TypeAlias.IntelligenceJsonValue)\>\> | `string`     |

## Properties

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts#L21)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts#L20)

---

### ranking

```ts
readonly ranking: readonly {
  document: TDocument;
  originalIndex: number;
  score: number;
}[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingResult.ts#L15)
