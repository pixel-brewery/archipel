---
title: 'Type Alias: QueryResultType\<T\>'
generated: true
editUrl: false
---

# Type Alias: QueryResultType\<T\>

```ts
type QueryResultType<T> = T extends IRepositoryQuery<unknown, infer R> ? R : never;
```

Defined in: [libs/platform-database/src/repositories/queries/IRepositoryQuery.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/IRepositoryQuery.ts#L42)

Extracts the result type from a repository query.
Useful for type-safe mapping without duplicating query result types.

## Type Parameters

| Type Parameter                    | Description                |
| --------------------------------- | -------------------------- |
| <a id="type-parameter-t"></a> `T` | The repository query type. |

## Example

```typescript
type UserProfileResult = QueryResultType<ReturnType<typeof createUserProfileQuery>>;
```
