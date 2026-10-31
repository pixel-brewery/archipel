---
title: 'Class: MappingNotRegisteredError'
generated: true
editUrl: false
---

# Class: MappingNotRegisteredError

Defined in: [libs/platform-mapping/src/errors/MappingNotRegisteredError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/MappingNotRegisteredError.ts#L12)

Thrown when a keyed mapping is requested but not registered.

## Extends

- [`MappingErrorBase`](Class.MappingErrorBase)

## Constructors

### Constructor

```ts
new MappingNotRegisteredError(key): MappingNotRegisteredError;
```

Defined in: [libs/platform-mapping/src/errors/MappingNotRegisteredError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/MappingNotRegisteredError.ts#L15)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`MappingNotRegisteredError`

#### Overrides

[`MappingErrorBase`](Class.MappingErrorBase).[`constructor`](Class.MappingErrorBase#constructor)

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/abstracts/MappingErrorBase.ts#L10)

#### Inherited from

[`MappingErrorBase`](Class.MappingErrorBase).[`code`](Class.MappingErrorBase#code)
