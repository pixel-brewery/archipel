---
title: 'Class: SocialAuthGuard'
generated: true
editUrl: false
---

# Class: SocialAuthGuard

Defined in: [libs/platform-authentication/src/guards/SocialAuthGuard.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/SocialAuthGuard.ts#L10)

## Implements

- `CanActivate`

## Constructors

### Constructor

```ts
new SocialAuthGuard(routeParam): SocialAuthGuard;
```

Defined in: [libs/platform-authentication/src/guards/SocialAuthGuard.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/SocialAuthGuard.ts#L20)

#### Parameters

| Parameter    | Type     |
| ------------ | -------- |
| `routeParam` | `string` |

#### Returns

`SocialAuthGuard`

## Methods

### canActivate()

```ts
canActivate(context): boolean | Promise<boolean> | Observable<boolean>;
```

Defined in: [libs/platform-authentication/src/guards/SocialAuthGuard.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/SocialAuthGuard.ts#L28)

#### Parameters

| Parameter | Type               | Description                                                                               |
| --------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `context` | `ExecutionContext` | Current execution context. Provides access to details about the current request pipeline. |

#### Returns

`boolean` \| `Promise`\<`boolean`\> \| `Observable`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
