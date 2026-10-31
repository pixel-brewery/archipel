---
title: 'Abstract Class: SessionPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: SessionPersistenceBase

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L39)

Abstract base for persisting and querying sessions.

## Remarks

Sessions are addressed by their own identifier, **never** by an access token. Reissuing an
access token therefore neither creates nor removes a session, which is what allows a client to
keep using the previous token until it has adopted the new one.

The abstract base stores refresh credentials as hashes only and exposes rotation as a compare-and-swap
(see [IRotateRefreshTokenArgs](Interface.IRotateRefreshTokenArgs)), so concurrent exchanges cannot both succeed. Everything
about the credential is transport-neutral: no cookie, no browser assumption, which is what lets
native mobile and desktop clients use the same session model as a web portal.

Implement it in the consuming application and register it through
`AuthModule.register({ sessionPersistence: … })`.

## Example

```typescript
@Injectable()
export class PrismaSessionAdapter extends SessionPersistenceBase {
    public constructor(private readonly _sessions: SessionRepository) {
        super();
    }

    public override async create(args: ICreateSessionArgs): Promise<ISessionRecord> {
        return this._sessions.create(args);
    }

    // … remaining members
}
```

## Constructors

### Constructor

```ts
new SessionPersistenceBase(): SessionPersistenceBase;
```

#### Returns

`SessionPersistenceBase`

## Methods

### create()

```ts
abstract create(args): Promise<ISessionRecord>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:62](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L62)

Create a session.

#### Parameters

| Parameter | Type                                                 | Description                |
| --------- | ---------------------------------------------------- | -------------------------- |
| `args`    | [`ICreateSessionArgs`](Interface.ICreateSessionArgs) | The session data to store. |

#### Returns

`Promise`\<[`ISessionRecord`](Interface.ISessionRecord)\>

The created session record.

#### Remarks

The adapter assigns the identifier and returns the stored record, because the caller needs
that identifier for the `sid` claim of the access token it is about to issue.

---

### deleteInactive()

```ts
abstract deleteInactive(userId, activeBefore): Promise<number>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:166](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L166)

Remove the sessions of one user that were last active before a cutoff.

#### Parameters

| Parameter      | Type     | Description                   |
| -------------- | -------- | ----------------------------- |
| `userId`       | `string` | The owning user identifier.   |
| `activeBefore` | `Date`   | Inclusive last-active cutoff. |

#### Returns

`Promise`\<`number`\>

The number of removed sessions.

#### Remarks

Expired sessions are unusable but stay readable, and [findAllByUserId](#findallbyuserid) loads all of
them. Purging bounds that set without a separate schedule when it is called from an
authenticated write such as issuing tokens.

---

### findAllByUserId()

```ts
abstract findAllByUserId(userId): Promise<readonly ISessionRecord[]>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:100](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L100)

Find all sessions for a given user.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `userId`  | `string` | The user identifier. |

#### Returns

`Promise`\<readonly [`ISessionRecord`](Interface.ISessionRecord)[]\>

Sessions ordered by last activity descending.

---

### findById()

```ts
abstract findById(id): Promise<ISessionRecord | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L75)

Find a session by its identifier.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `id`      | `string` | The session identifier. |

#### Returns

`Promise`\<[`ISessionRecord`](Interface.ISessionRecord) \| `null`\>

The session record or `null`.

#### Remarks

This is the lookup every authenticated request performs, using the `sid` claim of the
presented access token. It should be backed by the primary key.

---

### findByRefreshTokenHash()

```ts
abstract findByRefreshTokenHash(refreshTokenHash): Promise<ISessionRecord | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L91)

Find the session a refresh token belongs to, whether that token is the current one or the
one it replaced.

#### Parameters

| Parameter          | Type     | Description                          |
| ------------------ | -------- | ------------------------------------ |
| `refreshTokenHash` | `string` | Hash of the presented refresh token. |

#### Returns

`Promise`\<[`ISessionRecord`](Interface.ISessionRecord) \| `null`\>

The session record or `null`.

#### Remarks

Matching [ISessionRecord.previousRefreshTokenHash](Interface.ISessionRecord#previousrefreshtokenhash) as well is deliberate and required:
it is the only way [SessionService.refresh](Class.SessionService#refresh) can tell a replayed credential from an
unknown one. An adapter that matches the current hash alone silently disables replay
detection.

---

### invalidate()

```ts
abstract invalidate(id): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L137)

Invalidate (delete) a session by its identifier.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `id`      | `string` | The session identifier. |

#### Returns

`Promise`\<`boolean`\>

`true` if a session was invalidated.

---

### invalidateById()

```ts
abstract invalidateById(id, userId): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:151](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L151)

Invalidate (delete) a session by its identifier and owning user id.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `id`      | `string` | The session identifier.     |
| `userId`  | `string` | The owning user identifier. |

#### Returns

`Promise`\<`boolean`\>

`true` if a session was invalidated.

#### Remarks

The owner is part of the condition so that one subject can never end another subject's
session by guessing an identifier.

---

### rotateRefreshToken()

```ts
abstract rotateRefreshToken(args): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:128](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L128)

Replace the refresh token of a session, but only while the expected hash is still the
current one.

#### Parameters

| Parameter | Type                                                           | Description        |
| --------- | -------------------------------------------------------------- | ------------------ |
| `args`    | [`IRotateRefreshTokenArgs`](Interface.IRotateRefreshTokenArgs) | The rotation data. |

#### Returns

`Promise`\<`boolean`\>

`true` when the session was rotated, `false` when the expected hash was no longer
current.

#### Remarks

Must be a single conditional write. See [IRotateRefreshTokenArgs](Interface.IRotateRefreshTokenArgs) for the reasoning
and a reference implementation.

---

### updateLastActive()

```ts
abstract updateLastActive(id, date): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SessionPersistenceBase.ts#L113)

Update the last-active timestamp for a session.

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `id`      | `string` | The session identifier.   |
| `date`    | `Date`   | The new last-active date. |

#### Returns

`Promise`\<`void`\>

#### Remarks

Renews the inactivity window in place. It neither creates nor removes a row, so it can run
concurrently with any request of the same session.
