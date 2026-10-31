---
title: '@pixel-brewery/archipel-platform-telemetry'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-telemetry

## Classes

| Class                                                                | Description                                                                                                                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [DiagnosticsService](Class.DiagnosticsService)                       | Records dependency outcomes and sanitized failures through the selected measurement sink.                                                              |
| [MeasurementSinkBase](Class.MeasurementSinkBase)                     | Destination for individual numeric measurements.                                                                                                       |
| [MeasurementsInterceptor](Class.MeasurementsInterceptor)             | Records completed HTTP request values through the direct measurement path.                                                                             |
| [MeasurementsMiddleware](Class.MeasurementsMiddleware)               | Measures response completion, including guards, serialization, unmatched routes and client aborts.                                                     |
| [MeasurementsModule](Class.MeasurementsModule)                       | Installs one direct measurement sink and optional HTTP instrumentation.                                                                                |
| [MeasurementsService](Class.MeasurementsService)                     | Records individual numeric values without imposing an aggregation model.                                                                               |
| [MetricsService](Class.MetricsService)                               | Records application metrics through OpenTelemetry instruments.                                                                                         |
| [NewRelicMeasurementSink](Class.NewRelicMeasurementSink)             | Delivers measurements and sanitized operational failure logs to an explicitly selected New Relic region.                                               |
| [NoopMeasurementSink](Class.NoopMeasurementSink)                     | Explicit no-op sink for individual numeric measurements.                                                                                               |
| [NoopTelemetryFacade](Class.NoopTelemetryFacade)                     | -                                                                                                                                                      |
| [OtelMetricClient](Class.OtelMetricClient)                           | Owns OpenTelemetry metric instruments and their recording semantics.                                                                                   |
| [OtelMetricsInterceptor](Class.OtelMetricsInterceptor)               | Records completed HTTP requests through OpenTelemetry instruments.                                                                                     |
| [OtelSdkHolder](Class.OtelSdkHolder)                                 | Holds a reference to the selected OpenTelemetry SDK components and performs a graceful shutdown when the application terminates.                       |
| [ProviderInstrumentation](Class.ProviderInstrumentation)             | Adds provider method spans through Nest's public instance-decorator bootstrap hook.                                                                    |
| [TelemetryCacheMetricsRecorder](Class.TelemetryCacheMetricsRecorder) | Generic cache metrics recorder that forwards cache lifecycle events into the telemetry facade (which may be a noop when disabled).                     |
| [TelemetryFacade](Class.TelemetryFacade)                             | -                                                                                                                                                      |
| [TelemetryHealthIndicator](Class.TelemetryHealthIndicator)           | Health indicator for the telemetry infrastructure. Checks whether the OpenTelemetry SDK has been initialized via [OtelSdkHolder](Class.OtelSdkHolder). |
| [TelemetryLoggerService](Class.TelemetryLoggerService)               | ConsoleLogger rendering with active trace correlation and optional metric-rule forwarding.                                                             |
| [TelemetryModule](Class.TelemetryModule)                             | -                                                                                                                                                      |
| [TelemetryRuleEngine](Class.TelemetryRuleEngine)                     | -                                                                                                                                                      |
| [VercelMeasurementSink](Class.VercelMeasurementSink)                 | Sends each observation to Vercel Custom Metrics for the current Function invocation.                                                                   |

## Interfaces

| Interface                                                            | Description                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [IDiagnosticsOptions](Interface.IDiagnosticsOptions)                 | Host-owned classification and request correlation for operational diagnostics.  |
| [IMeasurementsModuleOptions](Interface.IMeasurementsModuleOptions)   | Configuration for one direct numeric measurement sink.                          |
| [IMetricInstruments](Interface.IMetricInstruments)                   | Built-in OpenTelemetry instruments used by telemetry operations.                |
| [IMetricReaderOptions](Interface.IMetricReaderOptions)               | Collection interval for an OpenTelemetry push metric reader.                    |
| [INewRelicMeasurementOptions](Interface.INewRelicMeasurementOptions) | Explicit New Relic destination and host lifecycle integration.                  |
| [IOtelInitResult](Interface.IOtelInitResult)                         | The initialized SDK, or an empty result when optional telemetry is unavailable. |
| [IOtelSdk](Interface.IOtelSdk)                                       | Lifecycle of the OpenTelemetry components selected by the host application.     |
| [ITelemetryFacade](Interface.ITelemetryFacade)                       | -                                                                               |
| [ITelemetryMetricsOptions](Interface.ITelemetryMetricsOptions)       | -                                                                               |
| [ITelemetryModuleOptions](Interface.ITelemetryModuleOptions)         | Telemetry SDK options with explicitly selected OpenTelemetry metric readers.    |
| [ITelemetryOptions](Interface.ITelemetryOptions)                     | -                                                                               |
| [ITelemetryTracesOptions](Interface.ITelemetryTracesOptions)         | -                                                                               |

## Type Aliases

| Type Alias                         | Description                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| [MetricKind](TypeAlias.MetricKind) | OpenTelemetry instrument kinds supported by MetricsService. |

## Variables

| Variable                                                                   | Description                                                                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [CONSOLE\_CONFIG\_ENTRIES](Variable.CONSOLE_CONFIG_ENTRIES)                | Console output requires no configuration entries.                                                                      |
| [defaultTelemetryOptions](Variable.defaultTelemetryOptions)                | -                                                                                                                      |
| [EMPTY\_CONFIG\_ENTRIES](Variable.EMPTY_CONFIG_ENTRIES)                    | The disabled measurement sink needs no configuration entries.                                                          |
| [NEW\_RELIC\_CONFIG\_ENTRIES](Variable.NEW_RELIC_CONFIG_ENTRIES)           | Register these entries with the host's ConfigModule before selecting the New Relic measurement sink.                   |
| [NEW\_RELIC\_LICENSE\_KEY](Variable.NEW_RELIC_LICENSE_KEY)                 | New Relic ingest license key. Missing credentials disable export; hosts may require the key outside local development. |
| [NEW\_RELIC\_MEASUREMENT\_OPTIONS](Variable.NEW_RELIC_MEASUREMENT_OPTIONS) | Nest provider token for INewRelicMeasurementOptions.                                                                   |
| [OTLP\_GRPC\_CONFIG\_ENTRIES](Variable.OTLP_GRPC_CONFIG_ENTRIES)           | This reader uses the standard OTEL_EXPORTER_OTLP_* settings.                                                           |
| [OTLP\_HTTP\_CONFIG\_ENTRIES](Variable.OTLP_HTTP_CONFIG_ENTRIES)           | This reader uses the standard OTEL_EXPORTER_OTLP_* settings.                                                           |
| [PROMETHEUS\_CONFIG\_ENTRIES](Variable.PROMETHEUS_CONFIG_ENTRIES)          | The Prometheus scrape port is passed explicitly to the reader factory.                                                 |
| [TELEMETRY\_ENABLED](Variable.TELEMETRY_ENABLED)                           | -                                                                                                                      |
| [TELEMETRY\_FACADE](Variable.TELEMETRY_FACADE)                             | -                                                                                                                      |
| [TELEMETRY\_LOGGER\_OPTIONS](Variable.TELEMETRY_LOGGER_OPTIONS)            | -                                                                                                                      |
| [TELEMETRY\_OPTIONS](Variable.TELEMETRY_OPTIONS)                           | -                                                                                                                      |
| [VERCEL\_CONFIG\_ENTRIES](Variable.VERCEL_CONFIG_ENTRIES)                  | Vercel Custom Metrics use the current Function invocation and need no configuration entries.                           |

## Functions

| Function                                                              | Description                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [createConsoleMetricReader](Function.createConsoleMetricReader)       | Creates a console reader for local diagnostics.                                                                                                                                                                            |
| [createOtlpGrpcMetricReader](Function.createOtlpGrpcMetricReader)     | Creates an OTLP/gRPC reader using the standard OpenTelemetry exporter configuration.                                                                                                                                       |
| [createOtlpHttpMetricReader](Function.createOtlpHttpMetricReader)     | Creates an OTLP/HTTP reader using the standard OpenTelemetry exporter configuration.                                                                                                                                       |
| [createPrometheusMetricReader](Function.createPrometheusMetricReader) | Creates an OpenTelemetry scrape reader for long-running Prometheus targets.                                                                                                                                                |
| [initializeOtel](Function.initializeOtel)                             | Registers only the OpenTelemetry components selected by the application. Import through the lightweight bootstrap entry point before loading the application and modules that the selected instrumentations need to patch. |
| [validateTelemetryOptions](Function.validateTelemetryOptions)         | Validates telemetry options and throws on invalid values.                                                                                                                                                                  |
