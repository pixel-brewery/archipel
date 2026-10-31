---
title: 'Abstract Class: EsigningClientBase'
generated: true
editUrl: false
---

# Abstract Class: EsigningClientBase

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L15)

Abstract base for e-signing provider clients.
Each provider (DocuSign, Adobe Sign, Dropbox Sign, Internal) must implement
this contract so that the consuming application can switch providers without changing business logic.

## Extended by

- [`DocuSignEsigningProvider`](Class.DocuSignEsigningProvider)
- [`AdobeSignEsigningProvider`](Class.AdobeSignEsigningProvider)
- [`DropboxSignEsigningProvider`](Class.DropboxSignEsigningProvider)
- [`InternalEsigningProvider`](Class.InternalEsigningProvider)

## Constructors

### Constructor

```ts
new EsigningClientBase(): EsigningClientBase;
```

#### Returns

`EsigningClientBase`

## Properties

### providerId

```ts
abstract readonly providerId: string;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L19)

Unique identifier of the provider implementation.

## Methods

### cancelSigningRequest()

```ts
abstract cancelSigningRequest(signingRequestId, reason?): Promise<void>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L74)

Cancel an in-progress signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |
| `reason?`          | `string` | Optional reason for cancellation.                 |

#### Returns

`Promise`\<`void`\>

---

### createSigningRequest()

```ts
abstract createSigningRequest(request): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L38)

Create a new signing request (envelope/agreement).

#### Parameters

| Parameter | Type                                                       | Description                         |
| --------- | ---------------------------------------------------------- | ----------------------------------- |
| `request` | [`ICreateSigningRequest`](Interface.ICreateSigningRequest) | The signing request creation input. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The created signing request with provider-assigned identifiers.

---

### createSigningSession()

```ts
abstract createSigningSession(request): Promise<ISigningSession>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L47)

Generate a signing session (signing link/URL) for a specific signer.

#### Parameters

| Parameter | Type                                                                     | Description                 |
| --------- | ------------------------------------------------------------------------ | --------------------------- |
| `request` | [`ICreateSigningSessionRequest`](Interface.ICreateSigningSessionRequest) | The session creation input. |

#### Returns

`Promise`\<[`ISigningSession`](Interface.ISigningSession)\>

The signing session with the signing URL.

---

### getSignedDocuments()

```ts
abstract getSignedDocuments(signingRequestId): Promise<ISignedDocument[]>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L65)

Retrieve the final signed documents for a completed signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |

#### Returns

`Promise`\<[`ISignedDocument`](Interface.ISignedDocument)[]\>

Array of signed documents with their content.

---

### getSigningRequest()

```ts
abstract getSigningRequest(signingRequestId): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L56)

Retrieve the current status and details of a signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The signing request with current status.

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:95](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L95)

Lightweight connectivity check for the e-signing provider.
Override in adapters to perform a real API call (e.g. account info).
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.

---

### verifyWebhook()

```ts
abstract verifyWebhook(
   payload,
   signature,
   headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/abstracts/EsigningClientBase.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/abstracts/EsigningClientBase.ts#L85)

Verify a webhook payload signature and return a normalized event.

#### Parameters

| Parameter   | Type                                      | Description                                                        |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------ |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.                                                  |
| `signature` | `string`                                  | Webhook signature header value.                                    |
| `headers?`  | `Record`\<`string`, `string`\>            | Optional webhook request headers (for timestamp/nonce validation). |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.
