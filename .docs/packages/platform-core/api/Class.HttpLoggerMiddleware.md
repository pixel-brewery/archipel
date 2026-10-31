---
title: 'Class: HttpLoggerMiddleware'
generated: true
editUrl: false
---

# Class: HttpLoggerMiddleware

Defined in: [libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts#L12)

## Implements

- `NestMiddleware`

## Constructors

### Constructor

```ts
new HttpLoggerMiddleware(): HttpLoggerMiddleware;
```

Defined in: [libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts#L26)

Constructs a new instance of the `HttpLoggerMiddleware` class.

#### Returns

`HttpLoggerMiddleware`

## Methods

### use()

```ts
use(
   req,
   _res,
   next
): void;
```

Defined in: [libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/HttpLoggerMiddleware.ts#L32)

#### Parameters

| Parameter | Type           |
| --------- | -------------- |
| `req`     | `Request`      |
| `_res`    | `Response`     |
| `next`    | `NextFunction` |

#### Returns

`void`

#### Implementation of

`NestMiddleware.use`
