---
title: 'Type Alias: ProblemDetail'
generated: true
editUrl: false
---

# Type Alias: ProblemDetail

```ts
type ProblemDetail = {
    detail: string;
    instance?: string;
    title: string;
    type?: string;
} & Record<string, string | number | string[] | number[]>;
```

Defined in: [libs/platform-core/src/filters/ProblemDetail.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetail.ts#L6)

A Problem Detail object as per RFC 7807.

## Type Declaration

| Name        | Type     | Defined in                                                                                                                                                    |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detail`    | `string` | [libs/platform-core/src/filters/ProblemDetail.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetail.ts#L9)   |
| `instance?` | `string` | [libs/platform-core/src/filters/ProblemDetail.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetail.ts#L10) |
| `title`     | `string` | [libs/platform-core/src/filters/ProblemDetail.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetail.ts#L8)   |
| `type?`     | `string` | [libs/platform-core/src/filters/ProblemDetail.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetail.ts#L7)   |
