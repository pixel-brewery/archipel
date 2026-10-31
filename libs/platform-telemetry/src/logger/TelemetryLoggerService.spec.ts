import { ConsoleLogger } from '@nestjs/common';
import type { ConsoleLoggerOptions, LogLevel } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { context, trace, TraceFlags } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TelemetryRuleEngine } from '../rules/TelemetryRuleEngine.js';
import { TELEMETRY_LOGGER_OPTIONS } from '../tokens/TelemetryTokens.js';
import { TelemetryLoggerService } from './TelemetryLoggerService.js';

const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'];
const firstSpan = { traceId: '1'.repeat(32), spanId: '2'.repeat(16), traceFlags: TraceFlags.SAMPLED };
const secondSpan = { traceId: '3'.repeat(32), spanId: '4'.repeat(16), traceFlags: TraceFlags.SAMPLED };
const loggerOptions: ConsoleLoggerOptions = {
    prefix: 'API',
    colors: false,
    forceConsole: true,
    compact: true,
    sorted: true,
    logLevels,
};

describe('TelemetryLoggerService', () => {
    // #region Fields

    let logger: TelemetryLoggerService;
    let processRule: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
        processRule = vi.fn();
        logger = new TelemetryLoggerService({ process: processRule } as unknown as TelemetryRuleEngine, { ...loggerOptions });
    });

    afterEach(() => {
        context.disable();
        vi.restoreAllMocks();
    });

    it.each(logLevels)('correlates %s output while forwarding its unmodified message', (level) => {
        // arrange
        const active = trace.setSpanContext(context.active(), firstSpan);

        // act
        context.with(active, () => logger[level]('test-only-log-message', 'Worker'));

        // assert
        const output = level === 'error' || level === 'fatal' ? vi.mocked(console.error) : vi.mocked(console.log);
        expect(output).toHaveBeenCalledOnce();
        expect(output).toHaveBeenCalledWith(expect.stringContaining(`trace.id=${firstSpan.traceId} span.id=${firstSpan.spanId}`));
        expect(output).toHaveBeenCalledWith(expect.stringContaining('[Worker]'));
        expect(processRule).toHaveBeenCalledExactlyOnceWith('test-only-log-message');
    });

    it('preserves ConsoleLogger rendering and structured parameters outside a trace', () => {
        // arrange
        vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);
        const base = new ConsoleLogger({ ...loggerOptions });
        const message = { z: 2, a: 1 };
        const parameters = { status: 'test-only-status' };
        base.log(message, parameters, 'Worker');
        const expected = vi.mocked(console.log).mock.calls[0];
        vi.mocked(console.log).mockClear();

        // act
        logger.log(message, parameters, 'Worker');

        // assert
        expect(console.log).toHaveBeenCalledExactlyOnceWith(...(expected ?? []));
        expect(processRule).not.toHaveBeenCalled();
        expect(message).toEqual({ z: 2, a: 1 });
    });

    it.each(['error', 'fatal'] as const)('preserves the raw %s stack separately from the correlated message', (level) => {
        // arrange
        const stack = 'Error: test-only-failure\n    at testOnlyOperation (/test-only/source.ts:12:3)';
        const active = trace.setSpanContext(context.active(), firstSpan);

        // act
        context.with(active, () => logger[level]('test-only-failure', stack, 'Worker'));

        // assert
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenNthCalledWith(1, expect.stringContaining(`trace.id=${firstSpan.traceId}`));
        expect(console.error).toHaveBeenNthCalledWith(2, stack);
        expect(processRule).toHaveBeenCalledExactlyOnceWith('test-only-failure');
    });

    it('adds structured JSON correlation while retaining error details and context', () => {
        // arrange
        const jsonLogger = new TelemetryLoggerService(undefined, { ...loggerOptions, json: true });
        const active = trace.setSpanContext(context.active(), firstSpan);
        const failure = new Error('test-only-failure');

        // act
        context.with(active, () => jsonLogger.error(failure, 'Worker'));

        // assert
        const output = vi.mocked(console.error).mock.calls[0]?.[0] as string;
        expect(JSON.parse(output)).toEqual(
            expect.objectContaining({
                message: 'test-only-failure',
                context: 'Worker',
                level: 'error',
                'trace.id': firstSpan.traceId,
                'span.id': firstSpan.spanId,
                error: expect.objectContaining({ name: 'Error', message: failure.message, stack: failure.stack }),
            }),
        );
        expect(console.error).toHaveBeenCalledOnce();
    });

    it('isolates correlation across overlapping asynchronous work and leaves subsequent output uncorrelated', async () => {
        // arrange
        const first = trace.setSpanContext(context.active(), firstSpan);
        const second = trace.setSpanContext(context.active(), secondSpan);

        // act
        await Promise.all([
            context.with(first, async () => {
                await Promise.resolve();
                logger.log('first-operation');
                await Promise.resolve();
                logger.log('first-completion');
            }),
            context.with(second, async () => {
                logger.log('second-operation');
                await Promise.resolve();
                logger.log('second-completion');
            }),
        ]);
        logger.log('outside-operation');

        // assert
        const records = vi.mocked(console.log).mock.calls.map(([record]) => String(record));
        expect(records).toHaveLength(5);
        for (const record of records.filter((value) => value.includes('first-'))) {
            expect(record).toContain(`trace.id=${firstSpan.traceId} span.id=${firstSpan.spanId}`);
            expect(record).not.toContain(secondSpan.traceId);
        }
        for (const record of records.filter((value) => value.includes('second-'))) {
            expect(record).toContain(`trace.id=${secondSpan.traceId} span.id=${secondSpan.spanId}`);
            expect(record).not.toContain(firstSpan.traceId);
        }
        expect(records[4]).not.toContain('trace.id=');
        expect(records[4]).not.toContain('span.id=');
    });

    it.each([
        { ...firstSpan, traceId: '0'.repeat(32) },
        { ...firstSpan, spanId: '0'.repeat(16) },
        { ...firstSpan, traceId: 'invalid-trace' },
    ])('omits invalid active span identifiers', (spanContext) => {
        // arrange
        const active = trace.setSpanContext(context.active(), spanContext);

        // act
        context.with(active, () => logger.log('test-only-log-message'));

        // assert
        expect(console.log).toHaveBeenCalledOnce();
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('trace.id='));
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('span.id='));
    });

    it('retains configured log-level filtering', () => {
        // arrange
        const filtered = new TelemetryLoggerService(undefined, { ...loggerOptions, logLevels: ['error', 'fatal'] });
        const active = trace.setSpanContext(context.active(), firstSpan);

        // act
        context.with(active, () => {
            filtered.debug('filtered-debug');
            filtered.error('retained-error');
        });

        // assert
        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledOnce();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('retained-error'));
    });

    it('keeps logging when rule processing fails without recursively forwarding its warning', () => {
        // arrange
        processRule.mockImplementation(() => {
            throw new Error('test-only-rule-error');
        });

        // act
        expect(() => logger.log('test-only-log-message')).not.toThrow();

        // assert
        expect(processRule).toHaveBeenCalledOnce();
        expect(console.log).toHaveBeenCalledTimes(2);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('test-only-log-message'));
    });

    it('allows Nest to construct the logger without optional providers', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({ providers: [TelemetryLoggerService] }).compile();

        // act
        const injected = moduleRef.get(TelemetryLoggerService);

        // assert
        expect(injected).toBeInstanceOf(TelemetryLoggerService);
        await moduleRef.close();
    });

    it('accepts host ConsoleLogger options through the explicit optional injection token', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            providers: [TelemetryLoggerService, { provide: TELEMETRY_LOGGER_OPTIONS, useValue: { ...loggerOptions, logLevels: ['error', 'fatal'] } }],
        }).compile();
        const injected = moduleRef.get(TelemetryLoggerService);

        // act
        injected.debug('filtered-debug');
        injected.error('retained-error');

        // assert
        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledOnce();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[API]'));
        await moduleRef.close();
    });

    // #endregion
});
