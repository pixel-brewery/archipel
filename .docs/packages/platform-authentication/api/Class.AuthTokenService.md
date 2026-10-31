---
title: 'Class: AuthTokenService'
generated: true
editUrl: false
---

# Class: AuthTokenService

Defined in: [libs/platform-authentication/src/services/AuthTokenService.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/AuthTokenService.ts#L18)

Generic service responsible for creating JWT access tokens.
Builds a base payload from [IAuthSubject](Interface.IAuthSubject) and optionally enriches it
via the [TokenEnricherBase](Class.TokenEnricherBase) with product-specific claims.

## Constructors

### Constructor

```ts
new AuthTokenService(jwtService, tokenEnricher): AuthTokenService;
```

Defined in: [libs/platform-authentication/src/services/AuthTokenService.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/AuthTokenService.ts#L35)

Constructs a new instance of the `AuthTokenService` class.

#### Parameters

| Parameter       | Type                                                     | Description                            |
| --------------- | -------------------------------------------------------- | -------------------------------------- |
| `jwtService`    | `JwtService`                                             | The NestJS JWT service.                |
| `tokenEnricher` | [`TokenEnricherBase`](Class.TokenEnricherBase) \| `null` | Optional token enricher abstract base. |

#### Returns

`AuthTokenService`

## Methods

### createAccessToken()

```ts
createAccessToken(subject, sessionId): Promise<string>;
```

Defined in: [libs/platform-authentication/src/services/AuthTokenService.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/AuthTokenService.ts#L67)

Creates a signed JWT for the given subject and session.

#### Parameters

| Parameter   | Type                                     | Description                                                                                                |
| ----------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `subject`   | [`IAuthSubject`](Interface.IAuthSubject) | The authenticated subject.                                                                                 |
| `sessionId` | `string`                                 | Identifier of the session the token belongs to, from [SessionService.create](Class.SessionService#create). |

#### Returns

`Promise`\<`string`\>

The signed JWT access token.

#### Remarks

The token carries the session identifier as the `sid` claim, which is how a request is tied
to a session. The token itself is never persisted, so the same session survives any number
of reissues and no client is rejected for still holding the previous token.

Claims are assembled from the subject and then extended by the [TokenEnricherBase](Class.TokenEnricherBase),
when one is registered. An enricher cannot remove `sid`, but it can overwrite it — do not.

#### Example

```typescript
const { session, refreshToken } = await sessionService.create(user.id, ip, lifetimeMillis);
const accessToken = await authTokenService.createAccessToken(user, session.id);
```
