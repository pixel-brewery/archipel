import { Test } from '@nestjs/testing';
import type { MetricReader } from '@opentelemetry/sdk-metrics';
import type { IOtelSdk } from './interfaces/IOtelSdk.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NoopTelemetryFacade } from './core/NoopTelemetryFacade.js';
import type { ITelemetryFacade } from './core/NoopTelemetryFacade.js';
import { MeasurementsModule } from './measurements/MeasurementsModule.js';
import { MeasurementsService } from './measurements/MeasurementsService.js';
import { NoopMeasurementSink } from './measurements/providers/empty/NoopMeasurementSink.js';
import { OtelMetricClient } from './otel/client/OtelMetricClient.js';
import { OtelSdkHolder } from './OtelSdkHolder.js';
import { MetricsService } from './otel/MetricsService.js';
import { TelemetryModule } from './TelemetryModule.js';
import { TELEMETRY_FACADE } from './tokens/TelemetryTokens.js';

const initializeOtel = vi.hoisted(() =>
    vi.fn(async (): Promise<{ sdk?: { shutdown(): Promise<void> } }> => ({
        sdk: { shutdown: async () => undefined },
    })),
);
vi.mock('./bootstrap/OtelInitializer.js', () => ({ initializeOtel }));

describe('TelemetryModule', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        initializeOtel.mockClear();
    });

    it('keeps OpenTelemetry instruments absent when telemetry is disabled', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [TelemetryModule.register({ enabled: false })],
        }).compile();

        expect(moduleRef.get(TELEMETRY_FACADE)).toBeInstanceOf(NoopTelemetryFacade);
        expect(() => moduleRef.get(MetricsService)).toThrow();
        await moduleRef.close();
    });

    it('records operations through OpenTelemetry while direct measurements remain a separate module', async () => {
        const record = vi.spyOn(OtelMetricClient.prototype, 'record').mockImplementation(() => undefined);
        const moduleRef = await Test.createTestingModule({
            imports: [
                TelemetryModule.register({ enabled: true, httpMetricsInterceptor: true, interceptor: { operation: false } }),
                MeasurementsModule.register({ sink: NoopMeasurementSink, isGlobal: true }),
            ],
        }).compile();

        try {
            const facade = moduleRef.get<ITelemetryFacade>(TELEMETRY_FACADE);
            await facade.runOperation('checkout', () => true);

            expect(record).toHaveBeenCalledWith('counter', 'operation_event_total', 1, { name: 'checkout', status: 'success' });
            expect(moduleRef.get(MetricsService)).toBeInstanceOf(MetricsService);
            expect(moduleRef.get(MeasurementsService)).toBeInstanceOf(MeasurementsService);
        } finally {
            await moduleRef.close();
        }
    });

    it('passes explicitly selected OpenTelemetry readers to the SDK', async () => {
        const readers = [{} as MetricReader, {} as MetricReader];
        const moduleRef = await Test.createTestingModule({
            imports: [TelemetryModule.register({ enabled: true, metricReaders: readers, interceptor: { operation: false } })],
        }).compile();

        expect(moduleRef.get(TELEMETRY_FACADE)).toBeDefined();
        expect(initializeOtel).toHaveBeenCalledWith(expect.objectContaining({ metrics: { enabled: true } }), readers);
        await moduleRef.close();
    });

    it('requires a reader before enabling OpenTelemetry metric export', () => {
        expect(() => TelemetryModule.register({ metrics: { enabled: true } })).toThrow('metric reader');
    });

    it('uses a no-op facade when OpenTelemetry startup fails', async () => {
        initializeOtel.mockResolvedValueOnce({});
        const moduleRef = await Test.createTestingModule({
            imports: [TelemetryModule.register({ enabled: true, interceptor: { operation: false } })],
        }).compile();

        expect(moduleRef.get(TELEMETRY_FACADE)).toBeInstanceOf(NoopTelemetryFacade);
        await moduleRef.close();
    });

    it('adopts the pre-bootstrap SDK without starting another provider and retains its lifecycle', async () => {
        // arrange
        const sdk: IOtelSdk = {
            forceFlush: vi.fn().mockResolvedValue(undefined),
            shutdown: vi.fn().mockResolvedValue(undefined),
        };

        // act
        const moduleRef = await Test.createTestingModule({
            imports: [TelemetryModule.register({ sdk, metrics: { enabled: true }, interceptor: { operation: false } })],
        }).compile();
        try {
            await moduleRef.get(OtelSdkHolder).forceFlush(75);
        } finally {
            await moduleRef.close();
        }

        // assert
        expect(initializeOtel).not.toHaveBeenCalled();
        expect(sdk.forceFlush).toHaveBeenCalledExactlyOnceWith(75);
        expect(sdk.shutdown).toHaveBeenCalledOnce();
    });

    it('leaves a supplied SDK under host ownership when telemetry is disabled', async () => {
        // arrange
        const sdk: IOtelSdk = {
            forceFlush: vi.fn().mockResolvedValue(undefined),
            shutdown: vi.fn().mockResolvedValue(undefined),
        };

        // act
        const moduleRef = await Test.createTestingModule({ imports: [TelemetryModule.register({ enabled: false, sdk })] }).compile();
        await moduleRef.close();

        // assert
        expect(initializeOtel).not.toHaveBeenCalled();
        expect(sdk.shutdown).not.toHaveBeenCalled();
    });
});
