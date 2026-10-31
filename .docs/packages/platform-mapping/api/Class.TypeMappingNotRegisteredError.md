---
title: 'Class: TypeMappingNotRegisteredError'
generated: true
editUrl: false
---

# Class: TypeMappingNotRegisteredError

Defined in: [libs/platform-mapping/src/errors/TypeMappingNotRegisteredError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/TypeMappingNotRegisteredError.ts#L12)

Thrown when a type mapping is requested but not registered.

## Extends

- [`MappingErrorBase`](Class.MappingErrorBase)

## Constructors

### Constructor

```ts
new TypeMappingNotRegisteredError(source, destination): TypeMappingNotRegisteredError;
```

Defined in: [libs/platform-mapping/src/errors/TypeMappingNotRegisteredError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/errors/TypeMappingNotRegisteredError.ts#L15)

#### Parameters

| Parameter     | Type     |
| ------------- | -------- |
| `source`      | `string` |
| `destination` | `string` |

#### Returns

`TypeMappingNotRegisteredError`

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
