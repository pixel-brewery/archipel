---
title: '@pixel-brewery/archipel-platform-openapi'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-openapi

## Classes

| Class                                                            | Description                                                                                                                      |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [SwaggerFeatureDiscovery](Class.SwaggerFeatureDiscovery)         | Centralizes the discovery of Swagger features declared across backend modules.                                                   |
| [SwaggerFeatureRegistry](Class.SwaggerFeatureRegistry)           | Registry service for dynamically discovered Swagger features. Collects feature configurations from `@SwaggerFeature` decorators. |
| [SwaggerMultiDocumentService](Class.SwaggerMultiDocumentService) | -                                                                                                                                |
| [SwaggerTheme](Class.SwaggerTheme)                               | The swagger theme class                                                                                                          |

## Interfaces

| Interface                                                                                      | Description                                                                                                                |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [ICreateJsonSchemaFromOpenApiModelOptions](Interface.ICreateJsonSchemaFromOpenApiModelOptions) | Controls conversion of a NestJS Swagger model into self-contained JSON Schema.                                             |
| [IFeatureSwaggerConfig](Interface.IFeatureSwaggerConfig)                                       | -                                                                                                                          |
| [IOpenApiFeatureDocument](Interface.IOpenApiFeatureDocument)                                   | One generated feature document together with its registered feature metadata.                                              |
| [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata)                                   | Describes a single Swagger feature module that should be exposed as its own OpenAPI document via the multi-document setup. |
| [ISwaggerThemeConfig](Interface.ISwaggerThemeConfig)                                           | Configuration interface for Swagger theme styling. Allows customization of primary and secondary branding colors.          |

## Variables

| Variable                                                                           | Description                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [APP\_VERSION](Variable.APP_VERSION)                                               | Application version shown in the Swagger document.                                                                                                                                                      |
| [JSON\_SCHEMA\_FINGERPRINT\_ALGORITHM](Variable.JSON_SCHEMA_FINGERPRINT_ALGORITHM) | Stable identifier for the validation-semantic JSON Schema fingerprint.                                                                                                                                  |
| [PLATFORM\_OPENAPI\_CONFIG\_ENTRIES](Variable.PLATFORM_OPENAPI_CONFIG_ENTRIES)     | All configuration entries required by `platform-openapi`.                                                                                                                                               |
| [SWAGGER\_CONTACT\_EMAIL](Variable.SWAGGER_CONTACT_EMAIL)                          | Contact e-mail displayed in the Swagger document.                                                                                                                                                       |
| [SWAGGER\_CONTACT\_NAME](Variable.SWAGGER_CONTACT_NAME)                            | Contact name displayed in the Swagger document.                                                                                                                                                         |
| [SWAGGER\_CONTACT\_URL](Variable.SWAGGER_CONTACT_URL)                              | Contact URL displayed in the Swagger document.                                                                                                                                                          |
| [SWAGGER\_FEATURE\_METADATA\_KEY](Variable.SWAGGER_FEATURE_METADATA_KEY)           | Metadata key used by `Reflect.defineMetadata` to attach [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) to a NestJS module class decorated with [SwaggerFeature](Function.SwaggerFeature). |

## Functions

| Function                                                                      | Description                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Api](Function.Api)                                                           | Composite Swagger decorator that wraps all NestJS OpenAPI decorators into a single declaration.                                                                                                                                                  |
| [createJsonSchemaFingerprint](Function.createJsonSchemaFingerprint)           | Creates a versioned, stable SHA-256 fingerprint for a JSON Schema document.                                                                                                                                                                      |
| [createJsonSchemaFromOpenApiModel](Function.createJsonSchemaFromOpenApiModel) | Creates a self-contained JSON Schema from a NestJS Swagger model.                                                                                                                                                                                |
| [getRegisteredSwaggerFeatures](Function.getRegisteredSwaggerFeatures)         | Returns all [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) entries that have been registered via the [SwaggerFeature](Function.SwaggerFeature) decorator, sorted alphabetically by [name](Interface.ISwaggerFeatureMetadata#name). |
| [getSwaggerFeatureMetadata](Function.getSwaggerFeatureMetadata)               | Reads the [ISwaggerFeatureMetadata](Interface.ISwaggerFeatureMetadata) previously attached to a module class by the [SwaggerFeature](Function.SwaggerFeature) decorator.                                                                         |
| [SwaggerFeature](Function.SwaggerFeature)                                     | Class decorator that marks a NestJS module as a Swagger feature.                                                                                                                                                                                 |
