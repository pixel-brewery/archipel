import type { Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequestContextStore } from './RequestContextStore.js';
import { REQUEST_ID_HEADER, RequestIdMiddleware } from './RequestIdMiddleware.js';

describe('RequestIdMiddleware', () => {
    // #region Fields

    let middleware: RequestIdMiddleware;

    // #endregion

    // #region Methods

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('REQUEST_ID_HEADER', () => {
        it('should equal "x-request-id"', () => {
            // assert
            expect(REQUEST_ID_HEADER).toBe('x-request-id');
        });
    });

    describe('use', () => {
        it('should generate a request ID and set it on the response when no header is present', () => {
            // arrange
            middleware = new RequestIdMiddleware();

            const req = { headers: {} } as Request;
            const setHeaderFn = vi.fn();
            const res = { setHeader: setHeaderFn } as unknown as Response;
            const next = vi.fn();

            // act
            middleware.use(req, res, next);

            // assert
            expect(setHeaderFn).toHaveBeenCalledWith(REQUEST_ID_HEADER, expect.any(String));
            const generatedId = setHeaderFn.mock.calls[0]![1] as string;
            expect(generatedId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(next).toHaveBeenCalledOnce();
        });

        it('should reuse the existing x-request-id header from the request', () => {
            // arrange
            middleware = new RequestIdMiddleware();
            const existingId = 'incoming-trace-id-999';

            const req = { headers: { [REQUEST_ID_HEADER]: existingId } } as unknown as Request;
            const setHeaderFn = vi.fn();
            const res = { setHeader: setHeaderFn } as unknown as Response;
            const next = vi.fn();

            // act
            middleware.use(req, res, next);

            // assert
            expect(setHeaderFn).toHaveBeenCalledWith(REQUEST_ID_HEADER, existingId);
        });

        it('should store the requestId in RequestContextStore during the callback', () => {
            // arrange
            middleware = new RequestIdMiddleware();
            const existingId = 'ctx-trace-id';

            const req = { headers: { [REQUEST_ID_HEADER]: existingId } } as unknown as Request;
            const setHeaderFn = vi.fn();
            const res = { setHeader: setHeaderFn } as unknown as Response;
            let capturedRequestId: string | undefined;

            const next = vi.fn(() => {
                capturedRequestId = RequestContextStore.getRequestId();
            });

            // act
            middleware.use(req, res, next);

            // assert
            expect(capturedRequestId).toBe(existingId);
        });

        it('should call next exactly once', () => {
            // arrange
            middleware = new RequestIdMiddleware();
            const req = { headers: {} } as Request;
            const res = { setHeader: vi.fn() } as unknown as Response;
            const next = vi.fn();

            // act
            middleware.use(req, res, next);

            // assert
            expect(next).toHaveBeenCalledOnce();
        });

        it('should not have a request context active after middleware completes', () => {
            // arrange
            middleware = new RequestIdMiddleware();
            const req = { headers: { [REQUEST_ID_HEADER]: 'temp-id' } } as unknown as Request;
            const res = { setHeader: vi.fn() } as unknown as Response;
            const next = vi.fn();

            // act
            middleware.use(req, res, next);

            // assert – outside the run callback, context should be gone
            expect(RequestContextStore.get()).toBeUndefined();
        });
    });

    // #endregion
});
