import type { IPlatformProcessStream } from './IPlatformProcessStream.js';

/**
 * Process contract used by `PlatformProcessGuard`.
 *
 * The Node.js global `process` satisfies it. Tests inject a double so that a fatal path never exits the test runner.
 *
 * @public
 */
export interface IPlatformProcess {
    /** Exit code used when the process ends without an explicit code. */
    exitCode: number | string | null | undefined;

    /** Standard output stream. */
    readonly stdout: IPlatformProcessStream;

    /** Standard error stream. */
    readonly stderr: IPlatformProcessStream;

    /** Terminates the process with the given exit code. */
    exit(code: number): void;

    /** Registers a listener for exceptions that no code caught. */
    on(event: 'uncaughtException', listener: (error: Error, origin: string) => void): unknown;

    /** Registers a listener for promise rejections that no code handled. */
    on(event: 'unhandledRejection', listener: (reason: unknown) => void): unknown;
}
