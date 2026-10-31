# @pixel-brewery/archipel-platform-feature-flags

> Provider-agnostic feature flag infrastructure for NestJS with support for Azure App Configuration and Vercel Edge Config.

## Providers

| Provider                | Subpath Import                                          | SDK                                                                   |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Azure App Configuration | `@pixel-brewery/archipel-platform-feature-flags/azure`  | `@azure/app-configuration-provider` + `@microsoft/feature-management` |
| Vercel Edge Config      | `@pixel-brewery/archipel-platform-feature-flags/vercel` | `@vercel/edge-config`                                                 |
