import type { CallHandler } from '@nestjs/common';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { initializeOtel } from './bootstrap/OtelInitializer.js';
import { NoopTelemetryFacade } from './core/NoopTelemetryFacade.js';
import type { ITelemetryFacade } from './core/NoopTelemetryFacade.js';
import { TelemetryFacade } from './core/TelemetryFacade.js';
import { OperationTelemetryInterceptor } from './interceptor/OperationTelemetryInterceptor.js';
import { TelemetryLoggerService } from './logger/TelemetryLoggerService.js';
import { MetricsService } from './otel/MetricsService.js';
import { OtelMetricClient } from './otel/client/OtelMetricClient.js';
import { OtelMetricsInterceptor } from './otel/OtelMetricsInterceptor.js';
import type { ITelemetryModuleOptions } from './options/TelemetryModuleOptions.js';
import { ITelemetryOptions, defaultTelemetryOptions, validateTelemetryOptions } from './options/TelemetryOptions.js';
import { OtelSdkHolder } from './OtelSdkHolder.js';
import { TelemetryRuleEngine } from './rules/TelemetryRuleEngine.js';
import { TELEMETRY_ENABLED, TELEMETRY_FACADE, TELEMETRY_OPTIONS } from './tokens/TelemetryTokens.js';

@Global()
@Module({})
export class TelemetryModule {
    public static register(options: ITelemetryModuleOptions = {}): DynamicModule {
        const { sdk: initializedSdk, metricReaders, httpMetricsInterceptor, ...sdkOptions } = options;
        const metricsEnabled = sdkOptions.metrics?.enabled ?? (metricReaders?.length ?? 0) > 0;
        if (options.enabled !== false && metricsEnabled && !metricReaders?.length && !initializedSdk) {
            throw new Error('TelemetryModule requires at least one OpenTelemetry metric reader when metrics are enabled');
        }
        const metricProviders = options.enabled === false ? [] : [OtelMetricClient, MetricsService];
        return {
            module: TelemetryModule,
            providers: [
                ...metricProviders,
                ...(options.enabled !== false && httpMetricsInterceptor ? [{ provide: APP_INTERCEPTOR, useClass: OtelMetricsInterceptor }] : []),
                {
                    provide: TELEMETRY_OPTIONS,
                    useFactory: () => {
                        const merged: ITelemetryOptions = {
                            ...defaultTelemetryOptions,
                            ...sdkOptions,
                            metrics: { enabled: metricsEnabled },
                        };
                        validateTelemetryOptions(merged);
                        return merged;
                    },
                },
                {
                    provide: TELEMETRY_ENABLED,
                    inject: [TELEMETRY_OPTIONS],
                    useFactory: (cfg: ITelemetryOptions) => cfg.enabled,
                },
                {
                    provide: TelemetryRuleEngine,
                    inject: [TELEMETRY_OPTIONS, { token: MetricsService, optional: true }],
                    useFactory: (cfg: ITelemetryOptions, metricsService?: MetricsService) => new TelemetryRuleEngine(cfg, metricsService),
                },
                TelemetryLoggerService,
                OtelSdkHolder,
                {
                    provide: TELEMETRY_FACADE,
                    inject: [TELEMETRY_OPTIONS, TELEMETRY_ENABLED, OtelSdkHolder, { token: MetricsService, optional: true }],
                    useFactory: async (cfg: ITelemetryOptions, enabled: boolean, sdkHolder: OtelSdkHolder, metricsService?: MetricsService) => {
                        if (!enabled) return new NoopTelemetryFacade();
                        try {
                            const sdk = initializedSdk ?? (await initializeOtel(cfg, metricReaders)).sdk;
                            if (!sdk) return new NoopTelemetryFacade();
                            sdkHolder.setSdk(sdk);
                            return new TelemetryFacade(undefined, metricsService, cfg.pattern);
                        } catch (error: unknown) {
                            new Logger('TelemetryModule').error('OpenTelemetry SDK initialization failed, falling back to noop', (error as Error).stack);
                            return new NoopTelemetryFacade();
                        }
                    },
                },
                {
                    provide: APP_INTERCEPTOR,
                    inject: [TELEMETRY_FACADE, TELEMETRY_OPTIONS],
                    useFactory: (facade: ITelemetryFacade, cfg: ITelemetryOptions) =>
                        cfg.interceptor?.operation
                            ? new OperationTelemetryInterceptor(facade)
                            : { intercept: (_: unknown, next: CallHandler) => next.handle() },
                },
            ],
            exports: options.enabled === false ? [TELEMETRY_FACADE] : [TELEMETRY_FACADE, MetricsService, OtelSdkHolder],
        };
    }
}
