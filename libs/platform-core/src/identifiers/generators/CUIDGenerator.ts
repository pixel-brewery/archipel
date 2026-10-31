// #region Imports

import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { IdGeneratorBase } from './abstracts/IdGeneratorBase.js';

// #endregion

/**
 * CUID Generator class
 *
 * @public
 */
@Injectable()
export class CUIDGenerator extends IdGeneratorBase {
    // #region Fields

    private _counter = 0;

    // #endregion

    /**
     * Generates a CUID (Collision-Resistant Unique Identifier).
     *
     * @param prefix Optional prefix to prepend to the ID
     * @param postfix Optional postfix to append to the ID
     */
    public generate(prefix?: string, postfix?: string): string {
        const timestamp = Date.now().toString(36);
        const randomBlock = randomBytes(5).toString('hex').substring(0, 8);
        const counterBlock = (this._counter++).toString(36).padStart(4, '0');
        const cuid = `c${timestamp}${counterBlock}${randomBlock}`;

        return `${prefix ?? ''}${cuid}${postfix ?? ''}`;
    }

    /**
     * Validates if the provided string is a valid CUID
     *
     * @param id The ID to validate
     * @returns True if the ID is valid, otherwise false
     */
    public isValid(id: string): boolean {
        const cuidRegex = /^c[0-9a-z]{25,}$/;
        return cuidRegex.test(id);
    }

    /**
     * Parses a CUID into its segments
     *
     * @param cuid The CUID string to parse
     * @returns An object containing the parsed segments
     */
    public parse(cuid: string): {
        timestamp: string;
        counter: string;
        random: string;
    } | null {
        if (!this.isValid(cuid)) {
            return null;
        }

        const timestamp = cuid.substring(1, 9); // First 8 characters after 'c'
        const counter = cuid.substring(9, 13); // Next 4 characters
        const random = cuid.substring(13); // Remaining part

        return {
            timestamp,
            counter,
            random,
        };
    }
}
