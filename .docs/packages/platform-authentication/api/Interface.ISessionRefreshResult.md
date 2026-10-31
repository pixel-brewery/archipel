---
title: 'Interface: ISessionRefreshResult'
generated: true
editUrl: false
---

# Interface: ISessionRefreshResult

Defined in: [libs/platform-authentication/src/models/ISessionRefreshResult.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISessionRefreshResult.ts#L30)

Outcome of a refresh-token exchange.

## Remarks

[ISessionRefreshResult.session](#session) and [ISessionRefreshResult.refreshToken](#refreshtoken) are present
only when [ISessionRefreshResult.outcome](#outcome) is [SessionRefreshOutcome.Refreshed](Enumeration.SessionRefreshOutcome#enumeration-member-refreshed).
Branch on the outcome before reading them rather than testing them for presence, so that a new
failing outcome cannot be mistaken for a successful exchange.

## Example

```typescript
const result = await sessionService.refresh(refreshToken, lifetimeMillis, cutoff);

if (result.outcome !== SessionRefreshOutcome.Refreshed) {
    throw new InvalidRefreshTokenError();
}

const accessToken = await authTokenService.createAccessToken(subject, result.session!.id);
```

## Properties

### outcome

```ts
readonly outcome: SessionRefreshOutcome;
```

Defined in: [libs/platform-authentication/src/models/ISessionRefreshResult.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISessionRefreshResult.ts#L36)

What the exchange means.

---

### refreshToken?

```ts
readonly refreshToken?: string;
```

Defined in: [libs/platform-authentication/src/models/ISessionRefreshResult.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISessionRefreshResult.ts#L47)

The successor refresh token, present only on [SessionRefreshOutcome.Refreshed](Enumeration.SessionRefreshOutcome#enumeration-member-refreshed) and
returned exactly once.

---

### session?

```ts
readonly session?: ISessionRecord;
```

Defined in: [libs/platform-authentication/src/models/ISessionRefreshResult.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISessionRefreshResult.ts#L41)

The refreshed session, present only on [SessionRefreshOutcome.Refreshed](Enumeration.SessionRefreshOutcome#enumeration-member-refreshed).
