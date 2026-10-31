---
title: 'Interface: IRotateRefreshTokenArgs'
generated: true
editUrl: false
---

# Interface: IRotateRefreshTokenArgs

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L34)

Arguments for replacing the refresh token of an existing session.

## Remarks

The rotation is deliberately expressed as a compare-and-swap:
[IRotateRefreshTokenArgs.expectedRefreshTokenHash](#expectedrefreshtokenhash) must still be the session's current
hash for the update to apply. Two clients that exchange the same credential concurrently — a
mobile application resuming from background while its own retry is still in flight, for
instance — therefore produce exactly one winner, and the loser is told the credential is no
longer current instead of both receiving a token.

Adapters must implement this as a single conditional statement. Reading the session first and
writing afterwards reintroduces the race the contract exists to prevent.

## Example

```typescript
public override async rotateRefreshToken(args: IRotateRefreshTokenArgs): Promise<boolean> {
    const result = await this.sessions.updateMany({
        where: { id: args.sessionId, refreshTokenHash: args.expectedRefreshTokenHash },
        data: {
            refreshTokenHash: args.refreshTokenHash,
            previousRefreshTokenHash: args.expectedRefreshTokenHash,
            refreshTokenExpiresAt: args.refreshTokenExpiresAt,
            lastActive: args.lastActive
        }
    });

    return result.count > 0;
}
```

## Properties

### expectedRefreshTokenHash

```ts
readonly expectedRefreshTokenHash: string;
```

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L49)

Hash that must still be current for the rotation to apply.

#### Remarks

Adapters store it as [ISessionRecord.previousRefreshTokenHash](Interface.ISessionRecord#previousrefreshtokenhash) while replacing it, so
a later replay of the same credential remains detectable.

---

### lastActive

```ts
readonly lastActive: Date;
```

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L68)

Moment the rotation is recorded as activity.

#### Remarks

A successful exchange proves the client is still there, so it renews the inactivity window
along with the credential.

---

### refreshTokenExpiresAt

```ts
readonly refreshTokenExpiresAt: Date;
```

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L59)

Moment the replacing refresh token stops being accepted.

---

### refreshTokenHash

```ts
readonly refreshTokenHash: string;
```

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L54)

Hash of the refresh token that replaces it.

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IRotateRefreshTokenArgs.ts#L40)

Identifier of the session whose credential is replaced.
