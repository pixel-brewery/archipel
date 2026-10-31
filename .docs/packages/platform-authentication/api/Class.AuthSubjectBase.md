---
title: 'Abstract Class: AuthSubjectBase'
generated: true
editUrl: false
---

# Abstract Class: AuthSubjectBase

Defined in: [libs/platform-authentication/src/abstracts/AuthSubjectBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/AuthSubjectBase.ts#L9)

Abstract base for resolving authentication subjects by identity.
Used by the JWT, Local, and Anonymous strategies.

## Constructors

### Constructor

```ts
new AuthSubjectBase(): AuthSubjectBase;
```

#### Returns

`AuthSubjectBase`

## Methods

### findAnonymous()

```ts
abstract findAnonymous(userName): Promise<IAuthSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/AuthSubjectBase.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/AuthSubjectBase.ts#L46)

Find the anonymous / seed subject by user name.

#### Parameters

| Parameter  | Type     | Description              |
| ---------- | -------- | ------------------------ |
| `userName` | `string` | The anonymous user name. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject) \| `null`\>

The subject or `null`.

---

### findById()

```ts
abstract findById(id): Promise<IAuthSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/AuthSubjectBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/AuthSubjectBase.ts#L28)

Find a subject by its unique identifier.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `id`      | `string` | The subject identifier. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject) \| `null`\>

The subject or `null`.

---

### findByLogin()

```ts
abstract findByLogin(login): Promise<IAuthSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/AuthSubjectBase.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/AuthSubjectBase.ts#L37)

Find a subject by its login name (user name or email).

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `login`   | `string` | The login identifier. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject) \| `null`\>

The subject or `null`.
