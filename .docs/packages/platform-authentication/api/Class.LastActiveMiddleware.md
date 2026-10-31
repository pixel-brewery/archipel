---
title: 'Class: LastActiveMiddleware'
generated: true
editUrl: false
---

# Class: LastActiveMiddleware

Defined in: [libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts#L39)

Middleware to automatically update the lastActive timestamp for authenticated sessions.
Reads the session identifier from the bearer token and updates the session asynchronously.

## Remarks

Registering it makes **every** authenticated request count as activity, including background
polling, prefetches and health probes. Products whose inactivity window is meant to track
literal user interaction should leave it unregistered and renew the session from an explicit
activity endpoint instead — otherwise a tab left open keeps the session alive indefinitely.

The update is fired without being awaited and its failures are logged at debug level, so a
database hiccup delays no request and fails none.

The identifier is read from the `sid` claim without verifying the signature, which is safe here:
the middleware only renews an existing session, and a forged identifier that matches no session
changes nothing.

## Example

```typescript
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LastActiveMiddleware).forRoutes('*');
    }
}
```

## Implements

- `NestMiddleware`

## Constructors

### Constructor

```ts
new LastActiveMiddleware(sessionService, jwtService): LastActiveMiddleware;
```

Defined in: [libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts#L57)

Constructs a new instance of the `LastActiveMiddleware` class.

#### Parameters

| Parameter        | Type                                     | Description                                     |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| `sessionService` | [`SessionService`](Class.SessionService) | Session service instance                        |
| `jwtService`     | `JwtService`                             | JWT service used to read the session identifier |

#### Returns

`LastActiveMiddleware`

## Methods

### use()

```ts
use(
   req,
   _res,
   next
): void;
```

Defined in: [libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/middlewares/LastActiveMiddleware.ts#L80)

Middleware execution method.
Reads the session identifier from the Authorization header and updates lastActive
asynchronously.

#### Parameters

| Parameter | Type           | Description                      |
| --------- | -------------- | -------------------------------- |
| `req`     | `Request`      | Express request object           |
| `_res`    | `Response`     | Express response object (unused) |
| `next`    | `NextFunction` | Next middleware function         |

#### Returns

`void`

#### Remarks

Always calls `next`, whether or not a session identifier was found and whether or not the
update succeeds.

#### Implementation of

`NestMiddleware.use`
