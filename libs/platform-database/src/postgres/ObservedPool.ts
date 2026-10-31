// #region Imports

import { Pool, type PoolClient, type PoolConfig } from 'pg';
import type { IPoolObserver } from './PoolObserver.js';

// #endregion

type ConnectCallback = Parameters<Pool['connect']>[0];

/**
 * Observes the public pg acquisition boundary without changing the pool's limits or retry behavior.
 *
 * @public
 */
export class ObservedPool extends Pool {
    // #region Fields

    private _telemetry?: IPoolObserver;
    private _lastSnapshotAt = 0;
    private _lastWaiting = 0;

    // #endregion

    // #region Ctor

    public constructor(config?: PoolConfig) {
        super(config);
        // pg emits release before returning the client to its idle list.
        this.on('release', () => queueMicrotask(() => this.snapshot()));
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public observe(telemetry: IPoolObserver): void {
        this._telemetry = telemetry;
        this.snapshot(true);
    }

    public override connect(): Promise<PoolClient>;
    public override connect(callback: ConnectCallback): void;
    public override connect(callback?: ConnectCallback): Promise<PoolClient> | void {
        const startedAt = performance.now();
        const acquisition = super.connect();
        // pg has now either queued the request or initiated the connection.
        if (this.waitingCount !== this._lastWaiting) this.snapshot(true);
        const observed = acquisition.then(
            (client) => {
                this.notify(() => this._telemetry?.complete('database_pool_acquire', performance.now() - startedAt, 'success'));
                if (this.waitingCount !== this._lastWaiting) this.snapshot(true);
                return client;
            },
            (error: unknown) => {
                this.notify(() => this._telemetry?.complete('database_pool_acquire', performance.now() - startedAt, 'failure'));
                this.reportError(error);
                throw error;
            },
        );

        if (!callback) {
            return observed;
        }
        void observed.then(
            (client) => callback(undefined, client, client.release),
            (error: Error) => callback(error, undefined, () => undefined),
        );
    }

    public reportError(error: unknown): void {
        this.notify(() => this._telemetry?.failure('database', 'pool', error));
        this.snapshot(true);
    }

    private notify(notification: () => void): void {
        try {
            notification();
        } catch {
            // Observer failures never change acquisition, release or the original database error.
        }
    }

    private snapshot(force = false): void {
        const now = Date.now();
        if (!force && now - this._lastSnapshotAt < 5000) {
            return;
        }
        this._lastSnapshotAt = now;
        this._lastWaiting = this.waitingCount;
        this.notify(() => this._telemetry?.gauge('database_pool_connections', this.totalCount));
        this.notify(() => this._telemetry?.gauge('database_pool_idle', this.idleCount));
        this.notify(() => this._telemetry?.gauge('database_pool_waiting', this.waitingCount));
        this.notify(() => this._telemetry?.gauge('database_pool_max', this.options.max ?? 10));
    }

    // #endregion
}
