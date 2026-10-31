---
title: 'Class: GoogleConnector'
generated: true
editUrl: false
---

# Class: GoogleConnector

Defined in: [libs/platform-authentication/src/connectors/GoogleConnector.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GoogleConnector.ts#L19)

The `GoogleConnector` integrates Google OAuth authentication.

## Extends

- \{
  `validate`(...`args`): `Promise`\<`unknown`\>;
  \}

## Constructors

### Constructor

```ts
new GoogleConnector(socialAuth, configService): GoogleConnector;
```

Defined in: [libs/platform-authentication/src/connectors/GoogleConnector.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GoogleConnector.ts#L35)

Initializes a new instance of the `GoogleConnector` class.

#### Parameters

| Parameter       | Type                                     | Description                         |
| --------------- | ---------------------------------------- | ----------------------------------- |
| `socialAuth`    | [`SocialAuthBase`](Class.SocialAuthBase) | Social auth abstract base instance. |
| `configService` | `ConfigService`                          | Configuration service instance.     |

#### Returns

`GoogleConnector`

#### Overrides

`ConnectorBase(Strategy, 'google').constructor`

## Methods

### validate()

```ts
validate(
   accessToken,
   refreshToken,
   profile
): Promise<IAuthSubject>;
```

Defined in: [libs/platform-authentication/src/connectors/GoogleConnector.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GoogleConnector.ts#L68)

Validates the Google authentication payload.

#### Parameters

| Parameter      | Type      | Description          |
| -------------- | --------- | -------------------- |
| `accessToken`  | `string`  | OAuth access token.  |
| `refreshToken` | `string`  | OAuth refresh token. |
| `profile`      | `Profile` | Google profile data. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject)\>

The authenticated user.

#### Overrides

`ConnectorBase(Strategy, 'google').validate`
