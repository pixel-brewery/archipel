---
title: 'Class: InvalidMfaCodeError'
generated: true
editUrl: false
---

# Class: InvalidMfaCodeError

Defined in: [libs/platform-authentication/src/errors/InvalidMfaCodeError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/InvalidMfaCodeError.ts#L19)

Error thrown when a code does not confirm the setup of a multi-factor authentication method.

## Remarks

`MfaService.verifySetup` throws it for a non-matching code. The person is
already signed in, so the rejection answers `400 Bad Request` with the
stable code `INVALID_MFA_CODE` rather than `401 Unauthorized`, which a
client would read as an ended session.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new InvalidMfaCodeError(): InvalidMfaCodeError;
```

Defined in: [libs/platform-authentication/src/errors/InvalidMfaCodeError.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/InvalidMfaCodeError.ts#L29)

#### Returns

`InvalidMfaCodeError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "INVALID_MFA_CODE" = 'INVALID_MFA_CODE';
```

Defined in: [libs/platform-authentication/src/errors/InvalidMfaCodeError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/InvalidMfaCodeError.ts#L23)

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
