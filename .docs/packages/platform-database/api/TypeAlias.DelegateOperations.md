---
title: 'Type Alias: DelegateOperations\<TDelegate\>'
generated: true
editUrl: false
---

# Type Alias: DelegateOperations\<TDelegate\>

```ts
type DelegateOperations<TDelegate> = Extract<RepositoryOperationsAll, keyof TDelegate>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L58)

Extracts the subset of known Prisma operations that a concrete delegate actually implements.
Useful for type-level checks without requiring the consumer to state the provider explicitly.

## Type Parameters

| Type Parameter                                    |
| ------------------------------------------------- |
| <a id="type-parameter-tdelegate"></a> `TDelegate` |

## Example

```typescript
// On PostgreSQL: 'findUnique' | ... | 'createManyAndReturn' | 'updateManyAndReturn'
// On SQL Server: 'findUnique' | ... (15 base ops only)
type Ops = DelegateOperations<Prisma.TaskDelegate>;
```
