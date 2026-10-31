---
title: 'Abstract Class: MfaSubjectBase'
generated: true
editUrl: false
---

# Abstract Class: MfaSubjectBase

Defined in: [libs/platform-authentication/src/abstracts/MfaSubjectBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaSubjectBase.ts#L10)

Abstract base for reading and writing MFA state on the underlying subject entity.
Used by the MfaService and all MFA channel implementations.

## Constructors

### Constructor

```ts
new MfaSubjectBase(): MfaSubjectBase;
```

#### Returns

`MfaSubjectBase`

## Methods

### findById()

```ts
abstract findById(id): Promise<IMfaSubject | null>;
```

Defined in: [libs/platform-authentication/src/abstracts/MfaSubjectBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaSubjectBase.ts#L29)

Find an MFA subject by its unique identifier.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `id`      | `string` | The subject identifier. |

#### Returns

`Promise`\<[`IMfaSubject`](Interface.IMfaSubject) \| `null`\>

The MFA subject or `null`.

---

### updateMfaState()

```ts
abstract updateMfaState(id, data): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/MfaSubjectBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaSubjectBase.ts#L38)

Update MFA-related fields on the subject.

#### Parameters

| Parameter | Type                                               | Description                 |
| --------- | -------------------------------------------------- | --------------------------- |
| `id`      | `string`                                           | The subject identifier.     |
| `data`    | [`IMfaSubjectUpdate`](Interface.IMfaSubjectUpdate) | The partial update payload. |

#### Returns

`Promise`\<`void`\>
