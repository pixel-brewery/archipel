---
title: 'Class: DocumentValidationError'
generated: true
editUrl: false
---

# Class: DocumentValidationError

Defined in: [libs/platform-documents/src/errors/DocumentValidationError.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/DocumentValidationError.ts#L8)

Thrown when document input validation fails.

## Extends

- [`DocumentErrorBase`](Class.DocumentErrorBase)

## Constructors

### Constructor

```ts
new DocumentValidationError(message): DocumentValidationError;
```

Defined in: [libs/platform-documents/src/errors/DocumentValidationError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/DocumentValidationError.ts#L11)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |

#### Returns

`DocumentValidationError`

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
