---
title: 'Type Alias: DelegateArgs\<T\>'
generated: true
editUrl: false
---

# Type Alias: DelegateArgs\<T\>

```ts
type DelegateArgs<T> = { [K in keyof T]: T[K] extends (args: infer A) => Promise<unknown> ? A : never };
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:422](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L422)

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |
