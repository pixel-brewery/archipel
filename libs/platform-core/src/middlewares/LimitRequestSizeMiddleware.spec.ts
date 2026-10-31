// #region Imports

import { PayloadTooLargeException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LimitRequestSizeMiddleware } from './LimitRequestSizeMiddleware.js';

// #endregion

// #region Helpers

function createMockRequest(contentLength?: string) {
    const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
    return {
        headers: contentLength !== undefined ? { 'content-length': contentLength } : {},
        on: vi.fn((event: string, cb: (...args: unknown[]) => void) => {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(cb);
        }),
        destroy: vi.fn(),
        _emit(event: string, ...args: unknown[]) {
            listeners[event]?.forEach((cb) => cb(...args));
        },
    };
}

// #endregion

// #region Tests

describe('LimitRequestSizeMiddleware', () => {
    const middleware = new LimitRequestSizeMiddleware();

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call next when content-length is within limit', () => {
        // arrange
        const request = createMockRequest('1024');
        const next = vi.fn();

        // act
        middleware.use(request as never, {} as never, next);

        // assert
        expect(next).toHaveBeenCalled();
    });

    it('should throw PayloadTooLargeException when content-length exceeds limit', () => {
        // arrange
        const twoMb = (1024 * 1024 * 2).toString();
        const request = createMockRequest(twoMb);
        const next = vi.fn();

        // act & assert
        expect(() => middleware.use(request as never, {} as never, next)).toThrow(PayloadTooLargeException);
    });

    it('should allow requests with no content-length header', () => {
        // arrange
        const request = createMockRequest();
        const next = vi.fn();

        // act
        middleware.use(request as never, {} as never, next);

        // assert
        expect(next).toHaveBeenCalled();
    });

    it('should register a data event listener for streaming check', () => {
        // arrange
        const request = createMockRequest('100');
        const next = vi.fn();

        // act
        middleware.use(request as never, {} as never, next);

        // assert
        expect(request.on).toHaveBeenCalledWith('data', expect.any(Function));
    });

    it('should destroy request when streaming data exceeds limit', () => {
        // arrange
        const request = createMockRequest('100');
        const next = vi.fn();
        middleware.use(request as never, {} as never, next);

        const largeChunk = Buffer.alloc(1024 * 1024 + 1);

        // act & assert
        expect(() => request._emit('data', largeChunk)).toThrow(PayloadTooLargeException);
        expect(request.destroy).toHaveBeenCalled();
    });
});

// #endregion
