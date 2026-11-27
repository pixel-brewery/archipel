---
title: 'Class: MfaReplayProtectionUnavailableError'
generated: true
editUrl: false
---

# Class: MfaReplayProtectionUnavailableError

Defined in: [libs/platform-authentication/src/errors/MfaReplayProtectionUnavailableError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaReplayProtectionUnavailableError.ts#L9)

Fails closed when replay protection is configured but the OTP provider cannot expose its verified counter.

## Extends

- `ProblemDetailException`

## Constructors

### Constructor

```ts
new MfaReplayProtectionUnavailableError(): MfaReplayProtectionUnavailableError;
```

Defined in: [libs/platform-authentication/src/errors/MfaReplayProtectionUnavailableError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/errors/MfaReplayProtectionUnavailableError.ts#L15)

#### Returns

`MfaReplayProtectionUnavailableError`

#### Overrides

`ProblemDetailException.constructor`

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
