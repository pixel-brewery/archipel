---
title: 'Abstract Class: PageableResponseBase'
generated: true
editUrl: false
---

# Abstract Class: PageableResponseBase

Defined in: [libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts#L11)

Base class describing pagination metadata returned alongside list payloads.

## Constructors

### Constructor

```ts
new PageableResponseBase(): PageableResponseBase;
```

#### Returns

`PageableResponseBase`

## Properties

### items

```ts
abstract items: unknown[];
```

Defined in: [libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts#L50)

---

### skip?

```ts
skip?: number;
```

Defined in: [libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts#L31)

---

### take?

```ts
take?: number;
```

Defined in: [libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts#L41)

---

### total

```ts
total: number;
```

Defined in: [libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/abstracts/PageableResponseBase.ts#L21)
