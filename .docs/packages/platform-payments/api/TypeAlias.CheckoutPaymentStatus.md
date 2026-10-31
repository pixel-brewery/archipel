---
title: 'Type Alias: CheckoutPaymentStatus'
generated: true
editUrl: false
---

# Type Alias: CheckoutPaymentStatus

```ts
type CheckoutPaymentStatus = 'paid' | 'unpaid' | 'noPaymentRequired' | 'unknown';
```

Defined in: [libs/platform-payments/src/models/CheckoutPaymentStatus.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/CheckoutPaymentStatus.ts#L7)

Provider-independent checkout payment status values.
`unknown` represents a provider status without a normalized equivalent.
