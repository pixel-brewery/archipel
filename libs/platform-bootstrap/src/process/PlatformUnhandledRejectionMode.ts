/**
 * Handling of promise rejections that reach the process without a handler.
 *
 * - `fatal` reports the rejection once and terminates the process with exit code 1, like the Node.js
 *   default (`--unhandled-rejections=throw`).
 * - `log` reports every rejection and keeps the process running. Choose it only when the known
 *   rejection sources leave the process consistent, for example detached side effects that start after
 *   their business transaction has committed.
 *
 * @public
 */
export type PlatformUnhandledRejectionMode = 'fatal' | 'log';
