# Archipel project contract

Read for every task with `AGENTS.md` and [shared workflow](../../architecture/references/common/workflow.md). The architect is mandatory even when not named. It derives from the pinned Architecture base; this file and the local domain references apply its foundations to Archipel.

## Environment

Apply [the execution environment contract](environment.md) for every task and delegation. It owns process reuse, configured standard ports, one global heavy task/worker, the existing main database and Chrome session. Archipel's Prisma stub does not establish a product database; the consuming project's actual configured main database/schema is the prerequisite for relational checks. Root scripts, historical Testcontainers examples and generic browser guides never authorize extra instances or test databases.

## Owners and authority

- Archipel owns reusable, provider-agnostic NestJS platform libraries under `libs/platform-*`, published as `@pixel-brewery/archipel-platform-*`. Consumer-specific entities, actor identities, business rules, authorization decisions and workflows remain in the consuming application. A framework extension must solve the same generic contract for every consumer.
- Work in the existing checkout and preserve concurrent changes. The skill grants no new permission for branches, worktrees, commits, external writes, pull requests or releases. The owner-only release rules in `AGENTS.md` apply to subagents as well.
- Reuse the existing public base classes, adapters, query operators, mappings, bootstrap steps and generators before introducing another owner. Perform the reference pass before editing and the combined-diff drift/duplication pass before completion.
- Detailed project-specific sources remain in [Archipel conventions](../../../../.github/instructions/archipel-project.instructions.md), [source conventions](../../../../.github/instructions/platform-library-source.instructions.md) and the task-selected `.github/instructions/` files. Read the relevant full source when its boundary is reached; do not load every instruction for every task.

## Executable configuration and source style

- Resolve tooling from root `package.json`, `.yarnrc.yml`, `nx.json`, the affected package manifest and `yarn nx show project <name> --json`. Use Yarn; select configured versions rather than upgrading because older prose says “latest”. The root uses the `node-modules` linker.
- `tsconfig.base.json` currently uses `module` and `moduleResolution` `nodenext`, target `es2023`, and package-export resolution. Backend relative ESM imports use `.js`. Workspace aliases identify local package entry points; do not add aliases to work around an external SDK's export resolution.
- Derive the actual dependency graph from package imports, manifests and Nx. Older “platform-core has zero Archipel dependencies” inventories are not a description of the current package: it depends on configuration, health and resources. Preserve acyclic, downward capability dependencies; do not manufacture a dependency migration from the stale inventory.
- Class regions: `Fields` → `Ctor` → `Properties` → `Methods`; no nested or alternate class regions. Members: public → protected → private, static before instance. Private fields use `_`; private methods do not. Interfaces start with `I` and live in `interfaces/`; abstract classes end in `Base` and live in `abstracts/`. One public declaration per file, except a cohesive runtime schema with its inferred type as specified by the shared contracts module.
- Use strict TypeScript, `unknown` instead of `any`, constructor injection, precise public-member annotations and English source/TSDoc. Follow [TSDoc guidance](../../../../.docs/guides/tsdoc-guidelines.md) for the affected public API. Legacy source inconsistencies do not authorize copying them.
- The shared workflow's surgical edits, installed-version policy and meaningful behavior-based verification replace older generic advice to rewrite whole files, always upgrade or create tests for incidental presentation details.

## Completion

- Select [tooling and documentation](tooling.md) when public APIs, providers, module options, environment entries, generated output or developer guidance change. Update affected package READMEs and authored `.docs/` pages; regenerate generated API pages through their owner.
- Verify the actual affected projects and consumers; a library dependency or generated document does not prove integration. Report checks actually run and any consumer prerequisites.
- Validate the pinned base and explicit derivation with `yarn agents:check`. Update the dependency through the Skills CLI with a reviewed full commit, then validate again; never synchronize private project skill trees between peer checkouts.
