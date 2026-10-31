import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';
import { MeasurementsModule } from './MeasurementsModule.js';
import { MeasurementsService } from './MeasurementsService.js';
import { DiagnosticsService } from './DiagnosticsService.js';

class CapturingMeasurementSink extends MeasurementSinkBase {
    // #region Fields

    private readonly _records: Array<{ name: string; value: number; attributes: Readonly<Record<string, string>> }> = [];

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties

    public get records(): ReadonlyArray<{ name: string; value: number; attributes: Readonly<Record<string, string>> }> {
        return this._records;
    }

    // #endregion

    // #region Methods

    public record(name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        this._records.push({ name, value, attributes });
    }

    // #endregion
}

describe('MeasurementsModule', () => {
    it('composes optional diagnostics and keeps background failures independent of the initiating request', async () => {
        const errorLog = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const moduleRef = await Test.createTestingModule({
            imports: [
                MeasurementsModule.register({
                    sink: CapturingMeasurementSink,
                    diagnostics: {
                        classifyFailure: () => ({ 'error.code': 'CONNECTION_FAILED' }),
                        getCorrelationId: () => 'host-generated-id',
                    },
                }),
            ],
        }).compile();
        try {
            await moduleRef.init();
            const diagnostics = moduleRef.get(DiagnosticsService);
            const original = new Error('SELECT private_data; password=private');
            diagnostics.failure('database', 'health', original);
            diagnostics.failure('worker', 'execute', original, { task: 'nightly-task' }, { correlate: false });
            diagnostics.complete('dependency_check', 12, 'failure');
            diagnostics.gauge('dependency_available', 0);
            const records = moduleRef.get(CapturingMeasurementSink).records;
            expect(records).toMatchObject([
                {
                    name: 'operational_failures_total',
                    value: 1,
                    attributes: { component: 'database', 'error.code': 'CONNECTION_FAILED', 'request.id': 'host-generated-id' },
                },
                { name: 'operational_failures_total', value: 1, attributes: { component: 'worker', task: 'nightly-task' } },
                { name: 'dependency_check_total', value: 1, attributes: { outcome: 'failure' } },
                { name: 'dependency_check_duration_ms', value: 12 },
                { name: 'dependency_available', value: 0 },
            ]);
            expect(records[1].attributes).not.toHaveProperty('request.id');
            expect(JSON.stringify(records)).not.toContain('private');
            expect(JSON.stringify(errorLog.mock.calls)).not.toContain('private');
        } finally {
            await moduleRef.close();
            errorLog.mockRestore();
        }
    });

    it('still reports an unknown failure when host diagnostic callbacks throw', async () => {
        const errorLog = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const warningLog = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const moduleRef = await Test.createTestingModule({
            imports: [
                MeasurementsModule.register({
                    sink: CapturingMeasurementSink,
                    diagnostics: {
                        classifyFailure: () => {
                            throw new Error('private credential');
                        },
                        getCorrelationId: () => {
                            throw new Error('private credential');
                        },
                    },
                }),
            ],
        }).compile();
        try {
            moduleRef.get(DiagnosticsService).failure('worker', 'execute', new Error('private credential'));
            expect(moduleRef.get(CapturingMeasurementSink).records).toMatchObject([
                { name: 'operational_failures_total', attributes: { 'failure.kind': 'unknown', 'error.code': 'UNKNOWN' } },
            ]);
            expect(JSON.stringify([...errorLog.mock.calls, ...warningLog.mock.calls])).not.toContain('private credential');
        } finally {
            await moduleRef.close();
            vi.restoreAllMocks();
        }
    });

    it('records each HTTP value through the selected direct sink', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [MeasurementsModule.register({ sink: CapturingMeasurementSink })],
        }).compile();

        try {
            await moduleRef.init();
            moduleRef.get(MeasurementsService).recordHttpRequest('GET', '/users/:id', '200', 42);

            expect(moduleRef.get(CapturingMeasurementSink).records).toEqual([
                { name: 'http_request_duration_ms', value: 42, attributes: { method: 'GET', path: '/users/:id', status: '200' } },
                { name: 'http_requests_total', value: 1, attributes: { method: 'GET', path: '/users/:id', status: '200' } },
            ]);
        } finally {
            await moduleRef.close();
        }
    });
});
