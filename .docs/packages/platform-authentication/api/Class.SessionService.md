---
title: 'Class: SessionService'
generated: true
editUrl: false
---

# Class: SessionService

Defined in: [libs/platform-authentication/src/services/SessionService.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L54)

Manages user sessions via the [SessionPersistenceBase](Class.SessionPersistenceBase).

## Remarks

A session is addressed by its own identifier, which the access token carries as the `sid` claim.
Access tokens are **never** persisted, so reissuing one leaves the session untouched and cannot
cut off a client that is still sending the previous token.

The refresh credential belongs to the session rather than to the user, so every device keeps its
own and signing in elsewhere does not evict it. It is opaque and travels in the request body,
which lets a web portal, a native mobile application and a desktop application use one identical
exchange — no cookie, and therefore no browser assumption anywhere in the contract.

The service owns credential generation and hashing. Applications decide the lifetimes, map the
outcomes to their own errors, and define what counts as activity.

## Example

```typescript
// Sign in
const { session, refreshToken } = await sessionService.create(user.id, ip, sevenDaysInMillis, {
    deviceInfo,
    clientName: 'mobile-app',
});
const accessToken = await authTokenService.createAccessToken(user, session.id);

// Every authenticated request
if (!(await sessionService.isActive(payload.sid, cutoff))) {
    throw new SessionExpiredError();
}

// Renew after explicit user activity
await sessionService.updateLastActive(payload.sid);
```

## Constructors

### Constructor

```ts
new SessionService(sessionPersistence, mappingService): SessionService;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L73)

Constructs a new instance of the `SessionService` class.

#### Parameters

| Parameter            | Type                                                     | Description                            |
| -------------------- | -------------------------------------------------------- | -------------------------------------- |
| `sessionPersistence` | [`SessionPersistenceBase`](Class.SessionPersistenceBase) | The session persistence abstract base. |
| `mappingService`     | `MappingService`                                         | The mapping service.                   |

#### Returns

`SessionService`

## Methods

### create()

```ts
create(
   userId,
   ipAddress,
   refreshTokenLifetimeMillis,
   options?
): Promise<IIssuedSession>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:119](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L119)

Opens a session and issues its refresh token.

#### Parameters

| Parameter                    | Type                                                                                                | Description                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `userId`                     | `string`                                                                                            | The user identifier.                                                   |
| `ipAddress`                  | `string`                                                                                            | The client IP address.                                                 |
| `refreshTokenLifetimeMillis` | `number`                                                                                            | How long the issued refresh token stays acceptable.                    |
| `options?`                   | \{ `clientName?`: `string`; `deviceInfo?`: `IDeviceInfo`; `location?`: `string`; `now?`: `Date`; \} | Optional device, location and client details, plus the current moment. |
| `options.clientName?`        | `string`                                                                                            | -                                                                      |
| `options.deviceInfo?`        | `IDeviceInfo`                                                                                       | -                                                                      |
| `options.location?`          | `string`                                                                                            | -                                                                      |
| `options.now?`               | `Date`                                                                                              | -                                                                      |

#### Returns

`Promise`\<[`IIssuedSession`](Interface.IIssuedSession)\>

The created session together with the refresh token, which is returned exactly once.

#### Remarks

The credential is 48 bytes of cryptographic randomness and is persisted as a hash only, so
the returned [IIssuedSession.refreshToken](Interface.IIssuedSession#refreshtoken) is the single opportunity to hand it to the
client.

Pass the identifier of the returned session to
[AuthTokenService.createAccessToken](Class.AuthTokenService#createaccesstoken) — it becomes the `sid` claim that ties the token
to this session.

---

### findById()

```ts
findById(sessionId): Promise<ISessionRecord | null>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:152](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L152)

Reads a session by its identifier.

#### Parameters

| Parameter   | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `sessionId` | `string` | The session identifier. |

#### Returns

`Promise`\<[`ISessionRecord`](Interface.ISessionRecord) \| `null`\>

The session record or `null`.

---

### hasActiveSession()

```ts
hasActiveSession(userId, activeAfter): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:187](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L187)

Checks whether a user has any session active at or after a cutoff.

#### Parameters

| Parameter     | Type     | Description                   |
| ------------- | -------- | ----------------------------- |
| `userId`      | `string` | The user identifier.          |
| `activeAfter` | `Date`   | Exclusive last-active cutoff. |

#### Returns

`Promise`\<`boolean`\>

`true` when at least one session has not been idle past the cutoff.

#### Remarks

Loads every session of the subject, so keep that set bounded with
[SessionService.purgeInactive](#purgeinactive) rather than letting expired rows accumulate.

---

### hashRefreshToken()

```ts
static hashRefreshToken(refreshToken): string;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L96)

Hashes a refresh token for persistence and lookup.

#### Parameters

| Parameter      | Type     | Description               |
| -------------- | -------- | ------------------------- |
| `refreshToken` | `string` | The opaque refresh token. |

#### Returns

`string`

The hash that is stored instead of the token.

#### Remarks

The credential is high-entropy random data, so a plain SHA-256 is the right primitive here:
it is deterministic, which lookups need, and there is nothing to brute-force. Do not
substitute a password hash — those are deliberately slow and not equality-searchable.

Exposed so adapters and tests can derive the same hash without reimplementing it.

---

### invalidate()

```ts
invalidate(sessionId): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:327](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L327)

Invalidates a session by its identifier.

#### Parameters

| Parameter   | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `sessionId` | `string` | The session identifier. |

#### Returns

`Promise`\<`boolean`\>

`true` if a session was invalidated.

#### Remarks

Backs an explicit sign-out of the current session. Ownership is not checked, so callers must
take the identifier from the authenticated token rather than from client input.

---

### invalidateById()

```ts
invalidateById(sessionId, userId): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:312](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L312)

Invalidates a session by its record id.

#### Parameters

| Parameter   | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `sessionId` | `string` | The session record identifier. |
| `userId`    | `string` | The owning user identifier.    |

#### Returns

`Promise`\<`boolean`\>

`true` if a session was invalidated.

#### Remarks

Backs "sign out this other device". The owner is part of the condition, so an identifier
alone never ends a session belonging to somebody else.

---

### isActive()

```ts
isActive(sessionId, activeAfter): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L169)

Checks whether a session was active at or after a cutoff.

#### Parameters

| Parameter     | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `sessionId`   | `string` | The session identifier, taken from the `sid` claim. |
| `activeAfter` | `Date`   | Exclusive last-active cutoff.                       |

#### Returns

`Promise`\<`boolean`\>

`true` when the session exists and has not been idle past the cutoff.

#### Remarks

The cutoff is exclusive and supplied by the application, which keeps the timeout policy out
of the platform. A missing session and an idle one are intentionally indistinguishable to
the caller, so neither reveals more than the other.

---

### listSessions()

```ts
listSessions(userId, sessionId): Promise<SessionResponse[]>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:289](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L289)

Lists all sessions for a user, marking the current one.

#### Parameters

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `userId`    | `string` | The user identifier.            |
| `sessionId` | `string` | The current session identifier. |

#### Returns

`Promise`\<[`SessionResponse`](Class.SessionResponse)[]\>

Array of session responses.

#### Remarks

Intended for a "signed in on these devices" view. The current session is identified by the
`sid` claim of the requesting token, which is why a device can recognise itself in the list
without ever comparing tokens.

---

### purgeInactive()

```ts
purgeInactive(userId, activeBefore): Promise<number>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:344](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L344)

Removes the sessions of one user that were last active before a cutoff.

#### Parameters

| Parameter      | Type     | Description                   |
| -------------- | -------- | ----------------------------- |
| `userId`       | `string` | The owning user identifier.   |
| `activeBefore` | `Date`   | Inclusive last-active cutoff. |

#### Returns

`Promise`\<`number`\>

The number of removed sessions.

#### Remarks

Expired sessions are unusable but stay readable, and every lookup by user loads all of them.
Calling this from an authenticated write — issuing tokens on sign-in is the natural place —
keeps the set bounded without a separate schedule, and stays idempotent and retry-safe.

---

### refresh()

```ts
refresh(
   refreshToken,
   refreshTokenLifetimeMillis,
   activeAfter,
   now?
): Promise<ISessionRefreshResult>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:238](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L238)

Exchanges a refresh token for its successor and reports what the exchange means.

#### Parameters

| Parameter                    | Type     | Description                                                  |
| ---------------------------- | -------- | ------------------------------------------------------------ |
| `refreshToken`               | `string` | The presented opaque refresh token.                          |
| `refreshTokenLifetimeMillis` | `number` | How long the issued refresh token stays acceptable.          |
| `activeAfter`                | `Date`   | Exclusive last-active cutoff the session must still satisfy. |
| `now?`                       | `Date`   | The current moment.                                          |

#### Returns

`Promise`\<[`ISessionRefreshResult`](Interface.ISessionRefreshResult)\>

The outcome and, when refreshed, the session and its new refresh token.

#### Remarks

The credential rotates on every use. A token that was already replaced can only reappear if
it was captured, so presenting it is treated as a replay: the session is revoked instead of
refreshed and a stolen credential is reduced to one failed attempt. See
[SessionRefreshOutcome](Enumeration.SessionRefreshOutcome) for the full set of answers.

Rotation itself is a compare-and-swap in the persistence abstract base, so two clients exchanging the
same credential concurrently produce exactly one winner; the loser is reported as
[SessionRefreshOutcome.Unknown](Enumeration.SessionRefreshOutcome#enumeration-member-unknown) rather than being handed a second token.

The exchange never revives an idle session — the inactivity window stays the authority over
session lifetime.

---

### updateLastActive()

```ts
updateLastActive(sessionId): Promise<void>;
```

Defined in: [libs/platform-authentication/src/services/SessionService.ts:207](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/SessionService.ts#L207)

Updates the last-active timestamp for a session.

#### Parameters

| Parameter   | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `sessionId` | `string` | The session identifier. |

#### Returns

`Promise`\<`void`\>

#### Remarks

Renews the inactivity window **in place**: no row is created and none is removed, so the
call is safe next to any concurrent request of the same session and the presented access
token keeps working.

A session that no longer exists is silently ignored, which makes the call safe to fire
without awaiting it.
