---
title: 'Class: MfaPhoneNumberRequiredError'
generated: true
editUrl: false
---

# Class: MfaPhoneNumberRequiredError

Defined in: [libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts#L18)

Error thrown when SMS-based multi-factor authentication has no phone number to send codes to.

## Remarks

`SmsMfaChannel` throws it when neither the setup context nor the person
provides a phone number. It answers `400 Bad Request` with the stable code
`MFA_PHONE_NUMBER_REQUIRED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaPhoneNumberRequiredError(): MfaPhoneNumberRequiredError;
```

Defined in: [libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts#L28)

#### Returns

`MfaPhoneNumberRequiredError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_PHONE_NUMBER_REQUIRED" = 'MFA_PHONE_NUMBER_REQUIRED';
```

Defined in: [libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaPhoneNumberRequiredError.ts#L22)

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
