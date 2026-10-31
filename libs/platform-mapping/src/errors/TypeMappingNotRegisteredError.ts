// #region Imports

import { MappingErrorBase } from './abstracts/MappingErrorBase.js';

// #endregion

/**
 * Thrown when a type mapping is requested but not registered.
 *
 * @public
 */
export class TypeMappingNotRegisteredError extends MappingErrorBase {
    // #region Ctor

    public constructor(source: string, destination: string) {
        super(`Type mapping not registered source=${source} destination=${destination}`, 'TYPE_MAPPING_NOT_REGISTERED');
    }

    // #endregion
}
