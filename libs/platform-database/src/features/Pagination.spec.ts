// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { paginator, type IPaginateOptions } from './Pagination.js';

// #endregion

// #region Tests

describe('paginator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createMockModel(total: number, data: Array<unknown>) {
        return {
            count: vi.fn().mockResolvedValue(total),
            findMany: vi.fn().mockResolvedValue(data),
        };
    }

    it('should return paginated result with correct meta for first page', async () => {
        // arrange
        const model = createMockModel(25, [{ id: 1 }, { id: 2 }]);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        const result = await paginate(model, { where: {} }, { page: 1, perPage: 10 });

        // assert
        expect(result.meta.total).toBe(25);
        expect(result.meta.currentPage).toBe(1);
        expect(result.meta.perPage).toBe(10);
        expect(result.meta.lastPage).toBe(3);
        expect(result.meta.prev).toBeNull();
        expect(result.meta.next).toBe(2);
    });

    it('should return correct meta for a middle page', async () => {
        // arrange
        const model = createMockModel(25, [{ id: 11 }]);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        const result = await paginate(model, { where: {} }, { page: 2, perPage: 10 });

        // assert
        expect(result.meta.currentPage).toBe(2);
        expect(result.meta.prev).toBe(1);
        expect(result.meta.next).toBe(3);
    });

    it('should return correct meta for the last page', async () => {
        // arrange
        const model = createMockModel(25, [{ id: 21 }]);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        const result = await paginate(model, { where: {} }, { page: 3, perPage: 10 });

        // assert
        expect(result.meta.currentPage).toBe(3);
        expect(result.meta.prev).toBe(2);
        expect(result.meta.next).toBeNull();
    });

    it('should use default options when no overrides are provided', async () => {
        // arrange
        const model = createMockModel(5, [{ id: 1 }]);
        const paginate = paginator({ page: 2, perPage: 5 });

        // act
        const result = await paginate(model, { where: {} });

        // assert
        expect(result.meta.currentPage).toBe(2);
        expect(result.meta.perPage).toBe(5);
    });

    it('should fall back to page 1 and perPage 10 when options are absent', async () => {
        // arrange
        const model = createMockModel(0, []);
        const paginate = paginator({});

        // act
        const result = await paginate(model);

        // assert
        expect(result.meta.currentPage).toBe(1);
        expect(result.meta.perPage).toBe(10);
    });

    it('should handle empty results', async () => {
        // arrange
        const model = createMockModel(0, []);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        const result = await paginate(model, { where: {} }, { page: 1, perPage: 10 });

        // assert
        expect(result.data).toEqual([]);
        expect(result.meta.total).toBe(0);
        expect(result.meta.lastPage).toBe(0);
        expect(result.meta.prev).toBeNull();
        expect(result.meta.next).toBeNull();
    });

    it('should compute skip correctly and forward args to findMany', async () => {
        // arrange
        const model = createMockModel(100, []);
        const paginate = paginator({ page: 1, perPage: 20 });
        const args = { where: { active: true }, orderBy: { name: 'asc' } };

        // act
        await paginate(model, args, { page: 3, perPage: 20 });

        // assert
        expect(model.findMany).toHaveBeenCalledWith({
            ...args,
            take: 20,
            skip: 40,
        });
        expect(model.count).toHaveBeenCalledWith({ where: args.where });
    });

    it('should handle string page and perPage values', async () => {
        // arrange
        const model = createMockModel(50, []);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        const result = await paginate(model, { where: {} }, { page: '2', perPage: '15' } as unknown as IPaginateOptions);

        // assert
        expect(result.meta.currentPage).toBe(2);
        expect(result.meta.perPage).toBe(15);
    });

    it('should clamp skip to zero when page is zero or negative', async () => {
        // arrange
        const model = createMockModel(10, []);
        const paginate = paginator({ page: 1, perPage: 10 });

        // act
        await paginate(model, { where: {} }, { page: 0, perPage: 10 });

        // assert
        expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0 }));
    });
});

// #endregion
