---
title: 'Interface: IHealthCheckResult'
generated: true
editUrl: false
---

# Interface: IHealthCheckResult

Defined in: [libs/platform-health/src/IHealthCheckResult.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthCheckResult.ts#L6)

Represents the result of a health check indicator.

## Properties

### details?

```ts
details?: Record<string, unknown>;
```

Defined in: [libs/platform-health/src/IHealthCheckResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthCheckResult.ts#L20)

Optional additional details about the health check.

---

### name

```ts
name: string;
```

Defined in: [libs/platform-health/src/IHealthCheckResult.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthCheckResult.ts#L10)

The name of the health indicator (e.g., 'database', 'app').

---

### status

```ts
status: 'up' | 'down';
```

Defined in: [libs/platform-health/src/IHealthCheckResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthCheckResult.ts#L15)

The status of the health indicator ('up', 'down').
