---
title: 'Function: isUniqueConstraintViolation()'
generated: true
editUrl: false
---

# Function: isUniqueConstraintViolation()

```ts
function isUniqueConstraintViolation(error): boolean;
```

Defined in: [libs/platform-database/src/repositories/failures/isUniqueConstraintViolation.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/failures/isUniqueConstraintViolation.ts#L23)

Determines whether a repository write failed because it violated a unique constraint.

## Parameters

| Parameter | Type      | Description       |
| --------- | --------- | ----------------- |
| `error`   | `unknown` | The thrown value. |

## Returns

`boolean`

`true` for a unique constraint violation.

## Remarks

Recognizes a [RepositoryError](Class.RepositoryError) after `repository.execute(query)` as
well as the raw Prisma `P2002` error inside a query callback. To translate
the violation of a single write, prefer
[translateUniqueConstraintViolation](Function.translateUniqueConstraintViolation).
