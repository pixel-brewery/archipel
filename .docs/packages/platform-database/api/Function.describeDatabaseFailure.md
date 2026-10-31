---
title: 'Function: describeDatabaseFailure()'
generated: true
editUrl: false
---

# Function: describeDatabaseFailure()

```ts
function describeDatabaseFailure(error): IDatabaseFailure;
```

Defined in: [libs/platform-database/src/postgres/describeDatabaseFailure.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/describeDatabaseFailure.ts#L24)

Classifies provider failures without exporting messages, SQL, parameters or credentials.

## Parameters

| Parameter | Type      | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| `error`   | `unknown` | The original failure, including wrapped Prisma driver causes. |

## Returns

`IDatabaseFailure`

Bounded diagnostic attributes.

## Remarks

Prisma's P2028 code describes transaction failures across lifecycle phases, so it is
classified as `transaction` without inferring whether the transaction started or closed.
