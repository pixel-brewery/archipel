import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequestContextStore, type IRequestContext } from './RequestContextStore.js';

describe('RequestContextStore', () => {
    // #region Methods

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('run', () => {
        it('should make the context available within the callback', () => {
            // arrange
            const context: IRequestContext = { requestId: 'req-abc' };
            let captured: IRequestContext | undefined;

            // act
            RequestContextStore.run(context, () => {
                captured = RequestContextStore.get();
            });

            // assert
            expect(captured).toEqual(context);
        });

        it('should return the callback return value', () => {
            // arrange
            const context: IRequestContext = { requestId: 'req-ret' };

            // act
            const result = RequestContextStore.run(context, () => 42);

            // assert
            expect(result).toBe(42);
        });

        it('should support nested contexts without leaking', () => {
            // arrange
            const outer: IRequestContext = { requestId: 'outer' };
            const inner: IRequestContext = { requestId: 'inner' };
            let capturedInner: IRequestContext | undefined;
            let capturedAfterInner: IRequestContext | undefined;

            // act
            RequestContextStore.run(outer, () => {
                RequestContextStore.run(inner, () => {
                    capturedInner = RequestContextStore.get();
                });
                capturedAfterInner = RequestContextStore.get();
            });

            // assert
            expect(capturedInner).toEqual(inner);
            expect(capturedAfterInner).toEqual(outer);
        });

        it('should include userId when provided', () => {
            // arrange
            const context: IRequestContext = { requestId: 'req-u1', userId: 'user-99' };
            let captured: IRequestContext | undefined;

            // act
            RequestContextStore.run(context, () => {
                captured = RequestContextStore.get();
            });

            // assert
            expect(captured?.userId).toBe('user-99');
        });
    });

    describe('get', () => {
        it('should return undefined when called outside a context', () => {
            // act
            const result = RequestContextStore.get();

            // assert
            expect(result).toBeUndefined();
        });

        it('should return the active context inside a run callback', () => {
            // arrange
            const context: IRequestContext = { requestId: 'req-get' };

            // act & assert
            RequestContextStore.run(context, () => {
                expect(RequestContextStore.get()).toEqual(context);
            });
        });
    });

    describe('getRequestId', () => {
        it('should return the requestId from the active context', () => {
            // arrange
            const context: IRequestContext = { requestId: 'req-id-123' };

            // act
            let requestId: string | undefined;
            RequestContextStore.run(context, () => {
                requestId = RequestContextStore.getRequestId();
            });

            // assert
            expect(requestId).toBe('req-id-123');
        });

        it('should return "unknown" when called outside a context', () => {
            // act
            const result = RequestContextStore.getRequestId();

            // assert
            expect(result).toBe('unknown');
        });
    });

    // #endregion
});
