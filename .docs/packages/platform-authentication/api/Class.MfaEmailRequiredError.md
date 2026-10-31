---
title: 'Class: MfaEmailRequiredError'
generated: true
editUrl: false
---

# Class: MfaEmailRequiredError

Defined in: [libs/platform-authentication/src/errors/MfaEmailRequiredError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaEmailRequiredError.ts#L18)

Error thrown when email-based multi-factor authentication has no email address to send codes to.

## Remarks

`EmailOtpMfaChannel` throws it when neither the setup context nor the
person provides an email address. It answers `400 Bad Request` with the
stable code `MFA_EMAIL_REQUIRED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaEmailRequiredError(): MfaEmailRequiredError;
```

Defined in: [libs/platform-authentication/src/errors/MfaEmailRequiredError.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaEmailRequiredError.ts#L28)

#### Returns

`MfaEmailRequiredError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_EMAIL_REQUIRED" = 'MFA_EMAIL_REQUIRED';
```

Defined in: [libs/platform-authentication/src/errors/MfaEmailRequiredError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaEmailRequiredError.ts#L22)

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
