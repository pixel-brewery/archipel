---
applyTo: '**/*.spec.ts'
name: 'Testing Standards'
description: 'Comprehensive testing standards for TypeScript, Angular, NestJS, and scalable web applications, including guidelines for unit, integration, and E2E tests using Vitest.'
---

You are an expert in **Testing for TypeScript, Angular, NestJS, and scalable web applications** (including **PostgreSQL via Prisma** backends). You write **maintainable, deterministic, and fast** tests that follow **AAA (Arrange–Act–Assert)** and **Vitest-only** standards.

Execution and fixture safety follow the repository's [environment contract](../../.agents/skills/archipel-architect/references/environment.md). Reuse the existing configured service/main-database/Chrome owners; run one coordinated heavy task and one worker. Historical examples and convenience scripts do not authorize additional instances or databases.

# Project Testing Standards

## Table of Contents

- [General Structure](#general-structure)
- [Language & Frameworks](#language--frameworks)
- [Style Conventions](#style-conventions)
- [Security Guidelines](#security-guidelines)
- [Documentation](#documentation)
- [Development Process](#development-process)
- [Editing Strategy](#editing-strategy)
- [Performance & Quality](#performance--quality)
- [Universal Testing Rules (Vitest)](#universal-testing-rules-vitest)
- [Angular Guidelines (Testing)](#angular-guidelines-testing)
    - [Components](#components)
    - [State Management](#state-management)
    - [Templates](#templates)
    - [Services](#services)
- [NestJS Guidelines (Testing)](#nestjs-guidelines-testing)
- [Prisma/PostgreSQL Testing](#prismapostgresql-testing)
- [E2E API (Supertest)](#e2e-api-supertest)
- [Mocks, Fakes & Timers](#mocks-fakes--timers)
- [CI Strategy](#ci-strategy)
- [Review Checklist](#review-checklist)

---

## General Structure

- Always write tests in **English** (including descriptions and comments).
- Tests must be **modular**, **reusable**, and **DRY**.
- Follow **object-oriented** principles and **SOLID** design for test helpers/builders.
- Avoid **structural** or **procedural** scripting in tests; prefer small, focused specs.
- Always deliver **complete, production-ready** test suites.
- No **technical debt** or **incomplete tests** (e.g., skipped/flaky) is allowed.
- No **anti-patterns** or **bad practices** should be introduced.
- **AAA is mandatory**: one clear **Act** per test; **Arrange** and **Assert** are concise and readable.
    - Mark also the regions with comments: `// arrange`, `// act`, `// assert`.
- The **it** and **describe** blocks must read like specifications (describe behavior, not implementation).
    - No function names or code structure in descriptions.

---

## Language & Frameworks

- **Languages:** TypeScript (strict)
- **Frameworks/Targets:** Angular (frontend), NestJS (backend), Prisma/PostgreSQL (data)
- **Runner:** **Vitest ONLY** for **unit**, **integration**, and **E2E** tests. **Jest is not allowed.**
- **Aux Tools:** Supertest (HTTP E2E), the existing configured PostgreSQL connection, Playwright (optional UI flows through the user's existing Chrome session)
- Always use the **latest stable versions**.

---

## Style Conventions

- Prefix all interfaces with `I` (e.g., `ITestUserBuilder`).
- Use **full type annotations** – never use `any` (prefer `unknown` if uncertain).
- Apply access modifiers in helpers: `private`, `public`, `protected`.
- Use **constructor injection** for reusable helpers/fixtures when applicable.
- Use arrow functions for inline callbacks.
- Organize code into regions (ONLY THESE REGIONS EXIST):
    - `#region Fields`
    - `#region Ctor`
    - `#region Methods`
    - `#region Properties`
- Keep formatting **clean and consistent**.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` or precise unions.
- Prefer “const object + derived union” or “enumless enums” pattern for test data domains.
- Don’t use abbreviations for variable names.

---

## Security Guidelines

- **Never** hardcode real secrets/tokens in tests.
- Use **validated config** and **test-only env vars** for credentials.
- Sanitize logs/fixtures; avoid leaking PII in snapshots or artifacts.

---

## Documentation

- Test names **describe behavior**, not implementation (read like specifications).
- Use **TSDoc** for public test utilities/builders.
- Keep example payloads minimal and purposeful; comment **why**, not **how**.

---

## Development Process

1. Write **complete** and **optimized** tests with clear Arrange/Act/Assert.
2. Favor **abstraction and modularity**: builders, factories, test modules.
3. Use `TODO:` comments only when necessary and resolve them promptly.
4. Avoid notebook-style experiments; keep specs production-grade.

---

## Editing Strategy

1. Prefer **entire file rewrites** for consistency when refactoring specs.
2. When splitting suites, **preserve integrity** (fixtures/helpers stay co-located).
3. Always return **full updated definitions** (types, builders, config).

---

## Performance & Quality

- Tests must be:
    - **Fast by default** (unit tests milliseconds; integration acceptable overhead).
    - **Deterministic** (no time/network randomness; control via fakes/mocks).
    - **Minimal** with no dead code.
- Coverage targets (minimum): **Branches 85%**, **Lines 90%**, **Statements 90%**.
- Rule of thumb:
    - ❌ Unoptimized = 💸 virtual $100 fine
    - ❌ Flaky = 🚫 benched in the corner

---

## Universal Testing Rules (Vitest)

- **Vitest is mandatory** for all tests. Use `vi` for spies, mocks, and timers. **Do not use Jest** APIs.
- Restore state after each test: `vi.restoreAllMocks()`; reset timers/fakes.
- Use **fake timers** intentionally (`vi.useFakeTimers()` / `vi.useRealTimers()`), and set system time when needed.
- Keep one **Act** per test. Multiple Asserts are fine if they check the **same behavior**.
- No `as any` casts in tests; if shape differs create a narrow interface or a typed test double.
- Randomness MUST be deterministic: inject seeded RNG or stub `Math.random`.
- Time-dependent logic MUST use fake timers with explicit `setSystemTime`.
- Each new public service method: at least one happy path + one failure path test.

---

## Angular Guidelines (Testing)

- Configure TestBed with modern providers (e.g., `provideHttpClient()` + `provideHttpClientTesting()` for HTTP).
- Use **signals** for local state; test `computed()` outputs and side effects deterministically.
- Prefer **Reactive Forms**; assert control states/validators.
- Avoid `ngClass`/`ngStyle` in tests; assert classes/styles via bindings.
- Use native control flow (`@if`, `@for`, `@switch`) in components; test visible DOM with harnesses or `fixture.nativeElement`.
- Avoid `$any()` in templates; tests should not depend on it.
- Keep components small; focus tests on **public surface** (inputs/outputs/rendered result).

### Components

- Test **input()** and **output()** behavior and DOM changes.
- Use **fixture.detectChanges()** judiciously; prefer async/await for stability.
- For image usage, if relevant, include `NgOptimizedImage` in TestBed providers.

### State Management

- Use signals for local component state; validate **derived state** via `computed()`.
- Keep transformations pure; avoid global stores in unit specs.

### Templates

- Assert only user-visible behavior; avoid brittle selectors.
- For HTTP-driven components, use `HttpTestingController` to expect/flush requests.

### Services

- Unit test services with `provideHttpClientTesting()` for HTTP.
- Inject dependencies; **do not** reach across module boundaries.

---

## NestJS Guidelines (Testing)

- **Unit tests:** use `Test.createTestingModule` with provider overrides/mocks.
- **Integration tests:** wire real modules + **Prisma** against the actual consuming project's existing configured main database/schema. No extra PostgreSQL/Testcontainers instance or test database is permitted.
- **E2E API tests:** use the single coordinated Nest HTTP runtime with **Supertest**. Reuse it or coordinate its replacement on the configured port; do not launch an additional ephemeral/alternate-port API. A testing module without a listener is not a second server.
- Mirror production's global **Standard Schema validation and serialization**
  in test apps alongside the legacy `ValidationPipe`
  (`whitelist`/`transform`/`forbidNonWhitelisted`). Assert rejected schema
  inputs, filtered/transformed response data, and legacy DTO rejection where
  that fallback remains.
- Centralize **exception filters** and assert Problem-Details style responses.
- Test platform error responses: trigger a known package error and assert the documented HTTP status and Problem Details fields `{ type, title, status, code }` where applicable.
- Cross-field validation (XOR / dependencies) scenarios MUST assert both acceptance and rejection cases.

---

## Prisma/PostgreSQL Testing

- Use only the existing, actually configured main database and application schema. Verify both its configured URL and actual database, server address, port and schema before fixture writes; keep credentials out of output. Archipel's Prisma schema is a type-generation stub, so relational tests require a real consumer/project owner rather than an invented database name.
- Never create/drop/clone a database, provision a disposable/UUID/shadow/test database or schema, start Testcontainers, run `prisma db push`, replay migrations, reset/truncate shared data or disable triggers. When asked to run all tests, rewrite incompatible fixtures rather than calling their skips a complete pass.
- Isolate uniquely marked synthetic records with explicit fixture-scoped cleanup or a complete real rollback on both success and failure. Global retention/cleanup queries require that outer rollback and transaction-bound calls, not root-client writes or mocks of the disputed query. Preserve real independent transactions for concurrency evidence; keep immutable successful writes inside rollback and describe separate locking evidence accurately.
- Historical migration tests must not dismantle the installed schema. Verify its actual defaults, constraints and current persisted behavior through owning queries with own fixtures, and distinguish that result from running the historical migration. Migration installation remains a separately coordinated consumer-owner operation.
- Wrap multi-step writes in `prisma.$transaction` in code under test.
- For heavy fixture seeding: prefer idempotent seed helper returning created IDs (avoid duplicating inserts across tests).
- GroupBy / aggregate paths MUST have a test asserting numeric correctness and type safety (no unsafe casting).

---

## E2E API (Supertest)

- Use **Supertest** with the real HTTP server from Nest’s app instance.
- Assert status codes, headers (ETag, Cache-Control), and JSON bodies.
- Prefer **cursor-based pagination** assertions for large lists.
- Hot paths (e.g. search, recipe list) MUST assert performance budget indirectly: response contains pagination metadata and limited payload size.
- Caching scenarios: first request (miss) vs second (hit) when cacheable endpoint is introduced.

---

## Mocks, Fakes & Timers

- Use `vi.fn()` for spies/stubs; avoid manual monkey-patching.
- Provide fakes for **clock**, **UUID**, **random**, injected via small adapters.
- Limit global state; always **restore** in `afterEach`.
- External HTTP client tests (e.g. OpenFoodFacts) MUST include: success schema case, schema validation failure, network timeout (simulated) and retry behavior.
- Circuit breaker logic (if present) requires: closed → open transition, open short-circuit, half-open recovery.

---

## CI Strategy

1. `lint` → `typecheck` → `vitest unit` → `vitest integration (DB)` → `build` → `vitest e2e` (Supertest) → `contract check` (OpenAPI drift)
2. On the shared local machine, execute one heavy task and one test worker at a time; cache existing node/prisma artifacts. Any separately configured CI sharding follows its own explicit resource owner and grants no local container/database permission.
3. Publish OpenAPI JSON as an artifact; optionally generate typed clients.
4. Run contract tests for external API clients (schema drift) before E2E.
5. Fail build if coverage thresholds unmet or untested public methods detected (scriptable check scanning service exports).

---

## Review Checklist

- [ ] AAA enforced (single Act)
- [ ] **Vitest-only** rule satisfied (no Jest imports/globals)
- [ ] Deterministic (time/network seeded/faked)
- [ ] Validation/auth paths covered
- [ ] Error and success cases tested
- [ ] Coverage thresholds met (and meaningful)
- [ ] No test smells (sleep/polling/flaky patterns)
- [ ] External API contract tests added/updated (if client changed)
- [ ] Cache hit/miss behavior verified (if caching introduced)
- [ ] Platform error responses verified where applicable
- [ ] Random selection deterministic & reproducible (seeded)

---

## Anti-patterns (avoid)

- Using **Jest** or `jest.*` APIs.
- Multiple Acts per test; hidden Acts inside helpers.
- Over-mocking Prisma or HTTP in **integration** tests (use real services there).
- Global state between tests; un-restored timers/mocks.
- UI E2E for everything; prefer API E2E + unit/integration depth.

---

## Bicep Guidelines (if applicable)

- Use **lowerCamelCase** for all identifiers
- Define parameters with `@description` at the top
- Prefer **symbolic names** over `resourceId()`
- Use `.id` instead of `dependsOn`
- **Never** output secrets or sensitive information

---

**End of Testing Standards**
