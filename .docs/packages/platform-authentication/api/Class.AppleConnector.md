---
title: 'Class: AppleConnector'
generated: true
editUrl: false
---

# Class: AppleConnector

Defined in: [libs/platform-authentication/src/connectors/AppleConnector.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/AppleConnector.ts#L30)

The `AppleConnector` integrates Apple Sign In authentication.

## Extends

- \{
  `validate`(...`args`): `Promise`\<`unknown`\>;
  \}

## Constructors

### Constructor

```ts
new AppleConnector(socialAuth, configService): AppleConnector;
```

Defined in: [libs/platform-authentication/src/connectors/AppleConnector.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/AppleConnector.ts#L46)

Initializes a new instance of the `AppleConnector` class.

#### Parameters

| Parameter       | Type                                     | Description                         |
| --------------- | ---------------------------------------- | ----------------------------------- |
| `socialAuth`    | [`SocialAuthBase`](Class.SocialAuthBase) | Social auth abstract base instance. |
| `configService` | `ConfigService`                          | Configuration service instance.     |

#### Returns

`AppleConnector`

#### Overrides

`ConnectorBase(Strategy, 'apple').constructor`

## Methods

### validate()

```ts
validate(
   accessToken,
   refreshToken,
   idToken,
   profile
): Promise<IAuthSubject>;
```

Defined in: [libs/platform-authentication/src/connectors/AppleConnector.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/AppleConnector.ts#L84)

Validates the Apple authentication payload.

#### Parameters

| Parameter      | Type            | Description           |
| -------------- | --------------- | --------------------- |
| `accessToken`  | `string`        | OAuth access token.   |
| `refreshToken` | `string`        | OAuth refresh token.  |
| `idToken`      | `string`        | Apple identity token. |
| `profile`      | `IAppleProfile` | Apple profile data.   |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject)\>

The authenticated user.

#### Overrides

`ConnectorBase(Strategy, 'apple').validate`
