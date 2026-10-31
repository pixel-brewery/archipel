---
title: 'Class: DocumentRenderError'
generated: true
editUrl: false
---

# Class: DocumentRenderError

Defined in: [libs/platform-documents/src/errors/DocumentRenderError.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/DocumentRenderError.ts#L8)

Thrown when document rendering fails.

## Extends

- [`DocumentErrorBase`](Class.DocumentErrorBase)

## Constructors

### Constructor

```ts
new DocumentRenderError(message, cause?): DocumentRenderError;
```

Defined in: [libs/platform-documents/src/errors/DocumentRenderError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/DocumentRenderError.ts#L11)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `message` | `string`  |
| `cause?`  | `unknown` |

#### Returns

`DocumentRenderError`

#### Overrides

[`DocumentErrorBase`](Class.DocumentErrorBase).[`constructor`](Class.DocumentErrorBase#constructor)

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts#L10)

#### Inherited from

[`DocumentErrorBase`](Class.DocumentErrorBase).[`code`](Class.DocumentErrorBase#code)
