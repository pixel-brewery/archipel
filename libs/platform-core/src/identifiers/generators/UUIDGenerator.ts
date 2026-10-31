// #region Imports

import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { IdGeneratorBase } from './abstracts/IdGeneratorBase.js';

// #endregion

/**
 * UUID Generator class
 *
 * @public
 */
@Injectable()
export class UUIDGenerator extends IdGeneratorBase {
    /**
     * Generates a version 4 UUID (random-based)
     *
     * @param prefix Optional prefix to prepend to the ID
     * @param postfix Optional postfix to append to the ID
     */
    public generate(prefix?: string, postfix?: string): string {
        const bytes = randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const hex = bytes.toString('hex');
        const uuid = [hex.substring(0, 8), hex.substring(8, 12), hex.substring(12, 16), hex.substring(16, 20), hex.substring(20, 32)].join('-');

        return `${prefix ?? ''}${uuid}${postfix ?? ''}`;
    }

    /**
     * Validates if the provided string is a valid UUID (version 4)
     *
     * @param id The ID to validate
     * @returns True if the ID is valid, otherwise false
     */
    public isValid(id: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
}
