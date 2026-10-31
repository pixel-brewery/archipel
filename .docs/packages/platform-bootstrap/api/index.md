---
title: '@pixel-brewery/archipel-platform-bootstrap'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-bootstrap

## Classes

| Class                                                          | Description                                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [CompositionContext](Class.CompositionContext)                 | Default implementation of the composition context.                                      |
| [CompositionModule](Class.CompositionModule)                   | Minimal module providing configuration access for composition.                          |
| [CompositionResolverBase](Class.CompositionResolverBase)       | Abstract base class for composition-time feature resolution.                            |
| [PlatformApplication](Class.PlatformApplication)               | Entry point for composing an existing NestJS application with Archipel bootstrap steps. |
| [PlatformApplicationBuilder](Class.PlatformApplicationBuilder) | Fluent builder that composes NestJS bootstrap steps and executes them once.             |
| [PlatformBootstrapContext](Class.PlatformBootstrapContext)     | Runtime context shared by platform bootstrap steps.                                     |
| [PlatformBootstrapError](Class.PlatformBootstrapError)         | Error raised when an Archipel platform bootstrap step fails.                            |
| [PlatformProcessGuard](Class.PlatformProcessGuard)             | Process-level handling of fatal errors and broken standard streams.                     |

## Interfaces

| Interface                                                                      | Description                                                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [IApiStandardSchemaOptions](Interface.IApiStandardSchemaOptions)               | Standard Schema request-validation and response-serialization options.                        |
| [IApiStepOptions](Interface.IApiStepOptions)                                   | Options for the generic Archipel API bootstrap step.                                          |
| [IApiValidationOptions](Interface.IApiValidationOptions)                       | Validation options used by the generic Archipel API bootstrap step.                           |
| [ICompositionContext](Interface.ICompositionContext)                           | Pre-bootstrap context for stage-aware module composition.                                     |
| [ICreateCompositionContextOptions](Interface.ICreateCompositionContextOptions) | Options for creating the composition context.                                                 |
| [ICreateWithCompositionOptions](Interface.ICreateWithCompositionOptions)       | Options for creating a composed application.                                                  |
| [IExpressServerStepOptions](Interface.IExpressServerStepOptions)               | Options for the Express-compatible server bootstrap step.                                     |
| [IOpenApiStepOptions](Interface.IOpenApiStepOptions)                           | Options for the OpenAPI bootstrap step.                                                       |
| [IPlatformApplicationOptions](Interface.IPlatformApplicationOptions)           | Options for wrapping an existing NestJS application with Archipel platform bootstrap support. |
| [IPlatformListenOptions](Interface.IPlatformListenOptions)                     | Options for resolving the HTTP listen port from typed configuration keys.                     |
| [IPlatformProcess](Interface.IPlatformProcess)                                 | Process contract used by `PlatformProcessGuard`.                                              |
| [IPlatformProcessGuardOptions](Interface.IPlatformProcessGuardOptions)         | Options for installing a `PlatformProcessGuard`.                                              |
| [IPlatformProcessStream](Interface.IPlatformProcessStream)                     | Standard output or error stream of a process guarded by `PlatformProcessGuard`.               |
| [IPlatformTestApplication](Interface.IPlatformTestApplication)                 | In-memory application contract used by platform bootstrap tests.                              |
| [IProviderDecision](Interface.IProviderDecision)                               | Represents the result of a provider composition decision.                                     |
| [ISecurityStepOptions](Interface.ISecurityStepOptions)                         | Options for the generic security bootstrap step.                                              |
| [ISessionStepOptions](Interface.ISessionStepOptions)                           | Options for the Express-compatible session bootstrap step.                                    |

## Type Aliases

| Type Alias                                                                       | Description                                                                     |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [CompositionImport](TypeAlias.CompositionImport)                                 | Represents a valid NestJS module import that can be used during composition.    |
| [PlatformBootstrapNext](TypeAlias.PlatformBootstrapNext)                         | Continues execution with the next platform bootstrap step.                      |
| [PlatformBootstrapStep](TypeAlias.PlatformBootstrapStep)                         | A composable bootstrap step in the platform application pipeline.               |
| [PlatformContentSecurityPolicyMode](TypeAlias.PlatformContentSecurityPolicyMode) | Named content-security-policy modes supported by `platform-bootstrap/security`. |
| [PlatformCorsOptions](TypeAlias.PlatformCorsOptions)                             | CORS options accepted by the security bootstrap step.                           |
| [PlatformUnhandledRejectionMode](TypeAlias.PlatformUnhandledRejectionMode)       | Handling of promise rejections that reach the process without a handler.        |
| [ProviderComposer](TypeAlias.ProviderComposer)                                   | Function signature for a provider composer.                                     |
| [SecurityRateLimitOptions](TypeAlias.SecurityRateLimitOptions)                   | Rate-limit options accepted by the security bootstrap step.                     |

## Variables

| Variable                                                                         | Description                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [APP\_CORS\_ORIGIN](Variable.APP_CORS_ORIGIN)                                    | Comma-separated list of allowed CORS origins.                                  |
| [APP\_RATE\_LIMIT\_MAX\_REQUESTS](Variable.APP_RATE_LIMIT_MAX_REQUESTS)          | Maximum requests accepted within the rate-limit window.                        |
| [APP\_RATE\_LIMIT\_WINDOW\_MS](Variable.APP_RATE_LIMIT_WINDOW_MS)                | Rate-limit window in milliseconds.                                             |
| [AUTH\_SESSION\_MAX\_AGE](Variable.AUTH_SESSION_MAX_AGE)                         | Session cookie lifetime, for example `30d` or `86400000`.                      |
| [AUTH\_SESSION\_SECRET](Variable.AUTH_SESSION_SECRET)                            | Secret used by Express-compatible session middleware.                          |
| [AUTH\_SESSION\_SECURE](Variable.AUTH_SESSION_SECURE)                            | Whether session cookies should be marked secure.                               |
| [PLATFORM\_SECURITY\_CONFIG\_ENTRIES](Variable.PLATFORM_SECURITY_CONFIG_ENTRIES) | Security step configuration entries provided by `platform-bootstrap/security`. |
| [PLATFORM\_SERVER\_CONFIG\_ENTRIES](Variable.PLATFORM_SERVER_CONFIG_ENTRIES)     | Server bootstrap configuration entries provided by `platform-bootstrap`.       |
| [PLATFORM\_SESSION\_CONFIG\_ENTRIES](Variable.PLATFORM_SESSION_CONFIG_ENTRIES)   | Session step configuration entries provided by `platform-bootstrap/session`.   |
| [PORT](Variable.PORT)                                                            | HTTP port exposed by serverless hosts such as Vercel.                          |

## Functions

| Function                                                                | Description                                                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [createCompositionContext](Function.createCompositionContext)           | Creates a temporary NestJS context for stage-aware module composition.                  |
| [createPlatformTestApplication](Function.createPlatformTestApplication) | Creates a lightweight in-memory NestJS application double for platform bootstrap tests. |
| [useApi](Function.useApi)                                               | Creates the generic Archipel API bootstrap step.                                        |
| [useExpressServer](Function.useExpressServer)                           | Creates an Express-compatible server bootstrap step.                                    |
| [useOpenApi](Function.useOpenApi)                                       | Creates the Archipel OpenAPI multi-document bootstrap step.                             |
| [useSecurity](Function.useSecurity)                                     | Creates the generic security bootstrap step.                                            |
| [useSession](Function.useSession)                                       | Creates an Express-compatible session bootstrap step.                                   |
