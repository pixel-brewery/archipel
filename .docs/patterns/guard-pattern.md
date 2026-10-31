---
title: Guard & Interceptor Pattern
description: Metadata decorators, FeatureGuard, RolesGuard, FeatureUsageInterceptor, and the full decorator-guard-interceptor trio.
order: 4
---

# Archipel Guard & Interceptor Pattern

## Overview

Archipel uses a **metadata-driven** guard and interceptor pattern. A custom decorator
attaches metadata (e.g., a feature key or role) to the handler. The guard reads this
metadata to decide access. An optional interceptor runs after the handler to record
usage or perform side effects.

This creates a reusable trio: **Decorator → Guard → Interceptor**.

## Guard Architecture

```
@RequiresFeature('create-posts')       ← Decorator sets metadata
@UseGuards(JwtAuthGuard, FeatureGuard) ← Guard reads metadata, checks access
@UseInterceptors(FeatureUsageInterceptor) ← Interceptor records usage after success
```

## Available Guards

| Guard                | Strategy                 | Purpose                                        |
| -------------------- | ------------------------ | ---------------------------------------------- |
| `JwtAuthGuard`       | jwt                      | Validates JWT bearer token                     |
| `LocalAuthGuard`     | local                    | Validates username + password                  |
| `AnonymousAuthGuard` | anonymous                | Allows unauthenticated access with a seed user |
| `GithubAuthGuard`    | github                   | OAuth via GitHub                               |
| `RolesGuard`         | metadata                 | Checks user roles against required roles       |
| `FeatureGuard`       | metadata + abstract base | Checks feature access via FeatureAccessBase    |

## The Feature Guard Pattern (Full Example)

### Step 1: Metadata Decorator

```typescript
import { SetMetadata } from '@nestjs/common';

export const FEATURE_KEY_METADATA = 'feature_key';

export const RequiresFeature = (featureKey: string) => SetMetadata(FEATURE_KEY_METADATA, featureKey);
```

### Step 2: Guard

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureAccessBase } from '../abstracts/FeatureAccessBase.js';
import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';

@Injectable()
export class FeatureGuard implements CanActivate {
    // #region Fields

    private readonly _featureAccess: FeatureAccessBase;
    private readonly _reflector: Reflector;

    // #endregion

    // #region Ctor

    public constructor(featureAccess: FeatureAccessBase, reflector: Reflector) {
        this._featureAccess = featureAccess;
        this._reflector = reflector;
    }

    // #endregion

    // #region Methods

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const featureKey = this._reflector.getAllAndOverride<string | undefined>(FEATURE_KEY_METADATA, [context.getHandler(), context.getClass()]);

        if (!featureKey) {
            return true; // No feature requirement on this endpoint
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = typeof user?.id === 'number' ? String(user.id) : user?.id;

        if (!userId) {
            return false;
        }

        const accessContext: IFeatureAccessContext = {
            userId,
            tenantId: user?.tenantId,
            subject: user,
        };
        const access = await this._featureAccess.checkAccess(userId, featureKey, accessContext);
        request.featureAccess = access; // Attach for downstream use

        return access.allowed;
    }

    // #endregion
}
```

### Step 3: Interceptor (records usage after success)

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class FeatureUsageInterceptor implements NestInterceptor {
    // #region Fields

    private readonly _featureAccess: FeatureAccessBase;
    private readonly _reflector: Reflector;

    // #endregion

    // #region Ctor

    public constructor(featureAccess: FeatureAccessBase, reflector: Reflector) {
        this._featureAccess = featureAccess;
        this._reflector = reflector;
    }

    // #endregion

    // #region Methods

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const featureKey = this._reflector.getAllAndOverride<string | undefined>(FEATURE_KEY_METADATA, [context.getHandler(), context.getClass()]);

        if (!featureKey) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = typeof user?.id === 'number' ? String(user.id) : user?.id;

        return next.handle().pipe(
            tap(async () => {
                if (userId) {
                    const accessContext: IFeatureAccessContext = {
                        userId,
                        tenantId: user?.tenantId,
                        subject: user,
                    };
                    await this._featureAccess.recordUsage(userId, featureKey, accessContext);
                }
            }),
        );
    }

    // #endregion
}
```

The context object lets adapters evaluate tenant-specific plans or inspect claims from the authenticated subject without pushing billing concerns into controllers.

### Step 4: Controller Usage

```typescript
@Controller('/posts')
export class PostsController {
    @Post()
    @RequiresFeature('create-posts')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @UseInterceptors(FeatureUsageInterceptor)
    public async createPost(@Body() body: CreatePostRequest): Promise<PostResponse> {
        const entity = await this._postService.create(body);

        return this._mappingService.map(POST_MAPPING_KEY, entity);
    }
}
```

## Roles Guard Pattern

```typescript
// Decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Guard
@Injectable()
export class RolesGuard implements CanActivate {

  public constructor(private readonly _reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }

}

// Usage
@Get('/admin')
@Roles('admin', 'superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
public async getAdminPanel(): Promise<AdminResponse> { ... }
```

## Telemetry Interceptor

```typescript
@Injectable()
export class OperationTelemetryInterceptor implements NestInterceptor {
    private readonly _facade: ITelemetryFacade;

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const handler = context.getHandler().name;
        const cls = context.getClass().name;
        // ... start span, capture duration, record outcome
        return next.handle();
    }
}
```

## How to Create a Custom Guard + Interceptor Pair

### Step 1: Define the metadata key and decorator

```typescript
export const RATE_LIMIT_METADATA = 'rate_limit';
export const RateLimit = (maxRequests: number) => SetMetadata(RATE_LIMIT_METADATA, maxRequests);
```

### Step 2: Create the guard

Read metadata via `Reflector`, check the condition, return boolean.

### Step 3: Create the interceptor (optional)

Use `tap()` in the RxJS pipeline to perform post-handler side effects.

### Step 4: Register in the module

Export guard and interceptor from the library module so consumers can apply them.

## Rules

1. **Guards decide access** — return `true` or `false`, never throw directly.
2. **Interceptors handle side effects** — recording, logging, transforming responses.
3. **Metadata decorators are the glue** — they attach config to handlers, read by guards/interceptors.
4. **Auth guards extend Passport's AuthGuard** — e.g. `AuthGuard('jwt')`.
5. **Feature guards delegate to abstract bases** — the guard itself holds no business logic.
6. **Guard order matters** — `@UseGuards(AuthGuard, FeatureGuard)`: auth runs first.
7. **Interceptors use `tap()`** for post-handler logic, `map()` for response transformation.
