---
title: 'Interface: IProblemDetailExceptionOptions'
generated: true
editUrl: false
---

# Interface: IProblemDetailExceptionOptions

Defined in: [libs/platform-core/src/filters/IProblemDetailExceptionOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/IProblemDetailExceptionOptions.ts#L6)

Optional settings of a [ProblemDetailException](Class.ProblemDetailException).

## Properties

### headers?

```ts
readonly headers?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-core/src/filters/IProblemDetailExceptionOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/IProblemDetailExceptionOptions.ts#L16)

Response headers that belong to the problem, such as `Retry-After` for a
`429`/`503` or `WWW-Authenticate` for a `401`.

#### Remarks

`ProblemDetailExceptionFilter` sends them together with the problem.
`Content-Type`, `Content-Length` and `Transfer-Encoding` are owned by the
filter and ignored; a header with an invalid name or value is skipped.
