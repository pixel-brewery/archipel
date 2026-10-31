# Archipel execution environment

Read for every task with `AGENTS.md` and [the project contract](project.md). This local reference governs shared-machine resources and test data; it does not change the synchronized common architecture core or grant release authority.

## Resolve the actual runtime owner

- Archipel publishes libraries; it has no product API, portal or named application database of its own. `prisma/schema.prisma` is a type-generation stub, not an application schema or permission to provision a test database. Resolve the existing main database, application schema, service endpoints and standard ports from the actual consuming project's executable configuration and environment contract. Do not copy another product's ports or database name into Archipel.
- The local documentation application is `apps/frontend/docs`. Its `docs:dev` and `docs:preview` targets in `project.json` delegate to VitePress; the current configuration has no explicit port override. Inspect the resolved target and existing listener before starting it. Do not supply a new port to evade a busy one or run dev and preview servers alongside each other for the same check.
- If no consuming application or existing database is identified for a database-backed test, establish that prerequisite through its owner. Continue independent source or unit work; do not invent a database, schema or application fixture to fill the gap.

## One necessary instance per service

- Reuse the primary checkout and existing local environment. Keep at most one necessary instance of each service on its configured standard port. Do not start alternate-port applications, private runtime copies, extra database servers or duplicate Node/tool/MCP helpers.
- Start a supporting service only when the task needs it and its owner has configured it. Existing Docker or Testcontainers examples do not authorize a second service, container or database. Count actual server instances and listeners; database worker connections and Chrome renderer processes are not additional servers or browsers.
- Before execution inspect relevant processes, executable paths, parent/child relationships, listeners and memory without exposing credentials. A busy port means identify and reuse its owner, or coordinate a deliberate replacement; it never means choose the next port.
- The leading thread coordinates process ownership and all heavy work across agents. Keep one heavy generation, build, typecheck or test task running globally at a time. Use Nx `--parallel=1` and one configured test worker; concurrent source work is permitted. Root convenience scripts containing `--parallel` do not override this limit: select the equivalent scoped serial target invocation.
- Use normal configured memory limits. Do not automatically increase heaps, workers or processes after a resource failure; narrow execution and report the actual limit.
- For a necessary restart, stop only the identified owner, confirm termination and listener release, then start one replacement on the same port. Verify children have ended when a command fails or times out. Stop task-owned helpers and watchers when no longer needed; preserve unrelated processes, user data and drafts.

## Existing main database only

- Local application, CLI, fixture and database-backed test work uses only the existing, actually configured main database and application schema identified above. Never create, drop, clone, reset or select another database, including a disposable, UUID, shadow or test database; never create a parallel test schema or launch a separate PostgreSQL/Testcontainers instance.
- Tests never run `prisma db push`, replay migrations, dismantle tables, truncate/reset shared data, disable triggers or bypass installed constraints. A normal source-schema or migration implementation request remains separate from running tests: installation is coordinated through the consumer's existing migration owner, not a fixture hook.
- Validate the configured URL and the actual connected database, server address, port and active schema before writing fixture data. Do not print DSNs, credentials or private application records. Keep the existing configuration unchanged.
- Use uniquely marked synthetic fixture records, retain their exact identities, and clean up only those owned records through the established data owner. Every test assertion and direct fixture lookup must be scoped to those identities. Never use unbounded `deleteMany`, truncate or shared seed/reset operations as isolation.
- Run global retention/cleanup behavior inside a complete real outer transaction that is rolled back on both success and failure. Bind every participating query to that transaction; a root-client write outside it survives rollback and can deadlock against it. Do not mock the disputed query or service to filter away existing records.
- Preserve genuinely independent transactions when proving concurrency and locking. Committed races require reversible, precisely owned fixtures. Keep irreversible successful writes inside rollback; prove real inter-transaction lock behavior separately when needed, and describe the distinct evidence honestly.
- Historical migration tests must not dismantle the current main schema. Adapt them to the installed schema, defaults and relevant current behavior using their real owners and own fixtures; do not claim that a historical migration was executed. A request to run all tests includes rewriting incompatible fixtures, not leaving them skipped and calling the result complete.

## Existing Chrome session

- Attach to the user's already running Chrome instance, current profile and authenticated session. Open one new task tab there and reuse it for the task's browser checks.
- Never launch another Chrome/Chromium instance, headless browser, automation profile or isolated browser context as a fallback. If the configured runner cannot use the permitted session, adapt the owning fixture or report the exact limitation; do not silently substitute another browser or claim a browser pass from skipped cases.
- Preserve other tabs, active drafts and unsaved data. Do not navigate or close the user's existing task tab. A browser-test or completion request does not override these session/resource limits.
- Verify the actual configured route and served artifact after the final relevant change. Record the route, fixture/context, viewport, actions and result; a separate preview server, build or unit test proves a different boundary.

## Coordinated implementation and verification

- Complete disjoint source work, integrate shared seams, then run one coordinated generation/build phase and one coordinated test phase. Do not keep watchers compiling intermediate edits or repeat a check without a new change, failure or unresolved concern.
- Report source implementation, executed checks and consumer/operator prerequisites separately. A dependency, configured target, skipped suite or passing neighboring test does not prove the requested integration.
