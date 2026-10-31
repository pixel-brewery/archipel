import { describe, expect, it, vi } from 'vitest';
import { query } from './query.js';

describe('query', () => {
    // #region Methods

    it('should create a query with name and run function', () => {
        // arrange
        const run = vi.fn();

        // act
        const result = query('findUserById', run);

        // assert
        expect(result.name).toBe('findUserById');
        expect(result.run).toBe(run);
    });

    it('should execute run function with delegate', async () => {
        // arrange
        const mockDelegate = { findFirst: vi.fn().mockResolvedValue({ id: '1' }) };
        const q = query('testQuery', (model: typeof mockDelegate) => model.findFirst({ where: { id: '1' } }));

        // act
        const result = await q.run(mockDelegate);

        // assert
        expect(result).toEqual({ id: '1' });
        expect(mockDelegate.findFirst).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    // #endregion
});
