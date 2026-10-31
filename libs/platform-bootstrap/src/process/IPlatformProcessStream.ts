/**
 * Standard output or error stream of a process guarded by `PlatformProcessGuard`.
 *
 * `process.stdout` and `process.stderr` satisfy this contract.
 *
 * @public
 */
export interface IPlatformProcessStream {
    /** Registers a listener for stream failures such as a pipe whose reader has gone away. */
    on(event: 'error', listener: (error: Error) => void): unknown;

    /** Queues a chunk. The callback runs once the chunk and everything queued before it are written, or the write failed. */
    write(chunk: string, callback: (error?: Error | null) => void): boolean;
}
