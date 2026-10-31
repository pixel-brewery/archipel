---
title: 'Function: translateRevisionConflict()'
generated: true
editUrl: false
---

# Function: translateRevisionConflict()

```ts
function translateRevisionConflict<TResult>(operation, createError): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/failures/translateRevisionConflict.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/failures/translateRevisionConflict.ts#L37)

Runs a revision-bound (compare-and-swap) write and reports a changed or
removed record as the caller's conflict error.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

## Parameters

| Parameter     | Type                             | Description                                               |
| ------------- | -------------------------------- | --------------------------------------------------------- |
| `operation`   | () => `PromiseLike`\<`TResult`\> | The write whose filter is bound to the observed revision. |
| `createError` | (`failure`) => `Error`           | Creates the conflict error from the failure.              |

## Returns

`Promise`\<`TResult`\>

The result of the write.

## Remarks

The write's filter must include the revision the caller observed, such as
`updatedAt` or a version number, next to the record key. When the record
changed or disappeared after it was read, the `update` or `delete` matches
no row and Prisma fails with "record not found" (`P2025`); this helper
reports that as the conflict. Every other failure is rethrown unchanged.
Do not wrap writes whose filter is not bound to a revision, because a plain
missing record would then be misreported as a conflict.

## Example

```typescript
return query<ConnectorDelegate, ConnectorModel>('updateConnector', (model) =>
    translateRevisionConflict(
        () => model.update({ where: { id, updatedAt: expectedUpdatedAt }, data }),
        () => new ConnectorRevisionConflictError(id),
    ),
);
```
