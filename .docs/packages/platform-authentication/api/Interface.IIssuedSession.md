---
title: 'Interface: IIssuedSession'
generated: true
editUrl: false
---

# Interface: IIssuedSession

Defined in: [libs/platform-authentication/src/models/IIssuedSession.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IIssuedSession.ts#L29)

A newly opened session together with the refresh token issued for it.

## Remarks

The refresh token is returned **exactly once**, here. Only its hash is persisted, so it cannot
be read back from the session afterwards — a caller that drops it has to open a new session.

Hand it to the client in the same response as the access token and let the client store it
wherever its platform considers secure: the keychain on iOS, the keystore on Android, the
credential store on desktop, web storage in a browser. The platform deliberately makes no
assumption about that, which is why the credential is opaque rather than a cookie.

## Example

```typescript
const { session, refreshToken } = await sessionService.create(user.id, ip, sevenDaysInMillis);
const accessToken = await authTokenService.createAccessToken(user, session.id);

return { accessToken, refreshToken };
```

## Properties

### refreshToken

```ts
readonly refreshToken: string;
```

Defined in: [libs/platform-authentication/src/models/IIssuedSession.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IIssuedSession.ts#L40)

The opaque refresh token, in clear text and for the last time.

---

### session

```ts
readonly session: ISessionRecord;
```

Defined in: [libs/platform-authentication/src/models/IIssuedSession.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IIssuedSession.ts#L35)

The persisted session, whose identifier belongs into the `sid` claim of the access token.
