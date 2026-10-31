---
title: 'Interface: IFeatureAccessResult'
generated: true
editUrl: false
---

# Interface: IFeatureAccessResult

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L6)

Result of a feature access check.

## Properties

### allowed

```ts
readonly allowed: boolean;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L12)

Whether the user is allowed to use the feature.

---

### limit

```ts
readonly limit: number;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L22)

Maximum allowed usage count. `-1` means unlimited.

---

### remaining

```ts
readonly remaining: number;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L27)

Remaining usage count. `-1` means unlimited.

---

### resetAt

```ts
readonly resetAt: Date;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L32)

When the current usage period resets.

---

### used

```ts
readonly used: number;
```

Defined in: [libs/platform-payments/src/contracts/IFeatureAccessResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/contracts/IFeatureAccessResult.ts#L17)

Current usage count for the feature in the active period.
