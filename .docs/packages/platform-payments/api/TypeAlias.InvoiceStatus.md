---
title: 'Type Alias: InvoiceStatus'
generated: true
editUrl: false
---

# Type Alias: InvoiceStatus

```ts
type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | 'unknown';
```

Defined in: [libs/platform-payments/src/models/InvoiceStatus.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/InvoiceStatus.ts#L7)

Provider-independent invoice status values.
`unknown` represents a provider status without a normalized equivalent.
