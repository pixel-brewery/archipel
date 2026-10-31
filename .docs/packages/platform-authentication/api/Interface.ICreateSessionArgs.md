---
title: 'Interface: ICreateSessionArgs'
generated: true
editUrl: false
---

# Interface: ICreateSessionArgs

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L32)

Arguments for creating a new session.

## Remarks

The identifier is assigned by the persistence adapter and returned on the created
[ISessionRecord](Interface.ISessionRecord); callers must not supply one. The access token is not part of these
arguments at all, because sessions are addressed by their own identifier rather than by a token.

[SessionService.create](Class.SessionService#create) fills the refresh fields — build these arguments by hand only when
implementing an adapter test or an alternative session factory.

## Example

```typescript
const session = await sessionPersistence.create({
    userId: subject.id,
    ipAddress: request.ip ?? '',
    deviceInfo,
    clientName: 'mobile-app',
    refreshTokenHash: SessionService.hashRefreshToken(refreshToken),
    refreshTokenExpiresAt: new Date(Date.now() + sevenDaysInMillis),
});
```

## Properties

### clientName?

```ts
readonly clientName?: string;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L58)

Name the client identifies itself with, for example a portal or a mobile application.

---

### deviceInfo?

```ts
readonly deviceInfo?: IDeviceInfo;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L48)

Device details derived from the request, when the application resolves them.

---

### ipAddress

```ts
readonly ipAddress: string;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L43)

Client IP address observed while opening the session.

---

### location?

```ts
readonly location?: string;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L53)

Geolocation the session was opened from, when the application resolves one.

---

### refreshTokenExpiresAt

```ts
readonly refreshTokenExpiresAt: Date;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L71)

Moment the issued refresh token stops being accepted.

---

### refreshTokenHash

```ts
readonly refreshTokenHash: string;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L66)

Hash of the refresh token issued together with the session.

#### Remarks

Never the token itself — persisting the credential would defeat hashing it.

---

### userId

```ts
readonly userId: string;
```

Defined in: [libs/platform-authentication/src/contracts/ICreateSessionArgs.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ICreateSessionArgs.ts#L38)

Identifier of the authenticated subject the session belongs to.
