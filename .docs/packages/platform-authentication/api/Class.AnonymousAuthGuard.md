---
title: 'Class: AnonymousAuthGuard'
generated: true
editUrl: false
---

# Class: AnonymousAuthGuard

Defined in: [libs/platform-authentication/src/guards/AnonymousAuthGuard.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/AnonymousAuthGuard.ts#L14)

The `AnonymousAuthGuard` protects routes using anonymous authentication.

## Extends

- `IAuthGuard`

## Constructors

### Constructor

```ts
new AnonymousAuthGuard(options?): AnonymousAuthGuard;
```

Defined in: [libs/platform-authentication/src/guards/AnonymousAuthGuard.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/guards/AnonymousAuthGuard.ts#L17)

#### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| `options?` | `AuthModuleOptions` |

#### Returns

`AnonymousAuthGuard`

#### Overrides

`AuthGuard('anonymous').constructor`
