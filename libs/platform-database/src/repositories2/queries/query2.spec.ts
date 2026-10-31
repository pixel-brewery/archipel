// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { query2 } from './query2.js';

// #endregion

// #region Tests

describe('query2', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a query with the given name', () => {
        // arrange / act
        const q = query2('findUserById', vi.fn());

        // assert
        expect(q.name).toBe('findUserById');
    });

    it('should invoke the run function with the delegate', () => {
        // arrange
        const run = vi.fn().mockReturnValue({ id: '1', name: 'test' });
        const q = query2('findUserById', run);
        const fakeDelegate = { findFirst: vi.fn() };

        // act
        const result = q.run(fakeDelegate as never);

        // assert
        expect(run).toHaveBeenCalledWith(fakeDelegate);
        expect(result).toEqual({ id: '1', name: 'test' });
    });
});

// #endregion
