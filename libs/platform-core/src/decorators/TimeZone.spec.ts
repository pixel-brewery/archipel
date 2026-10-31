// #region Imports

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { TimeZone } from './TimeZone.js';

// #endregion

// #region Helpers

function createMockContext(headers: Record<string, string | string[] | undefined> = {}) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({ headers }),
        }),
    };
}

function getFactory(): (data: unknown, ctx: unknown) => string | undefined {
    class TestController {
        public method(_timeZone: string | undefined) {
            /* noop */
        }
    }
    TimeZone()(TestController.prototype, 'method', 0);
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'method');
    const key = Object.keys(metadata)[0];
    return metadata[key].factory;
}

// #endregion

// #region Tests

describe('TimeZone', () => {
    const factory = getFactory();

    it('should return the IANA time zone sent by the client', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': 'Europe/Berlin' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('Europe/Berlin');
    });

    it('should return the canonical spelling of a case-insensitive zone', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': 'america/new_york' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('America/New_York');
    });

    it('should accept UTC', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': 'UTC' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('UTC');
    });

    it('should use the first value of a repeated header', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': ['Asia/Tokyo', 'Europe/Berlin'] });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('Asia/Tokyo');
    });

    it('should return undefined for an unknown time zone', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': 'Mars/Olympus_Mons' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });

    it('should return undefined for an overlong value', () => {
        // arrange
        const ctx = createMockContext({ 'x-time-zone': `Europe/${'Berlin'.repeat(30)}` });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });

    it('should return undefined when the header is missing or empty', () => {
        // arrange
        const missing = createMockContext({});
        const empty = createMockContext({ 'x-time-zone': '   ' });

        // act
        const results = [factory(undefined, missing), factory(undefined, empty)];

        // assert
        expect(results).toEqual([undefined, undefined]);
    });
});

// #endregion
