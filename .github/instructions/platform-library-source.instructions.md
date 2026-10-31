---
applyTo: '**/*.ts'
name: 'Platform Library Source Conventions'
description: 'Enforces region ordering, member visibility, base/adapter patterns, and service anti-patterns for all platform library TypeScript source files.'
---

# Platform Library Source File Conventions

These rules apply to all `.ts` files. They complement the full [backend-coding-standards.instructions.md](backend-coding-standards.instructions.md).

## Region Ordering (Mandatory)

Every class must organize code in **exactly** these regions, in this order:

```typescript
// #region Fields
// #endregion

// #region Ctor
// #endregion

// #region Properties
// #endregion

// #region Methods
// #endregion
```

- No nested regions. No other region names. No variations.
- Within each region: `public` → `protected` → `private` (static before instance).

## Naming

- Private fields: prefix with `_` (e.g., `private _configService: ConfigService`)
- Private methods: **no** `_` prefix (e.g., `private parseResponse()`)
- Interfaces: prefix with `I` (e.g., `IPaymentModuleOptions`)
- Interfaces live in an `interfaces/` subdirectory, not beside implementations or under `contracts/`.
- Abstract classes end in `Base` and live in an `abstracts/` subdirectory. Never use `*Port` class names or `ports/` directories.
- One public export per file

## Abstract Base / Adapter Rules

- Abstract base classes serve as both the type contract and NestJS DI token; their names end in `Base` and their files live under `abstracts/`.
- **Adapters** extend the abstract base and are decorated with `@Injectable()`
- Adapter constructors inject dependencies via constructor injection
- All abstract methods from the abstract base must be implemented

## Service Anti-Patterns (NEVER)

Services must NOT:

1. Inline-create response/DTO objects — use `MappingService.map(KEY, entity)`
2. Have `toResponse()` or `toStatusResponse()` helper methods
3. Call repository methods directly (e.g., `this._repo.findFirst()`) — use `execute(query)` pattern
4. Return `satisfies ResponseClass` object literals

## Configuration

- No `process.env` — use `createConfigKey<T>()` from `platform-configuration`
- Every provider exports a `{PROVIDER}_CONFIG_ENTRIES` array
- Read config via injected `ConfigService.get(KEY)`

## Error Handling

- Throw typed errors owned by the library (e.g., `PaymentError`, `MailDeliveryError`) instead of exposing raw provider errors
- HTTP-facing errors may extend `ProblemDetailException`; infrastructure errors use their owning library's filter where needed
- Never silently swallow errors — log with context or re-throw

## Type Safety

- No `any` — use `unknown` if type is uncertain
- No `as any` casts for ORM/API results — introduce typed wrappers
- Full type annotations on all public members
