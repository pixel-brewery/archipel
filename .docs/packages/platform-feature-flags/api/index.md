---
title: '@pixel-brewery/archipel-platform-feature-flags'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-feature-flags

## Classes

| Class                                                    | Description                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AzureFeatureFlagReader](Class.AzureFeatureFlagReader)   | Azure App Configuration implementation of the [FeatureFlagReaderBase](Class.FeatureFlagReaderBase). Uses `@azure/app-configuration-provider` for connecting to Azure App Configuration and `@microsoft/feature-management` for evaluating feature flags.                                                                |
| [AzureFeatureFlagWriter](Class.AzureFeatureFlagWriter)   | Azure App Configuration implementation of the [FeatureFlagWriterBase](Class.FeatureFlagWriterBase). Uses `@azure/app-configuration` (`AppConfigurationClient`) for CRUD operations on feature flags stored in Azure App Configuration.                                                                                  |
| [FeatureFlagError](Class.FeatureFlagError)               | Domain error thrown when a feature flag operation fails.                                                                                                                                                                                                                                                                |
| [FeatureFlagGuard](Class.FeatureFlagGuard)               | Guard that checks if a feature flag is enabled before allowing access to a route. Use the [FeatureFlag](Function.FeatureFlag) decorator to specify which flag to check.                                                                                                                                                 |
| [FeatureFlagModule](Class.FeatureFlagModule)             | NestJS module providing feature flag infrastructure. Exposes a configurable feature flag reader and a route guard. Optionally exposes a writer abstract base for CRUD operations when `featureFlagWriter` is provided. The specific provider (Azure App Configuration, Vercel Edge Config) is selected via the options. |
| [FeatureFlagReaderBase](Class.FeatureFlagReaderBase)     | Abstract base for feature flag reader operations. Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract so that the consuming application can switch providers without changing business logic.                                                                                      |
| [FeatureFlagWriterBase](Class.FeatureFlagWriterBase)     | Abstract base for feature flag writer operations (CRUD). Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract so that the admin UI backend can manage flags without being coupled to a specific provider.                                                                           |
| [VercelFeatureFlagReader](Class.VercelFeatureFlagReader) | Vercel Edge Config implementation of the [FeatureFlagReaderBase](Class.FeatureFlagReaderBase). Uses `@vercel/edge-config` for reading feature flag state from a Vercel Edge Config store.                                                                                                                               |
| [VercelFeatureFlagWriter](Class.VercelFeatureFlagWriter) | Vercel Edge Config implementation of the [FeatureFlagWriterBase](Class.FeatureFlagWriterBase). Uses the Vercel REST API to manage feature flags stored in a Vercel Edge Config store.                                                                                                                                   |

## Interfaces

| Interface                                                        | Description                                                                              |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [IFeatureFlagContext](Interface.IFeatureFlagContext)             | Context passed to feature flag evaluation for targeting and segmentation.                |
| [IFeatureFlagDefinition](Interface.IFeatureFlagDefinition)       | Represents a full feature flag definition for admin operations (create / update / read). |
| [IFeatureFlagEvaluation](Interface.IFeatureFlagEvaluation)       | Result of evaluating a single feature flag.                                              |
| [IFeatureFlagModuleOptions](Interface.IFeatureFlagModuleOptions) | Configuration options for the [FeatureFlagModule](Class.FeatureFlagModule).              |

## Variables

| Variable                                                                                             | Description                                                                                    |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [AZURE\_APPCONFIG\_CONNECTION\_STRING](Variable.AZURE_APPCONFIG_CONNECTION_STRING)                   | Azure App Configuration connection string. Alternative to endpoint + Entra ID.                 |
| [AZURE\_APPCONFIG\_ENDPOINT](Variable.AZURE_APPCONFIG_ENDPOINT)                                      | Azure App Configuration endpoint URL. Required when using Entra ID authentication.             |
| [AZURE\_FEATURE\_FLAG\_CONFIG\_ENTRIES](Variable.AZURE_FEATURE_FLAG_CONFIG_ENTRIES)                  | Configuration entries required by the Azure feature flag provider.                             |
| [AZURE\_FEATURE\_FLAG\_KEY\_FILTER](Variable.AZURE_FEATURE_FLAG_KEY_FILTER)                          | Key filter for selecting feature flags. Defaults to `*` (all).                                 |
| [AZURE\_FEATURE\_FLAG\_REFRESH\_INTERVAL](Variable.AZURE_FEATURE_FLAG_REFRESH_INTERVAL)              | Refresh interval in milliseconds for feature flag state. Defaults to 30000.                    |
| [FEATURE\_FLAG\_KEY\_METADATA](Variable.FEATURE_FLAG_KEY_METADATA)                                   | Metadata key used to store the feature flag key on route handlers.                             |
| [PLATFORM\_FEATURE\_FLAGS\_CONFIG\_ENTRIES](Variable.PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES)          | All configuration entries required by the platform-feature-flags library across all providers. |
| [VERCEL\_API\_TOKEN](Variable.VERCEL_API_TOKEN)                                                      | Vercel API token with write access to Edge Config. Required for write operations.              |
| [VERCEL\_EDGE\_CONFIG](Variable.VERCEL_EDGE_CONFIG)                                                  | Vercel Edge Config connection string (includes store ID and token).                            |
| [VERCEL\_EDGE\_CONFIG\_ID](Variable.VERCEL_EDGE_CONFIG_ID)                                           | Vercel Edge Config store ID. Required for write operations.                                    |
| [VERCEL\_EDGE\_CONFIG\_TOKEN](Variable.VERCEL_EDGE_CONFIG_TOKEN)                                     | Optional: Vercel Edge Config read access token (when not embedded in connection string).       |
| [VERCEL\_FEATURE\_FLAG\_CONFIG\_ENTRIES](Variable.VERCEL_FEATURE_FLAG_CONFIG_ENTRIES)                | Configuration entries required by the Vercel feature flag provider (read-only).                |
| [VERCEL\_FEATURE\_FLAG\_PREFIX](Variable.VERCEL_FEATURE_FLAG_PREFIX)                                 | Optional: Prefix for feature flag keys in Edge Config. Defaults to `featureFlags`.             |
| [VERCEL\_FEATURE\_FLAG\_WRITER\_CONFIG\_ENTRIES](Variable.VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES) | Configuration entries required by the Vercel feature flag writer provider.                     |
| [VERCEL\_TEAM\_ID](Variable.VERCEL_TEAM_ID)                                                          | Optional: Vercel Team ID for team-scoped API calls.                                            |

## Functions

| Function                            | Description                                                                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FeatureFlag](Function.FeatureFlag) | Decorator to mark endpoints that require a specific feature flag to be enabled. The guard reads this metadata to evaluate the flag before allowing access. |
