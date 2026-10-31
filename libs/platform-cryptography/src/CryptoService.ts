// #region Imports

import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CryptoValidationError } from './errors/CryptoValidationError.js';

// #endregion

/**
 * The `CryptoService` class.
 * Represents the service that provides cryptographic operations.
 *
 * @public
 */
@Injectable()
export class CryptoService {
    // #region Ctor

    /**
     * Initializes a new instance of the `CryptoService` class.
     */
    public constructor() {
        //
    }

    // #endregion

    // #region Methods

    /**
     * Generates a random GUID prefixed with the given string.
     *
     * @public
     * @param prefix - The prefix to prepend to the generated UUID.
     * @returns The prefixed UUID string.
     */
    public getRandomGuid(prefix: string): string {
        if (!prefix || prefix.trim().length === 0) {
            throw new CryptoValidationError('The prefix is required.');
        }

        return `${prefix}-${randomUUID()}`;
    }

    // #endregion
}
