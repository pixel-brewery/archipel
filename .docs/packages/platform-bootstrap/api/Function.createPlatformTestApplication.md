---
title: 'Function: createPlatformTestApplication()'
generated: true
editUrl: false
---

# Function: createPlatformTestApplication()

```ts
function createPlatformTestApplication(configService?): IPlatformTestApplication;
```

Defined in: [libs/platform-bootstrap/src/testing/createPlatformTestApplication.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/createPlatformTestApplication.ts#L14)

Creates a lightweight in-memory NestJS application double for platform bootstrap tests.

## Parameters

| Parameter        | Type            | Description                     |
| ---------------- | --------------- | ------------------------------- |
| `configService?` | `ConfigService` | Optional config service double. |

## Returns

[`IPlatformTestApplication`](Interface.IPlatformTestApplication)

A platform test application.
