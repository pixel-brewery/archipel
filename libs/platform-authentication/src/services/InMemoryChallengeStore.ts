// #region Imports

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ChallengeStoreBase } from '../abstracts/ChallengeStoreBase.js';
import type { IMfaChallengeState } from './ChallengeService.js';

// #endregion

/**
 * Default in-memory implementation of the {@link ChallengeStoreBase}.
 *
 * Suitable for single-instance deployments only. For production multi-instance
 * setups, replace with a Redis-backed implementation via `IAuthModuleOptions.challengeStore`.
 *
 * @public
 */
@Injectable()
export class InMemoryChallengeStore extends ChallengeStoreBase implements OnModuleDestroy {
    // #region Fields

    private static readonly _MAX_ENTRIES = 10_000;
    private readonly _logger = new Logger(InMemoryChallengeStore.name);
    private readonly _store = new Map<string, IMfaChallengeState>();

    // #endregion

    // #region Methods

    public async set(id: string, challenge: IMfaChallengeState): Promise<void> {
        if (this._store.size >= InMemoryChallengeStore._MAX_ENTRIES && !this._store.has(id)) {
            this._logger.warn(`InMemoryChallengeStore reached max capacity of ${InMemoryChallengeStore._MAX_ENTRIES} entries`);
            return;
        }
        this._store.set(id, challenge);
    }

    public async get(id: string): Promise<IMfaChallengeState | undefined> {
        return this._store.get(id);
    }

    public async delete(id: string): Promise<void> {
        this._store.delete(id);
    }

    public onModuleDestroy(): void {
        this._store.clear();
    }

    // #endregion
}
