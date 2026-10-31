---
title: 'Class: GithubConnector'
generated: true
editUrl: false
---

# Class: GithubConnector

Defined in: [libs/platform-authentication/src/connectors/GithubConnector.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GithubConnector.ts#L14)

## Extends

- \{
  `validate`(...`args`): `Promise`\<`unknown`\>;
  \}

## Constructors

### Constructor

```ts
new GithubConnector(socialAuth, configService): GithubConnector;
```

Defined in: [libs/platform-authentication/src/connectors/GithubConnector.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GithubConnector.ts#L30)

Constructs a new instance of the `GithubConnector` class.

#### Parameters

| Parameter       | Type                                     | Description                         |
| --------------- | ---------------------------------------- | ----------------------------------- |
| `socialAuth`    | [`SocialAuthBase`](Class.SocialAuthBase) | Social auth abstract base instance. |
| `configService` | `ConfigService`                          | Configuration service instance.     |

#### Returns

`GithubConnector`

#### Overrides

`ConnectorBase(Strategy, 'github').constructor`

## Methods

### validate()

```ts
validate(
   _accessToken,
   _refreshToken,
   profile
): Promise<IAuthSubject>;
```

Defined in: [libs/platform-authentication/src/connectors/GithubConnector.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/connectors/GithubConnector.ts#L57)

#### Parameters

| Parameter       | Type      |
| --------------- | --------- |
| `_accessToken`  | `string`  |
| `_refreshToken` | `string`  |
| `profile`       | `Profile` |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject)\>

#### Overrides

`ConnectorBase(Strategy, 'github').validate`
