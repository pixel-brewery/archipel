import { describe, expect, it, vi } from 'vitest';
import { cursorPaginator } from './CursorPagination.js';

describe('cursorPaginator', () => {
    // #region Fields

    const createModel = (items: Array<{ id: string }>) => ({
        findMany: vi.fn().mockResolvedValue(items),
    });

    // #endregion

    // #region Methods

    describe('forward pagination', () => {
        it('should return first page without cursor', async () => {
            // arrange
            const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
            const model = createModel(items);
            const paginate = cursorPaginator({ take: 10 });

            // act
            const result = await paginate(model, { where: {} });

            // assert
            expect(result.data).toHaveLength(3);
            expect(result.meta.hasNextPage).toBe(false);
            expect(result.meta.hasPreviousPage).toBe(false);
            expect(result.meta.startCursor).toBe('1');
            expect(result.meta.endCursor).toBe('3');
        });

        it('should detect next page when extra record exists', async () => {
            // arrange
            const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
            const model = createModel(items);
            const paginate = cursorPaginator({});

            // act
            const result = await paginate(model, { where: {} }, { take: 2 });

            // assert
            expect(result.data).toHaveLength(2);
            expect(result.meta.hasNextPage).toBe(true);
        });

        it('should set hasPreviousPage when cursor is provided', async () => {
            // arrange
            const items = [{ id: '3' }, { id: '4' }];
            const model = createModel(items);
            const paginate = cursorPaginator({ take: 10 });

            // act
            const result = await paginate(model, {}, { cursor: '2' });

            // assert
            expect(result.meta.hasPreviousPage).toBe(true);
            expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ cursor: { id: '2' }, skip: 1 }));
        });

        it('should return empty result for no data', async () => {
            // arrange
            const model = createModel([]);
            const paginate = cursorPaginator({ take: 10 });

            // act
            const result = await paginate(model, { where: {} });

            // assert
            expect(result.data).toHaveLength(0);
            expect(result.meta.startCursor).toBeNull();
            expect(result.meta.endCursor).toBeNull();
            expect(result.meta.hasNextPage).toBe(false);
            expect(result.meta.hasPreviousPage).toBe(false);
        });
    });

    describe('backward pagination', () => {
        it('should use negative take for backward direction', async () => {
            // arrange
            const items = [{ id: '1' }, { id: '2' }];
            const model = createModel(items);
            const paginate = cursorPaginator({ take: 5 });

            // act
            await paginate(model, {}, { cursor: '3', direction: 'backward' });

            // assert
            expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: -6 }));
        });
    });

    describe('page size limits', () => {
        it('should cap take at MAX_PAGE_SIZE (100)', async () => {
            // arrange
            const model = createModel([]);
            const paginate = cursorPaginator({});

            // act
            await paginate(model, {}, { take: 500 });

            // assert
            expect(model.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 101 }));
        });
    });

    // #endregion
});
