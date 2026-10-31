---
title: 'Abstract Class: DocumentErrorBase'
generated: true
editUrl: false
---

# Abstract Class: DocumentErrorBase

Defined in: [libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts#L7)

Base class for document-related domain errors.

## Extends

- `Error`

## Extended by

- [`DocumentRenderError`](Class.DocumentRenderError)
- [`DocumentValidationError`](Class.DocumentValidationError)
- [`ImageProcessingError`](Class.ImageProcessingError)

## Constructors

### Constructor

```ts
protected new DocumentErrorBase(
   message,
   code,
   cause?
): DocumentErrorBase;
```

Defined in: [libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts#L16)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `message` | `string`  |
| `code`    | `string`  |
| `cause?`  | `unknown` |

#### Returns

`DocumentErrorBase`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/abstracts/DocumentErrorBase.ts#L10)
