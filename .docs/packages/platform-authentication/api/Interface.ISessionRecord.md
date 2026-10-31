---
title: 'Interface: ISessionRecord'
generated: true
editUrl: false
---

# Interface: ISessionRecord

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L25)

Represents a persisted session record.

## Remarks

A session is identified by its own [ISessionRecord.id](#id), which every access token carries
as the `sid` claim. Access tokens themselves are **never** persisted. Reissuing one therefore
leaves the session untouched, and a client that is still sending the previous token keeps
working until it picks the new one up.

The refresh credential is bound to this record rather than to the user, so a person signing in
on a second device does not evict the first. Only hashes are stored: the tokens themselves
exist exactly once, in the response that issued them.

## Example

```typescript
const session = await sessionPersistence.findById(sessionId);

if (session !== null && session.lastActive > cutoff) {
    // The session is inside its inactivity window.
}
```

## Properties

### browserName

```ts
readonly browserName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L64)

Browser name derived from the user agent, or `null` for non-browser clients.

---

### browserVersion

```ts
readonly browserVersion: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L69)

Browser version derived from the user agent, or `null` for non-browser clients.

---

### clientName

```ts
readonly clientName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L93)

Name the client identified itself with, or `null` when it did not.

#### Remarks

Useful for telling a web portal, a mobile application and an integration apart in a session
list, since all three authenticate the same way.

---

### createdAt

```ts
readonly createdAt: Date;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:135](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L135)

Moment the session was opened.

---

### deviceName

```ts
readonly deviceName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L59)

Human-readable device name, or `null` when the client did not supply one.

---

### deviceType

```ts
readonly deviceType: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L54)

Device category derived from the user agent, or `null` when it could not be determined.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L31)

Stable identifier of the session, carried by access tokens as the `sid` claim.

---

### ipAddress

```ts
readonly ipAddress: string;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L41)

Client IP address observed when the session was opened.

---

### lastActive

```ts
readonly lastActive: Date;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:130](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L130)

Moment the session was last recorded as active.

#### Remarks

What counts as activity is the application's decision. Registering
[LastActiveMiddleware](Class.LastActiveMiddleware) makes every authenticated request count; products that require
literal user interaction renew this from an explicit endpoint instead.

---

### location

```ts
readonly location: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L84)

Geolocation the session was opened from, or `null` when the application does not resolve one.

---

### osName

```ts
readonly osName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L74)

Operating system name derived from the user agent, or `null` when unknown.

---

### osVersion

```ts
readonly osVersion: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L79)

Operating system version derived from the user agent, or `null` when unknown.

---

### previousRefreshTokenHash

```ts
readonly previousRefreshTokenHash: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L114)

Hash of the refresh token this session used before the last rotation, or `null` when it has
not been rotated yet.

#### Remarks

Keeping the replaced hash is what makes a replayed credential detectable: presenting it
again cannot be a legitimate exchange, so [SessionService.refresh](Class.SessionService#refresh) revokes the whole
session instead of issuing another token.

---

### refreshTokenExpiresAt

```ts
readonly refreshTokenExpiresAt: Date | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L120)

Moment the current refresh token stops being accepted, or `null` when it does not expire on
its own.

---

### refreshTokenHash

```ts
readonly refreshTokenHash: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L103)

Hash of the refresh token that is currently valid for this session, or `null` when the
session cannot be refreshed.

#### Remarks

The refresh token itself is never persisted. Compare against
[SessionService.hashRefreshToken](Class.SessionService#hashrefreshtoken) instead of against a stored token.

---

### userAgent

```ts
readonly userAgent: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L49)

Raw user-agent header, or `null` when the client did not send one.

#### Remarks

Native applications frequently omit it, so absence carries no meaning beyond "unknown".

---

### userId

```ts
readonly userId: string;
```

Defined in: [libs/platform-authentication/src/contracts/ISessionRecord.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISessionRecord.ts#L36)

Identifier of the authenticated subject the session belongs to.
