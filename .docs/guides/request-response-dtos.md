---
title: Request & Response Models
description: Standard Schema request and response contracts, with decorated class DTOs as the migration fallback for Archipel NestJS applications.
order: 4
---

# Request & Response Models

New Archipel endpoints define request and response contracts as named Standard
Schemas and infer their TypeScript types from those schemas. This keeps runtime
validation, response serialization, OpenAPI, and static types on one source of
truth. Decorated class DTOs remain supported for existing endpoints and for
paths where Nest's Standard Schema integration is unavailable.

For controller usage with `ResponseReturn2`, see the [Controller Best Practices](/guides/controller-best-practices) guide.

```typescript
export const AuthLoginRequestSchema = z
    .strictObject({
        login: z.string().min(1),
        password: z.string().min(8),
    })
    .meta({ id: 'AuthLoginRequest' });
export type AuthLoginRequest = z.input<typeof AuthLoginRequestSchema>;

export const AuthLoginResponseSchema = z
    .strictObject({
        accessToken: z.string(),
        mfaRequired: z.boolean(),
    })
    .meta({ id: 'AuthLoginResponse' });
export type AuthLoginResponse = z.output<typeof AuthLoginResponseSchema>;
```

---

## Naming Conventions

Transport models follow a strict naming pattern. Add `Schema` to the runtime
schema constant and use the unsuffixed name for its inferred type:

| Type                  | Pattern                      | Example                                    |
| --------------------- | ---------------------------- | ------------------------------------------ |
| Create request        | `Create{Resource}Request`    | `CreateOrderRequest`                       |
| Update request        | `Update{Resource}Request`    | `UpdateProfileRequest`                     |
| Action request        | `{Action}{Resource}Request`  | `AuthLoginRequest`, `AuthVerifyPinRequest` |
| Single response       | `{Resource}Response`         | `UserResponse`, `OrderResponse`            |
| List response         | `{Resource}ListResponse`     | `OrderListResponse`                        |
| Action response       | `{Action}{Resource}Response` | `AuthLoginResponse`, `AuthRefreshResponse` |
| Availability / status | `{Resource}{Status}Response` | `AuthUsernameAvailabilityResponse`         |

### Grouping by Feature

When a controller has many transport models, prefix them with the feature name to keep imports clean:

```typescript
// Auth feature DTOs
AuthLoginRequest;
AuthLoginResponse;
AuthRegisterRequest;
AuthRefreshResponse;
AuthChangePasswordRequest;
AuthChangeEmailRequest;
AuthForgotPasswordRequest;
AuthVerifyPinRequest;
AuthVerifyResponse;
AuthResendVerificationRequest;
AuthUsernameSuggestionsResponse;
AuthUsernameAvailabilityResponse;
AuthAvatarSuggestionResponse;
```

All transport contracts for a feature are exported from a `models/` barrel file:

```typescript
// models/index.ts
export { AuthLoginRequestSchema, type AuthLoginRequest } from './AuthLoginRequest.js';
export { AuthLoginResponseSchema, type AuthLoginResponse } from './AuthLoginResponse.js';
export { AuthRegisterRequestSchema, type AuthRegisterRequest } from './AuthRegisterRequest.js';
// ...
```

---

## File Organization

Keep one transport contract per file, named after the contract. A Standard
Schema constant and its inferred type are the two facets of that one contract.

```
src/
  auth/
    models/
      AuthLoginRequest.ts
      AuthLoginResponse.ts
      AuthRegisterRequest.ts
      AuthRefreshResponse.ts
      UserResponse.ts
      index.ts
    AuthController.ts
    AuthModule.ts
```

---

## Legacy request DTOs (fallback)

The following class-based examples apply to endpoints that cannot migrate yet.
They use `class-validator` and `@ApiProperty` from `@nestjs/swagger`.

### Basic Request

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthLoginRequest {
    /**
     * The user's email address or username.
     *
     * @public
     */
    @ApiProperty({ description: 'Email address or username.' })
    @IsNotEmpty()
    @IsString()
    public login!: string;

    /**
     * The user's password.
     *
     * @public
     */
    @ApiProperty({ description: 'Account password.' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    public password!: string;
}
```

### Request with Optional Fields

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthRegisterRequest {
    @ApiProperty({ description: 'Email address for the new account.' })
    @IsNotEmpty()
    @IsEmail()
    public email!: string;

    @ApiProperty({ description: 'Password for the new account.', minLength: 8 })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    public password!: string;

    @ApiProperty({ description: 'Account type.', example: 'personal' })
    @IsNotEmpty()
    @IsString()
    public type!: string;

    @ApiPropertyOptional({ description: 'Optional profile information.' })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProfilePayload)
    public profile?: ProfilePayload;
}
```

### Nested Payloads

When a request contains nested objects, define them as separate classes with `@ValidateNested()` and `@Type()`:

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfilePayload {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public avatar?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public firstName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public lastName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public userName?: string;
}
```

---

## Legacy response DTOs (fallback)

Response DTOs use `@ApiProperty` for documentation and `@Expose()` from `class-transformer` for serialization control.

### Basic Response

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthLoginResponse {
    @ApiProperty({ description: 'JWT access token.' })
    @Expose()
    public accessToken!: string;

    @ApiProperty({ description: 'Whether multi-factor authentication is required.' })
    @Expose()
    public mfaRequired!: boolean;
}
```

### Response with Optional Fields

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthLoginResponse {
    @ApiProperty({ description: 'JWT access token.' })
    @Expose()
    public accessToken!: string;

    @ApiProperty({ description: 'Whether MFA is required.' })
    @Expose()
    public mfaRequired!: boolean;

    @ApiProperty({ description: 'Whether email verification is required.' })
    @Expose()
    public verificationRequired!: boolean;

    @ApiPropertyOptional({ description: 'MFA challenge identifier.' })
    @Expose()
    public challengeId?: string;

    @ApiPropertyOptional({ description: 'Available MFA methods.', type: [String] })
    @Expose()
    public methods?: Array<string>;

    @ApiPropertyOptional({ description: 'Preferred MFA method.' })
    @Expose()
    public preferredMethod?: string;
}
```

### User / Entity Response

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponse {
    @ApiProperty({ description: 'Unique user identifier.' })
    @Expose()
    public id!: string;

    @ApiProperty({ description: 'Email address.' })
    @Expose()
    public email!: string;

    @ApiPropertyOptional({ description: 'Display username.' })
    @Expose()
    public userName?: string;

    @ApiPropertyOptional({ description: 'First name.' })
    @Expose()
    public firstName?: string;

    @ApiPropertyOptional({ description: 'Last name.' })
    @Expose()
    public lastName?: string;

    @ApiPropertyOptional({ description: 'Avatar URL or base64 image.' })
    @Expose()
    public avatar?: string;

    @ApiProperty({ description: 'Whether the email is verified.' })
    @Expose()
    public isVerified!: boolean;
}
```

---

## Schema-Native Responses

For new endpoints, define the response as a Standard Schema and return it with
`ResponseReturn2`. The schema replaces both the response class and its
`class-transformer` decorators.

```typescript
export const AuthLoginResponseSchema = z
    .strictObject({
        accessToken: z.string(),
        mfaRequired: z.boolean(),
    })
    .meta({ id: 'AuthLoginResponse' });
export type AuthLoginResponse = z.output<typeof AuthLoginResponseSchema>;

const AuthLoginEnvelopeSchema = ResponseReturn2.schema(AuthLoginResponseSchema);

@SerializeOptions({ schema: AuthLoginEnvelopeSchema })
@Api({
    responses: {
        status: HttpStatus.OK,
        standardSchema: AuthLoginEnvelopeSchema,
    },
})
public async login(): Promise<ResponseReturn2<AuthLoginResponse>> {
    return ResponseReturn2.ok(AuthLoginResponseSchema, await this._authService.login());
}
```

Use the complete `AuthLoginEnvelopeSchema` in OpenAPI metadata because it is the
actual wire body. Its `x-archipel-envelope` metadata lets envelope-aware client
generators identify and unwrap `data` without changing the published contract.
Reuse the exact `AuthLoginResponseSchema` object in both `.schema()` and `.ok()`
so non-idempotent transforms execute only once.

## How the legacy ResponseReturnBase uses DTOs

When a controller calls `ResponseReturnBase.ok(AuthLoginResponse, data)`, the response pipeline:

1. Instantiates `AuthLoginResponse` via `class-transformer`'s `plainToInstance()`
2. Applies `@Expose()` / `@Exclude()` rules — only explicitly exposed fields appear in the output
3. Wraps the result in the standard envelope: `{ success, status, data, timestamp }`

This means the DTO class **controls what the client sees**. Even if the service returns extra fields, they won't leak unless the DTO exposes them.

```typescript
// Service returns: { id, email, password, internalFlag, ... }
// DTO only exposes: { id, email, userName }
// Client receives:  { success: true, status: 200, data: { id, email, userName }, timestamp: ... }
```

---

## Validation Pipeline

Archipel applications register Standard Schema validation and response
serialization globally. The legacy `ValidationPipe` remains active in parallel
for decorated class DTOs, with strict settings:

```typescript
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Strip properties not in the DTO
        forbidNonWhitelisted: true, // Throw if unknown properties are sent
        transform: true, // Auto-transform payloads to DTO instances
    }),
);
```

This means:

- Properties without decorators are **silently removed** (`whitelist`)
- Unknown properties cause a **400 Bad Request** (`forbidNonWhitelisted`)
- Request bodies are automatically transformed to class instances (`transform`)

---

## Cross-Field Validation

For Standard Schema contracts, express cross-field rules in the schema so the
same constraint drives runtime validation and documentation where supported:

```typescript
const ContactRequestSchema = z
    .strictObject({
        email: z.email().optional(),
        phone: z.string().optional(),
    })
    .refine((value) => Boolean(value.email) !== Boolean(value.phone), {
        message: 'Exactly one of email or phone must be provided.',
    });
```

For a legacy class DTO, implement a reusable custom class-level validator:

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, Validate, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'eitherEmailOrPhone', async: false })
export class EitherEmailOrPhoneConstraint implements ValidatorConstraintInterface {
    public validate(_: unknown, args: ValidationArguments): boolean {
        const obj = args.object as { email?: string; phone?: string };
        return Boolean(obj.email) !== Boolean(obj.phone);
    }

    public defaultMessage(): string {
        return 'Exactly one of email or phone must be provided.';
    }
}

@Validate(EitherEmailOrPhoneConstraint)
export class ContactRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    public email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public phone?: string;
}
```

**Never** do cross-field validation in controllers or services. Keep it in the
Standard Schema or, for a legacy DTO, a reusable class-level validator.

---

## Constants for Limits

Define and reuse constants for bounds that appear in validation and pagination:

```typescript
// constants.ts
export const MAX_PAGE_SIZE = 100;
export const MAX_SEARCH_LIMIT = 50;
export const DEFAULT_PAGE_SIZE = 20;
```

```typescript
import { Max, Min, IsOptional, IsInt } from 'class-validator';
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '../constants.js';

export class PaginationQuery {
    @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE, maximum: MAX_PAGE_SIZE })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(MAX_PAGE_SIZE)
    public limit?: number = DEFAULT_PAGE_SIZE;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    public offset?: number = 0;
}
```

---

## Checklist

Before submitting transport contracts, verify:

- [ ] New contracts use a named Standard Schema plus an inferred input/output type
- [ ] One contract per file, exported from `models/index.ts`
- [ ] Response OpenAPI metadata and `@SerializeOptions` use the complete `ResponseReturn2.schema(...)` envelope
- [ ] `ResponseReturn2.schema()` and its response factory reuse the exact same data-schema object
- [ ] Legacy request DTOs have `class-validator` decorators on every property
- [ ] Legacy response DTOs have `@Expose()` on every public property
- [ ] Legacy nested objects use `@ValidateNested()` + `@Type()`
- [ ] Legacy properties have `@ApiProperty` or `@ApiPropertyOptional`
- [ ] No `any` types — use `unknown` or specific types
- [ ] Cross-field validation lives in the Standard Schema or a legacy class-level validator, never imperative controller/service code
- [ ] Pagination limits use shared constants with `@Max()`
