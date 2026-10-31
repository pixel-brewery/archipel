---
title: 'Type Alias: CamelCase\<T\>'
generated: true
editUrl: false
---

# Type Alias: CamelCase\<T\>

```ts
type CamelCase<T> = { [K in keyof T as SnakeToCamel<K & string>]: T[K] extends object ? CamelCase<T[K]> : T[K] };
```

Defined in: [libs/platform-core/src/types/Case.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/types/Case.ts#L5)

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |
