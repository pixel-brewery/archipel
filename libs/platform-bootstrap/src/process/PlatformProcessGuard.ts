import { Logger, type LoggerService } from '@nestjs/common';
import { inspect } from 'node:util';
import type { IPlatformProcess } from './IPlatformProcess.js';
import type { IPlatformProcessGuardOptions } from './IPlatformProcessGuardOptions.js';
import type { IPlatformProcessStream } from './IPlatformProcessStream.js';
import type { PlatformUnhandledRejectionMode } from './PlatformUnhandledRejectionMode.js';

// The guard deliberately has no runtime imports from sibling modules, so that Node.js can load this
// source file directly in the child processes of PlatformProcessGuard.integration.spec.ts.

const FATAL_EXIT_CODE = 1;
const DEFAULT_FLUSH_TIMEOUT_MS = 1000;
const CLOSED_STREAM_ERROR_CODES: ReadonlyArray<unknown> = ['EPIPE', 'ERR_STREAM_DESTROYED'];

/**
 * Process-level handling of fatal errors and broken standard streams.
 *
 * Registering an `uncaughtException` listener switches off the Node.js default crash, so a listener that
 * only logs lets the process continue in an undefined state. The guard restores fail-fast semantics
 * instead: it reports the first fatal error once on a best-effort basis, gives stdout and stderr a bounded
 * time to flush, and exits with code 1 so that a supervisor or serverless platform replaces the process.
 *
 * A closed standard stream (`EPIPE`, `ERR_STREAM_DESTROYED`) is ignored. Reporting it would write to the
 * same broken stream and raise the next error, which is how an endless logging loop starts. Any other
 * standard stream failure is fatal, as it is without a listener.
 *
 * Install the guard once, as early as possible in the application entrypoint.
 *
 * @example
 * ```typescript
 * const processGuard = PlatformProcessGuard.install({ logger: new Logger('Process') });
 *
 * main().catch((error: unknown) => processGuard.terminate(error, 'startup'));
 * ```
 *
 * @public
 */
export class PlatformProcessGuard {
    // #region Fields

    private readonly _process: IPlatformProcess;
    private readonly _logger: LoggerService;
    private readonly _unhandledRejection: PlatformUnhandledRejectionMode;
    private readonly _flushTimeoutMs: number;
    private _terminating: boolean;
    private _exited: boolean;

    // #endregion

    // #region Ctor

    private constructor(options: IPlatformProcessGuardOptions) {
        this._process = options.process ?? process;
        this._logger = options.logger ?? new Logger('Process');
        this._unhandledRejection = options.unhandledRejection ?? 'fatal';
        this._flushTimeoutMs = options.flushTimeoutMs ?? DEFAULT_FLUSH_TIMEOUT_MS;
        this._terminating = false;
        this._exited = false;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Installs the guard on the process.
     *
     * @public
     * @param options - Optional logger, rejection handling, flush bound, and process.
     * @returns The installed guard, which can also terminate the process for fatal errors it does not observe itself.
     */
    public static install(options?: IPlatformProcessGuardOptions): PlatformProcessGuard {
        const guard = new PlatformProcessGuard(options ?? {});
        guard.attach();
        return guard;
    }

    /**
     * Reports a fatal error once and terminates the process with exit code 1.
     *
     * Calls made while the process is already terminating are ignored, so a failure raised by the report
     * itself cannot start another report.
     *
     * @public
     * @param error - The fatal error or rejection reason.
     * @param origin - Where the error surfaced, for example `uncaughtException` or `startup`.
     */
    public terminate(error: unknown, origin: string): void {
        if (this._terminating) {
            return;
        }

        this._terminating = true;
        this._process.exitCode = FATAL_EXIT_CODE;
        this.report(`Fatal error (${origin}), terminating with exit code ${FATAL_EXIT_CODE}`, error);
        this.flushAndExit();
    }

    private attach(): void {
        this.attachStream(this._process.stdout, 'stdout');
        this.attachStream(this._process.stderr, 'stderr');
        this._process.on('uncaughtException', (error: Error, origin: string): void => {
            this.terminate(error, origin);
        });
        this._process.on('unhandledRejection', (reason: unknown): void => {
            this.handleUnhandledRejection(reason);
        });
    }

    private attachStream(stream: IPlatformProcessStream, origin: string): void {
        stream.on('error', (error: Error): void => {
            // The reader is gone and the output is lost either way. Reporting it would write to the same
            // broken stream and raise the next error, so ignoring it is what prevents the feedback loop.
            if (this.isClosedStreamError(error)) {
                return;
            }

            this.terminate(error, origin);
        });
    }

    private handleUnhandledRejection(reason: unknown): void {
        if (this._unhandledRejection === 'fatal') {
            this.terminate(reason, 'unhandledRejection');
            return;
        }

        if (!this._terminating) {
            this.report('Unhandled promise rejection', reason);
        }
    }

    private report(message: string, error: unknown): void {
        try {
            const text = `${message}: ${this.describe(error)}`;
            const stack = error instanceof Error ? error.stack : undefined;
            const result: unknown = stack === undefined ? this._logger.error(text) : this._logger.error(text, stack);

            // A logger may work asynchronously. Its failure must not surface as another unhandled rejection.
            void Promise.resolve(result).catch((): void => undefined);
        } catch {
            // Reporting is best effort. The logger itself failed, and there is no independent channel left
            // to report that through without running into the same failure again.
        }
    }

    private flushAndExit(): void {
        const streams: ReadonlyArray<IPlatformProcessStream> = [this._process.stdout, this._process.stderr];
        let pendingStreams = streams.length;
        const timeout = setTimeout((): void => this.exitOnce(), this._flushTimeoutMs);
        const onStreamSettled = (): void => {
            pendingStreams -= 1;

            if (pendingStreams === 0) {
                clearTimeout(timeout);
                this.exitOnce();
            }
        };

        for (const stream of streams) {
            try {
                // An empty write completes after every chunk queued before it, or fails because the stream is
                // broken. Either way there is nothing left worth waiting for on that stream.
                stream.write('', onStreamSettled);
            } catch {
                onStreamSettled();
            }
        }
    }

    private exitOnce(): void {
        if (this._exited) {
            return;
        }

        this._exited = true;
        this._process.exit(FATAL_EXIT_CODE);
    }

    private describe(error: unknown): string {
        return error instanceof Error ? `${error.name}: ${error.message}` : inspect(error, { breakLength: Number.POSITIVE_INFINITY, depth: 2 });
    }

    private isClosedStreamError(error: Error): boolean {
        return 'code' in error && CLOSED_STREAM_ERROR_CODES.includes(error.code);
    }

    // #endregion
}
