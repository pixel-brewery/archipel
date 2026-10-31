---
applyTo: '**'
description: 'Project coding standards for TypeScript, Angular, and scalable web application development.'
---

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

# Project Coding Standards

## Table of Contents

- [General Structure](#general-structure)
- [Language & Frameworks](#language--frameworks)
- [Style Conventions](#style-conventions)
- [Security Guidelines](#security-guidelines)
- [Documentation](#documentation)
- [Development Process](#development-process)
- [Editing Strategy](#editing-strategy)
- [Performance & Quality](#performance--quality)
- [Angular Guidelines](#angular-guidelines)
- [Lit Guidelines](#lit-guidelines)
- [Bicep Guidelines](#bicep-guidelines-if-applicable)

---

## General Structure

- Always write code in english. (also comments and documentation)
- Code must be **modular**, **reusable**, and **DRY**.
- Follow **object-oriented** principles and **SOLID** design.
- Avoid **structural** or **procedural** programming.
- Always deliver **complete, production-ready** implementations.
- No **technical debt** or **incomplete code** is allowed.
- No **anti-patterns** or **bad practices** should be introduced.
- **One public export per file.** Every public class, interface, type, enum, or constant gets its own dedicated file. Private types may live in the same file as their consumer. Internal exports are exempt from this rule.

---

## Language & Frameworks

- **Languages:** TypeScript, HTML, SCSS
- **Frameworks:** Angular, Lit, Stencil, Web Components
- Always use the **latest stable versions**.

---

## Style Conventions

- Everything has always a access modifier (`private`, `public`, `protected`).
- Private fields prefixed with `_`
    - for example, use `private _myField: string;`
    - ALL other private methods/functions must NOT have a `_` prefix.
        - for example, use `private myMethod() {}` instead of `private _myMethod() {}`
        - for example, use `private myFunction() {}` instead of `private _myFunction() {}`
- Prefix all interfaces with `I`
- Write **methods** as real functions, not arrow functions.
    - for example, use `myMethod() {}` instead of `myMethod = () => {}`
- Use **full type annotations** – never use `any` (use `unknown` if uncertain).
- Apply proper access modifiers: `private`, `public`, `protected`
- Use **constructor injection** for class setup
- Organize code into regions
    - ONLY THIS REGIONS EXISTS
        - `#region Fields`
        - `#region Ctor`
        - `#region Methods`
        - `#region Properties`
    - `#endregion` to close each region
    - Regions must be in this order
    - No nested regions
    - No other regions allowed
    - Strict this region names, no variations or extensions
- Keep formatting **clean and consistent**.
- Use **strict type checking**; prefer inference when the type is obvious.
- Prefer **“const object + derived union”** or **enumless enums** for small domains.
- Prefer DI via `inject()`; use constructors only when required by the framework.
- Don't use abbreviations for variable names.

---

## Security Guidelines

- **Never** expose secrets, tokens, or credentials
- Avoid **hardcoded passwords**
- Code must be **secure by design**

---

## Documentation

- Use **TSDoc** for all public classes, methods, and properties.
- Comments explain the **purpose**, not implementation details.

---

## Development Process

1. Write **complete** and **optimized** solutions
2. Favor **abstraction** and **modularity**
3. Use `TODO:` comments only when necessary
4. Avoid Jupyter-style code unless explicitly requested

---

## Editing Strategy

1. Prefer **entire file rewrites** for consistency
2. When splitting code, **preserve integrity**
3. Always return **full updated definitions**

---

## Performance & Quality

- Code must be:
    - **Big-O optimal** in time and space
    - **Minimal** with no dead code
    - Fully **style-compliant**
- Rule of thumb:
    - ❌ Unoptimized = 💸 virtual $100 fine
    - ❌ Insecure = 🚫 benched in the corner
    - ❌ Non-deterministic (unseeded random UI behavior) = rejected

### Additional Global Frontend Policies

- Shared mapping / feature keys must be imported from shared constants (never duplicate string literals).
- Randomized UI selections (e.g. tips / highlights) must be derived from a date-based deterministic seed – never plain `Math.random()` at runtime.
- Cross-field form validation belongs in reusable validators (class or directive) – not inline component imperative logic.
- Avoid `as any` for backend DTO responses; generate or define strict interfaces aligned with OpenAPI spec.
- Telemetry & logging: use a central Logger / Telemetry service; no stray `console.log` in committed code.
- Cache / stale states must be explicit (expose `isLoading`, `isStale`, `error` signals) – never implicit boolean branching on raw data.

---

## Angular Guidelines

- Use **standalone components** and **signals**
- Use modern control flow syntax: `@if`, `@for`
- Prefer `@Injectable({ providedIn: 'root' })`
- Follow proper **DI (Dependency Injection)** practices
- Always use standalone components over NgModules
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Use self closing tags for components. instead of doing `<custom-button></custom-button>` use `<custom-button />`
- Use `effect()` within an injection context such as a constructor **only**.
- Signals and rxjs observables never have a `$` suffix

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead
- Never write sfc (single-file components)
- Everything what is injectable must be injected as constructor argument `(constructor(anyService: AnyService = inject(AnyService)))`
- Avoid direct access to global objects (`window`, `document`, `localStorage`) inside components; wrap them in injectable abstraction services for testability.
- When consuming cached backend data, show a skeleton or shimmer state rather than layout shift.
- Derive presentation-only data via `computed()`; never recompute expensive transforms in template interpolations.

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Prefer signals. When using Observables, handle them with the async pipe or convert them via `toSignal()`.
- Avoid using `$any()` in template HTML.
- When we subscribe to a event `(click)="onClick()"` should the method accessor in the component protected.

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function for DI; avoid constructor injection in services.

---

## Lit Guidelines

Each component must be split into **three distinct parts**:

1. **Component Logic** (`*Element.ts`) - the class implementation
2. **Template** (`*ElementTemplate.ts`) - a function returning `TemplateResult`
3. **Styles** (`*Style.scss`) - SCSS source file

---

## Bicep Guidelines (if applicable)

- Use **lowerCamelCase** for all identifiers
- Define parameters with `@description` at the top
- Prefer **symbolic names** over `resourceId()`
- Use `.id` instead of `dependsOn`
- **Never** output secrets or sensitive information

---

**End of Coding Standards**
