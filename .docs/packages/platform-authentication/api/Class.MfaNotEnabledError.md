---
title: 'Class: MfaNotEnabledError'
generated: true
editUrl: false
---

# Class: MfaNotEnabledError

Defined in: [libs/platform-authentication/src/errors/MfaNotEnabledError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaNotEnabledError.ts#L18)

Error thrown when an operation requires multi-factor authentication that the person has not enabled.

## Remarks

`MfaService.verifyChallenge` and `MfaService.regenerateBackupCodes` throw it
for a person without enabled multi-factor authentication. It answers
`400 Bad Request` with the stable code `MFA_NOT_ENABLED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaNotEnabledError(): MfaNotEnabledError;
```

Defined in: [libs/platform-authentication/src/errors/MfaNotEnabledError.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaNotEnabledError.ts#L28)

#### Returns

`MfaNotEnabledError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_NOT_ENABLED" = 'MFA_NOT_ENABLED';
```

Defined in: [libs/platform-authentication/src/errors/MfaNotEnabledError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaNotEnabledError.ts#L22)

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
