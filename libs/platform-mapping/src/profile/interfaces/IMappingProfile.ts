// #region Imports

import { IMappingBuilder } from '../../builder/interfaces/IMappingBuilder.js';

// #endregion

/**
 * Defines the interface for a mapping profile.
 *
 * @public
 */
export interface IMappingProfile {
    // #region Methods

    /**
     * Configures the mapping profile.
     *
     * @public
     * @param builder The mapping builder.
     */
    configure(builder: IMappingBuilder): void;

    // #endregion
}
