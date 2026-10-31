---
title: 'Class: GUIDGenerator'
generated: true
editUrl: false
---

# Class: GUIDGenerator

Defined in: [libs/platform-core/src/identifiers/generators/GUIDGenerator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/GUIDGenerator.ts#L15)

GUID Generator class

## Extends

- [`IdGeneratorBase`](Class.IdGeneratorBase)

## Constructors

### Constructor

```ts
new GUIDGenerator(): GUIDGenerator;
```

#### Returns

`GUIDGenerator`

#### Inherited from

[`IdGeneratorBase`](Class.IdGeneratorBase).[`constructor`](Class.IdGeneratorBase#constructor)

## Methods

### generate()

```ts
generate(prefix?, postfix?): string;
```

Defined in: [libs/platform-core/src/identifiers/generators/GUIDGenerator.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/GUIDGenerator.ts#L22)

Generates a GUID (variant of UUID)

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

Defined in: [libs/platform-core/src/identifiers/generators/GUIDGenerator.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/GUIDGenerator.ts#L39)

Validates if the provided string is a valid GUID

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `id`      | `string` | The ID to validate |

#### Returns

`boolean`

True if the ID is valid, otherwise false

#### Overrides

[`IdGeneratorBase`](Class.IdGeneratorBase).[`isValid`](Class.IdGeneratorBase#isvalid)
