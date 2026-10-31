---
title: 'Class: MfaChannelNotEnabledError'
generated: true
editUrl: false
---

# Class: MfaChannelNotEnabledError

Defined in: [libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts#L18)

Error thrown when a sign-in challenge is issued for a multi-factor authentication channel the person has not enabled.

## Remarks

The email, SMS, and push channels throw it from `issueChallenge`. As a
sign-in failure it answers `401 Unauthorized` with the stable code
`MFA_CHANNEL_NOT_ENABLED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaChannelNotEnabledError(methodLabel): MfaChannelNotEnabledError;
```

Defined in: [libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts#L31)

#### Parameters

| Parameter     | Type     | Description                                                        |
| ------------- | -------- | ------------------------------------------------------------------ |
| `methodLabel` | `string` | The display name of the method, such as `Email`, `SMS`, or `Push`. |

#### Returns

`MfaChannelNotEnabledError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_CHANNEL_NOT_ENABLED" = 'MFA_CHANNEL_NOT_ENABLED';
```

Defined in: [libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaChannelNotEnabledError.ts#L22)

Stable machine-readable error code.

## Methods

### getHeaders()

```ts
getHeaders(): Readonly<Record<string, string>>;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L56)

Returns the response headers that belong to this problem.

#### Returns

`Readonly`\<`Record`\<`string`, `string`\>\>

The headers, empty when the problem has none.

#### Inherited from

`ProblemDetailException.getHeaders`

---

### getResponse()

```ts
getResponse(): ProblemDetail;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailException.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailException.ts#L47)

#### Returns

`ProblemDetail`

#### Inherited from

`ProblemDetailException.getResponse`
