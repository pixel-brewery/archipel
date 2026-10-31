---
title: 'Abstract Class: VerificationSubjectBase'
generated: true
editUrl: false
---

# Abstract Class: VerificationSubjectBase

Defined in: [libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts#L9)

Abstract base for verifiable subject persistence.
Used by the VerificationService to manage email/PIN verification.

## Constructors

### Constructor

```ts
new VerificationSubjectBase(): VerificationSubjectBase;
```

#### Returns

`VerificationSubjectBase`

## Methods

### findByLogin()

```ts
abstract findByLogin(login): Promise<IVerifiableSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts#L28)

Find a subject by login (user name or email).

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `login`   | `string` | The login identifier. |

#### Returns

`Promise`\<[`IVerifiableSubject`](Interface.IVerifiableSubject) \| `null`\>

The verifiable subject or `null`.

---

### findByVerificationToken()

```ts
abstract findByVerificationToken(token): Promise<IVerifiableSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts#L37)

Find a subject by its current verification token.

#### Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `token`   | `string` | The verification token string. |

#### Returns

`Promise`\<[`IVerifiableSubject`](Interface.IVerifiableSubject) \| `null`\>

The subject or `null`.

---

### markVerified()

```ts
abstract markVerified(id): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts#L54)

Mark the subject as verified and clear the token.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `id`      | `string` | The subject identifier. |

#### Returns

`Promise`\<`void`\>

---

### setVerificationToken()

```ts
abstract setVerificationToken(id, token): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/VerificationSubjectBase.ts#L46)

Store a verification token on the subject.

#### Parameters

| Parameter | Type               | Description                      |
| --------- | ------------------ | -------------------------------- |
| `id`      | `string`           | The subject identifier.          |
| `token`   | `string` \| `null` | The verification token to store. |

#### Returns

`Promise`\<`void`\>
