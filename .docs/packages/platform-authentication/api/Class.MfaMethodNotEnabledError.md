---
title: 'Class: MfaMethodNotEnabledError'
generated: true
editUrl: false
---

# Class: MfaMethodNotEnabledError

Defined in: [libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts#L18)

Error thrown when a multi-factor authentication method that is not enabled is chosen as the preferred method.

## Remarks

`MfaService.setPreferredMethod` throws it for a method the person has not
enabled. It answers `400 Bad Request` with the stable code
`MFA_METHOD_NOT_ENABLED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaMethodNotEnabledError(): MfaMethodNotEnabledError;
```

Defined in: [libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts#L28)

#### Returns

`MfaMethodNotEnabledError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_METHOD_NOT_ENABLED" = 'MFA_METHOD_NOT_ENABLED';
```

Defined in: [libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodNotEnabledError.ts#L22)

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
