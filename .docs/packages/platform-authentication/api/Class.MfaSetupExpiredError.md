---
title: 'Class: MfaSetupExpiredError'
generated: true
editUrl: false
---

# Class: MfaSetupExpiredError

Defined in: [libs/platform-authentication/src/errors/MfaSetupExpiredError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupExpiredError.ts#L19)

Error thrown when the code or approval that confirms a multi-factor authentication setup has expired.

## Remarks

The email, SMS, and push channels throw it from `verifySetup`. The person is
already signed in, so it answers `400 Bad Request` with the stable code
`MFA_SETUP_EXPIRED` rather than `401`, which clients read as an ended
session; the setup can be started again.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaSetupExpiredError(codeLabel): MfaSetupExpiredError;
```

Defined in: [libs/platform-authentication/src/errors/MfaSetupExpiredError.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupExpiredError.ts#L32)

#### Parameters

| Parameter   | Type     | Description                                                                 |
| ----------- | -------- | --------------------------------------------------------------------------- |
| `codeLabel` | `string` | The name of the code, such as `Email code`, `SMS code`, or `Push approval`. |

#### Returns

`MfaSetupExpiredError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_SETUP_EXPIRED" = 'MFA_SETUP_EXPIRED';
```

Defined in: [libs/platform-authentication/src/errors/MfaSetupExpiredError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSetupExpiredError.ts#L23)

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
