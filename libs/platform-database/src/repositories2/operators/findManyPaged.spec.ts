// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { findManyPaged } from './findManyPaged.js';

// #endregion

// #region Tests

describe('findManyPaged', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call count and findMany on the delegate with pagination', async () => {
        // arrange
        const delegate = {
            count: vi.fn().mockResolvedValue(50),
            findMany: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
        };
        const operator = findManyPaged({ page: 2, perPage: 10 });

        // act
        const result = (await operator(delegate as never)) as { data: Array<unknown>; meta: Record<string, unknown> };

        // assert
        expect(delegate.count).toHaveBeenCalled();
        expect(delegate.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10, skip: 10 }));
        expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(result.meta.total).toBe(50);
        expect(result.meta.currentPage).toBe(2);
    });

    it('should forward optional args to the delegate', async () => {
        // arrange
        const delegate = {
            count: vi.fn().mockResolvedValue(5),
            findMany: vi.fn().mockResolvedValue([]),
        };
        const args = { where: { active: true } };
        const operator = findManyPaged({ page: 1, perPage: 5 }, args as never);

        // act
        await operator(delegate as never);

        // assert
        expect(delegate.count).toHaveBeenCalledWith({ where: { active: true } });
        expect(delegate.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { active: true }, take: 5, skip: 0 }));
    });
});

// #endregion
