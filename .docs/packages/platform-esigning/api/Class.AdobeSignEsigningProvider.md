---
title: 'Class: AdobeSignEsigningProvider'
generated: true
editUrl: false
---

# Class: AdobeSignEsigningProvider

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L114)

Adobe Acrobat Sign e-signing provider.
Integrates with the Adobe Sign REST API v6 to manage agreements,
signing sessions, and webhook verification.

## Remarks

Adobe Sign does not provide a maintained Node.js SDK.
This provider communicates with the REST API directly using the
built-in `fetch` API available in Node.js 18+.

## Extends

- [`EsigningClientBase`](Class.EsigningClientBase)

## Constructors

### Constructor

```ts
new AdobeSignEsigningProvider(config): AdobeSignEsigningProvider;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:124](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L124)

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `config`  | `ConfigService` |

#### Returns

`AdobeSignEsigningProvider`

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`constructor`](Class.EsigningClientBase#constructor)

## Accessors

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:133](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L133)

Unique identifier of the provider implementation.

##### Returns

`string`

Unique identifier of the provider implementation.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`providerId`](Class.EsigningClientBase#providerid)

## Methods

### cancelSigningRequest()

```ts
cancelSigningRequest(signingRequestId, reason?): Promise<void>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:298](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L298)

Cancel an in-progress signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |
| `reason?`          | `string` | Optional reason for cancellation.                 |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`cancelSigningRequest`](Class.EsigningClientBase#cancelsigningrequest)

---

### createSigningRequest()

```ts
createSigningRequest(request): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:141](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L141)

Create a new signing request (envelope/agreement).

#### Parameters

| Parameter | Type                                                       | Description                         |
| --------- | ---------------------------------------------------------- | ----------------------------------- |
| `request` | [`ICreateSigningRequest`](Interface.ICreateSigningRequest) | The signing request creation input. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The created signing request with provider-assigned identifiers.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`createSigningRequest`](Class.EsigningClientBase#createsigningrequest)

---

### createSigningSession()

```ts
createSigningSession(request): Promise<ISigningSession>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:213](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L213)

Generate a signing session (signing link/URL) for a specific signer.

#### Parameters

| Parameter | Type                                                                     | Description                 |
| --------- | ------------------------------------------------------------------------ | --------------------------- |
| `request` | [`ICreateSigningSessionRequest`](Interface.ICreateSigningSessionRequest) | The session creation input. |

#### Returns

`Promise`\<[`ISigningSession`](Interface.ISigningSession)\>

The signing session with the signing URL.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`createSigningSession`](Class.EsigningClientBase#createsigningsession)

---

### getSignedDocuments()

```ts
getSignedDocuments(signingRequestId): Promise<ISignedDocument[]>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:277](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L277)

Retrieve the final signed documents for a completed signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |

#### Returns

`Promise`\<[`ISignedDocument`](Interface.ISignedDocument)[]\>

Array of signed documents with their content.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`getSignedDocuments`](Class.EsigningClientBase#getsigneddocuments)

---

### getSigningRequest()

```ts
getSigningRequest(signingRequestId): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:247](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L247)

Retrieve the current status and details of a signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |

#### Returns

`Promise`\<[`ISigningRequest`](Interface.ISigningRequest)\>

The signing request with current status.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`getSigningRequest`](Class.EsigningClientBase#getsigningrequest)

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

#### Inherited from

[`EsigningClientBase`](Class.EsigningClientBase).[`ping`](Class.EsigningClientBase#ping)

---

### verifyWebhook()

```ts
verifyWebhook(
   payload,
   _signature,
   headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts:308](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/adobe-sign/AdobeSignEsigningProvider.ts#L308)

Verify a webhook payload signature and return a normalized event.

#### Parameters

| Parameter    | Type                                      | Description                                                        |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------ |
| `payload`    | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.                                                  |
| `_signature` | `string`                                  | -                                                                  |
| `headers?`   | `Record`\<`string`, `string`\>            | Optional webhook request headers (for timestamp/nonce validation). |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`verifyWebhook`](Class.EsigningClientBase#verifywebhook)
