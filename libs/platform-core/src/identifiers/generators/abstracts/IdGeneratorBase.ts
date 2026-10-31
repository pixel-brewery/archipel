import { IIdGenerator } from '../interfaces/IIdGenerator.js';
import { Injectable } from '@nestjs/common';

/**
 * Abstract base class for ID Generators
 *
 * @public
 * @abstract
 */
@Injectable()
export abstract class IdGeneratorBase implements IIdGenerator {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Generates a new ID
     *
     * @param prefix Optional prefix to prepend to the ID
     * @param postfix Optional postfix to append to the ID
     */
    public abstract generate(prefix?: string, postfix?: string): string;

    /**
     * Validates if the given ID conforms to the expected format
     *
     * @param id The ID to validate
     * @returns True if the ID is valid, otherwise false
     */
    public abstract isValid(id: string): boolean;

    // #endregion
}
