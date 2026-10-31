---
title: 'Class: EsigningService'
generated: true
editUrl: false
---

# Class: EsigningService

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L23)

Application-level service for e-signing operations.
Delegates to the configured [EsigningClientBase](Class.EsigningClientBase) and optionally invokes
the [EsigningPersistenceBase](Class.EsigningPersistenceBase) for state tracking.

## Constructors

### Constructor

```ts
new EsigningService(client, persistence): EsigningService;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L41)

Initializes a new instance of the EsigningService class.

#### Parameters

| Parameter     | Type                                                                 | Description                                                  |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| `client`      | [`EsigningClientBase`](Class.EsigningClientBase)                     | The concrete e-signing provider implementation.              |
| `persistence` | [`EsigningPersistenceBase`](Class.EsigningPersistenceBase) \| `null` | Optional abstract base for persisting signing request state. |

#### Returns

`EsigningService`

## Accessors

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L51)

Identifier of the active provider.

##### Returns

`string`

## Methods

### cancelSigningRequest()

```ts
cancelSigningRequest(signingRequestId, reason?): Promise<void>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L114)

Cancel an in-progress signing request.

#### Parameters

| Parameter          | Type     | Description                       |
| ------------------ | -------- | --------------------------------- |
| `signingRequestId` | `string` | The signing request identifier.   |
| `reason?`          | `string` | Optional reason for cancellation. |

#### Returns

`Promise`\<`void`\>

---

### createSigningRequest()

```ts
createSigningRequest(request): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L66)

Create a new signing request.

#### Parameters

| Parameter | Type                                                       | Description                         |
| --------- | ---------------------------------------------------------- | ----------------------------------- |
| `request` | [`ICreateSigningRequest`](Interface.ICreateSigningRequest) | The signing request creation input. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The created signing request.

---

### createSigningSession()

```ts
createSigningSession(request): Promise<ISigningSession>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L81)

Generate a signing session (signing link) for a specific signer.

#### Parameters

| Parameter | Type                                                                     | Description                 |
| --------- | ------------------------------------------------------------------------ | --------------------------- |
| `request` | [`ICreateSigningSessionRequest`](Interface.ICreateSigningSessionRequest) | The session creation input. |

#### Returns

`Promise`\<[`ISigningSession`](Interface.ISigningSession)\>

The signing session.

---

### getSignedDocuments()

```ts
getSignedDocuments(signingRequestId): Promise<ISignedDocument[]>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L103)

Retrieve the final signed documents for a completed signing request.

#### Parameters

| Parameter          | Type     | Description                     |
| ------------------ | -------- | ------------------------------- |
| `signingRequestId` | `string` | The signing request identifier. |

#### Returns

`Promise`\<[`ISignedDocument`](Interface.ISignedDocument)[]\>

Array of signed documents.

---

### getSigningRequest()

```ts
getSigningRequest(signingRequestId): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L92)

Retrieve the current status and details of a signing request.

#### Parameters

| Parameter          | Type     | Description                     |
| ------------------ | -------- | ------------------------------- |
| `signingRequestId` | `string` | The signing request identifier. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The signing request with current status.

---

### verifyWebhook()

```ts
verifyWebhook(
   payload,
   signature,
   headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/services/EsigningService.ts:130](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/services/EsigningService.ts#L130)

Verify a webhook payload and return a normalized event.
Optionally updates persistence if a state change is detected.

#### Parameters

| Parameter   | Type                                      | Description                                                        |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------ |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.                                                  |
| `signature` | `string`                                  | Webhook signature header value.                                    |
| `headers?`  | `Record`\<`string`, `string`\>            | Optional webhook request headers (for timestamp/nonce validation). |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.
