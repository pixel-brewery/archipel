---
title: 'Interface: IAnalyticsBreadcrumb'
generated: true
editUrl: false
---

# Interface: IAnalyticsBreadcrumb

Defined in: [libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts#L6)

Represents a breadcrumb entry for analytics trail.

## Properties

### category

```ts
readonly category: string;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts#L10)

Category of the breadcrumb (e.g. `http`, `navigation`, `user`).

---

### data?

```ts
readonly data?: Record<string, unknown>;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts#L25)

Additional metadata.

---

### level?

```ts
readonly level?: "fatal" | "error" | "warning" | "info" | "debug";
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts#L20)

Severity level.

---

### message

```ts
readonly message: string;
```

Defined in: [libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/models/IAnalyticsBreadcrumb.ts#L15)

Human-readable message.
