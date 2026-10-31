// #region Imports

import { MappingErrorBase } from './abstracts/MappingErrorBase.js';

// #endregion

/**
 * Thrown when a keyed mapping is requested but not registered.
 *
 * @public
 */
export class MappingNotRegisteredError extends MappingErrorBase {
    // #region Ctor

    public constructor(key: string) {
        super(`Mapping not registered key=${key}`, 'MAPPING_NOT_REGISTERED');
    }

    // #endregion
}
