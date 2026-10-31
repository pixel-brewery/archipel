// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { RequestContextStore, type IRequestContext } from './RequestContextStore.js';

// #endregion

/**
 * Structured logger that automatically enriches log entries with the
 * current request context (requestId, userId) from {@link RequestContextStore}.
 *
 * @remarks
 * This logger wraps the NestJS {@link Logger} and prepends structured
 * context fields. It is intended as a drop-in replacement for direct
 * `Logger` usage in services that need request-scoped correlation.
 *
 * @public
 */
@Injectable()
export class ContextLogger {
    // #region Fields

    private readonly _logger: Logger;

    // #endregion

    // #region Ctor

    public constructor(context?: string) {
        this._logger = new Logger(context ?? ContextLogger.name);
    }

    // #endregion

    // #region Methods

    /**
     * Logs at `log` level with request context.
     *
     * @public
     */
    public log(message: string, data?: Record<string, unknown>): void {
        this._logger.log(this.enrich(message, data));
    }

    /**
     * Logs at `warn` level with request context.
     *
     * @public
     */
    public warn(message: string, data?: Record<string, unknown>): void {
        this._logger.warn(this.enrich(message, data));
    }

    /**
     * Logs at `error` level with request context.
     *
     * @public
     */
    public error(message: string, data?: Record<string, unknown>): void {
        this._logger.error(this.enrich(message, data));
    }

    /**
     * Logs at `debug` level with request context.
     *
     * @public
     */
    public debug(message: string, data?: Record<string, unknown>): void {
        this._logger.debug(this.enrich(message, data));
    }

    /**
     * Logs at `verbose` level with request context.
     *
     * @public
     */
    public verbose(message: string, data?: Record<string, unknown>): void {
        this._logger.verbose(this.enrich(message, data));
    }

    // #endregion

    // #region Private Methods

    private static readonly _sensitiveKeys = new Set([
        'password',
        'passwordhash',
        'token',
        'accesstoken',
        'refreshtoken',
        'secret',
        'apikey',
        'authorization',
        'creditcard',
        'ssn',
        'pin',
        'email',
    ]);

    private enrich(message: string, data?: Record<string, unknown>): string {
        const context: IRequestContext | undefined = RequestContextStore.get();
        const fields: Record<string, unknown> = {
            requestId: context?.requestId ?? 'unknown',
            ...(context?.userId ? { userId: context.userId } : {}),
            ...(data ?? {}),
        };

        return `${message} ${JSON.stringify(fields, (key, val: unknown) => {
            if (key && ContextLogger._sensitiveKeys.has(key.toLowerCase())) return '***';
            return val;
        })}`;
    }

    // #endregion
}
