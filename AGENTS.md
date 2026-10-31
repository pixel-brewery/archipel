# Archipel — AI Agent Guide

Archipel is an Nx monorepo of reusable, provider-agnostic **NestJS platform libraries** published under `@pixel-brewery/archipel-platform-*`. Each library follows abstract bases and adapters architecture with multi-entry-point subpath exports.

## Shared Guidance And Mandatory Architect

- `AGENTS.md` is the shared repository instruction source for all agents. Keep client-specific adapters thin; `CLAUDE.md` imports this guide rather than maintaining a second copy of its rules.
- Prefer executable configuration over prose: `package.json`, `.yarnrc.yml`, `nx.json`, project configuration and the owning TypeScript, ESLint and test configuration. Resolve stale examples against the actual owner.
- **Mandatory skill for every repository task:** Agents, subagents and automations must read and apply `.agents/skills/archipel-architect/SKILL.md` at task start, whether or not the user mentions or explicitly invokes `archipel-architect`. Use its router to combine the relevant common modules and Archipel-specific references. Classify test work by both its test kind and the production code it exercises; revisit routing when scope changes. Do not load every reference by default.
- The architect owns task decomposition and maximum useful parallel execution for every task. Use the active Claude Code or ChatGPT/Codex client's native subagents for independent work, within available capacity, without waiting for another delegation request. Assign clear scope, disjoint edit ownership and expected verification; the leading agent coordinates dependencies, integrates results and remains responsible for the final checks. Follow the shared workflow for serial dependencies and unavailable delegation. Parallelism does not grant branch, worktree, clone, external-write or release authority.
- Architecture, coding and testing guidance is maintained in the native `.agents/skills/archipel-architect/` skill and its routed references; detailed Archipel instructions remain under `.github/instructions/`. Do not edit vendored Nx skills as a substitute for project guidance.
- Every task follows [the execution environment contract](.agents/skills/archipel-architect/references/environment.md): one necessary instance per configured service/port, one global heavy task/worker, only the existing configured main database/schema, and the existing Chrome session with one new reusable tab. Resolve product runtime ownership through the actual consuming project; Archipel does not define another product's ports/database. Rewrite conflicting test fixtures instead of creating databases, containers or browser instances. Convenience scripts and historical examples do not override these limits.
- `archipel-architect` derives from the versioned `.agents/skills/architecture/SKILL.md` base installed from `pixel-brewery/skills`. Read that base first and keep Archipel paths, policies and compatibility decisions in the local project skill. `skills-lock.json` pins the upstream commit and content hash; update the base through the Skills CLI, never through peer-checkout copies. Run `yarn agents:check` after a skill update. Ordinary tasks require no peer checkout.

## Release Authority

- The human repository owner `RueDeRennes` controls release policy and has authorized continuous publication through the maintained GitHub Actions release workflow. A verified source merge into `main` requests a patch release for both fixed-version groups.
- Publication is allowed only in the canonical public `pixel-brewery/archipel` repository, immutable ID `1441080766`, from `main`, after the complete verification matrix and source-freshness checks succeed. The prepared version commit, tags and package archives must refer to the same source revision. Published package versions and release assets remain immutable.
- The release workflow uses the native short-lived `GITHUB_TOKEN` for package publication and GitHub Release APIs. Only the final protected-main version/tag push receives the narrowly scoped release App token, through the main-only `release-main` environment. PR verification and dependency installation never receive that App credential.
- Agents keep ordinary changes reviewable and may commit, push, open PRs or trigger live publication only when the user has authorized the specific action. Dry-run verification does not authorize publication. Never run a live local release to bypass required PR checks, change an existing published version, or delete registry packages as cleanup.
- Before creating a maintainer commit or merging a PR, explicitly select the maintainer's GitHub no-reply author address and verify both author and committer metadata. Local Git configuration does not control server-side merge authors.

## Quick Reference

| Action          | Command                            |
| --------------- | ---------------------------------- |
| Install         | `yarn install`                     |
| Build all       | `yarn build`                       |
| Test all        | `yarn test`                        |
| Lint all        | `yarn lint`                        |
| Typecheck       | `yarn typecheck`                   |
| Build one lib   | `npx nx run platform-{name}:build` |
| Test one lib    | `npx nx run platform-{name}:test`  |
| Regen API docs  | `npx nx run platform-{name}:docs`  |
| Docs dev server | `yarn docs:dev`                    |
| Format          | `yarn format`                      |

- **Package manager**: Yarn 4 — always use `yarn` (never `npm` or `pnpm`)
- **Node.js**: `engines.node` in `package.json` is authoritative
- **Commit format**: [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)

## Workspace Layout

```
libs/          → Platform libraries (core, payments, mailing, etc.)
apps/          → Frontend apps (docs site via VitePress)
tools/         → MCP server, Prisma generators
infra/         → Custom Nx plugins (docs executor)
.docs/         → Documentation site source
.github/       → Instructions, CODEOWNERS, Dependabot
```

- Package manifests and the ESLint boundary configuration define each library's dependencies and permitted layers
- No horizontal dependencies between same-layer libraries
- Dependencies flow downward only

## Architecture (Abstract Bases & Adapters)

- Abstract classes end in **`Base`**, live in an **`abstracts/`** subdirectory, and serve as both the type contract and NestJS DI token. Do not introduce `*Port` names or `ports/` directories.
- Interfaces start with **`I`** and live in an **`interfaces/`** subdirectory. Keep each public declaration in its own file.
- **Adapters** = concrete implementations (library-provided or app-provided)
- Registration: `XModule.register({ client: AdapterClass, configEntries: [...] })`
- Typed configuration via `createConfigKey<T>()` from `platform-configuration`
- Entity-to-DTO mapping via `MappingService` from `platform-mapping`

## Multi-Entry-Point Libraries

Libraries with multiple providers (payments, esigning, mailing, etc.) use subpath exports:

```
@pixel-brewery/archipel-platform-payments          → src/index.ts  (abstract bases, guards, models)
@pixel-brewery/archipel-platform-payments/stripe    → src/stripe/index.ts
@pixel-brewery/archipel-platform-payments/paddle    → src/paddle/index.ts
```

When adding/removing a provider, update **all** of: `package.json` (exports, typesVersions, peerDeps), `project.json` (additionalEntryPoints), `tsconfig.base.json` (path mapping), root `package.json` (SDK dep), `README.md`, and `.docs/`. See [archipel-project.instructions.md](.github/instructions/archipel-project.instructions.md) for the full checklist.

## Coding Conventions (Summary)

Full standards: [backend-coding-standards.instructions.md](.github/instructions/backend-coding-standards.instructions.md) and [frontend-coding-standards.instructions.md](.github/instructions/frontend-coding-standards.instructions.md)

- **TypeScript strict mode**, no `any` (use `unknown`), full type annotations
- Private fields prefixed with `_`, interfaces prefixed with `I`
- Code organized in **exactly** these regions in order: `#region Fields`, `#region Ctor`, `#region Properties`, `#region Methods`
- Member ordering within regions: `public` → `protected` → `private` (static before instance)
- **One public export per file**
- Controllers: I/O mapping only, no business logic
- New response contracts: prefer Standard Schema plus `ResponseReturn2`; keep `ResponseReturnBase` classes only as the migration fallback
- Services: orchestrate use-cases; **never** inline-create response objects — use `MappingService`
- Services: **never** call repository methods directly — use `execute(query)` pattern
- Archipel defines platform errors, not application business-domain errors. HTTP-facing platform errors may extend `ProblemDetailException`; infrastructure errors such as `RepositoryError` stay in their owning library and are mapped by that library's filter.
- No `process.env` outside `platform-configuration`

## Testing

Full standards: [testing-standards.instructions.md](.github/instructions/testing-standards.instructions.md)

- **Vitest only** (no Jest) — AAA pattern, one Act per test
- `vi.restoreAllMocks()` after each test
- Unit: `Test.createTestingModule` with mocked providers
- Integration: real modules + the existing configured main PostgreSQL database/schema, marked fixtures and scoped cleanup or a complete real rollback; no Testcontainers/test databases, DDL, resets or trigger bypasses
- E2E: Supertest against bootstrapped Nest app
- Coverage thresholds come from the owning Vitest configuration; inspect the actual target and configuration
- Cover meaningful observable behavior and credible success/failure paths according to risk; avoid tests that merely mirror trivial delegation or count public methods

## Key Instruction Files

Read these before working in the relevant area:

| File                                                                                                                  | Scope                                            |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [archipel-project.instructions.md](.github/instructions/archipel-project.instructions.md)                             | Library structure, provider lifecycle checklists |
| [backend-coding-standards.instructions.md](.github/instructions/backend-coding-standards.instructions.md)             | NestJS patterns, service anti-patterns, DTOs     |
| [frontend-coding-standards.instructions.md](.github/instructions/frontend-coding-standards.instructions.md)           | Angular, Lit, SCSS conventions                   |
| [enterprise-platform-readiness.instructions.md](.github/instructions/enterprise-platform-readiness.instructions.md)   | Stateless design, resilience, health checks      |
| [testing-standards.instructions.md](.github/instructions/testing-standards.instructions.md)                           | Vitest patterns, Prisma testing, coverage        |
| [api-guidelines.instructions.md](.github/instructions/api-guidelines.instructions.md)                                 | REST endpoint naming, HTTP methods               |
| [oop-design-patterns.instructions.md](.github/instructions/oop-design-patterns.instructions.md)                       | GoF patterns, SOLID principles                   |
| [testing-e2e-writing-guidelines.instructions.md](.github/instructions/testing-e2e-writing-guidelines.instructions.md) | Playwright e2e test patterns                     |

## Documentation

- Library READMEs ship with npm packages (`libs/platform-{name}/README.md`)
- Full docs site source in `.docs/` (architecture, 23 guides, per-package API docs)
- API docs under `.docs/packages/platform-{name}/api/` are **auto-generated** — do not edit manually
- Regenerate with `npx nx run platform-{name}:docs`

## Common Pitfalls

- `moduleResolution: "nodenext"` and package `exports` resolve SDK entry points; `tsconfig.base.json` mappings are for workspace packages.
- Always run `yarn install` after adding a new SDK dependency
- After changing a library's entry points, run `yarn build` to verify compilation before testing
- The MCP server (`tools/mcp`) is also a release project — it follows the same versioning as libraries

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
