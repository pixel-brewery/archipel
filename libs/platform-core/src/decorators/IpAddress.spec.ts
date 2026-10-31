// #region Imports

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { IpAddress } from './IpAddress.js';

// #endregion

// #region Helpers

function createMockContext(headers: Record<string, string | string[] | undefined> = {}, ip?: string, remoteAddress?: string) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({
                headers,
                ip,
                connection: { remoteAddress },
            }),
        }),
    };
}

function getFactory(): (data: unknown, ctx: unknown) => string | undefined {
    class TestController {
        public method(_ip: string) {
            /* noop */
        }
    }
    IpAddress()(TestController.prototype, 'method', 0);
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'method');
    const key = Object.keys(metadata)[0];
    return metadata[key].factory;
}

// #endregion

// #region Tests

describe('IpAddress', () => {
    const factory = getFactory();

    it('should extract IP from x-forwarded-for header', () => {
        // arrange
        const ctx = createMockContext({ 'x-forwarded-for': '203.0.113.50, 70.41.3.18' });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('203.0.113.50');
    });

    it('should extract IP from x-forwarded-for array', () => {
        // arrange
        const ctx = createMockContext({ 'x-forwarded-for': ['10.0.0.1'] });

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('10.0.0.1');
    });

    it('should fall back to req.ip', () => {
        // arrange
        const ctx = createMockContext({}, '192.168.1.100');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('192.168.1.100');
    });

    it('should fall back to connection.remoteAddress', () => {
        // arrange
        const ctx = createMockContext({}, undefined, '10.0.0.5');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('10.0.0.5');
    });

    it('should normalize IPv6-mapped IPv4 addresses', () => {
        // arrange
        const ctx = createMockContext({}, '::ffff:192.168.0.1');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('192.168.0.1');
    });

    it('should map ::1 to localhost', () => {
        // arrange
        const ctx = createMockContext({}, '::1');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('localhost');
    });

    it('should map 127.0.0.1 to localhost', () => {
        // arrange
        const ctx = createMockContext({}, '127.0.0.1');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('localhost');
    });

    it('should map ::ffff:127.0.0.1 to localhost', () => {
        // arrange
        const ctx = createMockContext({}, '::ffff:127.0.0.1');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('localhost');
    });

    it('should return undefined for empty values', () => {
        // arrange
        const ctx = createMockContext({}, undefined, undefined);

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBeUndefined();
    });

    it('should strip IPv6 brackets', () => {
        // arrange
        const ctx = createMockContext({}, '[2001:db8::1]');

        // act
        const result = factory(undefined, ctx);

        // assert
        expect(result).toBe('2001:db8::1');
    });
});

// #endregion
