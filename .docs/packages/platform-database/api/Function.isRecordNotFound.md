---
title: 'Function: isRecordNotFound()'
generated: true
editUrl: false
---

# Function: isRecordNotFound()

```ts
function isRecordNotFound(error): boolean;
```

Defined in: [libs/platform-database/src/repositories/failures/isRecordNotFound.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/failures/isRecordNotFound.ts#L24)

Determines whether a repository operation failed because a required record
does not exist or no longer matches the operation's filter.

## Parameters

| Parameter | Type      | Description       |
| --------- | --------- | ----------------- |
| `error`   | `unknown` | The thrown value. |

## Returns

`boolean`

`true` when the required record was not found.

## Remarks

Recognizes a [RepositoryError](Class.RepositoryError) after `repository.execute(query)` as
well as the raw Prisma `P2025` error inside a query callback. For a
revision-bound (compare-and-swap) write, prefer
[translateRevisionConflict](Function.translateRevisionConflict).
