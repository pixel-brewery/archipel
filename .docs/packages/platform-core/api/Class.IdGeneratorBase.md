---
title: 'Abstract Class: IdGeneratorBase'
generated: true
editUrl: false
---

# Abstract Class: IdGeneratorBase

Defined in: [libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts#L11)

Abstract base class for ID Generators

## Extended by

- [`CUIDGenerator`](Class.CUIDGenerator)
- [`GUIDGenerator`](Class.GUIDGenerator)
- [`UUIDGenerator`](Class.UUIDGenerator)

## Implements

- [`IIdGenerator`](Interface.IIdGenerator)

## Constructors

### Constructor

```ts
new IdGeneratorBase(): IdGeneratorBase;
```

#### Returns

`IdGeneratorBase`

## Methods

### generate()

```ts
abstract generate(prefix?, postfix?): string;
```

Defined in: [libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts#L29)

Generates a new ID

#### Parameters

| Parameter  | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `prefix?`  | `string` | Optional prefix to prepend to the ID |
| `postfix?` | `string` | Optional postfix to append to the ID |

#### Returns

`string`

#### Implementation of

[`IIdGenerator`](Interface.IIdGenerator).[`generate`](Interface.IIdGenerator#generate)

---

### isValid()

```ts
abstract isValid(id): boolean;
```

Defined in: [libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/abstracts/IdGeneratorBase.ts#L37)

Validates if the given ID conforms to the expected format

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `id`      | `string` | The ID to validate |

#### Returns

`boolean`

True if the ID is valid, otherwise false

#### Implementation of

[`IIdGenerator`](Interface.IIdGenerator).[`isValid`](Interface.IIdGenerator#isvalid)
