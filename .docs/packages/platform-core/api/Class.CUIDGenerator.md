---
title: 'Class: CUIDGenerator'
generated: true
editUrl: false
---

# Class: CUIDGenerator

Defined in: [libs/platform-core/src/identifiers/generators/CUIDGenerator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/CUIDGenerator.ts#L15)

CUID Generator class

## Extends

- [`IdGeneratorBase`](Class.IdGeneratorBase)

## Constructors

### Constructor

```ts
new CUIDGenerator(): CUIDGenerator;
```

#### Returns

`CUIDGenerator`

#### Inherited from

[`IdGeneratorBase`](Class.IdGeneratorBase).[`constructor`](Class.IdGeneratorBase#constructor)

## Methods

### generate()

```ts
generate(prefix?, postfix?): string;
```

Defined in: [libs/platform-core/src/identifiers/generators/CUIDGenerator.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/CUIDGenerator.ts#L28)

Generates a CUID (Collision-Resistant Unique Identifier).

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

Defined in: [libs/platform-core/src/identifiers/generators/CUIDGenerator.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/CUIDGenerator.ts#L43)

Validates if the provided string is a valid CUID

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `id`      | `string` | The ID to validate |

#### Returns

`boolean`

True if the ID is valid, otherwise false

#### Overrides

[`IdGeneratorBase`](Class.IdGeneratorBase).[`isValid`](Class.IdGeneratorBase#isvalid)

---

### parse()

```ts
parse(cuid):
  | {
  counter: string;
  random: string;
  timestamp: string;
}
  | null;
```

Defined in: [libs/platform-core/src/identifiers/generators/CUIDGenerator.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/CUIDGenerator.ts#L54)

Parses a CUID into its segments

#### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `cuid`    | `string` | The CUID string to parse |

#### Returns

\| \{
`counter`: `string`;
`random`: `string`;
`timestamp`: `string`;
\}
\| `null`

An object containing the parsed segments
