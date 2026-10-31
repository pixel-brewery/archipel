---
title: 'Class: LocalAuthGuard'
generated: true
editUrl: false
---

# Class: LocalAuthGuard

Defined in: [libs/platform-authentication/src/guards/LocalAuthGuard.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/LocalAuthGuard.ts#L14)

The `LocalAuthGuard` protects routes using local authentication.

## Extends

- `IAuthGuard`

## Constructors

### Constructor

```ts
new LocalAuthGuard(options?): LocalAuthGuard;
```

Defined in: [libs/platform-authentication/src/guards/LocalAuthGuard.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/LocalAuthGuard.ts#L17)

#### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| `options?` | `AuthModuleOptions` |

#### Returns

`LocalAuthGuard`

#### Overrides

`AuthGuard('local').constructor`
