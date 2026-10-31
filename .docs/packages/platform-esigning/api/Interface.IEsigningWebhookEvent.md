---
title: 'Interface: IEsigningWebhookEvent'
generated: true
editUrl: false
---

# Interface: IEsigningWebhookEvent

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L12)

Normalized representation of a webhook event from an e-signing provider.

## Properties

### eventId

```ts
readonly eventId: string;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L14)

Provider-specific event identifier.

---

### eventType

```ts
readonly eventType: WebhookEventType;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L17)

Normalized event type.

---

### occurredAt

```ts
readonly occurredAt: Date;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L26)

Timestamp when the event occurred.

---

### rawPayload

```ts
readonly rawPayload: unknown;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L29)

Provider-specific raw event payload.

---

### signerId?

```ts
readonly signerId?: string;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L23)

Signer the event relates to, if applicable.

---

### signingRequestId

```ts
readonly signingRequestId: string;
```

Defined in: [libs/platform-esigning/src/models/IEsigningWebhookEvent.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/IEsigningWebhookEvent.ts#L20)

Signing request the event relates to.
