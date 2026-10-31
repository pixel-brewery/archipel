---
title: 'Abstract Class: MappingErrorBase'
generated: true
editUrl: false
---

# Abstract Class: MappingErrorBase

Defined in: [libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts#L7)

Base class for mapping related domain errors.

## Extends

- `Error`

## Extended by

- [`MappingNotRegisteredError`](Class.MappingNotRegisteredError)
- [`TypeMappingNotRegisteredError`](Class.TypeMappingNotRegisteredError)

## Constructors

### Constructor

```ts
protected new MappingErrorBase(message, code): MappingErrorBase;
```

Defined in: [libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts#L16)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |
| `code`    | `string` |

#### Returns

`MappingErrorBase`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts#L10)
