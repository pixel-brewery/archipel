# Platform integration and providers

Use with common Platform and Backend safety. Read the affected portions of [enterprise platform readiness](../../../../.github/instructions/enterprise-platform-readiness.instructions.md) and [Archipel provider lifecycle conventions](../../../../.github/instructions/archipel-project.instructions.md).

## Runtime ownership

- Singleton providers hold injected dependencies, immutable configuration or explicitly bounded shared state; never retain a current user, tenant, request or session in mutable fields. Make initialization concurrency-safe and keep request context explicit or within an existing scoped mechanism.
- `platform-configuration` owns `createConfigKey<T>()`, `ConfigRegistry`, `ConfigService` and configuration strategies. Provider subpaths export their configuration-entry arrays. The application calls `ConfigModule.forRoot()` once; feature modules register their own entries. Do not read `process.env` outside the configuration owner or invent a parallel environment loader.
- Keep constructors free of network/startup effects. Use the owner's initialization hooks, and bounded teardown to close connections, flush buffers, cancel work and drain transport sessions. Preserve the existing lifecycle ordering rather than assuming another provider remains available during shutdown.
- Bound I/O by the actual provider's configurable timeout, cancellation, retry policy and resource limits. Retry only transient failures and operations whose idempotency is protected. Carry caller-supplied idempotency through the owning contract where supported; document provider limitations without inventing application deduplication in the framework.
- I/O-bound capabilities expose lightweight, bounded health indicators through `platform-health` and its existing bootstrap registration. Inspect actual `health` subpaths, indicator tests and registration before declaring a capability missing; the older enterprise document's missing-provider table is not a current inventory.
- Use owning logging/telemetry capabilities, correlation context, typed error wrapping and explicit degradation policy. No leaked secrets, raw SDK errors, silent failures or unbounded collections/listeners. Check existing public primitives before adding resilience, caching or queue machinery.

## Provider packaging checklist

1. Follow the closest live provider end to end; `platform-payments` demonstrates `PaymentClientBase`, selectable clients, optional consumer feature-access adapter, provider entry points and a health entry point.
2. Keep the neutral root barrel separate from provider SDK imports. Add or remove the provider source/barrel, package `exports`, `typesVersions`, optional SDK peer metadata, `archipel` metadata and any affected dependencies together.
3. Synchronize the build's `additionalEntryPoints`, repository workspace aliases, package SDK development dependency and lockfile through the established package-manager workflow. Validate actual NodeNext exports; do not patch SDK resolution with a copied legacy `moduleResolution: node` workaround.
4. Update the package README and the actual authored documentation/navigation owners under `.docs/`, including affected guides and architecture/provider inventories. Locate these owners; do not assume every generated package API directory has an authored `index.md`. Regenerate API docs through the owning target. Provider removal also checks contracts, examples, stale exports and orphan SDK dependencies.
5. Verify focused provider behavior, public registration/injection, compilation and packaged entry-point imports. The configured ESM verification script is `yarn verify:esm`; run it when packaging is affected. Leave package versions, changelogs, tags, publishing and releases to the owner.
