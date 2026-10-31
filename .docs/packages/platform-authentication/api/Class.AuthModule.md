---
title: 'Class: AuthModule'
generated: true
editUrl: false
---

# Class: AuthModule

Defined in: [libs/platform-authentication/src/AuthModule.ts:167](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L167)

The `AuthModule` handles JWT-based authentication,
including token creation and validation.

**Rate Limiting:** This library does not expose controllers. Consumers should
apply `@nestjs/throttler` guards on their auth endpoints (login, MFA verify)
to prevent brute-force attacks (recommended: 5 req/min per IP + username).

**OAuth CSRF Protection:** All social connectors use `state: true` which requires
a session middleware (e.g. `express-session`) to store and verify OAuth state
parameters. Ensure your application configures session middleware before using
social connectors.

## Constructors

### Constructor

```ts
new AuthModule(): AuthModule;
```

#### Returns

`AuthModule`

## Methods

### configure()

```ts
configure(consumer): void;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:297](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L297)

#### Parameters

| Parameter  | Type                 |
| ---------- | -------------------- |
| `consumer` | `MiddlewareConsumer` |

#### Returns

`void`

---

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:183](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L183)

Registers the auth module with the provided abstract base implementations.

#### Parameters

| Parameter | Type                                                 | Description                                        |
| --------- | ---------------------------------------------------- | -------------------------------------------------- |
| `options` | [`IAuthModuleOptions`](Interface.IAuthModuleOptions) | Abstract Base implementations for the auth module. |

#### Returns

`DynamicModule`

The configured dynamic module.
