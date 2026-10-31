// #region Imports

import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { IdGeneratorBase } from './abstracts/IdGeneratorBase.js';

// #endregion

/**
 * GUID Generator class
 *
 * @public
 */
@Injectable()
export class GUIDGenerator extends IdGeneratorBase {
    /**
     * Generates a GUID (variant of UUID)
     *
     * @param prefix Optional prefix to prepend to the ID
     * @param postfix Optional postfix to append to the ID
     */
    public generate(prefix?: string, postfix?: string): string {
        const bytes = randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const hex = bytes.toString('hex').toUpperCase();
        const guid = [hex.substring(0, 8), hex.substring(8, 12), hex.substring(12, 16), hex.substring(16, 20), hex.substring(20, 32)].join('-');

        return `${prefix ?? ''}${guid}${postfix ?? ''}`;
    }

    /**
     * Validates if the provided string is a valid GUID
     *
     * @param id The ID to validate
     * @returns True if the ID is valid, otherwise false
     */
    public isValid(id: string): boolean {
        const guidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        return guidRegex.test(id);
    }
}
