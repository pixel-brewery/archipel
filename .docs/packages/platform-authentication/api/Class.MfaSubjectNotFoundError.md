---
title: 'Class: MfaSubjectNotFoundError'
generated: true
editUrl: false
---

# Class: MfaSubjectNotFoundError

Defined in: [libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts#L19)

Error thrown when the `MfaSubjectBase` does not find the person of a multi-factor authentication operation.

## Remarks

Every `MfaService` and channel operation that reads the multi-factor
authentication state of a person throws it when that person does not
exist. It answers `400 Bad Request` with the stable code
`MFA_SUBJECT_NOT_FOUND`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaSubjectNotFoundError(): MfaSubjectNotFoundError;
```

Defined in: [libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts#L29)

#### Returns

`MfaSubjectNotFoundError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_SUBJECT_NOT_FOUND" = 'MFA_SUBJECT_NOT_FOUND';
```

Defined in: [libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaSubjectNotFoundError.ts#L23)

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
