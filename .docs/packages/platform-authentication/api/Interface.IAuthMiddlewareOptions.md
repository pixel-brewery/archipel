---
title: 'Interface: IAuthMiddlewareOptions'
generated: true
editUrl: false
---

# Interface: IAuthMiddlewareOptions

Defined in: [libs/platform-authentication/src/AuthModule.ts:133](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L133)

Configuration for the auth module's middleware registration.

## Properties

### lastActive?

```ts
lastActive?: boolean;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:139](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L139)

Configuration for the last-active tracking middleware.

- `true` or `undefined`: enabled for all routes (default)
- `false`: disabled entirely

---

### requestSizeLimit?

```ts
requestSizeLimit?: string | false;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:147](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L147)

Configuration for the request size limit middleware on the register endpoint.

- `undefined`: enabled with default path `'auth/register'`
- `false`: disabled entirely
- `string`: custom path for the register endpoint (relative, without global prefix)
