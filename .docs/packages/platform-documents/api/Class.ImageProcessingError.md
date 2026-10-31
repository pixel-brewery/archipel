---
title: 'Class: ImageProcessingError'
generated: true
editUrl: false
---

# Class: ImageProcessingError

Defined in: [libs/platform-documents/src/errors/ImageProcessingError.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/ImageProcessingError.ts#L8)

Thrown when image processing fails.

## Extends

- [`DocumentErrorBase`](Class.DocumentErrorBase)

## Constructors

### Constructor

```ts
new ImageProcessingError(message, cause?): ImageProcessingError;
```

Defined in: [libs/platform-documents/src/errors/ImageProcessingError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/errors/ImageProcessingError.ts#L11)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `message` | `string`  |
| `cause?`  | `unknown` |

#### Returns

`ImageProcessingError`

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
