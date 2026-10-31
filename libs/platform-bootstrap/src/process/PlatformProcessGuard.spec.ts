import type { LoggerService } from '@nestjs/common';
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, onTestFinished, vi, type Mock } from 'vitest';
import type { IPlatformProcess } from './IPlatformProcess.js';
import type { IPlatformProcessStream } from './IPlatformProcessStream.js';
import { PlatformProcessGuard } from './PlatformProcessGuard.js';

interface IStreamDouble extends IPlatformProcessStream {
    readonly write: Mock<(chunk: string, callback: (error?: Error | null) => void) => boolean>;
    emit(event: 'error', error: Error): boolean;
}

interface IProcessDouble extends IPlatformProcess {
    readonly exit: Mock<(code: number) => void>;
    readonly stdout: IStreamDouble;
    readonly stderr: IStreamDouble;
    emit(event: 'uncaughtException', error: Error, origin: string): boolean;
    emit(event: 'unhandledRejection', reason: unknown): boolean;
}

interface ILoggerDouble extends LoggerService {
    readonly error: Mock<(message: string, stack?: string) => unknown>;
}

describe('PlatformProcessGuard', () => {
    afterEach((): void => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('reports an uncaught exception once and exits with code 1', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        const error = new Error('Connection pool state is corrupt.');
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.emit('uncaughtException', error, 'uncaughtException');
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Error: Connection pool state is corrupt.'), error.stack);
        expect(host.exitCode).toBe(1);
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('does not exit while standard output is still being flushed', (): void => {
        // Arrange
        vi.useFakeTimers();
        const host = createProcessDouble({ stdout: createStalledStreamDouble() });
        PlatformProcessGuard.install({ process: host, logger: createLoggerDouble(), flushTimeoutMs: 250 });
        host.emit('uncaughtException', new Error('Connection pool state is corrupt.'), 'uncaughtException');

        // Act
        vi.advanceTimersByTime(249);

        // Assert
        expect(host.exit).not.toHaveBeenCalled();
    });

    it('exits when the flush timeout elapses although a standard stream never drains', (): void => {
        // Arrange
        vi.useFakeTimers();
        const host = createProcessDouble({ stderr: createStalledStreamDouble() });
        PlatformProcessGuard.install({ process: host, logger: createLoggerDouble(), flushTimeoutMs: 250 });
        host.emit('uncaughtException', new Error('Connection pool state is corrupt.'), 'uncaughtException');

        // Act
        vi.advanceTimersByTime(250);

        // Assert
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('ignores further fatal errors while the process is terminating', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.emit('uncaughtException', new Error('First failure.'), 'uncaughtException');
        host.emit('uncaughtException', new Error('Failure during shutdown.'), 'uncaughtException');
        host.emit('unhandledRejection', new Error('Rejection during shutdown.'));
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledOnce();
        expect(host.exit).toHaveBeenCalledOnce();
    });

    it.each([
        ['stderr', 'EPIPE'],
        ['stdout', 'ERR_STREAM_DESTROYED'],
    ] as const)('ignores a closed %s pipe (%s) without reporting it', (streamName: 'stdout' | 'stderr', code: string): void => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host[streamName].emit('error', createStreamError(code));

        // Assert
        expect(logger.error).not.toHaveBeenCalled();
        expect(host.exit).not.toHaveBeenCalled();
        expect(host.exitCode).toBeUndefined();
    });

    it('exits without waiting for the flush timeout when the fatal report hits a closed standard error pipe', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble({ stderr: createClosedPipeDouble() });
        const logger = createLoggerDouble((message: string): unknown => host.stderr.write(message, (): void => undefined));
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.emit('uncaughtException', new Error('Request pipeline failed.'), 'uncaughtException');
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledOnce();
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('terminates when a standard stream fails for another reason than a closed pipe', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.stdout.emit('error', createStreamError('EIO'));
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Fatal error (stdout)'), expect.any(String));
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('still exits when the logger fails', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble((): unknown => {
            throw new Error('Log sink unavailable.');
        });
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.emit('uncaughtException', new Error('Connection pool state is corrupt.'), 'uncaughtException');
        await waitForPendingCallbacks();

        // Assert
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('terminates on an unhandled promise rejection by default', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger });

        // Act
        host.emit('unhandledRejection', new Error('Mail recipient lookup failed.'));
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Fatal error (unhandledRejection)'), expect.any(String));
        expect(host.exit).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('keeps the process running when unhandled rejections are logged', async (): Promise<void> => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger, unhandledRejection: 'log' });

        // Act
        host.emit('unhandledRejection', new Error('Mail recipient lookup failed.'));
        await waitForPendingCallbacks();

        // Assert
        expect(logger.error).toHaveBeenCalledExactlyOnceWith(
            expect.stringContaining('Unhandled promise rejection: Error: Mail recipient lookup failed.'),
            expect.any(String),
        );
        expect(host.exit).not.toHaveBeenCalled();
        expect(host.exitCode).toBeUndefined();
    });

    it('reports a rejection reason that is not an error without an empty stack argument', (): void => {
        // Arrange
        const host = createProcessDouble();
        const logger = createLoggerDouble();
        PlatformProcessGuard.install({ process: host, logger, unhandledRejection: 'log' });

        // Act
        host.emit('unhandledRejection', { code: 'P2024' });

        // Assert
        expect(logger.error.mock.calls).toEqual([[expect.stringContaining("{ code: 'P2024' }")]]);
    });

    it('does not turn a failing asynchronous logger into another unhandled rejection', async (): Promise<void> => {
        // Arrange
        const onUnhandledRejection = vi.fn();
        process.on('unhandledRejection', onUnhandledRejection);
        onTestFinished((): void => {
            process.off('unhandledRejection', onUnhandledRejection);
        });
        const host = createProcessDouble();
        const logger = createLoggerDouble((): unknown => Promise.reject(new Error('Log sink unavailable.')));
        PlatformProcessGuard.install({ process: host, logger, unhandledRejection: 'log' });

        // Act
        host.emit('unhandledRejection', new Error('Mail recipient lookup failed.'));
        await waitForPendingCallbacks();

        // Assert
        expect(onUnhandledRejection).not.toHaveBeenCalled();
    });
});

function createProcessDouble(streams?: { stdout?: IStreamDouble; stderr?: IStreamDouble }): IProcessDouble {
    return Object.assign(new EventEmitter(), {
        exitCode: undefined as IPlatformProcess['exitCode'],
        exit: vi.fn<(code: number) => void>(),
        stdout: streams?.stdout ?? createStreamDouble(),
        stderr: streams?.stderr ?? createStreamDouble(),
    });
}

function createStreamDouble(): IStreamDouble {
    return Object.assign(new EventEmitter(), {
        write: vi.fn((_chunk: string, callback: (error?: Error | null) => void): boolean => {
            queueMicrotask((): void => callback(null));
            return true;
        }),
    });
}

function createStalledStreamDouble(): IStreamDouble {
    return Object.assign(new EventEmitter(), {
        write: vi.fn<(chunk: string, callback: (error?: Error | null) => void) => boolean>((): boolean => false),
    });
}

function createClosedPipeDouble(): IStreamDouble {
    const stream = Object.assign(new EventEmitter(), {
        write: vi.fn((_chunk: string, callback: (error?: Error | null) => void): boolean => {
            const error = createStreamError('EPIPE');

            // Like a real socket, the failed write reaches its callback first and is then emitted as an event.
            queueMicrotask((): void => {
                callback(error);
                stream.emit('error', error);
            });

            return false;
        }),
    });

    return stream;
}

function createLoggerDouble(onError?: (message: string) => unknown): ILoggerDouble {
    return {
        log: vi.fn(),
        warn: vi.fn(),
        error: vi.fn<(message: string, stack?: string) => unknown>((message: string): unknown => onError?.(message)),
    };
}

function createStreamError(code: string): Error {
    return Object.assign(new Error(`write ${code}`), { code });
}

function waitForPendingCallbacks(): Promise<void> {
    return new Promise((resolve): void => {
        setImmediate(resolve);
    });
}
