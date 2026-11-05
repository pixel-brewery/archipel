// #region Imports

import { BlobStorageUnsupportedOperationError } from '../errors/BlobStorageUnsupportedOperationError.js';
import type { BlobExecutionOperation } from '../interfaces/BlobExecutionOperation.js';
import type { IBlobExecutionOptions } from '../interfaces/IBlobExecutionOptions.js';
import type { BlobStorageStrategyBase } from './abstracts/BlobStorageStrategyBase.js';

// #endregion

/** Rejects execution limits that the strategy cannot enforce before any storage operation. */
export function assertBlobExecutionSupport(
    strategy: Pick<BlobStorageStrategyBase, 'providerId' | 'supportsExecutionOptions'>,
    operation: BlobExecutionOperation,
    key: string,
    execution?: IBlobExecutionOptions,
    maxBytes?: number,
): void {
    if ((execution !== undefined || maxBytes !== undefined) && strategy.supportsExecutionOptions?.(operation) !== true) {
        throw new BlobStorageUnsupportedOperationError(strategy.providerId, `${operation}.execution`, key);
    }
}
