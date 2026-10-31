// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { transactionalQuery } from './transactionalQuery.js';

// #endregion

// #region Tests

describe('transactionalQuery', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a query with the given name', () => {
        // arrange / act
        const query = transactionalQuery('createUser', vi.fn());

        // assert
        expect(query.name).toBe('createUser');
    });

    it('should invoke the run function with the provided transaction client', async () => {
        // arrange
        const run = vi.fn().mockResolvedValue({ id: '1' });
        const query = transactionalQuery('createUser', run);
        const fakeTx = { user: { create: vi.fn() } };

        // act
        const result = await query.run(fakeTx as never);

        // assert
        expect(run).toHaveBeenCalledWith(fakeTx);
        expect(result).toEqual({ id: '1' });
    });
});

// #endregion
