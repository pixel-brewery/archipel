// #region Imports

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { UserAgent } from './UserAgent.js';

// #endregion

// #region Helpers

function createMockContext(headers: Record<string, string | undefined> = {}) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({ headers }),
        }),
    };
}

function getFactory(): (data: unknown, ctx: unknown) => string | undefined {
    class TestController {
        public method(_ua: string) {
            /* noop */
        }
    }
    UserAgent()(TestController.prototype, 'method', 0);
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'method');
    const key = Object.keys(metadata)[0];
    return metadata[key].factory;
}

// #endregion

// #region Tests

describe('UserAgent', () => {
    const factory = getFactory();

    it('should return the user-agent header', () => {
        // arrange
        const ctx = createMockContext({ 'user-agent': 'Mozilla/5.0' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('Mozilla/5.0');
    });

    it('should return undefined when no user-agent is present', () => {
        // arrange
        const ctx = createMockContext({});

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });
});

// #endregion
