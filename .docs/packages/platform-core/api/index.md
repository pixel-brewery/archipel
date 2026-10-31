---
title: '@pixel-brewery/archipel-platform-core'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-core

## Namespaces

| Namespace                                | Description                                 |
| ---------------------------------------- | ------------------------------------------- |
| [ISseEventData](Namespace.ISseEventData) | Represents the data of a Server-Sent Event. |

## Classes

| Class                                                              | Description                                                                                                                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AppHealthIndicator](Class.AppHealthIndicator)                     | Health indicator for the application.                                                                                                                       |
| [AvatarGeneratorService](Class.AvatarGeneratorService)             | Service for generating GitHub-style identicon avatars.                                                                                                      |
| [BooleanUtils](Class.BooleanUtils)                                 | Boolean Utility Class. This class provides static methods to parse and format boolean values.                                                               |
| [CasingInterceptor](Class.CasingInterceptor)                       | Global NestJS interceptor that normalizes property casing across the HTTP boundary.                                                                         |
| [CatchUtils](Class.CatchUtils)                                     | -                                                                                                                                                           |
| [ContentTemplateEngine](Class.ContentTemplateEngine)               | The `ContentTemplateEngine` class.                                                                                                                          |
| [CUIDGenerator](Class.CUIDGenerator)                               | CUID Generator class                                                                                                                                        |
| [DateTimeUtils](Class.DateTimeUtils)                               | TimeSpan Utility Class. Provides methods to parse and format time span values.                                                                              |
| [DeviceParserService](Class.DeviceParserService)                   | The `DeviceParserService` class.                                                                                                                            |
| [ErrorTemplateService](Class.ErrorTemplateService)                 | Service for rendering error page templates.                                                                                                                 |
| [EventHub](Class.EventHub)                                         | Provides a strongly typed event hub that can publish and subscribe to events.                                                                               |
| [EventModule](Class.EventModule)                                   | Module that provides event hub services.                                                                                                                    |
| [GlobalExceptionFilter](Class.GlobalExceptionFilter)               | A global exception filter that handles all uncaught exceptions in the application. Returns HTML error pages for browser requests and JSON for API requests. |
| [GUIDGenerator](Class.GUIDGenerator)                               | GUID Generator class                                                                                                                                        |
| [HostModule](Class.HostModule)                                     | The `HostModule` provides host-related services globally.                                                                                                   |
| [HostService](Class.HostService)                                   | The `HostService` class.                                                                                                                                    |
| [HttpLoggerMiddleware](Class.HttpLoggerMiddleware)                 | -                                                                                                                                                           |
| [IdentifierModule](Class.IdentifierModule)                         | -                                                                                                                                                           |
| [IdGeneratorBase](Class.IdGeneratorBase)                           | Abstract base class for ID Generators                                                                                                                       |
| [LimitRequestSizeMiddleware](Class.LimitRequestSizeMiddleware)     | -                                                                                                                                                           |
| [LocalizedTextRequest](Class.LocalizedTextRequest)                 | Request DTO for a single localized text entry.                                                                                                              |
| [LocalizedTextResponse](Class.LocalizedTextResponse)               | Base class for localized text responses.                                                                                                                    |
| [NameGeneratorService](Class.NameGeneratorService)                 | Service for generating random names.                                                                                                                        |
| [NormalizedUtils](Class.NormalizedUtils)                           | Utility functions for normalizing data.                                                                                                                     |
| [PageableRequestBase](Class.PageableRequestBase)                   | Base class describing pagination query parameters shared across endpoints.                                                                                  |
| [PageableResponseBase](Class.PageableResponseBase)                 | Base class describing pagination metadata returned alongside list payloads.                                                                                 |
| [ProblemDetailException](Class.ProblemDetailException)             | A NestJS HttpException that represents a Problem Detail as per RFC 7807.                                                                                    |
| [ProblemDetailExceptionFilter](Class.ProblemDetailExceptionFilter) | A NestJS exception filter that transforms exceptions into Problem Details compliant responses as per RFC 7807.                                              |
| [ProblemDetailResponse](Class.ProblemDetailResponse)               | OpenAPI schema class representing a Problem Detail response as per RFC 9457.                                                                                |
| [QuantityResponse](Class.QuantityResponse)                         | Base class for quantity responses.                                                                                                                          |
| [ResponseReturn2](Class.ResponseReturn2)                           | Schema-native success response envelope for NestJS 12 applications.                                                                                         |
| [ResponseReturnBase](Class.ResponseReturnBase)                     | -                                                                                                                                                           |
| [SseHub](Class.SseHub)                                             | Represents a server-sent event service.                                                                                                                     |
| [SseModule](Class.SseModule)                                       | Represents the `SseModule` class.                                                                                                                           |
| [TimeStampResponseBase](Class.TimeStampResponseBase)               | The base class for all time stamp responses.                                                                                                                |
| [UUIDGenerator](Class.UUIDGenerator)                               | UUID Generator class                                                                                                                                        |

## Interfaces

| Interface                                                                  | Description                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [IDeviceInfo](Interface.IDeviceInfo)                                       | Interface for parsed device information                                        |
| [IErrorPageParams](Interface.IErrorPageParams)                             | Parameters for generating error page content.                                  |
| [IEventKey](Interface.IEventKey)                                           | Represents a strongly typed event key that encodes the payload type.           |
| [IEventMap](Interface.IEventMap)                                           | Represents the shape of the event map used by the [EventHub](Class.EventHub).  |
| [IHostContentParams](Interface.IHostContentParams)                         | Parameters for generating host content.                                        |
| [IIdGenerator](Interface.IIdGenerator)                                     | Interface for ID generators                                                    |
| [IProblemDetailExceptionOptions](Interface.IProblemDetailExceptionOptions) | Optional settings of a [ProblemDetailException](Class.ProblemDetailException). |
| [ISseEventData](Interface.ISseEventData)                                   | Represents the data of a Server-Sent Event.                                    |
| [ISseHub](Interface.ISseHub)                                               | Represents a server-sent event service.                                        |

## Type Aliases

| Type Alias                                                             | Description                                                                 |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [CamelCase](TypeAlias.CamelCase)                                       | -                                                                           |
| [ProblemDetail](TypeAlias.ProblemDetail)                               | A Problem Detail object as per RFC 7807.                                    |
| [ProblemDetailTypeUrlResolver](TypeAlias.ProblemDetailTypeUrlResolver) | A function that resolves a type URL for a given HTTP status code and title. |
| [SetOptional](TypeAlias.SetOptional)                                   | Sets the specified keys of T as optional.                                   |
| [StringValue](TypeAlias.StringValue)                                   | -                                                                           |

## Variables

| Variable                                                                 | Description                                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [APP\_NAME](Variable.APP_NAME)                                           | Human-readable name of the application.                                                                                                       |
| [APP\_PORT](Variable.APP_PORT)                                           | HTTP port the application listens on.                                                                                                         |
| [APP\_URL](Variable.APP_URL)                                             | Base URL the application is served from (e.g. `https://example.com`).                                                                         |
| [APP\_VERSION](Variable.APP_VERSION)                                     | Semantic version of the running application (e.g. `1.2.3`).                                                                                   |
| [GIT\_COMMIT](Variable.GIT_COMMIT)                                       | Git commit SHA of the current build.                                                                                                          |
| [ID\_GENERATOR\_TOKEN](Variable.ID_GENERATOR_TOKEN)                      | Interface for ID generators                                                                                                                   |
| [IpAddress](Variable.IpAddress)                                          | Extracts the client IP address from the current HTTP request. Handles IPv6 (::1), proxy headers (X-Forwarded-For), and normalizes the output. |
| [IS\_PUBLIC\_KEY](Variable.IS_PUBLIC_KEY)                                | -                                                                                                                                             |
| [Lang](Variable.Lang)                                                    | Extracts the first language token from the Accept-Language header.                                                                            |
| [NODE\_ENV](Variable.NODE_ENV)                                           | The current Node.js environment (`development`, `production`, etc.).                                                                          |
| [PLATFORM\_CORE\_CONFIG\_ENTRIES](Variable.PLATFORM_CORE_CONFIG_ENTRIES) | All configuration entries required by `platform-core`.                                                                                        |
| [TIME\_ZONE\_HEADER](Variable.TIME_ZONE_HEADER)                          | Request header through which a client announces its IANA time zone, for example `Europe/Berlin`.                                              |
| [TimeZone](Variable.TimeZone)                                            | Extracts the client's IANA time zone from the `X-Time-Zone` request header.                                                                   |
| [UserAgent](Variable.UserAgent)                                          | Extracts the User-Agent header from the incoming HTTP request.                                                                                |

## Functions

| Function                                                                      | Description                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [createEventKey](Function.createEventKey)                                     | Creates a branded event key for the [EventHub](Class.EventHub).                |
| [env](Function.env)                                                           | Marker function for environment strings.                                       |
| [getMimeTypeByFileNameOrExtension](Function.getMimeTypeByFileNameOrExtension) | Get MIME type by file name or extension.                                       |
| [maskSensitive](Function.maskSensitive)                                       | Serializes a value to a JSON string with sensitive keys masked.                |
| [maskSensitiveFields](Function.maskSensitiveFields)                           | Recursively masks values of sensitive keys in a plain object for safe logging. |
| [Public](Function.Public)                                                     | The `Public` decorator.                                                        |
