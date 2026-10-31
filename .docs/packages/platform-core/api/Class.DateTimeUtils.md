---
title: 'Class: DateTimeUtils'
generated: true
editUrl: false
---

# Class: DateTimeUtils

Defined in: [libs/platform-core/src/utils/DateTimeUtils.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/DateTimeUtils.ts#L58)

TimeSpan Utility Class.
Provides methods to parse and format time span values.

## Constructors

### Constructor

```ts
new DateTimeUtils(): DateTimeUtils;
```

#### Returns

`DateTimeUtils`

## Methods

### convert()

```ts
static convert(value, options?): string | number;
```

Defined in: [libs/platform-core/src/utils/DateTimeUtils.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/DateTimeUtils.ts#L66)

Converts a time span value (string or number) to milliseconds or a formatted string.

#### Parameters

| Parameter  | Type                                               | Description                       |
| ---------- | -------------------------------------------------- | --------------------------------- |
| `value`    | `number` \| [`StringValue`](TypeAlias.StringValue) | The time span value to convert    |
| `options?` | `Options`                                          | Options for formatting the output |

#### Returns

`string` \| `number`

The parsed time in milliseconds or formatted time string

---

### format()

```ts
static format(ms, options?): string;
```

Defined in: [libs/platform-core/src/utils/DateTimeUtils.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/DateTimeUtils.ts#L113)

Formats a number of milliseconds into a string representation.

#### Parameters

| Parameter  | Type      | Description                       |
| ---------- | --------- | --------------------------------- |
| `ms`       | `number`  | The milliseconds to format        |
| `options?` | `Options` | Options for formatting the output |

#### Returns

`string`

The formatted time span string

---

### parse()

```ts
static parse(value): number;
```

Defined in: [libs/platform-core/src/utils/DateTimeUtils.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/DateTimeUtils.ts#L82)

Parses a time span string to milliseconds.

#### Parameters

| Parameter | Type                                   | Description                   |
| --------- | -------------------------------------- | ----------------------------- |
| `value`   | [`StringValue`](TypeAlias.StringValue) | The time span string to parse |

#### Returns

`number`

The time span in milliseconds

#### Throws

Error if the string is invalid
