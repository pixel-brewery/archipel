// #region Imports

import { AsyncLocalStorage } from 'node:async_hooks';

// #endregion

/**
 * Shape of the per-request context stored in {@link RequestContextStore}.
 *
 * @public
 */
export interface IRequestContext {
    /** Unique request correlation identifier. */
    readonly requestId: string;

    /** Optional authenticated user identifier. */
    readonly userId?: string;
}

/**
 * AsyncLocalStorage-based request context store.
 *
 * Provides a per-request context accessible anywhere in the call stack
 * without passing parameters explicitly. This is the foundation for
 * structured logging with automatic `requestId` propagation.
 *
 * @public
 */
export class RequestContextStore {
    // #region Fields

    private static readonly _storage = new AsyncLocalStorage<IRequestContext>();

    // #endregion

    // #region Methods

    /**
     * Runs a callback within a new request context.
     *
     * @param context - The request context to associate with the callback execution.
     * @param callback - The function to execute within the context.
     * @returns The return value of the callback.
     *
     * @public
     */
    public static run<T>(context: IRequestContext, callback: () => T): T {
        return this._storage.run(context, callback);
    }

    /**
     * Returns the current request context, or `undefined` if called
     * outside a request scope.
     *
     * @public
     */
    public static get(): IRequestContext | undefined {
        return this._storage.getStore();
    }

    /**
     * Returns the current `requestId`, or `'unknown'` if no context is active.
     *
     * @public
     */
    public static getRequestId(): string {
        return this._storage.getStore()?.requestId ?? 'unknown';
    }

    // #endregion
}
