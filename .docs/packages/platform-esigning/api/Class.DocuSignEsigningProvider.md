---
title: 'Class: DocuSignEsigningProvider'
generated: true
editUrl: false
---

# Class: DocuSignEsigningProvider

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L93)

DocuSign eSignature provider.
Integrates with the DocuSign eSignature REST API v2.1 via the official
`docusign-esign` Node.js SDK.

## Extends

- [`EsigningClientBase`](Class.EsigningClientBase)

## Constructors

### Constructor

```ts
new DocuSignEsigningProvider(config): DocuSignEsigningProvider;
```

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L105)

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `config`  | `ConfigService` |

#### Returns

`DocuSignEsigningProvider`

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`constructor`](Class.EsigningClientBase#constructor)

## Accessors

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:123](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L123)

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

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:290](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L290)

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

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:131](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L131)

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

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:204](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L204)

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

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:261](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L261)

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

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:246](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L246)

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
   signature,
   _headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts:306](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/docusign/DocuSignEsigningProvider.ts#L306)

Verify a webhook payload signature and return a normalized event.

#### Parameters

| Parameter   | Type                                      | Description                     |
| ----------- | ----------------------------------------- | ------------------------------- |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.               |
| `signature` | `string`                                  | Webhook signature header value. |
| `_headers?` | `Record`\<`string`, `string`\>            | -                               |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`verifyWebhook`](Class.EsigningClientBase#verifywebhook)
