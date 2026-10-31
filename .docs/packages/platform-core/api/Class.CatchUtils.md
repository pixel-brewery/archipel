---
title: 'Class: CatchUtils'
generated: true
editUrl: false
---

# Class: CatchUtils

Defined in: [libs/platform-core/src/utils/CatchUtils.ts:1](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/CatchUtils.ts#L1)

## Constructors

### Constructor

```ts
new CatchUtils(): CatchUtils;
```

#### Returns

`CatchUtils`

## Methods

### catch()

```ts
static catch<T>(input, handler): void;
```

Defined in: [libs/platform-core/src/utils/CatchUtils.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/CatchUtils.ts#L4)

#### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| <a id="type-parameter-t"></a> `T` _extends_ `Error` |

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `input`   | `unknown`            |
| `handler` | (`error`) => `Error` |

#### Returns

`void`

---

### catchError()

```ts
static catchError<T>(promise): Promise<[undefined, T] | [Error]>;
```

Defined in: [libs/platform-core/src/utils/CatchUtils.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/CatchUtils.ts#L10)

#### Type Parameters

| Type Parameter                      |
| ----------------------------------- |
| <a id="type-parameter-t-1"></a> `T` |

#### Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `promise` | `Promise`\<`T`\> |

#### Returns

`Promise`\<\[`undefined`, `T`\] \| \[`Error`\]\>

---

### isError()

```ts
static isError(value): value is Error;
```

Defined in: [libs/platform-core/src/utils/CatchUtils.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/CatchUtils.ts#L14)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is Error`
