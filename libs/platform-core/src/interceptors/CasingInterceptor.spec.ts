// #region Imports

import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CasingInterceptor } from './CasingInterceptor.js';

// #endregion

// #region Helpers

function createMockContext(body: unknown) {
    const request = { body };
    return {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
        request,
    };
}

function createMockHandler(data: unknown = { result: true }) {
    return {
        handle: () => of(data),
    };
}

// #endregion

// #region Tests

describe('CasingInterceptor', () => {
    const interceptor = new CasingInterceptor();

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('intercept', () => {
        it('should convert snake_case body keys to camelCase', async () => {
            // arrange
            const ctx = createMockContext({ user_name: 'john', first_name: 'John' });
            const handler = createMockHandler();

            // act
            await firstValueFrom(interceptor.intercept(ctx as never, handler as never));

            // assert
            expect(ctx.request.body).toEqual({ userName: 'john', firstName: 'John' });
        });

        it('should handle nested snake_case objects', async () => {
            // arrange
            const ctx = createMockContext({ user_profile: { first_name: 'John', last_name: 'Doe' } });
            const handler = createMockHandler();

            // act
            await firstValueFrom(interceptor.intercept(ctx as never, handler as never));

            // assert
            expect(ctx.request.body).toEqual({ userProfile: { firstName: 'John', lastName: 'Doe' } });
        });

        it('should handle arrays in body', async () => {
            // arrange
            const ctx = createMockContext([{ item_name: 'A' }, { item_name: 'B' }]);
            const handler = createMockHandler();

            // act
            await firstValueFrom(interceptor.intercept(ctx as never, handler as never));

            // assert
            expect(ctx.request.body).toEqual([{ itemName: 'A' }, { itemName: 'B' }]);
        });

        it('should pass through null body', async () => {
            // arrange
            const ctx = createMockContext(null);
            const handler = createMockHandler();

            // act
            await firstValueFrom(interceptor.intercept(ctx as never, handler as never));

            // assert
            expect(ctx.request.body).toBeNull();
        });

        it('should pass response data through unchanged', async () => {
            // arrange
            const ctx = createMockContext({});
            const handler = createMockHandler({ some_data: 'value' });

            // act
            const result = await firstValueFrom(interceptor.intercept(ctx as never, handler as never));

            // assert
            expect(result).toEqual({ some_data: 'value' });
        });
    });

    describe('process', () => {
        it('should convert snake_case to camelCase', () => {
            // act
            const result = interceptor.process({ my_field: 'value', another_field: 42 });

            // assert
            expect(result).toEqual({ myField: 'value', anotherField: 42 });
        });

        it('should return primitive values unchanged', () => {
            // act & assert
            expect(interceptor.process('hello')).toBe('hello');
            expect(interceptor.process(42)).toBe(42);
            expect(interceptor.process(null)).toBeNull();
        });
    });
});

// #endregion
