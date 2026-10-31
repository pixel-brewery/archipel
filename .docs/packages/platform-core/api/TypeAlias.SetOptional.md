---
title: 'Type Alias: SetOptional\<T, K\>'
generated: true
editUrl: false
---

# Type Alias: SetOptional\<T, K\>

```ts
type SetOptional<T, K> = Omit<T, K> & Partial<Pick<T, K>>;
```

Defined in: [libs/platform-core/src/types/SetOptional.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/types/SetOptional.ts#L7)

Sets the specified keys of T as optional.

## Type Parameters

| Type Parameter                                        | Description             |
| ----------------------------------------------------- | ----------------------- |
| <a id="type-parameter-t"></a> `T`                     | Original type           |
| <a id="type-parameter-k"></a> `K` _extends_ keyof `T` | Keys to set as optional |
