---
name: archipel-architect
description: 'Plan, implement, refactor, test, explain, or review engineering work in the Archipel monorepo. Combine shared architecture, backend/API, platform, frontend, date/time and testing rules with Archipel library contracts, abstract bases/adapters, provider lifecycle, package exports and documentation tooling.'
metadata:
  inherits: architecture
---

# Archipel Architekt

Carry out the requested engineering task through the canonical library and tooling owners. This project skill derives from the shared Architecture base and adds Archipel-specific references and maintained project instructions.

## Inherited architecture foundation

This project skill derives from the versioned [Architecture base](../architecture/SKILL.md) installed from `pixel-brewery/skills`. Read that skill and its [shared workflow](../architecture/references/common/workflow.md) first, together with root `AGENTS.md` and the [local project contract](references/project.md), for every task, including delegated work.

Apply the base's task classification, owner/reference pass, subagent coordination and completion gates. Select every applicable foundation below and combine it with the local project references; do not load unrelated modules. Local rules specialize the shared principles for this project's actual owners and frameworks. A local framework translation does not waive a general architecture invariant or expand the authorized scope.

`skills-lock.json` records the immutable upstream commit and content hash. Do not edit the installed `architecture` skill, copy common modules back into this skill, or substitute another project's architect. Restore the pinned dependency if it is missing. Validate skill updates with `python3 .agents/skills/architecture/scripts/check_inheritance.py --root . --derived archipel-architect` and the repository's configured client checks.

| Task or production boundary                                                                                 | Common module                                                                                                                          | Local project guidance                                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Solution design, architecture review, cross-cutting concerns, refactoring or migration                      | [Architecture](../architecture/references/common/architecture.md)                                                                      | [Architecture application](references/architecture.md)                                                                         |
| TypeScript abstraction, SOLID, composition or pattern selection                                             | [OOP/design patterns](../architecture/references/common/oop.md)                                                                        | [Architecture application](references/architecture.md), [Source style](references/project.md)                                  |
| NestJS modules, services, controllers, queries, entities, Prisma or persistence                             | [Backend](../architecture/references/common/backend.md)                                                                                | [Backend integration](references/backend.md)                                                                                   |
| Runtime validation/serialization, Standard Schema, response envelopes, OpenAPI or multipart                 | [Backend contracts](../architecture/references/common/backend-contracts.md), [API URLs](../architecture/references/common/api.md)      | [Transport contracts](references/backend-contracts.md)                                                                         |
| Abstract bases/adapters, provider registration, configuration, I/O, health, lifecycle or bounded resources  | [Platform](../architecture/references/common/platform.md)                                                                              | [Platform owners](references/platform.md), [Library architecture](references/architecture.md)                                  |
| Authentication, AI, files/downloads, reads, external destinations, events, webhooks, mail or cleanup        | [Backend safety](../architecture/references/common/backend-safety.md)                                                                  | [Platform integration](references/platform.md), [Backend integration](references/backend.md)                                   |
| Frontend applications, documentation UI, Angular, Lit, TypeScript/HTML/SCSS or forms                        | [Frontend](../architecture/references/common/frontend.md), [Frontend patterns](../architecture/references/common/frontend-patterns.md) | [Actual frontend owners](references/frontend.md)                                                                               |
| Calendar days, instants, time zones, date filters or date presentation                                      | [Date/time](../architecture/references/common/date-time.md)                                                                            | [Project contract](references/project.md), actual [backend](references/backend.md) or [frontend](references/frontend.md) owner |
| Unit/integration/API tests, mocks, timers, coverage or test ownership                                       | [Testing](../architecture/references/common/testing.md), plus the production domain                                                    | [Test integration](references/testing.md)                                                                                      |
| Playwright browser/UI tests and acceptance evidence                                                         | [Browser E2E](../architecture/references/common/e2e.md), plus the production domain                                                    | [Browser integration](references/e2e.md)                                                                                       |
| Package entry points, provider SDK dependencies, generated API docs, Prisma generators, MCP or Nx executors | Production domain above                                                                                                                | [Tooling and documentation](references/tooling.md), [Library architecture](references/architecture.md)                         |

Examples of combined selection:

- Provider addition: Architecture + Platform + Backend safety + Testing; follow the owning provider's registration, subpath exports, optional SDK dependencies, lifecycle and documentation chain.
- HTTP contract change: Backend + Backend contracts + API URLs + Testing; verify runtime validation/serialization, `ResponseReturn2`, generated OpenAPI and actual consumers independently.
- Repository or query change: Backend + Platform + Testing; preserve the generic data-access contract, typed query execution, transaction semantics and consumer compatibility.
- Documentation-site UI: Frontend + local VitePress integration; apply framework-specific rules only to code that actually uses that framework.
- Browser task: Browser E2E + local browser integration; distinguish writing guidance from an installed, configured, executed browser suite.

Keep product identities, business rules and consumer-specific policies in consuming applications. Apply the local documentation, export/compatibility and verification gates from [project](references/project.md); release authority remains with the human owner.

## Local environment

Every task also applies [Environment](references/environment.md): reuse the actual configured service instances and existing main database, serialize heavy work with one test worker, and use a new reusable tab in the user's existing Chrome session. Resolve application ports and database/schema ownership through Archipel's executable configuration or the actual consuming project; never invent another runtime, database or browser to make a test run.
