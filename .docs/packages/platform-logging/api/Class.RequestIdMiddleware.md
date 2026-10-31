---
title: 'Class: RequestIdMiddleware'
generated: true
editUrl: false
---

# Class: RequestIdMiddleware

Defined in: [libs/platform-logging/src/RequestIdMiddleware.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestIdMiddleware.ts#L27)

NestJS middleware that extracts or generates a unique request ID
and stores it in the [RequestContextStore](Class.RequestContextStore) via `AsyncLocalStorage`.

## Remarks

If the incoming request already carries a `x-request-id` header (e.g. from
an API gateway or load balancer), the middleware reuses that value.
Otherwise it generates a new UUID v4.

The request ID is also set on the response headers for traceability.

## Implements

- `NestMiddleware`

## Constructors

### Constructor

```ts
new RequestIdMiddleware(): RequestIdMiddleware;
```

#### Returns

`RequestIdMiddleware`

## Methods

### use()

```ts
use(
   req,
   res,
   next
): void;
```

Defined in: [libs/platform-logging/src/RequestIdMiddleware.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestIdMiddleware.ts#L33)

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `req`     | `Request`            |
| `res`     | `Response`           |
| `next`    | (`error?`) => `void` |

#### Returns

`void`

#### Inherit Doc

#### Implementation of

`NestMiddleware.use`
