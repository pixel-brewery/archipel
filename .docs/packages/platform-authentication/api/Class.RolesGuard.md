---
title: 'Class: RolesGuard'
generated: true
editUrl: false
---

# Class: RolesGuard

Defined in: [libs/platform-authentication/src/guards/RolesGuard.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/RolesGuard.ts#L13)

## Implements

- `CanActivate`

## Constructors

### Constructor

```ts
new RolesGuard(reflector): RolesGuard;
```

Defined in: [libs/platform-authentication/src/guards/RolesGuard.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/RolesGuard.ts#L27)

Constructs a new instance of the `RolesGuard` class.

#### Parameters

| Parameter   | Type        |
| ----------- | ----------- |
| `reflector` | `Reflector` |

#### Returns

`RolesGuard`

## Methods

### canActivate()

```ts
canActivate(context): boolean | Promise<boolean> | Observable<boolean>;
```

Defined in: [libs/platform-authentication/src/guards/RolesGuard.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/RolesGuard.ts#L38)

#### Parameters

| Parameter | Type               |
| --------- | ------------------ |
| `context` | `ExecutionContext` |

#### Returns

`boolean` \| `Promise`\<`boolean`\> \| `Observable`\<`boolean`\>

#### Implementation of

`CanActivate.canActivate`
