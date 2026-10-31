---
title: 'Class: LimitRequestSizeMiddleware'
generated: true
editUrl: false
---

# Class: LimitRequestSizeMiddleware

Defined in: [libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts#L5)

## Implements

- `NestMiddleware`

## Constructors

### Constructor

```ts
new LimitRequestSizeMiddleware(): LimitRequestSizeMiddleware;
```

Defined in: [libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts#L17)

Constructs a new instance of the `LimitRequestSizeMiddleware` class.

#### Returns

`LimitRequestSizeMiddleware`

## Methods

### use()

```ts
use(
   request,
   _response,
   next
): void;
```

Defined in: [libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/middlewares/LimitRequestSizeMiddleware.ts#L21)

#### Parameters

| Parameter   | Type           |
| ----------- | -------------- |
| `request`   | `Request`      |
| `_response` | `Response`     |
| `next`      | `NextFunction` |

#### Returns

`void`

#### Implementation of

`NestMiddleware.use`
