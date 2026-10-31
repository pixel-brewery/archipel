---
title: 'Class: MfaMethodAlreadyEnabledError'
generated: true
editUrl: false
---

# Class: MfaMethodAlreadyEnabledError

Defined in: [libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts#L17)

Error thrown when the setup of a multi-factor authentication method starts although the method is already enabled.

## Remarks

`MfaService.initSetup` throws it for a method the person already uses. It
answers `400 Bad Request` with the stable code `MFA_METHOD_ALREADY_ENABLED`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaMethodAlreadyEnabledError(): MfaMethodAlreadyEnabledError;
```

Defined in: [libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts#L27)

#### Returns

`MfaMethodAlreadyEnabledError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_METHOD_ALREADY_ENABLED" = 'MFA_METHOD_ALREADY_ENABLED';
```

Defined in: [libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaMethodAlreadyEnabledError.ts#L21)

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
