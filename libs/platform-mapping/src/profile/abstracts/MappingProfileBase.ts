import { IMappingProfile } from '../interfaces/IMappingProfile.js';
import { IMappingBuilder } from '../../builder/interfaces/IMappingBuilder.js';

/**
 * Base class for mapping profiles to simplify implementation.
 *
 * @public
 */
export abstract class MappingProfileBase implements IMappingProfile {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Configures the mapping profile.
     *
     * @public
     * @abstract
     * @param builder The mapping builder.
     */
    public abstract configure(builder: IMappingBuilder): void;

    // #endregion
}
