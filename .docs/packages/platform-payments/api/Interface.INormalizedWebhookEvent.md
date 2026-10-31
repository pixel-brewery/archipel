---
title: 'Interface: INormalizedWebhookEvent'
generated: true
editUrl: false
---

# Interface: INormalizedWebhookEvent

Defined in: [libs/platform-payments/src/models/INormalizedWebhookEvent.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/INormalizedWebhookEvent.ts#L14)

Normalized webhook event.

## Properties

### data

```ts
readonly data: {
  checkoutSession?: INormalizedCheckoutSession;
  invoice?: {
     id: string;
     status: InvoiceStatus;
     subscriptionId: string | null;
  };
  subscription?: INormalizedSubscription;
};
```

Defined in: [libs/platform-payments/src/models/INormalizedWebhookEvent.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/INormalizedWebhookEvent.ts#L17)

#### checkoutSession?

```ts
readonly checkoutSession?: INormalizedCheckoutSession;
```

#### invoice?

```ts
readonly invoice?: {
  id: string;
  status: InvoiceStatus;
  subscriptionId: string | null;
};
```

##### invoice.id

```ts
readonly id: string;
```

##### invoice.status

```ts
readonly status: InvoiceStatus;
```

##### invoice.subscriptionId

```ts
readonly subscriptionId: string | null;
```

#### subscription?

```ts
readonly subscription?: INormalizedSubscription;
```

---

### type

```ts
readonly type:
  | "unknown"
  | "checkout.session.completed"
  | "subscription.updated"
  | "subscription.deleted"
  | "invoice.payment_failed"
  | "invoice.payment_succeeded";
```

Defined in: [libs/platform-payments/src/models/INormalizedWebhookEvent.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/INormalizedWebhookEvent.ts#L15)
