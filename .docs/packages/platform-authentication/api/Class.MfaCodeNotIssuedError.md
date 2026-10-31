---
title: 'Class: MfaCodeNotIssuedError'
generated: true
editUrl: false
---

# Class: MfaCodeNotIssuedError

Defined in: [libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts#L19)

Error thrown when a sign-in challenge code is verified although none was issued.

## Remarks

The email, SMS, and push channels throw it from `verifyChallenge` when no
pending code or approval exists. As a sign-in failure it answers
`401 Unauthorized` with the stable code `MFA_CODE_NOT_ISSUED`; the setup
reports the same situation as `MfaSetupNotInitializedError`.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaCodeNotIssuedError(codeLabel): MfaCodeNotIssuedError;
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts#L32)

#### Parameters

| Parameter   | Type     | Description                                                                 |
| ----------- | -------- | --------------------------------------------------------------------------- |
| `codeLabel` | `string` | The name of the code, such as `Email code`, `SMS code`, or `Push approval`. |

#### Returns

`MfaCodeNotIssuedError`

#### Overrides

`ProblemDetailException.constructor`

## Properties

### code

```ts
readonly code: "MFA_CODE_NOT_ISSUED" = 'MFA_CODE_NOT_ISSUED';
```

Defined in: [libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaCodeNotIssuedError.ts#L23)

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
