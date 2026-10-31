---
title: 'Class: NormalizedUtils'
generated: true
editUrl: false
---

# Class: NormalizedUtils

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L6)

Utility functions for normalizing data.

## Constructors

### Constructor

```ts
new NormalizedUtils(): NormalizedUtils;
```

#### Returns

`NormalizedUtils`

## Methods

### normalizeArray()

```ts
static normalizeArray<T>(values?): T[] | undefined;
```

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L23)

Normalize an array by removing duplicates.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type  | Description             |
| --------- | ----- | ----------------------- |
| `values?` | `T`[] | The array to normalize. |

#### Returns

`T`[] \| `undefined`

The normalized array.

---

### normalizeBoolean()

```ts
static normalizeBoolean(value?): boolean | undefined;
```

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L67)

Normalize a boolean value.

#### Parameters

| Parameter | Type      | Description                     |
| --------- | --------- | ------------------------------- |
| `value?`  | `boolean` | The boolean value to normalize. |

#### Returns

`boolean` \| `undefined`

The normalized boolean value.

---

### normalizeDate()

```ts
static normalizeDate(value?): Date | undefined;
```

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L53)

Normalize a date by ensuring it is a valid date object.

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `value?`  | `Date` | The date to normalize. |

#### Returns

`Date` \| `undefined`

The normalized date.

---

### normalizeNumber()

```ts
static normalizeNumber(value?): number | undefined;
```

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L39)

Normalize a number by ensuring it is non-negative.

#### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `value?`  | `number` | The number to normalize. |

#### Returns

`number` \| `undefined`

The normalized number.

---

### normalizeString()

```ts
static normalizeString(value?): string | undefined;
```

Defined in: [libs/platform-core/src/utils/NormalizedUtils.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/NormalizedUtils.ts#L13)

Normalize a search query by trimming whitespace and converting to lowercase.

#### Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `value?`  | `string` | The search query to normalize. |

#### Returns

`string` \| `undefined`

The normalized search query.
