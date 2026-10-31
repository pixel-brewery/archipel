import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

interface IChildRun {
    readonly exitCode: number | null;
    readonly signal: NodeJS.Signals | null;
    readonly stderr: string;
    readonly loggerCalls: number;
}

type ChildScenario = 'closed-pipes' | 'fatal-with-closed-pipes' | 'fatal-with-open-pipes';

const TEST_TIMEOUT_MS = 15_000;
const CHILD_TIMEOUT_MS = 10_000;
const GUARD_MODULE_URL = new URL('./PlatformProcessGuard.ts', import.meta.url).href;

// The child loads the guard source through the TypeScript type stripping built into Node.js. That runs the
// real module against the real process object, the real standard streams, and the real exit path. The
// original failure lived in exactly that interplay: an EPIPE emitted as an uncaught exception, and a
// logger whose two console.error writes per error kept raising the next one.
const CHILD_ENTRYPOINT = String.raw`
import { writeSync } from 'node:fs';
import { ConsoleLogger } from '@nestjs/common';

const [scenario, guardModuleUrl] = process.argv.slice(1);
const { PlatformProcessGuard } = await import(guardModuleUrl);

// forceConsole writes every error as two console.error calls, message and stack, like the incident's logger.
const consoleLogger = new ConsoleLogger('Process', { forceConsole: true });
const countingLogger = {
    log: (message) => consoleLogger.log(message),
    warn: (message) => consoleLogger.warn(message),
    error: (...parameters) => {
        writeSync(4, 'logger-call\n');
        consoleLogger.error(...parameters);
    },
};

PlatformProcessGuard.install(scenario === 'fatal-with-open-pipes' ? {} : { logger: countingLogger });

// Stands in for the HTTP server that keeps a real API process alive.
const server = setInterval(() => undefined, 60_000);

process.on('message', (message) => {
    if (message !== 'start') {
        return;
    }

    // Unprotected writes, as issued by any code that writes to the standard streams directly.
    process.stdout.write('output after the reader left\n');
    process.stderr.write('diagnostics after the reader left\n');

    if (scenario === 'closed-pipes') {
        countingLogger.error('Request failed.', new Error('Request failed.').stack);
        setTimeout(() => {
            clearInterval(server);
            process.disconnect();
        }, 250);
        return;
    }

    setTimeout(() => {
        throw new Error('Unexpected failure.');
    }, 0);
});

process.send('ready');
`;

describe('PlatformProcessGuard (child process integration)', () => {
    it(
        'keeps a process running when the readers of stdout and stderr are gone, without re-entering the logger',
        async (): Promise<void> => {
            // Arrange
            const scenario: ChildScenario = 'closed-pipes';

            // Act
            const run = await runChild(scenario);

            // Assert
            expect(run).toMatchObject({ exitCode: 0, signal: null, loggerCalls: 1 });
        },
        TEST_TIMEOUT_MS,
    );

    it(
        'terminates with exit code 1 on an uncaught exception while stdout and stderr are closed',
        async (): Promise<void> => {
            // Arrange
            const scenario: ChildScenario = 'fatal-with-closed-pipes';

            // Act
            const run = await runChild(scenario);

            // Assert
            expect(run).toMatchObject({ exitCode: 1, signal: null, loggerCalls: 1 });
        },
        TEST_TIMEOUT_MS,
    );

    it(
        'reports an uncaught exception exactly once before exiting with code 1',
        async (): Promise<void> => {
            // Arrange
            const scenario: ChildScenario = 'fatal-with-open-pipes';

            // Act
            const run = await runChild(scenario);

            // Assert
            expect(run.exitCode).toBe(1);
            expect(run.stderr.split('Fatal error (uncaughtException)')).toHaveLength(2);
            expect(run.stderr).toContain('Error: Unexpected failure.');
        },
        TEST_TIMEOUT_MS,
    );
});

function runChild(scenario: ChildScenario): Promise<IChildRun> {
    return new Promise((resolve, reject): void => {
        const child = spawn(process.execPath, ['--input-type=module', '--eval', CHILD_ENTRYPOINT, scenario, GUARD_MODULE_URL], {
            cwd: import.meta.dirname,
            env: { NO_COLOR: '1' },
            stdio: ['ignore', 'pipe', 'pipe', 'ipc', 'pipe'],
        });
        const stdout = child.stdout;
        const stderr = child.stderr;
        const report = child.stdio[4];

        if (!stdout || !stderr || !(report instanceof Readable)) {
            child.kill('SIGKILL');
            reject(new Error('The child process was spawned without the expected pipes.'));
            return;
        }

        const stderrChunks: Array<string> = [];
        const reportChunks: Array<string> = [];
        // A regression that loops forever must fail the test instead of leaving a process behind.
        const killTimer = setTimeout((): void => {
            child.kill('SIGKILL');
        }, CHILD_TIMEOUT_MS);

        stdout.resume();
        stderr.setEncoding('utf8').on('data', (chunk: string): void => {
            stderrChunks.push(chunk);
        });
        report.setEncoding('utf8').on('data', (chunk: string): void => {
            reportChunks.push(chunk);
        });
        child.on('message', (message: unknown): void => {
            if (message !== 'ready') {
                return;
            }

            if (scenario === 'fatal-with-open-pipes') {
                child.send('start');
                return;
            }

            // Without a reader, every further write of the child fails with EPIPE.
            closeReaders([stdout, stderr]).then(
                (): void => {
                    child.send('start');
                },
                (error: unknown): void => {
                    child.kill('SIGKILL');
                    reject(error);
                },
            );
        });
        child.on('error', reject);
        child.on('close', (exitCode: number | null, signal: NodeJS.Signals | null): void => {
            clearTimeout(killTimer);
            resolve({
                exitCode,
                signal,
                stderr: stderrChunks.join(''),
                loggerCalls: reportChunks
                    .join('')
                    .split('\n')
                    .filter((line: string): boolean => line === 'logger-call').length,
            });
        });
    });
}

async function closeReaders(readers: ReadonlyArray<Readable>): Promise<void> {
    await Promise.all(
        readers.map(async (reader: Readable): Promise<void> => {
            const closed = once(reader, 'close');
            reader.destroy();
            await closed;
        }),
    );
}
