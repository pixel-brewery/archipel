---
title: 'Abstract Class: EsigningPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: EsigningPersistenceBase

Defined in: [libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts#L9)

Abstract base for persisting signing request state.
Implement this abstract base in the consuming application to track signing requests in a database.

## Constructors

### Constructor

```ts
new EsigningPersistenceBase(): EsigningPersistenceBase;
```

#### Returns

`EsigningPersistenceBase`

## Methods

### onSigningRequestCancelled()

```ts
abstract onSigningRequestCancelled(signingRequestId): Promise<void>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts#L44)

Update persisted state when a signing request is cancelled.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |

#### Returns

`Promise`\<`void`\>

---

### onSigningRequestCreated()

```ts
abstract onSigningRequestCreated(signingRequest): Promise<void>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts#L27)

Persist a newly created signing request.

#### Parameters

| Parameter        | Type                                           | Description                     |
| ---------------- | ---------------------------------------------- | ------------------------------- |
| `signingRequest` | [`ISigningRequest`](Interface.ISigningRequest) | The signing request to persist. |

#### Returns

`Promise`\<`void`\>

---

### onSigningRequestStatusChanged()

```ts
abstract onSigningRequestStatusChanged(signingRequestId, status): Promise<void>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningPersistenceBase.ts#L36)

Update persisted state when a signing request status changes.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |
| `status`           | `string` | The new status of the signing request.            |

#### Returns

`Promise`\<`void`\>
