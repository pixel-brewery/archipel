---
title: Guides
description: Developer guides for integrating and working with Archipel platform libraries.
---

# Guides

Practical guides for working with Archipel packages in your NestJS application.

## Foundations

| Guide                                                    | What you'll learn                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Getting Started](./getting-started)                     | Install packages, register your first module, implement abstract bases, and run the app.             |
| [Migrating to v1](./migrating-to-v1)                     | Move a consuming NestJS 12 application to Archipel's ESM-only package contract.                      |
| [Configuration Management](./configuration)              | Type-safe config keys, strategy-based resolution, central registry, and validation.                  |
| [Application Bootstrap](./application-bootstrap)         | Compose NestJS startup with platform-bootstrap, Express middleware, security, sessions, and OpenAPI. |
| [Composition Context](./composition-context)             | Stage-aware, configuration-driven module composition without direct process.env access.              |
| [Implementing Adapters](./implementing-adapters)         | How the abstract bases and adapters pattern works, how to write adapters, and how to test them.      |
| [Controller Best Practices](./controller-best-practices) | Structure controllers with Standard Schema, ResponseReturn2, guards, DI, and the @Api decorator.     |
| [Request & Response Models](./request-response-dtos)     | Standard Schema contracts and the decorated class DTO migration fallback.                            |
| [Testing](./testing)                                     | Unit testing services, testing adapters, integration testing with real databases.                    |
| [TSDoc Guidelines](./tsdoc-guidelines)                   | Documentation standards for public APIs and generated reference pages.                               |

## Security & Identity

| Guide                                                                | What you'll learn                                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Authentication & Authorization](./authentication-and-authorization) | JWT tokens, role-based access, custom scopes, MFA, sessions, and OAuth social login. |
| [Cryptography & OTP](./cryptography-and-otp)                         | Bcrypt password hashing, prefixed UUIDs, and TOTP multi-factor authentication.       |

## Data & Storage

| Guide                                           | What you'll learn                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Database Setup](./database-setup)              | PostgreSQL via Prisma, Accelerate, repositories, queries, transactions, and health.   |
| [Blob Storage](./blob-storage)                  | Multi-provider file storage, uploads, signed URLs, and metadata tracking.             |
| [Document Generation](./document-generation)    | Generate PDF and DOCX from templates with variable substitution and image processing. |
| [E-Signing Integration](./esigning-integration) | Electronic signature workflows, provider setup, and webhook handling.                 |

## Communication & Payments

| Guide                                                      | What you'll learn                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Email Delivery](./email-delivery)                         | Multi-provider email sending, template engines, and verification flows.           |
| [Email Templates](./email-templates)                       | Create, register, and override email templates with ResourceManager.              |
| [Payments & Feature Gating](./payments-and-feature-gating) | Payment provider integration, webhook handling, and feature-based access control. |

## Operations & Observability

| Guide                                                        | What you'll learn                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [Feature Flags](./feature-flags)                             | Toggle features at runtime with Azure App Configuration or Vercel Edge Config.             |
| [Telemetry & Observability](./telemetry-and-observability)   | OpenTelemetry metrics, distributed tracing, and structured logging.                        |
| [Analytics & Error Tracking](./analytics-and-error-tracking) | Capture errors and user context with Sentry, AppInsights, or Datadog.                      |
| [Caching](./caching)                                         | In-memory LRU and Redis layered caches with TTL, stale-while-revalidate, and metrics.      |
| [Queue Infrastructure](./queue-infrastructure)               | In-memory FIFO, BullMQ (Redis), and Azure Service Bus job queues.                          |
| [Health Indicators](./health-indicators)                     | Integrate health checks from all platform libraries using the unified health architecture. |

## AI & Extensibility

| Guide                                                          | What you'll learn                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Intelligence Agent Runtime](./intelligence-agents)            | Compose application-neutral agents, situations, events and bounded execution.                                 |
| [Intelligence Prompts Warm-up](./intelligence-prompts-warm-up) | Define, bind, execute, validate, and test reusable text and structured prompts.                               |
| [AI Language Generation](./ai-text-generation)                 | Provider-neutral text, structured output, streaming, tools, agents, and per-request model policy.             |
| [AI Image Generation](./ai-image-generation)                   | Provider-neutral image generation with tree-shakable provider model loaders.                                  |
| [AI Realtime Voice](./ai-realtime-voice)                       | Server-owned live audio/text sessions, interaction modes, durable streaming, metering, and explicit recovery. |
| [MCP Server](./mcp-server)                                     | Build MCP servers with tools, resources, and prompts for AI agent integration.                                |

## Platform Internals

| Guide                                                          | What you'll learn                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [OpenAPI & Feature Discovery](./openapi-and-feature-discovery) | Multi-document Swagger UI, the @Api decorator, and automatic per-module doc discovery.    |
| [Resource Management](./resource-management)                   | Load templates, assets, and files from disk, blob storage, or memory via ResourceManager. |
