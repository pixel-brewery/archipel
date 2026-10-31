// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { pageable } from './IPageableEntityCollection.js';

// #endregion

// #region Tests

describe('pageable', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a pageable collection with all properties', () => {
        // arrange
        const items = [{ id: 1 }, { id: 2 }];

        // act
        const result = pageable(items, 100, 10, 20);

        // assert
        expect(result.items).toBe(items);
        expect(result.total).toBe(100);
        expect(result.skip).toBe(10);
        expect(result.take).toBe(20);
    });

    it('should create a pageable collection without take', () => {
        // arrange
        const items = [{ id: 1 }];

        // act
        const result = pageable(items, 50, 0);

        // assert
        expect(result.items).toBe(items);
        expect(result.total).toBe(50);
        expect(result.skip).toBe(0);
        expect(result.take).toBeUndefined();
    });

    it('should handle an empty items array', () => {
        // arrange / act
        const result = pageable([], 0, 0);

        // assert
        expect(result.items).toEqual([]);
        expect(result.total).toBe(0);
    });
});

// #endregion
