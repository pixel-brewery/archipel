import type { LoggerService } from '@nestjs/common';
import type { IPlatformProcess } from './IPlatformProcess.js';
import type { PlatformUnhandledRejectionMode } from './PlatformUnhandledRejectionMode.js';

/**
 * Options for installing a `PlatformProcessGuard`.
 *
 * @public
 */
export interface IPlatformProcessGuardOptions {
    /** Logger that receives fatal reports. Defaults to a NestJS `Logger` with the `Process` context. */
    readonly logger?: LoggerService;

    /** Handling of promise rejections that no code handled. Defaults to `fatal`. */
    readonly unhandledRejection?: PlatformUnhandledRejectionMode;

    /** Upper bound in milliseconds for flushing stdout and stderr before a fatal exit. Defaults to `1000`. */
    readonly flushTimeoutMs?: number;

    /** Process to guard. Defaults to the Node.js global `process`. */
    readonly process?: IPlatformProcess;
}
