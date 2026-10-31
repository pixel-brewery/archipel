---
title: 'Class: MfaCodeRecentlySentError'
generated: true
editUrl: false
---

# Class: MfaCodeRecentlySentError

Defined in: [libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts#L18)

Error thrown when a new multi-factor authentication code is requested before the resend interval has passed.

## Remarks

The email, SMS, and push channels throw it from `initSetup` and
`issueChallenge` while the previous code or approval request is too recent.
It answers `400 Bad Request` with the stable code `MFA_CODE_RECENTLY_SENT`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaCodeRecentlySentError(codeLabel): MfaCodeRecentlySentError;
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts#L31)

#### Parameters

| Parameter   | Type     | Description                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| `codeLabel` | `string` | The name of what was sent, such as `OTP` or `Approval request`. |

#### Returns

`MfaCodeRecentlySentError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_CODE_RECENTLY_SENT" = 'MFA_CODE_RECENTLY_SENT';
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRecentlySentError.ts#L22)

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
