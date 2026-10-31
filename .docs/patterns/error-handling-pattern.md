---
title: Error Handling Pattern
description: Platform errors, RepositoryError, exception filters, and structured error responses.
order: 3
---

# Archipel Error Handling Pattern

## Overview

Archipel exposes errors for its platform capabilities. HTTP-facing errors can
extend `ProblemDetailException`; infrastructure failures such as
`RepositoryError` stay in their owning library and use a dedicated filter.
Application business-domain errors belong to the consuming application.

## Layer Architecture

```
HTTP-facing platform service → ProblemDetailException → ProblemDetailExceptionFilter → Problem Details
```

## Base Error Classes

### ProblemDetailException

HTTP-facing platform errors can extend `ProblemDetailException` from
`platform-core` with an explicit HTTP status, title, detail, and stable code.
Nest recognizes the HTTP status directly. `ProblemDetailExceptionFilter`
renders the response as `application/problem+json`.

### RepositoryError

Thrown when any Prisma operation fails. Automatically wrapped by `RepositoryBase.tryCatch()`.

```typescript
// models/errors/RepositoryError.ts
export class RepositoryError extends Error {
    public constructor(message: string, originalCode?: string, meta?: Record<string, unknown>, kind: RepositoryErrorKind = RepositoryErrorKinds.Unclassified) {
        super(message);
        Object.setPrototypeOf(this, RepositoryError.prototype);
        this.name = 'RepositoryError';
        this.originalCode = originalCode;
        this.meta = meta;
        this.kind = kind;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RepositoryError);
        }
    }

    public readonly code = 'REPOSITORY_ERROR';
    public readonly originalCode?: string;
    public readonly meta?: Record<string, unknown>;
    public readonly kind: RepositoryErrorKind;
}
```

`kind` classifies the failure as `unique-constraint-violation` (`P2002`), `record-not-found` (`P2025`), or `unclassified`. A consuming application can translate an expected database failure into its own error where the write happens:

```typescript
return query<LocationDelegate, LocationModel>('createLocation', (model) =>
    translateUniqueConstraintViolation(
        () => model.create({ data }),
        () => new LocationNameAlreadyExistsError(data.name),
    ),
);
```

`translateRevisionConflict` does the same for a revision-bound (compare-and-swap) write whose filter includes the observed revision; `isUniqueConstraintViolation` and `isRecordNotFound` test a caught failure.

### MappingErrorBase (abstract)

Base for mapping-related errors.

```typescript
export abstract class MappingErrorBase extends Error {
    public readonly code: string;

    protected constructor(message: string, code: string) {
        super(message);
        this.code = code;
    }
}
```

Concrete variants:

- `MappingNotRegisteredError` — code: `'MAPPING_NOT_REGISTERED'`
- `TypeMappingNotRegisteredError` — code: `'TYPE_MAPPING_NOT_REGISTERED'`

## Exception Filters

### RepositoryExceptionFilter

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { RepositoryError } from '../models/errors/RepositoryError.js';

@Catch(RepositoryError)
export class RepositoryExceptionFilter implements ExceptionFilter<RepositoryError> {
    public catch(_exception: RepositoryError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            error: 'Repository Error',
            path: request.url,
        });
    }
}
```

### Registration (in main.ts or AppModule)

```typescript
app.useGlobalFilters(new RepositoryExceptionFilter());
```

## Consuming Application Errors

The following `UserNotFoundError` is an example owned by an application using
Archipel. It is not a platform error supplied by Archipel.

### Step 1: Define the error class

```typescript
// models/errors/UserNotFoundError.ts
export class UserNotFoundError extends Error {
    public readonly code = 'USER_NOT_FOUND';
    public readonly userId: string;

    public constructor(userId: string) {
        super(`User not found: ${userId}`);
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
        this.name = 'UserNotFoundError';
        this.userId = userId;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotFoundError);
        }
    }
}
```

### Step 2: Create an exception filter

```typescript
// filters/UserNotFoundExceptionFilter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserNotFoundError } from '../models/errors/UserNotFoundError.js';

@Catch(UserNotFoundError)
export class UserNotFoundExceptionFilter implements ExceptionFilter<UserNotFoundError> {
    public catch(exception: UserNotFoundError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            timestamp: new Date().toISOString(),
            error: exception.code,
            message: exception.message,
            path: request.url,
        });
    }
}
```

### Step 3: Register the filter globally

```typescript
app.useGlobalFilters(new RepositoryExceptionFilter(), new UserNotFoundExceptionFilter());
```

### Step 4: Throw from a service

```typescript
@Injectable()
export class UserService {
    public async findById(id: string): Promise<IUserEntity> {
        const user = await this._userRepository.execute(findUserByIdQuery(id));

        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }
}
```

## Response Envelope Convention

The custom application filter above produces this response shape:

```json
{
    "statusCode": 404,
    "timestamp": "2026-04-05T12:00:00.000Z",
    "error": "USER_NOT_FOUND",
    "message": "User not found: abc-123",
    "path": "/api/v1/users/abc-123"
}
```

## Prisma Error Code Reference

Common Prisma error codes wrapped by `RepositoryError`:

| Code  | Meaning                          |
| ----- | -------------------------------- |
| P2000 | Value too long                   |
| P2002 | Unique constraint violation      |
| P2003 | Foreign key constraint violation |
| P2025 | Record not found                 |

## Rules

1. **Keep ownership clear** — Archipel supplies platform errors; consuming applications supply business-domain errors.
2. **Use the appropriate HTTP mapping** — HTTP-facing platform errors can extend `ProblemDetailException`; infrastructure and application errors can use dedicated filters.
3. **Error classes include a machine-readable `code`** — used for client-side error handling.
4. **Use `Object.setPrototypeOf`** and `Error.captureStackTrace` in custom Error subclasses.
5. **Don't leak internal details** — the filter should not expose Prisma error codes or stack traces.
6. **Register filters globally** in the bootstrap function or via `APP_FILTER` provider.
