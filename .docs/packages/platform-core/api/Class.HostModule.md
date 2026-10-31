---
title: 'Class: HostModule'
generated: true
editUrl: false
---

# Class: HostModule

Defined in: [libs/platform-core/src/host/HostModule.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/host/HostModule.ts#L27)

The `HostModule` provides host-related services globally.

This module exports:

- `HostService`: Provides access to host configuration (host URL, stage, version, etc.)
- `ContentTemplateEngine`: Template engine for rendering dynamic content

## Remarks

This module is marked as `@Global()` so it only needs to be imported once
in the root `AppModule`. All services are then available throughout the application.

## Constructors

### Constructor

```ts
new HostModule(): HostModule;
```

#### Returns

`HostModule`
