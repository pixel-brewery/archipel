---
title: Transport Model & Validation Pattern
description: Standard Schema request/response models, ResponseReturn2 serialization, OpenAPI integration, and legacy class DTO fallback.
order: 2
---

# Archipel Transport Model & Validation Pattern

## Overview

New Archipel endpoints use named **Standard Schema** contracts for request
validation, response serialization, and OpenAPI. Types are inferred from the
schema rather than maintained in parallel classes. `useApi()` registers Nest's
Standard Schema validation pipe and serializer interceptor globally alongside
the legacy class-based `ValidationPipe`.

```typescript
export const UserResponseSchema = z
  .strictObject({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    createdAt: z.iso.datetime(),
  })
  .meta({ id: 'UserResponse' });
export type UserResponse = z.output<typeof UserResponseSchema>;

const UserResponseEnvelopeSchema = ResponseReturn2.schema(UserResponseSchema);

@SerializeOptions({ schema: UserResponseEnvelopeSchema })
@Api({
  responses: {
    status: HttpStatus.OK,
    standardSchema: UserResponseEnvelopeSchema,
  },
})
public async getUser(): Promise<ResponseReturn2<UserResponse>> {
  return ResponseReturn2.ok(UserResponseSchema, await this._userService.getUser());
}
```

OpenAPI publishes the full wire envelope. The generated component's
`x-archipel-envelope` metadata lets compatible generators deliberately unwrap
the `data` property. Reuse the exact data-schema object in `.schema()` and
`.ok()` so non-idempotent transforms run only once.

The remaining class-based pattern is a migration fallback for existing
endpoints or transport paths that do not yet support Standard Schema.

## Legacy global ValidationPipe

```typescript
// In main.ts bootstrap:
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Strip unknown properties
        forbidNonWhitelisted: true, // Throw on unknown properties
        transform: true, // Auto-transform payloads to DTO instances
    }),
);
```

## Legacy request DTO (input validation)

```typescript
// dtos/CreateUserRequest.ts
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
    @Expose()
    @IsEmail()
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    public email!: string;

    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty({ description: 'Display name' })
    public name!: string;

    @Expose()
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'Password (min 8 characters)' })
    public password!: string;
}
```

## Legacy response DTO (output shape)

```typescript
// dtos/UserResponse.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
    @Expose()
    @ApiProperty({ description: 'Unique identifier' })
    public id!: string;

    @Expose()
    @ApiProperty({ description: 'User email address' })
    public email!: string;

    @Expose()
    @ApiProperty({ description: 'Display name' })
    public name!: string;

    @Expose()
    @ApiProperty({ description: 'Account creation date' })
    public createdAt!: Date;

    // Note: password is intentionally NOT exposed
}
```

## Common legacy validators

### Basic Types

| Decorator         | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `@IsString()`     | Must be a string                                 |
| `@IsNumber()`     | Must be a number                                 |
| `@IsBoolean()`    | Must be a boolean                                |
| `@IsEmail()`      | Must be a valid email                            |
| `@IsUUID()`       | Must be a valid UUID                             |
| `@IsDate()`       | Must be a Date instance                          |
| `@IsEnum(MyEnum)` | Must be a value from the enum                    |
| `@IsOptional()`   | Field is optional (skip validation if undefined) |

### String Constraints

| Decorator         | Purpose                    |
| ----------------- | -------------------------- |
| `@MinLength(n)`   | Minimum string length      |
| `@MaxLength(n)`   | Maximum string length      |
| `@Matches(regex)` | Must match a regex pattern |
| `@IsNotEmpty()`   | Must not be empty string   |

### Number Constraints

| Decorator       | Purpose         |
| --------------- | --------------- |
| `@Min(n)`       | Minimum value   |
| `@Max(n)`       | Maximum value   |
| `@IsPositive()` | Must be > 0     |
| `@IsInt()`      | Must be integer |

### Nested & Array

| Decorator           | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `@ValidateNested()` | Validate nested objects                         |
| `@Type(() => Cls)`  | Transform to class instance (class-transformer) |
| `@IsArray()`        | Must be an array                                |
| `@ArrayMinSize(n)`  | Minimum array length                            |
| `@ArrayMaxSize(n)`  | Maximum array length                            |

## Cross-Field Validation

Prefer a Standard Schema refinement for fields that depend on each other. For a
legacy class DTO, use a custom class-level validator:

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
    public validate(value: unknown, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];

        return value === relatedValue;
    }

    public defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;

        return `${args.property} must match ${relatedPropertyName}`;
    }
}

// Usage in DTO:
export class ResetPasswordRequest {
    @Expose()
    @IsString()
    @MinLength(8)
    public password!: string;

    @Expose()
    @IsString()
    @Validate(MatchConstraint, ['password'])
    public confirmPassword!: string;
}
```

## Legacy query parameter DTOs

For a legacy GET request query DTO, use `@Transform()` and `@Type()` for type coercion:

```typescript
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQuery {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({ default: 1 })
    public page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @ApiPropertyOptional({ default: 20 })
    public perPage?: number = 20;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    public search?: string;
}
```

## Legacy OpenAPI / Swagger integration

### @ApiProperty Decorators

```typescript
@ApiProperty({
  description: 'User email address',
  example: 'user@example.com',
  required: true,
})
public email!: string;

@ApiPropertyOptional({
  description: 'Profile bio',
  maxLength: 500,
})
public bio?: string;
```

### Controller Response Decorators

```typescript
@Controller('/users')
@ApiTags('Users')
export class UsersController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created', type: UserResponse })
    @ApiResponse({ status: 400, description: 'Validation error' })
    public async createUser(@Body() body: CreateUserRequest): Promise<UserResponse> {
        // ...
    }
}
```

## Naming Conventions

| Type          | Naming Pattern                               | Example             |
| ------------- | -------------------------------------------- | ------------------- |
| Create input  | `Create{Entity}Request`                      | `CreateUserRequest` |
| Update input  | `Update{Entity}Request`                      | `UpdateUserRequest` |
| Query params  | `{Entity}Query` or `Pagination{Entity}Query` | `UserQuery`         |
| Response      | `{Entity}Response`                           | `UserResponse`      |
| List response | `{Entity}ListResponse`                       | `UserListResponse`  |

## Constants for Bounds

Define and reuse constants for upper limits:

```typescript
// constants/ValidationConstants.ts
export const MAX_PAGE_SIZE = 100;
export const MAX_SEARCH_LIMIT = 50;
export const MAX_NAME_LENGTH = 100;
export const MAX_BIO_LENGTH = 500;

// In DTO:
@Max(MAX_PAGE_SIZE)
public perPage?: number;
```

## Rules

1. **New contracts are named Standard Schemas** with inferred input/output types.
2. **Responses use the full `ResponseReturn2.schema(...)` envelope** for runtime serialization and OpenAPI.
3. **The exact same data-schema object is reused** by the response factory and envelope schema.
4. **204 endpoints use `@HttpCode(HttpStatus.NO_CONTENT)`**, return `Promise<void>`, and publish no response body.
5. **Cross-field validation lives in the schema** — never imperative checks in services or controllers.
6. **Legacy fallback fields use `@Expose()` and `@ApiProperty()`** for serialization and documentation.
7. **Legacy request DTOs use class-validator decorators** and the parallel global `ValidationPipe`.
8. **Upper bounds are exported constants** — never inline magic numbers.
