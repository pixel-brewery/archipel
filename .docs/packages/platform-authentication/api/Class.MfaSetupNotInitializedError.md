---
title: 'Class: MfaSetupNotInitializedError'
generated: true
editUrl: false
---

# Class: MfaSetupNotInitializedError

Defined in: [libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts#L18)

Error thrown when the setup of a multi-factor authentication method is confirmed before it was started.

## Remarks

A channel's `verifySetup` throws it when no pending TOTP secret or setup
code exists. The person is already signed in, so it answers
`400 Bad Request` with the stable code `MFA_SETUP_NOT_INITIALIZED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaSetupNotInitializedError(methodLabel): MfaSetupNotInitializedError;
```

Defined in: [libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts#L31)

#### Parameters

| Parameter     | Type     | Description                                                                |
| ------------- | -------- | -------------------------------------------------------------------------- |
| `methodLabel` | `string` | The display name of the method, such as `TOTP`, `Email`, `SMS`, or `Push`. |

#### Returns

`MfaSetupNotInitializedError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_SETUP_NOT_INITIALIZED" = 'MFA_SETUP_NOT_INITIALIZED';
```

Defined in: [libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupNotInitializedError.ts#L22)

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
