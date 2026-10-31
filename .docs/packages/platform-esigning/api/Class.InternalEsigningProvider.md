---
title: 'Class: InternalEsigningProvider'
generated: true
editUrl: false
---

# Class: InternalEsigningProvider

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L42)

Built-in e-signing provider that manages signing requests in-memory.
This provider fulfills the same contract as external providers and can be used
for development, testing, or simple self-managed signing workflows.

## Extends

- [`EsigningClientBase`](Class.EsigningClientBase)

## Constructors

### Constructor

```ts
new InternalEsigningProvider(): InternalEsigningProvider;
```

#### Returns

`InternalEsigningProvider`

#### Inherited from

[`EsigningClientBase`](Class.EsigningClientBase).[`constructor`](Class.EsigningClientBase#constructor)

## Accessors

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L53)

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

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:186](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L186)

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

### completeSigner()

```ts
completeSigner(signingRequestId, signerId): Promise<void>;
```

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:209](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L209)

Marks a signer as having completed their signing.
This is specific to the internal provider and allows the consuming
application to programmatically complete a signer's step.

#### Parameters

| Parameter          | Type     | Description                     |
| ------------------ | -------- | ------------------------------- |
| `signingRequestId` | `string` | The signing request identifier. |
| `signerId`         | `string` | The signer identifier.          |

#### Returns

`Promise`\<`void`\>

---

### createSigningRequest()

```ts
createSigningRequest(request): Promise<ISigningRequest>;
```

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L61)

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

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:126](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L126)

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

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L169)

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

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:155](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L155)

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
   _payload,
   _signature,
   _headers?
): Promise<IEsigningWebhookEvent>;
```

Defined in: [libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts:196](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/providers/internal/InternalEsigningProvider.ts#L196)

Verify a webhook payload signature and return a normalized event.

#### Parameters

| Parameter    | Type                                      |
| ------------ | ----------------------------------------- |
| `_payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> |
| `_signature` | `string`                                  |
| `_headers?`  | `Record`\<`string`, `string`\>            |

#### Returns

`Promise`\<[`IEsigningWebhookEvent`](Interface.IEsigningWebhookEvent)\>

Normalized webhook event.

#### Overrides

[`EsigningClientBase`](Class.EsigningClientBase).[`verifyWebhook`](Class.EsigningClientBase#verifywebhook)
