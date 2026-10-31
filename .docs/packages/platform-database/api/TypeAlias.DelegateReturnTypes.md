---
title: 'Type Alias: DelegateReturnTypes\<T\>'
generated: true
editUrl: false
---

# Type Alias: DelegateReturnTypes\<T\>

```ts
type DelegateReturnTypes<T> = { [K in keyof T]: T[K] extends (args: infer A) => Promise<infer R> ? R : never };
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:429](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L429)

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |
