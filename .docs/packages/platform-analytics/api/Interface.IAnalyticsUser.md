---
title: 'Interface: IAnalyticsUser'
generated: true
editUrl: false
---

# Interface: IAnalyticsUser

Defined in: [libs/platform-analytics/src/models/IAnalyticsUser.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsUser.ts#L6)

Represents user context for analytics tracking.

## Properties

### email?

```ts
readonly email?: string;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsUser.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsUser.ts#L15)

Optional e-mail address.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsUser.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsUser.ts#L10)

Unique user identifier.

---

### traits?

```ts
readonly traits?: Record<string, unknown>;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsUser.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsUser.ts#L25)

Additional user traits.

---

### username?

```ts
readonly username?: string;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsUser.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsUser.ts#L20)

Optional display name.
