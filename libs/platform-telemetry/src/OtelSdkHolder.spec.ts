import { Logger } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OtelSdkHolder } from './OtelSdkHolder.js';

describe('OtelSdkHolder', () => {
    // #region Fields

    let holder: OtelSdkHolder;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        holder = new OtelSdkHolder();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('flushes a warm SDK without shutting it down and clears its deadline', async () => {
        // arrange
        vi.useFakeTimers();
        const sdk = { forceFlush: vi.fn().mockResolvedValue(undefined), shutdown: vi.fn().mockResolvedValue(undefined) };
        holder.setSdk(sdk);

        // act
        await holder.forceFlush(75);

        // assert
        expect(sdk.forceFlush).toHaveBeenCalledExactlyOnceWith(75);
        expect(sdk.shutdown).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('diagnoses failed export without failing the retained host operation', async () => {
        // arrange
        vi.useFakeTimers();
        const log = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const failure = new Error('test-only-export-failure');
        holder.setSdk({ forceFlush: vi.fn().mockRejectedValue(failure), shutdown: vi.fn().mockResolvedValue(undefined) });

        // act
        await expect(holder.forceFlush()).resolves.toBeUndefined();

        // assert
        expect(log).toHaveBeenCalledWith('Failed to flush OpenTelemetry SDK.', failure.stack);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('releases a retained host operation when an SDK flush never completes', async () => {
        // arrange
        vi.useFakeTimers();
        const log = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const sdk = { forceFlush: vi.fn(() => new Promise<void>(() => undefined)), shutdown: vi.fn().mockResolvedValue(undefined) };
        holder.setSdk(sdk);

        // act
        const flushing = holder.forceFlush(25);
        await vi.advanceTimersByTimeAsync(25);
        await flushing;

        // assert
        expect(log).toHaveBeenCalledWith('Failed to flush OpenTelemetry SDK.', expect.stringContaining('exceeded 25ms'));
        expect(sdk.shutdown).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('continues accepting legacy shutdown-only SDKs', async () => {
        // arrange
        const sdk = { shutdown: vi.fn().mockResolvedValue(undefined) };
        holder.setSdk(sdk);

        // act
        await holder.forceFlush();

        // assert
        expect(sdk.shutdown).not.toHaveBeenCalled();
    });

    describe('onApplicationShutdown()', () => {
        it('should call shutdown on the SDK when one was set', async () => {
            // arrange
            const sdkMock = { shutdown: vi.fn().mockResolvedValue(undefined) };
            holder.setSdk(sdkMock);

            // act
            await holder.onApplicationShutdown();

            // assert
            expect(sdkMock.shutdown).toHaveBeenCalledOnce();
        });

        it('shuts down once across repeated lifecycle calls and clears its deadline', async () => {
            // arrange
            vi.useFakeTimers();
            const sdk = { shutdown: vi.fn().mockResolvedValue(undefined) };
            holder.setSdk(sdk);

            // act
            await Promise.all([holder.onApplicationShutdown(), holder.onApplicationShutdown()]);

            // assert
            expect(sdk.shutdown).toHaveBeenCalledOnce();
            expect(vi.getTimerCount()).toBe(0);
        });

        it('bounds stalled shutdown instead of reporting it as successful', async () => {
            // arrange
            vi.useFakeTimers();
            const log = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
            const success = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
            holder.setSdk({ shutdown: vi.fn(() => new Promise<void>(() => undefined)) });

            // act
            const closing = holder.onApplicationShutdown();
            await vi.advanceTimersByTimeAsync(5_000);
            await closing;

            // assert
            expect(log).toHaveBeenCalledWith('Failed to shut down OpenTelemetry SDK.', expect.stringContaining('exceeded 5000ms'));
            expect(success).not.toHaveBeenCalled();
            expect(vi.getTimerCount()).toBe(0);
        });

        it('should not throw when no SDK was set', async () => {
            // act & assert
            await expect(holder.onApplicationShutdown()).resolves.not.toThrow();
        });

        it('should not throw when SDK shutdown fails', async () => {
            // arrange
            const sdkMock = { shutdown: vi.fn().mockRejectedValue(new Error('shutdown error')) };
            holder.setSdk(sdkMock);

            // act & assert
            await expect(holder.onApplicationShutdown()).resolves.not.toThrow();
        });
    });

    // #endregion
});
