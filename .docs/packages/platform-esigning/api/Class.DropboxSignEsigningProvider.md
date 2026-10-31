---
title: 'Class: DropboxSignEsigningProvider'
generated: true
editUrl: false
---

# Class: DropboxSignEsigningProvider

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L71)

Dropbox Sign (HelloSign) e-signing provider.
Integrates with the Dropbox Sign API v3 via the official
`@dropbox/sign` Node.js SDK.

## Extends

- [`EsigningClientBase`](Class.EsigningClientBase)

## Constructors

### Constructor

```ts
new DropboxSignEsigningProvider(config): DropboxSignEsigningProvider;
```

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L83)

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `config`  | `ConfigService` |

#### Returns

`DropboxSignEsigningProvider`

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`constructor`](Class.EsigningClientBase#constructor)

## Accessors

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:100](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L100)

Unique identifier of the provider implementation.

##### Returns

`string`

Unique identifier of the provider implementation.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`providerId`](Class.EsigningClientBase#providerid)

## Methods

### cancelSigningRequest()

```ts
cancelSigningRequest(signingRequestId, _reason?): Promise<void>;
```

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:214](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L214)

Cancel an in-progress signing request.

#### Parameters

| Parameter          | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `signingRequestId` | `string` | The provider-specific signing request identifier. |
| `_reason?`         | `string` | -                                                 |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`cancelSigningRequest`](Class.EsigningClientBase#cancelsigningrequest)

---

### createSigningRequest()

```ts
createSigningRequest(request): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L108)

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

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:151](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L151)

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

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:193](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L193)

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

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:181](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L181)

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
   _headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts:223](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/dropbox-sign/DropboxSignEsigningProvider.ts#L223)

Verify a webhook payload signature and return a normalized event.

#### Parameters

| Parameter    | Type                                      | Description       |
| ------------ | ----------------------------------------- | ----------------- |
| `payload`    | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body. |
| `_signature` | `string`                                  | -                 |
| `_headers?`  | `Record`\<`string`, `string`\>            | -                 |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`verifyWebhook`](Class.EsigningClientBase#verifywebhook)
