---
title: 'Class: ProblemDetailResponse'
generated: true
editUrl: false
---

# Class: ProblemDetailResponse

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L29)

OpenAPI schema class representing a Problem Detail response as per RFC 9457.

This class is used exclusively for Swagger / OpenAPI documentation. It is
**not** instantiated at runtime — the actual response body is produced by
[ProblemDetailExceptionFilter](Class.ProblemDetailExceptionFilter).

The static [MEDIA\_TYPE](#media_type) property signals to the `@Api` decorator
that this response schema must be served under `application/problem+json`
instead of the default `application/json`.

Usage in controllers:

```typescript
@Api({
    responses: [
        { status: HttpStatus.NOT_FOUND, description: 'User not found.', type: ProblemDetailResponse },
    ]
})
```

## Constructors

### Constructor

```ts
new ProblemDetailResponse(): ProblemDetailResponse;
```

#### Returns

`ProblemDetailResponse`

## Properties

### code?

```ts
code?: string;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L81)

---

### detail

```ts
detail: string;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L69)

---

### instance?

```ts
instance?: string;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L75)

---

### MEDIA\_TYPE

```ts
readonly static MEDIA_TYPE: "application/problem+json" = 'application/problem+json';
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L41)

The media type for Problem Detail responses as per RFC 9457.

This static property is consumed by the `@Api` decorator to override the
default `application/json` content type when this class is used as a
response `type`.

---

### status

```ts
status: number;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L63)

---

### title

```ts
title: string;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L57)

---

### type

```ts
type: string;
```

Defined in: [libs/platform-core/src/models/response/ProblemDetailResponse.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/response/ProblemDetailResponse.ts#L51)
