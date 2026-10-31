---
title: 'Interface: IFeatureAccessContext'
generated: true
editUrl: false
---

# Interface: IFeatureAccessContext

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessContext.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessContext.ts#L6)

Request-scoped context for feature access checks and usage recording.

## Properties

### subject?

```ts
readonly subject?: unknown;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessContext.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessContext.ts#L22)

Original authenticated subject from the request.

---

### tenantId?

```ts
readonly tenantId?: string | number;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessContext.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessContext.ts#L17)

Optional tenant identifier when the authenticated subject carries tenancy context.

---

### userId

```ts
readonly userId: string;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessContext.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessContext.ts#L12)

Authenticated user identifier resolved by the guard.
