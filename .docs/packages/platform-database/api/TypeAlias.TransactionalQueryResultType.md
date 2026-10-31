---
title: 'Type Alias: TransactionalQueryResultType\<T\>'
generated: true
editUrl: false
---

# Type Alias: TransactionalQueryResultType\<T\>

```ts
type TransactionalQueryResultType<T> = T extends ITransactionalRepositoryQuery<infer R> ? R : never;
```

Defined in: [libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts#L43)

Extracts the result type from a transactional repository query.

## Type Parameters

| Type Parameter                    | Description                              |
| --------------------------------- | ---------------------------------------- |
| <a id="type-parameter-t"></a> `T` | The transactional repository query type. |

## Example

```typescript
type ConversationResult = TransactionalQueryResultType<ReturnType<typeof createConversationQuery>>;
```
