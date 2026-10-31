---
title: 'Abstract Class: TokenEnricherBase'
generated: true
editUrl: false
---

# Abstract Class: TokenEnricherBase

Defined in: [libs/platform-authentication/src/abstracts/TokenEnricherBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/TokenEnricherBase.ts#L9)

Abstract base for enriching JWT claims with product-specific data.
This is an optional abstract base: when not provided, the token contains only base claims.

## Constructors

### Constructor

```ts
new TokenEnricherBase(): TokenEnricherBase;
```

#### Returns

`TokenEnricherBase`

## Methods

### enrichClaims()

```ts
abstract enrichClaims(subject): Promise<Record<string, unknown>>;
```

Defined in: [libs/platform-authentication/src/abstracts/TokenEnricherBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/TokenEnricherBase.ts#L28)

Return additional claims to merge into the JWT payload.

#### Parameters

| Parameter | Type                                     | Description                |
| --------- | ---------------------------------------- | -------------------------- |
| `subject` | [`IAuthSubject`](Interface.IAuthSubject) | The authenticated subject. |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

A record of additional claims.
