---
title: Controller Best Practices
description: Structure, annotate, and implement NestJS controllers following Archipel conventions — regions, Standard Schema transport contracts, guards, and the @Api decorator.
order: 4
---

# Controller Best Practices

This guide defines the canonical structure of a NestJS controller in an Archipel-powered application. Controllers are the HTTP boundary — they map transport concerns (routes, headers, status codes) to service calls and response objects. **No business logic lives here.**

If you haven't set up OpenAPI documentation yet, read the [OpenAPI & Feature Discovery](/guides/openapi-and-feature-discovery) guide first.

---

## Anatomy of a Controller

Every controller follows the same skeleton: **Imports → Class decorator → Regions (Fields, Ctor, Methods)**. No other regions are allowed.

```typescript
// #region Imports

import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { Api } from '@pixel-brewery/archipel-platform-openapi';
import { Public, ResponseReturn2, IpAddress, UserAgent } from '@pixel-brewery/archipel-platform-core';
import { JwtAuthGuard, Token, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';
import { CreateOrderRequest, OrderResponse, OrderListResponse } from '../models.js';

// #endregion

@Api({ tags: ['Orders'] })
@Controller('api/orders')
export class OrderController {
    // #region Fields

    private readonly _orderService: OrderService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `OrderController` class.
     *
     * @public
     */
    public constructor(orderService: OrderService) {
        this._orderService = orderService;
    }

    // #endregion

    // #region Methods

    // ... endpoint methods

    // #endregion
}
```

### Key Rules

| Rule                                                       | Why                                                                        |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| Controllers use **constructor injection** (not `inject()`) | Framework requires it for request-scoped providers; keeps DI explicit      |
| Private fields prefixed with `_`                           | Coding standard — distinguishes injected dependencies from local variables |
| Regions in strict order: Fields → Ctor → Methods           | Consistency across the entire codebase                                     |
| No business logic in controllers                           | Controllers are I/O adapters; logic belongs in services                    |
| No direct Prisma/repository calls                          | Services orchestrate data access; controllers never touch persistence      |

---

## Class-Level Decorators

Apply `@Api({ tags })` and `@Controller(path)` at class level. The tag groups all endpoints under a single OpenAPI section.

```typescript
@Api({ tags: ['Auth'] })
@Controller('api/auth')
export class AuthController { ... }
```

For versioned APIs, include the version in the path:

```typescript
@Api({ tags: ['Users'] })
@Controller('api/v1/users')
export class UserController { ... }
```

---

## Dependency Injection

Controllers receive services via constructor parameters. Store them in private `readonly` fields.

```typescript
// #region Fields

private readonly _userService: UserService;
private readonly _verificationService: VerificationService;
private readonly _nameGeneratorService: NameGeneratorService;

// #endregion

// #region Ctor

public constructor(
    userService: UserService,
    verificationService: VerificationService,
    nameGeneratorService: NameGeneratorService
) {
    this._userService = userService;
    this._verificationService = verificationService;
    this._nameGeneratorService = nameGeneratorService;
}

// #endregion
```

**Never** create service instances manually. NestJS resolves the dependency graph automatically via the module system.

---

## ResponseReturn2

New endpoints use `ResponseReturn2` with Standard Schema response models. It
preserves the `{ success, status, data, timestamp }` envelope while validating
and transforming the payload without a response DTO class.

```typescript
import { SerializeOptions } from '@nestjs/common';
import { ResponseReturn2 } from '@pixel-brewery/archipel-platform-core';
import { z } from 'zod';

export const UserResponseSchema = z
    .strictObject({
        id: z.string().uuid(),
        displayName: z.string(),
    })
    .meta({ id: 'UserResponse' });
export type UserResponse = z.output<typeof UserResponseSchema>;

const UserResponseEnvelopeSchema = ResponseReturn2.schema(UserResponseSchema);

@SerializeOptions({ schema: UserResponseEnvelopeSchema })
@Api({
    responses: {
        status: HttpStatus.OK,
        description: 'User found.',
        standardSchema: UserResponseEnvelopeSchema,
    },
})
public async getUser(): Promise<ResponseReturn2<UserResponse>> {
    const result = await this._userService.getUser();
    return ResponseReturn2.ok(UserResponseSchema, result);
}
```

`ResponseReturn2.ok()`, `.created()`, and `.accepted()` validate `data`
through the supplied schema. `ResponseReturn2.schema()` creates the complete
wire-envelope schema for both Nest's `StandardSchemaSerializerInterceptor` and
OpenAPI. Always reuse the exact `UserResponseSchema` object in `.schema()` and
`.ok()` so a non-idempotent data transform runs only once. The OpenAPI component
contains formal `x-archipel-envelope` metadata for envelope-aware generators.

For a bodyless response, make the HTTP status explicit and do not attach an
envelope serializer or an OpenAPI response body:

```typescript
@HttpCode(HttpStatus.NO_CONTENT)
public async deleteUser(): Promise<void> {
    await this._userService.deleteUser();
    return ResponseReturn2.noContent();
}
```

## Legacy class-based ResponseReturnBase fallback

Existing endpoints may continue returning `Promise<ResponseReturnBase<T>>` while
they still depend on decorated class DTOs. This API remains available as the
migration fallback.

### Success Responses

| Factory Method                            | HTTP Status | Use Case                               |
| ----------------------------------------- | ----------- | -------------------------------------- |
| `ResponseReturnBase.ok(Type, data)`       | 200         | Returning data (GET, POST with result) |
| `ResponseReturnBase.created(Type, data)`  | 201         | Resource creation                      |
| `ResponseReturnBase.accepted(Type, data)` | 202         | Async processing started               |
| `ResponseReturnBase.noContent()`          | 204         | Mutations with no response body        |

### Examples

```typescript
// 200 OK — return data
public async login(
    @Body() body: AuthLoginRequest
): Promise<ResponseReturnBase<AuthLoginResponse>> {
    const result = await this._userService.signIn(body.login, body.password);
    return ResponseReturnBase.ok(AuthLoginResponse, {
        accessToken: result.accessToken,
        mfaRequired: result.mfaRequired
    });
}

// 204 No Content — the decorator controls the HTTP status and suppresses the body
@HttpCode(HttpStatus.NO_CONTENT)
public async register(
    @Body() body: AuthRegisterRequest
): Promise<ResponseReturnBase<void>> {
    await this._userService.signUp(body.email, body.password, body.type);
    return ResponseReturnBase.noContent();
}
```

The first argument to `ok()` / `created()` is the **response DTO class** — `ResponseReturnBase` uses `class-transformer` internally to ensure the response matches the declared shape. This prevents accidentally leaking internal fields.

### What NOT to Do

```typescript
// ❌ BAD — inline object literal without ResponseReturnBase
public async getUser(): Promise<{ id: string; name: string }> {
    const user = await this._userService.find(id);
    return { id: user.id, name: user.name };
}

// ❌ BAD — raw service entity as response
public async getUser(): Promise<UserEntity> {
    return this._userService.find(id);
}

// ✅ GOOD — schema-native response with a named, executable contract
@SerializeOptions({ schema: UserResponseEnvelopeSchema })
public async getUser(): Promise<ResponseReturn2<UserResponse>> {
    const result = await this._userService.find(id);
    return ResponseReturn2.ok(UserResponseSchema, result);
}
```

The following decorator examples use legacy class contracts where that makes
the individual guard or routing concern easier to see. New endpoints should use
the Standard Schema request/response pattern above.

---

## Guards and Decorators

### Authentication Guard

Use `@UseGuards(JwtAuthGuard)` for protected endpoints. Extract the authenticated user with `@User()`:

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
@Api({
    auth: 'bearer',
    operation: {
        operationId: 'me',
        description: 'Gets the current user.',
        summary: 'Get current user'
    },
    responses: [{
        status: HttpStatus.OK,
        description: 'Authenticated user profile.',
        type: UserResponse
    }, {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Authentication is required.'
    }]
})
public async me(
    @User() user: IAuthSubject
): Promise<ResponseReturnBase<UserResponse>> {
    const result = await this._userService.find({ id: user.id });
    return ResponseReturnBase.ok(UserResponse, result);
}
```

### Public Routes

Mark unauthenticated endpoints with `@Public()`. This bypasses the global JWT guard if one is registered:

```typescript
@Post('register')
@Public()
public async register(@Body() body: RegisterRequest): Promise<ResponseReturnBase<void>> { ... }
```

### Token Extraction

Use `@Token()` when you need the raw JWT string (e.g., for logout or refresh):

```typescript
@Post('logout')
@HttpCode(HttpStatus.NO_CONTENT)
@UseGuards(JwtAuthGuard)
public async logout(@Token() token: string): Promise<void> {
    await this._userService.signOut(token);
}
```

### Custom Parameter Decorators

Archipel provides built-in decorators for common request data:

| Decorator      | Extracts                                        | Typical Use                                |
| -------------- | ----------------------------------------------- | ------------------------------------------ |
| `@User()`      | `request.user` as `IAuthSubject`                | Authenticated user identity                |
| `@Token()`     | Bearer token string                             | Logout, refresh                            |
| `@IpAddress()` | Client IP address                               | Audit logging, rate limiting               |
| `@UserAgent()` | User-Agent header                               | Device tracking, session metadata          |
| `@Lang()`      | First `Accept-Language` token                   | Localized responses                        |
| `@TimeZone()`  | Canonical IANA zone from the `X-Time-Zone` hint | Resolving "today" and local times per user |

`@TimeZone()` returns `undefined` when the `X-Time-Zone` header (exported as `TIME_ZONE_HEADER`) is missing, overlong or names an unknown zone, so the endpoint decides how to proceed without a time zone. Cross-origin deployments must allow the header in their CORS `allowedHeaders`.

---

## Annotating with @Api

Every endpoint **must** have an `@Api()` decorator with `operation` and `responses`. This generates accurate OpenAPI documentation.

### Minimal Annotation

```typescript
@Get()
@Api({
    operation: {
        operationId: 'listOrders',
        description: 'Lists all orders for the authenticated user.',
        summary: 'List orders'
    },
    responses: [{
        status: HttpStatus.OK,
        description: 'List of orders.',
        type: OrderListResponse
    }]
})
public async listOrders(): Promise<ResponseReturnBase<OrderListResponse>> { ... }
```

### Full Annotation with Body, Query, and Auth

```typescript
@Post('login')
@Api({
    operation: {
        operationId: 'login',
        description: 'Logs the user in and returns an access token.',
        summary: 'Authenticate user'
    },
    body: {
        description: 'Credentials used for authentication.',
        type: AuthLoginRequest
    },
    responses: [{
        status: HttpStatus.OK,
        description: 'Access token successfully generated.',
        type: AuthLoginResponse
    }, {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Provided credentials are invalid.'
    }]
})
public async login(
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
    @Body() body: AuthLoginRequest
): Promise<ResponseReturnBase<AuthLoginResponse>> { ... }
```

### Protected Endpoint with Params

```typescript
@Get(':provider')
@UseGuards(JwtAuthGuard)
@Api({
    auth: 'bearer',
    operation: {
        operationId: 'getProvider',
        description: 'Returns details about a payment provider.',
        summary: 'Get provider'
    },
    params: [{
        name: 'provider',
        description: 'Provider identifier.',
        required: true,
        type: String
    }],
    responses: [{
        status: HttpStatus.OK,
        description: 'Provider details.',
        type: ProviderResponse
    }, {
        status: HttpStatus.NOT_FOUND,
        description: 'Provider not found.'
    }]
})
```

### Query Parameters

```typescript
@Get('availability')
@Api({
    operation: {
        operationId: 'checkAvailability',
        description: 'Checks if a username is available.',
        summary: 'Check availability'
    },
    query: [{
        name: 'username',
        description: 'The username to check.',
        required: true,
        type: String
    }],
    responses: [{
        status: HttpStatus.OK,
        description: 'Availability status.',
        type: AvailabilityResponse
    }]
})
public async checkAvailability(
    @Query('username') username: string
): Promise<ResponseReturnBase<AvailabilityResponse>> { ... }
```

---

## Method Naming Conventions

Controller methods should clearly reflect the action and resource:

| Pattern                 | HTTP Method      | Example                                                        |
| ----------------------- | ---------------- | -------------------------------------------------------------- |
| `listX`                 | GET (collection) | `listOrders()`                                                 |
| `getX` / `X`            | GET (single)     | `getOrder()`, `me()`                                           |
| `createX` / domain verb | POST             | `createOrder()`, `login()`, `register()`                       |
| `updateX`               | PUT / PATCH      | `updateProfile()`                                              |
| `deleteX`               | DELETE           | `deleteOrder()`                                                |
| `verbNoun`              | POST (action)    | `changePassword()`, `forgotPassword()`, `resendVerification()` |

Methods are always `public async`. Endpoints with a body return
`Promise<ResponseReturn2<T>>` on the schema-native path (or
`Promise<ResponseReturnBase<T>>` for a legacy class contract); 204 endpoints return
`Promise<void>` and declare `@HttpCode(HttpStatus.NO_CONTENT)`.

---

## Rate Limiting

Use `@Throttle()` from `@nestjs/throttler` for endpoints that need rate limiting:

```typescript
import { Throttle } from '@nestjs/throttler';

@Get('availability')
@Public()
@Throttle({ default: { limit: 10, ttl: 60000 } })
public async checkAvailability(
    @Query('username') username: string
): Promise<ResponseReturnBase<AvailabilityResponse>> { ... }
```

Always document the rate limit in the `@Api` responses:

```typescript
responses: [
    {
        status: HttpStatus.OK,
        description: 'Availability result.',
    },
    {
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'Rate limit exceeded (max 10 requests per minute).',
    },
];
```

---

## Social Authentication Pattern

Social login uses a guard factory and a two-endpoint flow: initiate → callback.

```typescript
@Public()
@Get('social/:provider')
@UseGuards(socialAuthGuardFactory(':provider'))
@Api({
    operation: {
        operationId: 'socialAuthentication',
        description: 'Redirects the user to the social provider.',
        summary: 'Start social authentication'
    },
    params: [{
        name: 'provider',
        description: 'Authentication provider (github, google, microsoft, apple).',
        required: true,
        type: String
    }],
    responses: [{
        status: HttpStatus.TEMPORARY_REDIRECT,
        description: 'Redirects to the social provider.'
    }]
})
public async socialAuthentication(): Promise<void> {
    // Guard handles the redirect flow.
}

@Public()
@Get('social/:provider/callback')
@UseGuards(socialAuthGuardFactory(':provider'))
@Api({
    operation: {
        operationId: 'socialAuthenticationCallback',
        description: 'Handles the callback from the authentication provider.',
        summary: 'Handle social callback'
    },
    params: [{
        name: 'provider',
        description: 'Authentication provider that initiated the callback.',
        required: true,
        type: String
    }],
    responses: [{
        status: HttpStatus.TEMPORARY_REDIRECT,
        description: 'Redirects to the application.'
    }]
})
public async socialAuthenticationCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
): Promise<void> {
    const user = req.user as IAuthSubject;
    await new Promise<void>((resolve, reject) => {
        req.login(user, (err) => err ? reject(err) : resolve());
    });

    const redirectUri = (req.authInfo as { state: { redirectUri?: string } }).state?.redirectUri;
    res.redirect(redirectUri ?? '/');
}
```

> **Note:** Social callback endpoints are the only place where `@Req()` and `@Res()` are acceptable. In all other endpoints, use typed parameter decorators (`@Body()`, `@Query()`, `@User()`, etc.).

---

## Complete legacy controller example

Below is a legacy class-based authentication controller retained as a migration
reference. Prefer the schema-native pattern above for new controllers. Its 204
methods must use `@HttpCode(HttpStatus.NO_CONTENT)` in production.

```typescript
// #region Imports

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Api } from '@pixel-brewery/archipel-platform-openapi';
import { IpAddress, Public, ResponseReturnBase, UserAgent } from '@pixel-brewery/archipel-platform-core';
import { type IAuthSubject, JwtAuthGuard, Token, User, socialAuthGuardFactory } from '@pixel-brewery/archipel-platform-authentication';
import {
    AuthLoginRequest,
    AuthLoginResponse,
    AuthRefreshResponse,
    AuthRegisterRequest,
    AuthChangePasswordRequest,
    AuthForgotPasswordRequest,
    AuthVerifyPinRequest,
    AuthVerifyResponse,
    UserResponse,
} from '../models.js';

// #endregion

@Api({ tags: ['Auth'] })
@Controller('api/auth')
export class AuthController {
    // #region Fields

    private readonly _userService: UserService;
    private readonly _verificationService: VerificationService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `AuthController` class.
     *
     * @public
     */
    public constructor(userService: UserService, verificationService: VerificationService) {
        this._userService = userService;
        this._verificationService = verificationService;
    }

    // #endregion

    // #region Methods

    /**
     * Logs the user in and returns an access token.
     *
     * @public
     */
    @Post('login')
    @Api({
        operation: {
            operationId: 'login',
            description: 'Logs the user in and returns an access token.',
            summary: 'Authenticate user',
        },
        body: {
            description: 'Credentials used for authentication.',
            type: AuthLoginRequest,
        },
        responses: [
            {
                status: HttpStatus.OK,
                description: 'Access token successfully generated.',
                type: AuthLoginResponse,
            },
            {
                status: HttpStatus.UNAUTHORIZED,
                description: 'Provided credentials are invalid.',
            },
        ],
    })
    public async login(
        @IpAddress() ipAddress: string,
        @UserAgent() userAgent: string,
        @Body() body: AuthLoginRequest,
    ): Promise<ResponseReturnBase<AuthLoginResponse>> {
        const result = await this._userService.signIn(body.login, body.password, ipAddress, userAgent);
        return ResponseReturnBase.ok(AuthLoginResponse, {
            accessToken: result.accessToken,
            mfaRequired: result.mfaRequired,
        });
    }

    /**
     * Logs the user out.
     *
     * @public
     */
    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Api({
        auth: 'bearer',
        operation: {
            operationId: 'logout',
            description: 'Logs the authenticated user out.',
            summary: 'Log out user',
        },
        responses: [
            {
                status: HttpStatus.NO_CONTENT,
                description: 'User has been logged out.',
            },
            {
                status: HttpStatus.UNAUTHORIZED,
                description: 'Authentication is required.',
            },
        ],
    })
    public async logout(@Token() token: string): Promise<void> {
        await this._userService.signOut(token);
    }

    /**
     * Registers a new user.
     *
     * @public
     */
    @Post('register')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Api({
        operation: {
            operationId: 'register',
            description: 'Registers a new user.',
            summary: 'Register user',
        },
        body: {
            description: 'Registration payload.',
            type: AuthRegisterRequest,
        },
        responses: [
            {
                status: HttpStatus.NO_CONTENT,
                description: 'The user has been registered.',
            },
            {
                status: HttpStatus.BAD_REQUEST,
                description: 'Email or password are missing.',
            },
            {
                status: HttpStatus.CONFLICT,
                description: 'The email address is already registered.',
            },
        ],
    })
    public async register(@Body() body: AuthRegisterRequest): Promise<void> {
        await this._userService.signUp(body.email, body.password, body.type, {
            avatar: body.profile?.avatar,
            firstName: body.profile?.firstName,
            lastName: body.profile?.lastName,
            userName: body.profile?.userName,
        });
    }

    /**
     * Gets the current user.
     *
     * @public
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @Api({
        auth: 'bearer',
        operation: {
            operationId: 'me',
            description: 'Gets the current user.',
            summary: 'Get current user',
        },
        responses: [
            {
                status: HttpStatus.OK,
                description: 'Authenticated user profile.',
                type: UserResponse,
            },
            {
                status: HttpStatus.UNAUTHORIZED,
                description: 'Authentication is required.',
            },
        ],
    })
    public async me(@User() user: IAuthSubject): Promise<ResponseReturnBase<UserResponse>> {
        const result = await this._userService.find({ id: user.id });
        return ResponseReturnBase.ok(UserResponse, result);
    }

    /**
     * Changes the password.
     *
     * @public
     */
    @Post('change-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Api({
        auth: 'bearer',
        operation: {
            operationId: 'changePassword',
            description: "Changes the authenticated user's password.",
            summary: 'Change password',
        },
        body: {
            description: 'Payload containing the new password.',
            type: AuthChangePasswordRequest,
        },
        responses: [
            {
                status: HttpStatus.NO_CONTENT,
                description: 'Password has been changed.',
            },
            {
                status: HttpStatus.UNAUTHORIZED,
                description: 'Authentication is required.',
            },
        ],
    })
    public async changePassword(@Body() body: AuthChangePasswordRequest, @User() user: IAuthSubject): Promise<void> {
        await this._userService.changePassword({ id: user.id }, body.password);
    }

    /**
     * Sends a password reset email.
     *
     * @public
     */
    @Post('forgot-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Api({
        operation: {
            operationId: 'forgotPassword',
            description: 'Sends a password reset email.',
            summary: 'Forgot password',
        },
        body: {
            description: 'Payload identifying the account.',
            type: AuthForgotPasswordRequest,
        },
        responses: [
            {
                status: HttpStatus.NO_CONTENT,
                description: 'Password reset instructions sent.',
            },
            {
                status: HttpStatus.BAD_REQUEST,
                description: 'Login identifier is missing.',
            },
        ],
    })
    public async forgotPassword(@Body() body: AuthForgotPasswordRequest): Promise<void> {
        await this._userService.forgotPassword(body.login);
    }

    // #endregion
}
```

---

## Checklist

Before submitting a controller, verify:

- [ ] Class has `@Api({ tags })` and `@Controller(path)` decorators
- [ ] Every method has `@Api()` with `operation` and `responses`
- [ ] Protected endpoints use `@UseGuards(JwtAuthGuard)` and `@Api({ auth: 'bearer' })`
- [ ] Public endpoints have `@Public()` decorator
- [ ] Schema-native response methods return `Promise<ResponseReturn2<T>>`; legacy class contracts use `ResponseReturnBase<T>`
- [ ] 204 methods declare `@HttpCode(HttpStatus.NO_CONTENT)`, return `Promise<void>`, and publish no response body schema
- [ ] The same named data schema object is reused by `ResponseReturn2.schema()` and the response factory
- [ ] OpenAPI publishes the complete `ResponseReturn2` wire-envelope schema
- [ ] No business logic — only delegation to services
- [ ] No direct repository or Prisma calls
- [ ] Constructor injection with private `readonly` fields
- [ ] Regions: Fields → Ctor → Methods (no other regions)
- [ ] TSDoc on every public method
- [ ] Rate-limited endpoints document `TOO_MANY_REQUESTS` response
