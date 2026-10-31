---
title: 'Class: ProblemDetailException'
generated: true
editUrl: false
---

# Class: ProblemDetailException

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L28)

A NestJS HttpException that represents a Problem Detail as per RFC 7807.

## Remarks

Response headers that belong to the problem, such as `Retry-After` or
`WWW-Authenticate`, travel with the exception and are sent by
[ProblemDetailExceptionFilter](Class.ProblemDetailExceptionFilter).

## Example

```typescript
throw new ProblemDetailException(
    HttpStatus.TOO_MANY_REQUESTS,
    { title: 'Rate Limit Exceeded', detail: 'Too many requests.', code: 'RATE_LIMIT' },
    { headers: { 'Retry-After': '42' } },
);
```

## Extends

- `HttpException`

## Constructors

### Constructor

```ts
new ProblemDetailException(
   responseCode,
   args,
   options?
): ProblemDetailException;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L37)

#### Parameters

| Parameter      | Type                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| `responseCode` | `number`                                                                     |
| `args`         | [`ProblemDetail`](TypeAlias.ProblemDetail)                                   |
| `options?`     | [`IProblemDetailExceptionOptions`](Interface.IProblemDetailExceptionOptions) |

#### Returns

`ProblemDetailException`

#### Overrides

`HttpException.constructor`

## Methods

### getHeaders()

```ts
getHeaders(): Readonly<Record<string, string>>;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L56)

Returns the response headers that belong to this problem.

#### Returns

`Readonly`\<`Record`\<`string`, `string`\>\>

The headers, empty when the problem has none.

---

### getResponse()

```ts
getResponse(): ProblemDetail;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L47)

#### Returns

[`ProblemDetail`](TypeAlias.ProblemDetail)

#### Overrides

`HttpException.getResponse`
