---
title: 'Type Alias: ProblemDetailTypeUrlResolver'
generated: true
editUrl: false
---

# Type Alias: ProblemDetailTypeUrlResolver

```ts
type ProblemDetailTypeUrlResolver = (code, title) => string;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailTypeUrlResolver.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailTypeUrlResolver.ts#L6)

A function that resolves a type URL for a given HTTP status code and title.

## Parameters

| Parameter | Type     |
| --------- | -------- |
| `code`    | `number` |
| `title`   | `string` |

## Returns

`string`
