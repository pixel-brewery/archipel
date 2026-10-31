// #region Imports

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { Lang } from './Lang.js';

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
        public method(_lang: string) {
            /* noop */
        }
    }
    Lang()(TestController.prototype, 'method', 0);
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'method');
    const key = Object.keys(metadata)[0];
    return metadata[key].factory;
}

// #endregion

// #region Tests

describe('Lang', () => {
    const factory = getFactory();

    it('should extract the first language token from accept-language', () => {
        // arrange
        const ctx = createMockContext({ 'accept-language': 'da, en-gb;q=0.8, en;q=0.7' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('da');
    });

    it('should strip quality values', () => {
        // arrange
        const ctx = createMockContext({ 'accept-language': 'en-US;q=0.9' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('en-US');
    });

    it('should handle array headers by joining them', () => {
        // arrange
        const ctx = createMockContext({ 'accept-language': ['de', 'en'] });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('de');
    });

    it('should return undefined when no accept-language header is present', () => {
        // arrange
        const ctx = createMockContext({});

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });

    it('should return undefined for an empty header', () => {
        // arrange
        const ctx = createMockContext({ 'accept-language': '' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });
});

// #endregion
