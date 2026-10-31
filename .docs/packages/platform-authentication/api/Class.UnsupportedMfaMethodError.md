---
title: 'Class: UnsupportedMfaMethodError'
generated: true
editUrl: false
---

# Class: UnsupportedMfaMethodError

Defined in: [libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts#L17)

Error thrown when no channel is registered for a multi-factor authentication method.

## Remarks

`MfaService` throws it for a method name without a registered `IMfaChannel`.
It answers `400 Bad Request` with the stable code `UNSUPPORTED_MFA_METHOD`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new UnsupportedMfaMethodError(method): UnsupportedMfaMethodError;
```

Defined in: [libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts#L30)

#### Parameters

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| `method`  | `string` | The requested method name. |

#### Returns

`UnsupportedMfaMethodError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "UNSUPPORTED_MFA_METHOD" = 'UNSUPPORTED_MFA_METHOD';
```

Defined in: [libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/UnsupportedMfaMethodError.ts#L21)

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
