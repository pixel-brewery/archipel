---
title: 'Class: JwtAuthGuard'
generated: true
editUrl: false
---

# Class: JwtAuthGuard

Defined in: [libs/platform-authentication/src/guards/JwtAuthGuard.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/JwtAuthGuard.ts#L19)

The `JwtAuthGuard` protects routes using JWT-based authentication.
It checks for the `@Public()` decorator metadata.
When registered as `APP_GUARD`, all routes require JWT authentication by default.
Routes decorated with `@Public()` are exempt.

## Extends

- `IAuthGuard`

## Constructors

### Constructor

```ts
new JwtAuthGuard(reflector): JwtAuthGuard;
```

Defined in: [libs/platform-authentication/src/guards/JwtAuthGuard.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/JwtAuthGuard.ts#L22)

#### Parameters

| Parameter   | Type        |
| ----------- | ----------- |
| `reflector` | `Reflector` |

#### Returns

`JwtAuthGuard`

#### Overrides

`AuthGuard('jwt').constructor`

## Methods

### canActivate()

```ts
canActivate(context): boolean | Promise<boolean> | Observable<boolean>;
```

Defined in: [libs/platform-authentication/src/guards/JwtAuthGuard.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/JwtAuthGuard.ts#L30)

#### Parameters

| Parameter | Type               | Description                                                                               |
| --------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `context` | `ExecutionContext` | Current execution context. Provides access to details about the current request pipeline. |

#### Returns

`boolean` \| `Promise`\<`boolean`\> \| `Observable`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

#### Overrides

`AuthGuard('jwt').canActivate`
