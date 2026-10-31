---
title: 'Enumeration: SessionRefreshOutcome'
generated: true
editUrl: false
---

# Enumeration: SessionRefreshOutcome

Defined in: [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L29)

Result of exchanging a refresh token.

## Remarks

The exchange reports why it ended rather than throwing, because the five outcomes call for
different answers: only [SessionRefreshOutcome.Replayed](#enumeration-member-replayed) indicates a possible theft, and
only it revokes the session. Everything else simply means the caller has to sign in again.

All failing outcomes should reach the client as the same opaque error. Telling an attacker
whether a credential was unknown, expired or merely idle hands them a probing oracle.

## Example

```typescript
const result = await sessionService.refresh(refreshToken, lifetimeMillis, cutoff);

switch (result.outcome) {
    case SessionRefreshOutcome.Refreshed:
        return this.issueTokens(result.session!, result.refreshToken!);
    case SessionRefreshOutcome.Replayed:
        this._logger.warn(`Refresh token replay detected userId=${userId}`);
        throw new InvalidRefreshTokenError();
    default:
        throw new InvalidRefreshTokenError();
}
```

## Enumeration Members

| Enumeration Member                                    | Value         | Description                                                                                                                                                                                                                                                                                                                                            | Defined in                                                                                                                                                                                      |
| ----------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enumeration-member-expired"></a> `Expired`     | `"EXPIRED"`   | The presented token outlived its own validity.                                                                                                                                                                                                                                                                                                         | [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L69) |
| <a id="enumeration-member-inactive"></a> `Inactive`   | `"INACTIVE"`  | The session left its inactivity window. **Remarks** A refresh credential does not revive an idle session; the inactivity window remains the authority over how long a session lives.                                                                                                                                                                   | [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L64) |
| <a id="enumeration-member-refreshed"></a> `Refreshed` | `"REFRESHED"` | The exchange succeeded and issued a successor token. **Remarks** The session and the new credential are present on the result.                                                                                                                                                                                                                         | [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L36) |
| <a id="enumeration-member-replayed"></a> `Replayed`   | `"REPLAYED"`  | The presented token had already been replaced, so the session was revoked. **Remarks** A rotated credential can only reappear if it was captured or leaked. The session is ended rather than refreshed, which turns a stolen token into a single failed attempt. Worth logging and, depending on the product, worth notifying the account owner about. | [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L55) |
| <a id="enumeration-member-unknown"></a> `Unknown`     | `"UNKNOWN"`   | No session holds the presented token. **Remarks** Also reported when a concurrent exchange won the rotation, because from this caller's point of view the credential it presented is no longer current either way.                                                                                                                                     | [libs/platform-authentication/src/models/SessionRefreshOutcome.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/SessionRefreshOutcome.ts#L45) |
