---
applyTo: '**'
---

You are an expert in **TypeScript, NestJS, PostgreSQL (via Prisma), and scalable backend development**. You write maintainable, secure, observable, and testable code following **NestJS** and **TypeScript** best practices, with **OpenAPI/Swagger** contracts as first‑class artifacts.

# Project Coding Standards (Backend / NestJS)

## Table of Contents

- [General Structure](#general-structure)
- [Language & Frameworks](#language--frameworks)
- [Style Conventions](#style-conventions)
- [Security Guidelines](#security-guidelines)
- [Documentation](#documentation)
- [Development Process](#development-process)
- [Editing Strategy](#editing-strategy)
- [Performance & Quality](#performance--quality)
- [NestJS Guidelines](#nestjs-guidelines)
    - [Controllers](#controllers)
    - [Providers & Modules](#providers--modules)
    - [DTOs & Validation](#dtos--validation)
    - [Entities](#entities)
    - [OpenAPI Contracts](#openapi-contracts)
    - [Persistence: Prisma + PostgreSQL](#persistence-prisma--postgresql)
    - [Error Handling](#error-handling)
    - [Caching & Queues](#caching--queues-optional)
    - [External API Resilience](#external-api-resilience)
    - [Observability & Logging](#observability--logging)
    - [Testing](#testing)
    - [PR Checklist](#pr-checklist-backend)
- [Bicep Guidelines](#bicep-guidelines-if-applicable)

---

## General Structure

- Always write code in **English** (including comments and documentation).
- Code must be **modular**, **reusable**, and **DRY**.
- Follow **object‑oriented** principles and **SOLID** design.
- Avoid **structural** or **procedural** programming.
- Always deliver **complete, production‑ready** implementations.
- No **technical debt** or **incomplete code** is allowed.
- No **anti‑patterns** or **bad practices** should be introduced.
- Apps are **thin executors**. All logic lives in libraries with clear boundaries.
- **One public export per file.** Every public class, interface, type, enum, or constant gets its own dedicated file. Private types may live in the same file as their consumer. Internal exports are exempt from this rule.

---

## Language & Frameworks

- **Language:** TypeScript (strict mode)
- **Framework:** NestJS (module‑centric DI)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **API Contracts:** OpenAPI / Swagger (`@nestjs/swagger`)
- **Testing:** Vitest (unit/integration) + Supertest (e2e)
- **Runtime:** Node.js ≥ 20

Always use the **latest stable versions**.

---

## Style Conventions

- Private fields prefixed with `_`
- Prefix all interfaces with `I`.
- Put interfaces in an `interfaces/` subdirectory and abstract classes in an `abstracts/` subdirectory.
- End every abstract class name with `Base`; do not introduce `*Port` names or `ports/` directories.
- Use **full type annotations** – never use `any` (use `unknown` if uncertain).
- Apply access modifiers: `private`, `public`, `protected`.
- **Constructor injection** for NestJS providers (services, repositories, etc.).
- Use arrow functions for inline callbacks.
- Organize code into regions
    - ONLY THIS REGIONS EXISTS
        - `#region Fields`
        - `#region Ctor`
        - `#region Properties`
        - `#region Methods`
    - `#endregion` to close each region
    - Regions must be in this order
    - No nested regions
    - No other regions allowed
    - Strict this region names, no variations or extensions
- **Member ordering within regions**: `public` → `protected` → `private`
    - Apply this order to fields, properties, and methods
    - Static members come before instance members within each access level
- Keep formatting **clean and consistent**.
- Use **strict type checking**; prefer inference when the type is obvious.
- Prefer **“const object + derived union”** or **enumless enums** for small domains.
- Don’t use abbreviations in variable names.

---

## Security Guidelines

- **Never** expose secrets, tokens, or credentials.
- Avoid **hard‑coded passwords**; read via validated configuration only.
- Code must be **secure by design**: enable **Helmet**, **CORS**, rate limiting, and input validation.
- Use **Argon2** for password hashing (if applicable). Store only salted hashes.
- Enforce authentication/authorization with guards, interceptors, and declarative decorators.

---

## Documentation

- Use **TSDoc** for all public classes, methods, and properties.
- Comments explain the **purpose**, not implementation details.
- Generate **OpenAPI** docs consistently (controllers + DTOs annotated).

---

## Development Process

1. Write **complete** and **optimized** solutions.
2. Favor **abstraction** and **modularity** (abstract bases and adapters, repositories, services).
3. Use `TODO:` comments only when necessary (and short‑lived).
4. Avoid notebook/Jupyter‑style code unless explicitly requested.

---

## Editing Strategy

1. Prefer **entire file rewrites** for consistency.
2. When splitting code, **preserve integrity** across modules and providers.
3. Always return **full updated definitions** (types, DTOs, providers, modules).

---

## Performance & Quality

- Code must be:
    - **Big‑O optimal** in time and space where it matters.
    - **Minimal**, with no dead code.
    - Fully **style‑compliant** and **lint‑clean**.
- Data access:
    - Select only required fields; avoid N+1; batch where possible.
    - Use indexes and verify plans (e.g., `EXPLAIN ANALYZE`).
    - Prefer cursor pagination for large scans.
- Rule of thumb:
    - ❌ Unoptimized = 💸 virtual $100 fine
    - ❌ Insecure = 🚫 benched in the corner

### Additional Global Policies

- Mapping keys MUST be exported constants (no inline magic strings in services or controllers).
- Enriched projections (adding computed fields) MUST define explicit interfaces; avoid spreading raw persistence objects plus `as unknown` casting.
- Random selection for large datasets (e.g. "of the day") MUST avoid large OFFSET scans; use deterministic daily hash or preselected pool when row count > 5000.
- All new public service methods require at least one happy-path and one failure-path unit test.
- No `as any` or unchecked casts for ORM aggregations: introduce typed wrappers / helper methods.

---

## NestJS Guidelines

- **Modules:** NestJS is **module‑centric**. Organize code into **feature modules**; expose only what’s public via `exports`.
- **Dynamic Modules:** Provide configuration via `XModule.register()/registerAsync()` instead of leaking global state.
- **Providers:** Single responsibility; stateless where possible; injected via constructor. Use tokens for abstractions (abstract bases).
- **Controllers:** I/O mapping only (HTTP/GraphQL/RPC). **No business logic** here.
- **Services (Application Layer):** Orchestrate use‑cases, transactions, and repositories. **NEVER inline-create response objects; use MappingService.**
- **Library core:** Keep reusable platform contracts and policies independent of consuming applications; application entities and business-domain errors belong to the consumer.
- **Repositories (Data Access):** Prisma‑backed implementations behind interfaces. Always use `execute(query)` pattern, never direct method calls.
- **Transport Contracts:** Prefer named Standard Schema contracts plus inferred
  `CreateXRequest`, `XResponse`, etc. types for new endpoints. Use decorated
  request/response classes only when the schema-native NestJS path is not
  available yet.
- **Response Envelopes:** New schema-native endpoints use `ResponseReturn2`.
  Create one envelope schema with `ResponseReturn2.schema(DataSchema)` and pass
  that same envelope schema to both `@SerializeOptions` and OpenAPI. Reuse the
  exact `DataSchema` object with `ResponseReturn2.ok()` so response transforms
  execute only once. Existing `ResponseReturnBase` endpoints remain the legacy
  class-based fallback.

### Service-Layer Anti-Patterns (NEVER DO THIS)

Services MUST NOT:

1. **Inline-create Response objects** – use `MappingService.map(KEY, entity)` in controllers
2. **Have `toResponse()` or `toStatusResponse()` helper methods** – these belong in a dedicated MappingProfile
3. **Directly call repository methods** like `this._repository.upsert()`, `findFirst()`, `update()` – use `execute(someQuery({...}))`
4. **Return `satisfies ResponseClass` object literals** – return Entity types, let controller/mapper handle response creation

Example of **WRONG** code:

```typescript
// ❌ BAD - Never do this in a Service!
return {
    subscriptionId: entity.id,
    email: entity.email,
} satisfies SomeResponse;

// ❌ BAD - No toResponse methods in services!
private toStatusResponse(entity: Entity): Response { ... }
```

- **Validation:** Register Nest's Standard Schema validation and serialization globally for schema-native contracts, alongside the legacy `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`) for decorated classes.
- **OpenAPI/Swagger:** Publish the real wire schema for every operation. Standard Schema contracts use `standardSchema`; legacy classes use `@ApiProperty`. Keep contracts versioned and exportable (JSON/YAML).
- **API Versioning:** Use Nest versioning (e.g., URI or header) and keep old versions stable until deprecation.
- **Errors:** Define typed platform errors in their owning library. HTTP-facing errors may extend `ProblemDetailException`; map infrastructure errors through their library's exception filter. Use Problem-Details style envelopes without leaking internals.
- **Configuration:** Central `ConfigModule` with a validated schema (Zod). No direct `process.env` outside config.
- **Security:** Enable Helmet, CORS; implement RBAC/ABAC; never trust client IDs; validate all inputs.
- **Observability:** Structured logging (e.g., Pino), correlation/request IDs, health & readiness endpoints, metrics/traces if available.
- **Workers/CLI:** For jobs/CRON/CLI, use **standalone application context** (`NestFactory.createApplicationContext(AppModule)`), still module‑based.

### Controllers

- Keep small and focused; map transport to/from schema models or legacy DTO/response classes.
- Use `@HttpCode`, `@Header`, and proper status codes.
- Prefer cursor pagination and explicit filter/sort schemas (legacy DTOs where Standard Schema is unavailable).
- Methods names should reflect the action: `getX`, `createX`, `updateX`, `deleteX`, `listX`, etc.

### Providers & Modules

- Keep constructor side‑effect free; expose `init()` when needed.
- Avoid circular deps; use interfaces/tokens and adapter pattern.
- For feature configuration, expose `Module.register(options)`.

### DTOs & Validation

- Prefer Standard Schema models for new request and response contracts. DTO
  classes with decorators like `@IsString()` and `@IsEmail()` are the fallback
  for paths that cannot use Standard Schema yet.
- Make object schemas strict and express arrays with the schema library's array
  primitive. On the legacy path, retain `ValidationPipe` options `whitelist`,
  `transform`, and `forbidNonWhitelisted`, plus `ParseArrayPipe` or wrapper DTOs.
- Cross-field constraints (XOR / dependent fields) MUST live in a Standard
  Schema refinement. Use a custom class-level validator only for legacy DTOs;
  never put these checks in services or controllers.
- Define and reuse constants for upper bounds (`MAX_PAGE_SIZE`,
  `MAX_SEARCH_LIMIT`) and enforce them in the schema (`.max(...)`) or, for a
  legacy class DTO, with `@Max()`.

### Entities

- All domain entities must be defined as interfaces in `models/entities` with a corresponding mapping function from the repository projection shape. Entities are the only interface between services and repositories.
- Entities never has additional methods or business logic or mapping logic.
- **Entity Purity Rule:** Entities reference ONLY other entity interfaces or primitive types. NEVER reference response classes, service classes, or external non-entity interfaces.
- **Property Naming Rule:** Entity property names MUST match Prisma schema property names exactly (e.g., if Prisma has `titleGroup`, entity must use `titleGroup`, not `title` or `titleLocalized`).
- Entities properties are strictly aligned with the Prisma schema (no extra computed properties).

### OpenAPI Contracts

- Give Standard Schemas stable IDs and publish them through `standardSchema`; annotate legacy DTOs with `@ApiProperty`. Controllers still use `@ApiTags` and response metadata.
- Generate the spec with `SwaggerModule.createDocument()`; serve `/docs` locally and protect in non‑local envs.
- Persist JSON/YAML for CI contract checks and SDK generation.

### Persistence: Prisma + PostgreSQL

- Keep the Prisma schema under backend data‑access; enforce relations, unique constraints, indexes, and cascades.
- Use **migrations**; never edit applied migrations. Use `prisma migrate deploy` in CI/CD.
- Wrap multi‑step writes in `prisma.$transaction`.
- Prefer soft delete (`deletedAt`) only when business requires recoverability.
- Configure connection via `DATABASE_URL` (environment), read only through the config module.

### Error Handling

- Define platform errors in the owning library with stable machine-readable codes. Consuming applications define their own business-domain errors.
- Return consistent error envelopes with machine‑readable codes.
- HTTP-facing platform services may throw `ProblemDetailException` subclasses. Infrastructure errors such as `RepositoryError` can extend `Error` and use a dedicated filter.

### Caching & Queues (optional)

- Use Redis for cache and queues. Define explicit keys & TTLs; invalidate on writes.
- Workers must be idempotent; configure retries with exponential backoff and DLQ metrics.
- Stale-While-Revalidate only for quasi-static reference data. Personalized list data requires strict TTL or explicit invalidation.
- Cache invalidation helpers belong in services (not repositories) and wrap delete calls defensively.

### External API Resilience

- Every outbound HTTP call MUST define: timeout (≤3000ms), retry (max 2, idempotent failures only), structured logging, and metrics.
- Implement a simple circuit breaker (open after N consecutive failures, half-open probe after cooldown).
- Never bubble raw transport errors; map to domain or return graceful null/empty results.
- Metrics: `external_http_request_total{service,action,status}`, `external_http_request_duration_ms` histogram, consecutive failure gauge.

### Observability & Logging

- Use structured logs; include `requestId`, user id (if available), latency, and status.
- Expose `/health` and `/ready`. Add basic metrics if available.
- Required baseline metrics:
    - `db_query_duration_ms` (histogram; labels: model, operation)
    - `cache_hits_total` / `cache_misses_total` (counter; labels: cache)
    - `domain_command_total` (counter; labels: command, status)
    - `external_http_request_duration_ms` (histogram; labels: service, action, status)
    - Feature-specific (e.g.): `product_lookup_source_total{source=cache|external|fallback}`
- All logs must include `requestId`; generate if absent.

### Testing

- **Unit/Integration:** Vitest. Use in‑memory doubles for domain; repository tests use the consumer's existing configured main database/schema with marked fixtures and scoped cleanup or complete rollback under the [environment contract](../../.agents/skills/archipel-architect/references/environment.md). Do not provision another database/container or reset shared data.
- **E2E:** Supertest against the single coordinated Nest HTTP runtime on its configured port. Test installed schema/constraints with owned fixtures or real rollback; never replay migrations per suite or start an extra API/database instance. Follow the same environment contract and report an incompatible runner as `BLOCKED`.
- Provide factories/builders for test data.
- Contract tests for external API clients with mocked transport (success + schema failure case).
- No untested public service methods admitted in PRs (add CI rule where feasible).

### PR Checklist (Backend)

Every backend PR must include (checked locally or via template):

```
[ ] Layering respected (no service → prisma shortcuts)
[ ] No new `any` / unsafe casts
[ ] Mapping keys via exported constants
[ ] Validation (incl. cross-field) present for new inputs
[ ] Tests added/updated (list scenarios)
[ ] Logging & metrics for new external calls
[ ] Caching TTL / invalidation evaluated
[ ] Platform errors have stable codes and HTTP mapping where applicable
```

---

## Bicep Guidelines (if applicable)

- Use **lowerCamelCase** for all identifiers.
- Define parameters with `@description` at the top.
- Prefer **symbolic names** over `resourceId()`.
- Use `.id` instead of `dependsOn`.
- **Never** output secrets or sensitive information.

---

**End of Coding Standards**
