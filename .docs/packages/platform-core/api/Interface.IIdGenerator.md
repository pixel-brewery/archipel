---
title: 'Interface: IIdGenerator'
generated: true
editUrl: false
---

# Interface: IIdGenerator

Defined in: [libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts#L4)

Interface for ID generators

## Methods

### generate()

```ts
generate(prefix?, postfix?): string;
```

Defined in: [libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts#L14)

Generates a new ID

#### Parameters

| Parameter  | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `prefix?`  | `string` | Optional prefix to prepend to the ID |
| `postfix?` | `string` | Optional postfix to append to the ID |

#### Returns

`string`

---

### isValid()

```ts
isValid(id): boolean;
```

Defined in: [libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/identifiers/generators/interfaces/IIdGenerator.ts#L23)

Validates if the given ID conforms to the expected format

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `id`      | `string` | The ID to validate |

#### Returns

`boolean`

True if the ID is valid, otherwise false
