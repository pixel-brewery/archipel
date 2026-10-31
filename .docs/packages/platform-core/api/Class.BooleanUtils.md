---
title: 'Class: BooleanUtils'
generated: true
editUrl: false
---

# Class: BooleanUtils

Defined in: [libs/platform-core/src/utils/BooleanUtils.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/BooleanUtils.ts#L21)

Boolean Utility Class.
This class provides static methods to parse and format boolean values.

## Constructors

### Constructor

```ts
new BooleanUtils(): BooleanUtils;
```

#### Returns

`BooleanUtils`

## Methods

### formatBoolean()

```ts
static formatBoolean(
   bool,
   trueFormat?,
   falseFormat?
): string;
```

Defined in: [libs/platform-core/src/utils/BooleanUtils.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/BooleanUtils.ts#L73)

Formats a boolean into a specific string representation.

#### Parameters

| Parameter      | Type      | Default value | Description                                                   |
| -------------- | --------- | ------------- | ------------------------------------------------------------- |
| `bool`         | `boolean` | `undefined`   | The boolean to format                                         |
| `trueFormat?`  | `string`  | `'true'`      | The string to return for `true` values (defaults to "true")   |
| `falseFormat?` | `string`  | `'false'`     | The string to return for `false` values (defaults to "false") |

#### Returns

`string`

The formatted string representation of the boolean

---

### parseBoolean()

```ts
static parseBoolean(value, options?): boolean;
```

Defined in: [libs/platform-core/src/utils/BooleanUtils.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/BooleanUtils.ts#L31)

Parses a given value into a boolean.
Accepts flexible strings like "yes", "no", "y", "n", "1", "0", "true", "false".

#### Parameters

| Parameter  | Type                  | Description                       |
| ---------- | --------------------- | --------------------------------- |
| `value`    | `string` \| `boolean` | The value to parse into a boolean |
| `options?` | `BooleanOptions`      | Options for strict parsing mode   |

#### Returns

`boolean`

The parsed boolean value

#### Throws

Error if the value is not a valid boolean representation
