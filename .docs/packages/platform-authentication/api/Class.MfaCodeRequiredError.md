---
title: 'Class: MfaCodeRequiredError'
generated: true
editUrl: false
---

# Class: MfaCodeRequiredError

Defined in: [libs/platform-authentication/src/errors/MfaCodeRequiredError.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRequiredError.ts#L17)

Error thrown when a multi-factor authentication code is missing.

## Remarks

`MfaService.verifySetup` throws it for an empty or blank code. It answers
`400 Bad Request` with the stable code `MFA_CODE_REQUIRED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaCodeRequiredError(): MfaCodeRequiredError;
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeRequiredError.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRequiredError.ts#L27)

#### Returns

`MfaCodeRequiredError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_CODE_REQUIRED" = 'MFA_CODE_REQUIRED';
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeRequiredError.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeRequiredError.ts#L21)

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
