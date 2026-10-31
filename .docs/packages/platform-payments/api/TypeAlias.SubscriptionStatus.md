---
title: 'Type Alias: SubscriptionStatus'
generated: true
editUrl: false
---

# Type Alias: SubscriptionStatus

```ts
type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incompleteExpired' | 'pastDue' | 'trialing' | 'unpaid' | 'paused' | 'unknown';
```

Defined in: [libs/platform-payments/src/models/SubscriptionStatus.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/models/SubscriptionStatus.ts#L7)

Provider-independent subscription status values.
`unknown` represents a provider status without a normalized equivalent.
