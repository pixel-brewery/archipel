---
title: Patterns
description: Reusable implementation patterns for Archipel platform libraries and applications.
---

# Patterns

These patterns document repeatable implementation shapes used across Archipel. Use them when adding platform library code, application integration code, or AI-assisted scaffolding that must follow repository conventions.

| Pattern                                                | What it covers                                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [Configuration Pattern](./config-pattern)              | Typed config keys, registry entries, and `ConfigModule` integration.                            |
| [Transport Model & Validation Pattern](./dto-pattern)  | Standard Schema request/response contracts, OpenAPI, and the legacy class DTO fallback.         |
| [Error Handling Pattern](./error-handling-pattern)     | Platform errors, exception filters, and structured error responses.                             |
| [Guard & Interceptor Pattern](./guard-pattern)         | Metadata decorators, guards, interceptors, and request enforcement.                             |
| [Mapping Pattern](./mapping-pattern)                   | Type-safe mapping keys, profiles, and `MappingService` usage.                                   |
| [Dynamic Module Pattern](./module-pattern)             | NestJS dynamic module registration and dependency wiring.                                       |
| [Query Pattern](./query-pattern)                       | Repository query objects and transactional query execution.                                     |
| [Repository Pattern](./repository-pattern)             | `RepositoryBase` subclasses and Prisma delegate isolation.                                      |
| [Testing Pattern](./testing-pattern)                   | Vitest structure, mocks, and integration test conventions.                                      |
| [Bootstrap Pattern](./bootstrap-pattern)               | Composable NestJS startup with `PlatformApplication` and `PlatformBootstrapStep`.               |
| [Realtime Session Pattern](./realtime-session-pattern) | Long-lived connection ownership, per-fragment durability, metering, backpressure, and recovery. |
