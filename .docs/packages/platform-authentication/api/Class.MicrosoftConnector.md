---
title: 'Class: MicrosoftConnector'
generated: true
editUrl: false
---

# Class: MicrosoftConnector

Defined in: [libs/platform-authentication/src/connectors/MicrosoftConnector.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/MicrosoftConnector.ts#L27)

The `MicrosoftConnector` integrates Microsoft OAuth authentication.

## Extends

- \{
  `validate`(...`args`): `Promise`\<`unknown`\>;
  \}

## Constructors

### Constructor

```ts
new MicrosoftConnector(socialAuth, configService): MicrosoftConnector;
```

Defined in: [libs/platform-authentication/src/connectors/MicrosoftConnector.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/MicrosoftConnector.ts#L43)

Initializes a new instance of the `MicrosoftConnector` class.

#### Parameters

| Parameter       | Type                                     | Description                         |
| --------------- | ---------------------------------------- | ----------------------------------- |
| `socialAuth`    | [`SocialAuthBase`](Class.SocialAuthBase) | Social auth abstract base instance. |
| `configService` | `ConfigService`                          | Configuration service instance.     |

#### Returns

`MicrosoftConnector`

#### Overrides

`ConnectorBase(Strategy, 'microsoft').constructor`

## Methods

### validate()

```ts
validate(
   accessToken,
   refreshToken,
   profile
): Promise<IAuthSubject>;
```

Defined in: [libs/platform-authentication/src/connectors/MicrosoftConnector.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/MicrosoftConnector.ts#L77)

Validates the Microsoft authentication payload.

#### Parameters

| Parameter      | Type      | Description             |
| -------------- | --------- | ----------------------- |
| `accessToken`  | `string`  | OAuth access token.     |
| `refreshToken` | `string`  | OAuth refresh token.    |
| `profile`      | `Profile` | Microsoft profile data. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject)\>

The authenticated user.

#### Overrides

`ConnectorBase(Strategy, 'microsoft').validate`
