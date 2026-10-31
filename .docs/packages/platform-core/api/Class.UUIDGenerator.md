---
title: 'Class: UUIDGenerator'
generated: true
editUrl: false
---

# Class: UUIDGenerator

Defined in: [libs/platform-core/src/identifiers/generators/UUIDGenerator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/UUIDGenerator.ts#L15)

UUID Generator class

## Extends

- [`IdGeneratorBase`](Class.IdGeneratorBase)

## Constructors

### Constructor

```ts
new UUIDGenerator(): UUIDGenerator;
```

#### Returns

`UUIDGenerator`

#### Inherited from

[`IdGeneratorBase`](Class.IdGeneratorBase).[`constructor`](Class.IdGeneratorBase#constructor)

## Methods

### generate()

```ts
generate(prefix?, postfix?): string;
```

Defined in: [libs/platform-core/src/identifiers/generators/UUIDGenerator.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/UUIDGenerator.ts#L22)

Generates a version 4 UUID (random-based)

#### Parameters

| Parameter  | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `prefix?`  | `string` | Optional prefix to prepend to the ID |
| `postfix?` | `string` | Optional postfix to append to the ID |

#### Returns

`string`

#### Overrides

[`IdGeneratorBase`](Class.IdGeneratorBase).[`generate`](Class.IdGeneratorBase#generate)

---

### isValid()

```ts
isValid(id): boolean;
```

Defined in: [libs/platform-core/src/identifiers/generators/UUIDGenerator.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/UUIDGenerator.ts#L39)

Validates if the provided string is a valid UUID (version 4)

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `id`      | `string` | The ID to validate |

#### Returns

`boolean`

True if the ID is valid, otherwise false

#### Overrides

[`IdGeneratorBase`](Class.IdGeneratorBase).[`isValid`](Class.IdGeneratorBase#isvalid)
